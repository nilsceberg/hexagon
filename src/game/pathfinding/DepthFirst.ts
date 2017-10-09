import Pathfinder from "./Pathfinder";
import { Position } from "../Position";
import Board from "../Board";


export default class DepthFirst implements Pathfinder {
	pathExists(board: Board, from: Position, to: Position, traversed: Position[] = []): boolean {
		traversed.push(from);
		return from.neighbours.map(p => board.wrap(p))
			.filter(p => traversed.find(x => x.equals(p)) === undefined)
			.filter(p => board.getCellAt(p).owner === board.getCellAt(from).owner)
			.filter(p => p.equals(to) || this.pathExists(board, p, to, traversed)).length > 0;
	}
}
