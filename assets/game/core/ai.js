﻿export class Ai {
    #area;
    #schema;
    #onStepOver;

    #blocks = [];

    constructor(area, schema, onStepOver) {
        this.#area = area;
        this.#schema = schema;
        this.#onStepOver = onStepOver;
    }

    start(playerCoordinate, steps) {
        this.#build(playerCoordinate);
        window.requestAnimationFrame(timestamp => this.#animate(playerCoordinate, steps)(timestamp));
    }

    stop() {
        for (let blocks of this.#blocks) {
            this.#area.remove(blocks);
        }

        this.#blocks = [];
    }

    crash(playerCoordinate) {
        return this.#blocks.some(blocks => blocks.some(block => block.crash(playerCoordinate)));
    }

    #animate = (playerCoordinate, steps = 1, start) => timestamp => {
        if (this.#blocks.length <= 0) return;

        if (start === undefined) start = timestamp;
        const elapsed = timestamp - start;

        // move all blocks left
        for (let blocks of this.#blocks) {
            for (let block of blocks) {
                block.moveLeft(steps);
            }
        }

        // destroy blocks if they are out of screen
        const destroy = this.#blocks[0].some(block => block.coordinate.left + block.coordinate.width <= 0);
        if (destroy) {
            const blocks = this.#blocks.shift();
            this.#area.remove(blocks);
        }

        // create new blocks if the previous block is at 2/3 of screen
        const limit = Math.floor(this.#area.coordinate.width * .66);
        const left = this.#blocks[this.#blocks.length - 1][0].coordinate.left; // TODO: calc max left coordinate in sub-array
        if (left <= limit || limit >= left) {
            this.#build(playerCoordinate);
        }

        // callback to game class
        const _continue = this.#onStepOver(elapsed);

        if (_continue) {
            window.requestAnimationFrame(this.#animate(playerCoordinate, steps, start));
        }
    }

    #build(playerCoordinate) {
        const coordinates = this.#schema(this.#area.coordinate, playerCoordinate);

        const blocks = [];
        for (let coordinate of coordinates) {
            const block = this.#area.add(coordinate);
            blocks.push(block);
        }

        this.#blocks.push(blocks);
    }
}
