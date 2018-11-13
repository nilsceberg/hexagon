import pos from "./Position";
import Board from "./Board";
import Cell from "./Cell";
import Player from "./Player";
import * as Constants from "./Constants";
import * as Interface from "../strategy/Interface";


export default class Game {
	board: Board;
	players: Player[];
	
	constructor(strategies: {[name: string]: Interface.Strategy}) {
		this.players = [];
		let playerNumber = 1;
		for(let name in strategies) {
			this.players.push(new Player(name, strategies[name], playerNumber++, Object.keys(strategies).length));
		}

		this.board = new Board(6);
		this.board.placePlayers(this.players);
	}

	turn(): Player {
		for(let player of this.players) {
			player.play(this.board);
		}

		this.growCells();

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

	private growCells() {
		let ownedCells = this.board.positions.map(p => this.board.getCellAt(p)).filter(c => c.owner !== null);
		for(let cell of ownedCells) {
			cell.grow();
		}
	}
}
