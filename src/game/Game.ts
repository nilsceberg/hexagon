import pos from "./Position";
import Board from "./Board";
import Cell from "./Cell";
import Player from "./Player";
import * as Constants from "./Constants";


export default class Game {
	board: Board;
	players: Player[];
	
	constructor(players: Player[]) {
		this.players = players;
		this.board = new Board(6);

		this.board.placePlayers(players);
	}

	turn(): Player {
		for(let player of this.players) {
			player.play(this.board);
		}

		this.applyInterest();

		return this.checkForWinner();
	}

	private checkForWinner(): Player {
		let lastOwner = this.board.getCellAt(pos(0,0,0)).owner;
		for(let p of this.board.positions) {
			if(this.board.getCellAt(p).owner !== lastOwner) {
				return null;
			}
		}
		return lastOwner;
	}

	private applyInterest() {
		let ownedCells = this.board.positions.map(p => this.board.getCellAt(p)).filter(c => c.owner !== null);
		for(let cell of ownedCells) {
			if (cell.resources < Constants.INTEREST_CAP) {
				cell.resources += Constants.INTEREST;
			}
		}
	}
}