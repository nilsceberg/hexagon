import Board from "../game/Board";
import Player from "../game/Player";


interface Renderer {
	render(board: Board): void;
	displayPlayers(players: Player[]): void;
}

export default Renderer;
