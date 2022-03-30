export class LivesService {
    #html;

    #lives = 0;
    #totalLives;

    constructor(html, lives = 3) {
        this.#html = html;

        this.#totalLives = lives;
    }

    get alive() {
        return this.#lives > 0;
    }

    decrease = () => this.#lives--;
    recover = () => this.#lives = this.#totalLives;
    kill = () => this.#lives = 0;
    update = () => this.#html.innerHTML = this.#lives;
}