import Board from "../game/Board";
import Player from "../game/Player";
import Renderer from "./Renderer";


class DummyRenderer implements Renderer {
	render(board: Board): void {
	}

	displayPlayers(boardSize: number, players: Player[]): void {
	}
}

export default DummyRenderer;
