export class HttpService {
    #httpFactory;

    constructor() {
        this.#httpFactory = () => new XMLHttpRequest();
    }

    get(url, callback) {
        const httpFactory = this.#httpFactory();

        httpFactory.open('GET', url);
        httpFactory.send();

        httpFactory.onreadystatechange = () => {
            if (httpFactory.readyState === 4) {
                callback(httpFactory.responseText);
            }
        };
    }

    post(url, playerTime, playerName) {
        const playerInfo = {
            "name": playerName,
            "total": playerTime
        };
        let payload = JSON.stringify(playerInfo);
        const httpFactory = this.#httpFactory();
        httpFactory.open('POST', url);
        httpFactory.setRequestHeader("Content-type", "application/json");
        httpFactory.send(payload);
    }
}