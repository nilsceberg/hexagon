require('source-map-support').install();

import pos from "./game/Position";
import Game from "./game/Game";
import Player from "./game/Player";
import Renderer from "./graphics/Renderer";
import TerminalRenderer from "./graphics/TerminalRenderer";
import DummyRenderer from "./graphics/DummyRenderer";
import { Strategy } from "./strategy/Interface";

import { strategy as AggressiveBot } from "./strategy/bots/Aggressive";
import { strategy as TacoBot } from "./strategy/bots/Taco";
import { strategy as NoahBot } from "./strategy/bots/Noah";


class Main {
	private async render(renderer: Renderer, game: Game) {
		await renderer.render(game.board);
		renderer.displayPlayers(game.board.getMapSize(), game.players);
	}

	private async simulate(realtime: boolean, players: {[name: string]: Strategy}): Promise<Player> {
		let renderer: Renderer = realtime ? new TerminalRenderer(3) : new DummyRenderer();
		let game = new Game(players);

		await this.render(renderer, game);
		let winner = null;

		while(!winner) {
			winner = game.turn();
			await this.render(renderer, game);

			if(realtime) {
				await this.sleep(10);
			}
		}

		game.turn();
		await this.render(renderer, game);
		renderer.displayPlayers(game.board.getMapSize(), game.players);

		return winner;
	}

	private sleep(milliseconds: number): Promise<void> {
		return new Promise<void>(resolve => setTimeout(resolve, milliseconds));
	}

	async start(realtime: boolean): Promise<void> {
		let winner = await this.simulate(realtime, {
			//Aggressive: AggressiveBot,
			noahshitbot: NoahBot,
			TaconsLag: TacoBot,
		});

		if(!realtime) {
			console.log(winner);
		}
	}
}

let main = new Main();
main.start(true);

