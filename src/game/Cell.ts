import * as uuid from "uuid";

import Player from "./Player";


export enum CellOwner {
	Own = 0,
	None = 1,
	Other = 2
}

export default class Cell {
	id: string;
	resources: number;
	owner: Player;

	constructor() {
		this.id = uuid.v4();
		this.resources = 0;
		this.owner = null;
	}

	getRelativeOwner(to: Player): CellOwner {
		if (this.owner === null) {
			return CellOwner.None;
		}
		else if (this.owner === to) {
			return CellOwner.Own;
		}
		else {
			return CellOwner.Other;
		}
	}

	getColor(): [number, number, number] {
		if (this.owner) {
			return this.owner.color;
		}
		else {
			return [255, 255, 255];
		}
	}
}
