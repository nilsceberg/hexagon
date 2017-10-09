import Board from "../game/Board";
import Player from "../game/Player";


interface Renderer {
	render(board: Board): void;
	displayPlayers(boardSize: number, players: Player[]): void;
}

export default Renderer;
