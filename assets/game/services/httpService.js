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

    post(url, playerTime) {
        const playerInfo = {
            "name": "LucaEliaGiacomo",
            "time": playerTime,
            "id": 4
        };
        let payload = JSON.stringify(playerInfo);
        const httpFactory = this.#httpFactory();
        httpFactory.open('POST', url);

        httpFactory.setRequestHeader("Content-type", "application/json");
        httpFactory.setRequestHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

        httpFactory.send(payload);
    }
}