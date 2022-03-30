export class RankingService {
    #html;
    #http;
    #url;

    constructor(html, http, url) {
        this.#html = html;
        this.#http = http;
        this.#url = url;
    }

    show() {
        this.#http.get(this.#url, this.#print);
    }

    hide() {
        this.#html.innerHTML = '';
    }

    #print = response => {
        let html = '<ol>';
        for (const player of JSON.parse(response)) {
            let newTotal = player.total.substring(0, 11);
            html += `<li>${player.name} - ${newTotal}</li>`;
        }
        html += '</ol>';

        document.getElementById('ranking').innerHTML = html;
    }
}