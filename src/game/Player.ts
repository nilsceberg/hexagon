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
	name: string;

	constructor(name: string, strategy: Interface.Strategy, playerNumber: number, totalPlayers: number) {
		this.name = name;
		this.id = uuid.v4();
		this.strategy = strategy;
		this.alive = true;

		//const c = color.hsv(Math.random() * 360, 100, 100).rgb()
		//this.color = c.array() as [number, number, number];
		this.color = color.hsv(360 * (playerNumber / totalPlayers) + 90, 100, 100).rgb().array() as [number, number, number];
	}

	toString(): string {
		return `${this.name} (${this.exceptions} exceptions)`;
	}

	play(board: Board) {
		if(!this.alive) {
			return;
		}

		const boardState = this.prepareBoardState(board);
		if(boardState.length === 0) {
			this.alive = false;
			return;
		}

		const transaction = this.runStrategy(boardState);
		this.issueTransaction(board, transaction);
	}

	private runStrategy(state: Interface.BoardState): Interface.Transaction {
		try {
			return this.strategy(state);
		}
		catch(e) {
			this.exceptions++;
		}
	}

	private issueTransaction(board: Board, transaction: Interface.Transaction): void {
		if(transaction) {
			try {
				board.getCell(transaction.fromId).transfer(board, board.getCell(transaction.toId), transaction.amountToTransfer);
			}
			catch(e) {
				this.exceptions++;
			}
		}
	}

	private prepareBoardState(board: Board): Interface.BoardState {
		const myCellsPositions: Position[] = board.positions.filter(p => board.getCellAt(p).owner === this);
		const boardState: Interface.BoardState = myCellsPositions.map(p => {
			const cell = board.getCellAt(p);
			return <Interface.MyCell>{
				id: cell.id,
				resources: cell.resources,
				maxGrowth: cell.maxGrowth,
				neighbours: p.neighbours.map(p => {
					const cell = board.getCellAt(board.wrap(p));
					return <Interface.NeighbourCell>{
						id: cell.id,
						resources: cell.resources,
						maxGrowth: cell.maxGrowth,
						owner: cell.getRelativeOwner(this)
					};
				})
			};
		});

		return boardState;
	}
}

export default Player;
