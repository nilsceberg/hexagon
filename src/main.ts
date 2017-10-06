require('source-map-support').install();

import pos from "./game/Position";
import Board from "./game/Board";
import Player from "./game/Player";
import TerminalRenderer from "./graphics/TerminalRenderer";


class Main {
	async start() {
		let board = new Board(6);
		let renderer = new TerminalRenderer();

		let player1 = new Player();
		let player2 = new Player();

		board.getCellAt(pos(0, 0, 0)).owner = player1;

		let p = pos(0, 0, 0);

		while(true) {
			await renderer.render(board);
			await this.sleep(1000);
			p = board.wrap(p.southEast);
			board.getCellAt(p).owner = player1;
			//board.getCellAt(p.rotate()).owner = player1;
		}

		//process.stdin.on("data", () => { process.exit(0); });
	}

	private sleep(milliseconds: number): Promise<void> {
		return new Promise<void>(resolve => setTimeout(resolve, milliseconds));
	}
}

let main = new Main();
main.start();
