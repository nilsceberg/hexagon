import * as uuid from "uuid";

import * as Constants from "./Constants";
import Player from "./Player";
import Board from "./Board";
import DepthFirst from "./pathfinding/DepthFirst";
import VeryLazy from "./pathfinding/VeryLazy";
import { Position } from "./Position";


export enum CellOwner {
	Own = 0,
	Other = 1,
	None = 2
}

export default class Cell {
	id: string;
	resources: number;
	owner: Player;
	position: Position;

	constructor(position: Position) {
		this.id = uuid.v4();
		this.position = position;
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

	transfer(board: Board, to: Cell, amount: number) {
		if (this.resources > amount) {
			if (this.owner === to.owner) {
				const pathfinder = new VeryLazy();
				if (!pathfinder.pathExists(board, this.position, to.position)) {
					throw "cells are not connected";
				}
				this.resources -= amount;
				to.resources += amount;
			}
			else {
				if (!this.position.neighbours.find(p => board.wrap(p).equals(to.position))) {
					throw "cells are not adjacent";
				}

				this.resources -= amount;
				to.resources -= amount;

				if (to.resources < 0) {
					to.resources = -to.resources;
					to.owner = this.owner;
				}
			}
		}
		else {
			// TODO: illegal, I guess?
		}
	}

	getColor(): [number, number, number] {
		if (this.owner) {
			return this.owner.color;
		}
		else {
			return [155, 155, 155];
		}
	}

	grow() {
		if (this.resources < Constants.INTEREST_CAP) {
			this.resources += Constants.INTEREST;
		}
	}
}
