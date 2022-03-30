export class OverlayService {
    #html;
    #htmlTitle
    #htmlScore;
    #htmlButton;
    #http;
    #url;
    #htmlName;
    #playerName;

    constructor(html, htmlTitle, htmlScore, htmlButton, htmlName, http, url) {
        this.#html = html;
        this.#htmlTitle = htmlTitle;
        this.#htmlScore = htmlScore;
        this.#htmlButton = htmlButton;
        this.#http = http;
        this.#url = url;
        this.#htmlName = htmlName;
    }

    static #timesBuilder(stopwatch) {
        return `<p>Completed In: ${stopwatch.final.getMinutes().round2()}:${stopwatch.final.getSeconds().round2()}:${stopwatch.final.getMilliseconds().round2()}</p>
                <p>Total Time: ${stopwatch.total.getMinutes().round2()}:${stopwatch.total.getSeconds().round2()}:${stopwatch.total.getMilliseconds().round2()}</p>`;
    }

    hide() {
        this.#html.style.display = 'none';
    }

    continue(stopwatch) {
        this.#html.style.display = 'block';
        this.#htmlTitle.innerHTML = 'Continue ...';
        this.#htmlScore.innerHTML = OverlayService.#timesBuilder(stopwatch);
        this.#htmlButton.innerHTML = 'Continue';
        this.#htmlName.style.display = 'none';
    }

    levelOver(stopwatch, level = "") {
        this.#html.style.display = 'block';
        this.#htmlTitle.innerHTML = `Level <span class="level">${level}</span> Over!`;
        this.#htmlScore.innerHTML = OverlayService.#timesBuilder(stopwatch);
        this.#htmlButton.innerHTML = 'Next Level';
        this.#htmlName.style.display = 'none';
    }

    youWin(stopwatch) {
        this.#html.style.display = 'block';
        this.#htmlTitle.innerHTML = 'You Win!';
        this.#htmlScore.innerHTML = OverlayService.#timesBuilder(stopwatch);
        this.#htmlButton.innerHTML = 'Play Again';
        this.#htmlName.style.display = 'none';
        this.#playerName = this.#htmlName.value === "" ? "Anonymous" : this.#htmlName.value;
        this.#http.post(this.#url, `00:${stopwatch.total.getMinutes().round2()}:${stopwatch.total.getSeconds().round2()}.${stopwatch.total.getMilliseconds().round2()}`, this.#playerName);
    }

    gameOver(stopwatch) {
        this.#html.style.display = 'block';
        this.#htmlTitle.innerHTML = 'Game Over!';
        this.#htmlScore.innerHTML = OverlayService.#timesBuilder(stopwatch);
        this.#htmlButton.innerHTML = 'Retry';
        this.#htmlName.style.display = 'none';
    }
}