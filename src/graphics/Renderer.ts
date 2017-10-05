import Board from "../game/Board";


interface Renderer {
	render(board: Board): void;
}

export default Renderer;
