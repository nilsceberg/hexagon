export class Position {
	constructor(x: number, y: number, z: number) {
		this._x = x;
		this._y = y;
		this._z = z;
	}

	get x(): number {
		return this.x;
	}

	get y(): number {
		return this.x;
	}

	get z(): number {
		return this.x;
	}

	add(x: number, y: number, z: number): Position {
		return pos(this._x + x, this._y + y, this._z + z);
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

	private _x: number;
	private _y: number;
	private _z: number;
}

export default function pos(x: number, y: number, z: number): Position {
	return new Position(x, y, z);
}
