require('source-map-support').install();

import pos from "./game/Position";
import Game from "./game/Game";
import Player from "./game/Player";
import TerminalRenderer from "./graphics/TerminalRenderer";

import { strategy as AggressiveBot } from "./strategy/bots/Aggressive";


class Main {
	async start() {
		let renderer = new TerminalRenderer();

		let game = new Game([
			new Player(AggressiveBot),
			new Player(AggressiveBot),
			new Player(AggressiveBot)
		]);


		await renderer.render(game.board);
		while(true) {
			let winner = game.turn();
			await renderer.render(game.board);

			if(winner) {
				console.log("Winner:", winner);
				break;
			}

			await this.sleep(10);
		}

		//process.stdin.on("data", () => { process.exit(0); });
	}

	private sleep(milliseconds: number): Promise<void> {
		return new Promise<void>(resolve => setTimeout(resolve, milliseconds));
	}
}

let main = new Main();
main.start();
