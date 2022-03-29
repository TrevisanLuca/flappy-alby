import {Area} from "./core/area.js";
import {OverlayService} from "./services/overlayService.js";
import {LevelService} from "./services/levelService.js";
import {Option} from "./model/options.js";
import {Game} from "./game.js";
import {Coordinate} from "./model/coordinate.js";
import {LivesService} from "./services/livesService.js";
import {StatisticsService} from "./services/statisticsService.js";
import {HttpService} from "./services/httpService.js";
import {RankingService} from "./services/rankingService.js";

(function () {
    document.addEventListener('DOMContentLoaded', () => {
        const html_area = document.getElementById('area');
        const html_percentage = document.getElementById('percentage');
        const html_overlay = document.getElementById('overlay');
        const html_overlay_title = document.getElementById('overlay-title');
        const html_overlay_score = document.getElementById('overlay-score');
        const html_start_button = document.getElementById('overlay-button');
        const html_level = document.getElementById('header-level');
        const html_lives = document.getElementById('lives');
        const html_speed = document.getElementById('speed');
        const html_ranking = document.getElementById('ranking');

        const areaCoordinate = new Coordinate(0, 0, html_area.clientHeight, html_area.clientWidth);
        const area = new Area(html_area, areaCoordinate);

        const levelsOptions = [];
        for (let i = 1; i < 6; i++) {
            const playerSide = areaCoordinate.width / 20;
            const playerCoordinate = new Coordinate((areaCoordinate.height - playerSide) / 2, areaCoordinate.width * .1, playerSide, playerSide);
            levelsOptions.push(new Option(playerCoordinate, i / 2, i > 2 ? 8 : 5, i * 10000));
        }

        const statisticsService = new StatisticsService(area.coordinate, html_speed, html_percentage);
        const overlayService = new OverlayService(html_overlay, html_overlay_title, html_overlay_score, html_start_button);
        const levelService = new LevelService(html_level, levelsOptions);
        const livesService = new LivesService(html_lives);
        const httpService = new HttpService();
        const rankingService = new RankingService(html_ranking, httpService, 'http://localhost:5126/ranking');

        const game = new Game(area, statisticsService, overlayService, levelService, livesService, rankingService);
        html_start_button.onclick = () => game.nextLevel()();
    });
})();
