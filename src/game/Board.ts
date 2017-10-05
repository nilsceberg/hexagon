import Cell from "./Cell";
import pos, { Position } from "./Position";


type MapData = {[c: number]: {[r: number]: Cell}};

export default class Board {
	private size: number;
	private map: MapData;
	private idMap: {[uuid: string]: Cell};

	constructor(size: number) {
		this.size = size;

		this.map = {};
		this.idMap = {};

		for(let c = 0; c <= size; ++c) {
			this.fillColumn(c);
			if (c > 0) {
				this.fillColumn(-c);
			}
		}
	}

	private fillColumn(c: number) {
		this.map[c] = {};
		for(let r = 0; r <= (this.size * 2 - c); ++r) {
			let cell = new Cell();
			this.map[c][r - this.size] = cell;
			this.idMap[cell.id] = cell;
		}
	}

	getCellAt(position: Position): Cell {
		let { c, r } = position.axial;
		return this.map[c][r];
	}

	getCell(id: string): Cell {
		return this.idMap[id];
	}

	getMapData(): MapData {
		return this.map;
	}

	getMapSize(): number {
		return this.size;
	}
}
