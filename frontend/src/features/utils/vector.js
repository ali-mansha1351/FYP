export default class Vector {
    constructor(x, y, z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }

    negative() {
        return new Vector(-this.x, -this.y, -this.z);
    }

    add(v) {
        if (v instanceof Vector) return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
        else return new Vector(this.x + v, this.y + v, this.z + v);
    }

    subtract(v) {
        if (v instanceof Vector) return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
        else return new Vector(this.x - v, this.y - v, this.z - v);
    }

    multiply(v) {
        if (v instanceof Vector) return new Vector(this.x * v.x, this.y * v.y, this.z * v.z);
        else return new Vector(this.x * v, this.y * v, this.z * v);
    }

    divide(v) {
        if (v instanceof Vector) return new Vector(this.x / v.x, this.y / v.y, this.z / v.z);
        else return new Vector(this.x / v, this.y / v, this.z / v);
    }

    equals(v) {
        return this.x == v.x && this.y == v.y && this.z == v.z;
    }

    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    cross(v) {
        return new Vector(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
    }

    length() {
        return Math.sqrt(this.dot(this));
    }

    unit() {
        return this.divide(this.length());
    }

    min() {
        return Math.min(Math.min(this.x, this.y), this.z);
    }

    max() {
        return Math.max(Math.max(this.x, this.y), this.z);
    }

    toAngles() {
        return {
            theta: Math.atan2(this.z, this.x),
            phi: Math.asin(this.y / this.length())
        };
    }

    angleTo(a) { // returns radians
        return Math.acos(this.dot(a) / (this.length() * a.length()));
    }

    unitAngleTo(a) { // use when vectors are of unit length
        return Math.acos(this.dot(a));
    }

    toArray(n) {
        return [this.x, this.y, this.z].slice(0, n || 3);
    }

    clone() {
        return new Vector(this.x, this.y, this.z);
    }

    init(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }
}