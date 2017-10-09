import { Position } from "../Position";
import Board from "../Board";


interface Pathfinder {
	pathExists(board: Board, from: Position, to: Position): boolean;
}

export default Pathfinder;

