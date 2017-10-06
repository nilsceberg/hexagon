import Cell from "./Cell";
import pos, { Position } from "./Position";


type MapData = {[c: number]: {[r: number]: Cell}};

export default class Board {
	private radius: number;
	private map: MapData;
	private idMap: {[uuid: string]: Cell};

	constructor(radius: number) {
		this.radius = radius;

		this.map = {};
		this.idMap = {};

		for(let c = 0; c <= radius; ++c) {
			this.fillColumn(c);
			if (c > 0) {
				this.fillColumn(-c);
			}
		}
	}

	private fillColumn(c: number) {
		this.map[c] = {};
		for(let r = 0; r <= (this.radius * 2 - c); ++r) {
			let cell = new Cell();
			this.map[c][r - this.radius] = cell;
			this.idMap[cell.id] = cell;
		}
	}

	get mirror(): Position {
		return pos(
			2 * this.radius + 1,
			-this.radius,
			-this.radius - 1
		);
	}

	get mirrors(): Position[] {
		return [0, 1, 2, 3, 4, 5].map(n => this.mirror.rotate(n));
	}

	wrap(position: Position): Position {
		const enteredMirror = this.mirrors.find(center => center.distance(position) <= this.radius);

		if (enteredMirror) {
			return position.subtract(enteredMirror);
		}
		else {
			return position;
		}
	}

	getCellAt(position: Position): Cell {
		let { c, r } = position.axial;
		return this.map[c][r];
	}

	getCell(id: string): Cell {
		return this.idMap[id];
	}

	getMapSize(): number {
		return this.radius;
	}
}
