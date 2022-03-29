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
}