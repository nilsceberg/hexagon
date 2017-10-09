import * as uuid from "uuid";

import Player from "./Player";
import Board from "./Board";
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

	transfer(board: Board, from: Cell, amount: number) {
		if (from.resources > amount) {
			from.resources -= amount;
			if (from.owner === this.owner) {
				// TODO: check if there is actually a path
				this.resources += amount;
			}
			else {
				// TODO: check if cells are actually adjacent (can we do that as it stands?)
				if (!this.position.neighbours.find(p => board.wrap(p).equals(from.position))) {
					throw "cells are not adjacent";
				}

				this.resources -= amount;
				if (this.resources < 0) {
					this.resources = -this.resources;
					this.owner = from.owner;
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
}
