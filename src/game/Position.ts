export class Position {
	constructor(x: number, y: number, z: number) {
		this._x = x;
		this._y = y;
		this._z = z;
	}

	get x(): number {
		return this._x;
	}

	get y(): number {
		return this._y;
	}

	get z(): number {
		return this._z;
	}

	add(x: number, y: number, z: number): Position {
		return pos(this._x + x, this._y + y, this._z + z);
	}

	subtract(other: Position): Position {
		return pos(this._x - other.x, this._y - other.y, this._z - other.z);
	}

	get north(): Position {
		return this.add(0, 1, -1);
	}

	get northEast(): Position {
		return this.add(1, 0, -1);
	}

	get southEast(): Position {
		return this.add(1, -1, 0);
	}

	get south(): Position {
		return this.add(0, -1, 1);
	}

	get southWest(): Position {
		return this.add(-1, 0, 1);
	}

	get northWest(): Position {
		return this.add(-1, 1, 0);
	}

	get neighbours(): Position[] {
		return [
			this.north,
			this.northEast,
			this.southEast,
			this.south,
			this.southWest,
			this.northWest
		];
	}

	get axial(): { c: number, r: number } {
		return {
			c: this._x,
			r: this._y
		};
	}

	rotate(n: number = 1): Position {
		if (n === 0) {
			return this;
		}
		else {
			return pos(-this.z, -this.x, -this.y).rotate(n - 1);
		}
	}

	distance(target: Position): number {
		return (Math.abs(this.x - target.x) + Math.abs(this.y - target.y) + Math.abs(this.z - target.z)) / 2;
	}

	private _x: number;
	private _y: number;
	private _z: number;
}

export default function pos(x: number, y: number, z: number): Position {
	return new Position(x, y, z);
}
