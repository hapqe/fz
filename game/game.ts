import { Vec2 } from "./math";

export class Game {
    // width to height ratio
    readonly ratio = 16 / 9;
    readonly baseSize = 1 / 4;

    readonly tickRate = 60;

    onTick: () => void = () => { };

    beers: Vec2[] = [
        Vec2.zero,
        new Vec2(1 / 4, this.ratio / 4), // tr
        new Vec2(1 / 4, -this.ratio / 4), // br
        new Vec2(-1 / 4, -this.ratio / 4), // bl
        new Vec2(-1 / 4, this.ratio / 4), // tl
    ];

    constructor() {
        setInterval(() => {
            this.tick();
        }, 1000 / this.tickRate);
    }

    tick() {
        this.onTick();
    }

}