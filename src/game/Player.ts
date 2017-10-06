import * as uuid from "uuid";
import * as color from "color";

import * as Interface from "../strategy/Interface";
import Board from "./Board";
import Cell from "./Cell";
import { Position } from "./Position";


class Player {
	id: String;
	color: [number, number, number];
	strategy: Interface.Strategy;
	exceptions: number = 0;
	alive: boolean;

	constructor(strategy: Interface.Strategy) {
		this.id = uuid.v4();
		const c = color.hsv(Math.random() * 360, 100, 100).rgb()
		this.color = c.array() as [number, number, number];
		this.alive = true;

		this.strategy = strategy;
	}

	play(board: Board) {
		if(!this.alive) {
			return;
		}

		const boardState = this.prepareBoardState(board);
		if(boardState.length === 0) {
			this.alive = false;
		}

		const transaction = this.runStrategy(boardState);

		if(transaction) {
			board.getCell(transaction.toId).transfer(board.getCell(transaction.fromId), transaction.amountToTransfer);
		}
	}

	private runStrategy(state: Interface.BoardState): Interface.Transaction {
		try {
			return this.strategy(state);
		} catch(e) {
			this.exceptions++;
			console.error(e);
		}
	}

	private prepareBoardState(board: Board): Interface.BoardState {
		const myCellsPositions: Position[] = board.positions.filter(p => board.getCellAt(p).owner === this);
		const boardState: Interface.BoardState = myCellsPositions.map(p => {
			const cell = board.getCellAt(p);
			return <Interface.Cell>{
				id: cell.id,
				resources: cell.resources,
				neighbours: p.neighbours.map(p => {
					const cell = board.getCellAt(board.wrap(p));
					return <Interface.Neighbour>{
						id: cell.id,
						resources: cell.resources,
						owner: cell.getRelativeOwner(this)
					};
				})
			};
		});

		return boardState;
	}
}

export default Player;
