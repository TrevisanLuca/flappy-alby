import { Ai } from "./core/ai.js";
import { Player } from "./core/player.js";
import { BarrierSchema } from "./schemas/barrierSchema.js";
import { Stopwatch } from "./core/stopwatch.js";

export class Game {
    #area;
    #player;
    #ai;

    #statisticsService;
    #overlayService;
    #levelService;
    #livesService;
    #rankingService;

    #stopwatch;

    constructor(area, statisticsService, overlayService, levelService, livesService, rankingService) {
        this.#area = area;

        this.#statisticsService = statisticsService;
        this.#overlayService = overlayService;
        this.#levelService = levelService;
        this.#livesService = livesService;
        this.#rankingService = rankingService;
    }

    nextLevel() {
        if (this.#levelService.first && !this.#livesService.alive) {
            this.#livesService.recover();
            this.#rankingService.hide();
            this.#stopwatch = new Stopwatch();
        }

        const options = this.#levelService.currentOptions;
        this.#player = new Player(this.#area, options.coordinate, options.playerSteps);

        const schema = BarrierSchema.build;
        this.#ai = new Ai(this.#area, schema, this.#onStepOver);

        return () => {
            this.#overlayService.hide();
            this.#levelService.update();
            this.#livesService.update();

            this.#statisticsService.start();
            this.#stopwatch.start(options.finalTime);
            this.#ai.start(this.#player.coordinate, options.steps);
        }
    }

    #onStepOver = () => {
        this.#statisticsService.reload(this.#player.coordinate, this.#stopwatch);
        this.#stopwatch.applyBonus(this.#statisticsService.bonus);

        const gameOver = this.#onGameOver();
        if (gameOver) return false;

        const levelOver = this.#onLevelOver();
        return !levelOver;
    }

    #stop() {
        this.#stopwatch.stop();
        this.#ai.stop();

        this.#player.dispose();
        this.#player = undefined;

        this.#statisticsService.stop();
    }

    // look at collisions and kill player, consumes lives
    #onGameOver() {
        // GAME Status Table                | crashed   | alive |
        // Game Over   (you LOOSE)          | 1         | 0     |
        // Kill        (CONTINUE)           | 1         | 1     |
        const crashed = this.#ai.crash(this.#player.coordinate);
        if (crashed) {
            this.#stop();

            this.#livesService.decrease();
            this.#livesService.update();

            const alive = this.#livesService.alive;
            if (alive) {
                // USE REMAINING LIVES (CONTINUE) => players.count > 0
                this.#overlayService.continue(this.#stopwatch);
            } else {
                // Game Over (you LOOSE)  =>  players.count <= 0
                this.#overlayService.gameOver(this.#stopwatch);
                this.#levelService.reset();
                setTimeout(() => {
                    this.#rankingService.show()
                }, 1000);
            }
        }

        return crashed;
    }

    // lock at score complete and kill player without consume lives
    #onLevelOver() {
        // LEVEL Status Table               | levelOver | final |
        // Next level  (NEXT Level)         | 1         | 0     |
        // Game Over   (you WIN)            | 1         | 1     |
        const levelOver = this.#stopwatch.over;
        if (levelOver) {
            this.#stop();

            const final = this.#levelService.final;
            if (final) {
                // FINAL LEVEL COMPLETE, YOU WIN (you WIN) => levelIndex > totalLevels
                this.#overlayService.youWin(this.#stopwatch);
                this.#levelService.reset();
                this.#livesService.kill();
            } else {
                // SOME REMAINING LEVELS (NEXT Level) => levelIndex <= totalLevels
                this.#overlayService.levelOver(this.#stopwatch, this.#levelService.level);
                this.#levelService.increase();
            }
        }

        return levelOver;
    }
}
