export class Vec2 {
    constructor(public x: number, public y: number) {
    }

    static get zero() {
        return new Vec2(0, 0);
    }
}