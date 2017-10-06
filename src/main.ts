require('source-map-support').install();

import pos from "./game/Position";
import Game from "./game/Game";
import Player from "./game/Player";
import TerminalRenderer from "./graphics/TerminalRenderer";

import { strategy as AggressiveBot } from "./strategy/bots/Aggressive";
import { strategy as TacoBot } from "./strategy/bots/Taco";
import { strategy as NoahBot } from "./strategy/bots/Noah";


class Main {
	async start() {
		let renderer = new TerminalRenderer();

		let game = new Game({
			//Aggressive: AggressiveBot,
			noahshitbot: NoahBot,
			TaconsLag: TacoBot,
		});


		await renderer.render(game.board);
		while(true) {
			let winner = game.turn();
			await renderer.render(game.board);
			renderer.displayPlayers(game.players);

			if(winner) {
				break;
			}

			await this.sleep(10);
		}

		let winner = game.turn();
		renderer.displayPlayers(game.players);
	}

	private sleep(milliseconds: number): Promise<void> {
		return new Promise<void>(resolve => setTimeout(resolve, milliseconds));
	}
}

let main = new Main();
main.start();
