import Pathfinder from "./Pathfinder";
import { Position } from "../Position";
import Board from "../Board";


export default class VeryLazy implements Pathfinder {
	pathExists(board: Board, from: Position, to: Position): boolean {
        const fromFriendlyNeighbours = from.neighbours
            .map(p => board.getCellAt(p))
            .filter(c => c.owner == board.getCellAt(from).owner);
            
        const toFriendlyNeighbours = to.neighbours
            .map(p => board.getCellAt(p))
            .filter(c => c.owner == board.getCellAt(from).owner);

        return fromFriendlyNeighbours.length > 0 && toFriendlyNeighbours.length > 0;
	}
}
