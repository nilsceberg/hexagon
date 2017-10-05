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
		board.getCellAt(pos(0, 1, -1)).owner = player2;

		await renderer.render(board);

		process.stdin.on("data", () => { process.exit(0); });
	}
}

let main = new Main();
main.start();
