export class Vec2 {
    readonly epsilon = 0.0001;

    constructor(public x: number, public y: number) {
    }

    static get zero() {
        return new Vec2(0, 0);
    }

    get magnitude() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }

    get normalized() {
        const m = this.magnitude;

        if (m < this.epsilon)
            return Vec2.zero;

        return new Vec2(this.x / length, this.y / length);
    }

    get normal() {
        return new Vec2(this.y, -this.x);
    }

    static add(a: Vec2, b: Vec2) {
        return new Vec2(a.x + b.x, a.y + b.y);
    }

    static sub(a: Vec2, b: Vec2) {
        return new Vec2(a.x - b.x, a.y - b.y);
    }

    static mul(v: Vec2, scalar: number) {
        return new Vec2(v.x * scalar, v.y * scalar);
    }
}