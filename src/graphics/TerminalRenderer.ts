import Renderer from "./Renderer";
import Board from "../game/Board";
import Cell from "../game/Cell";
import pos, { Position } from "../game/Position";

import * as axel from "axel";


const BOX_HEIGHT = 3;
const BOX_WIDTH = 11;

export default class TerminalRenderer implements Renderer {
	constructor() {
		axel.clear();
	}

	async render(board: Board): Promise<void> {
		const boardSize = board.getMapSize();

		const origin = this.toPixel(boardSize, 0, 0);
		this.drawHexagon(origin, board.getCellAt(pos(0,0,0)));

		for(let ring = 1; ring <= boardSize; ++ring) {
			let cartesianPosition = {
				x: 0, y: -ring * 2
			};
			let hexagon = pos(0, ring, -ring);

			hexagon = await this.drawSide(board, ring, hexagon, cartesianPosition, x => x.southEast, { x:  1, y:  1 });
			hexagon = await this.drawSide(board, ring, hexagon, cartesianPosition, x => x.south,     { x:  0, y:  2 });
			hexagon = await this.drawSide(board, ring, hexagon, cartesianPosition, x => x.southWest, { x: -1, y:  1 });
			hexagon = await this.drawSide(board, ring, hexagon, cartesianPosition, x => x.northWest, { x: -1, y: -1 });
			hexagon = await this.drawSide(board, ring, hexagon, cartesianPosition, x => x.north,     { x:  0, y: -2 });
			hexagon = await this.drawSide(board, ring, hexagon, cartesianPosition, x => x.northEast, { x:  1, y: -1 });
		}

		axel.cursor.restore();
	}

	private async drawSide(
		board: Board,
		ring: number,
		hexagon: Position,
		cartesian: { x: number, y: number },
		neighbour: (pos: Position) => Position,
		cartesianOffset: { x: number, y: number }
	): Promise<Position> {
		for(let i=0; i<ring; ++i) {
			let coords = this.toPixel(board.getMapSize(), cartesian.x, cartesian.y);
			this.drawHexagon(coords, board.getCellAt(hexagon));

			hexagon = neighbour(hexagon);
			cartesian.x += cartesianOffset.x;
			cartesian.y += cartesianOffset.y;
		}

		return hexagon;
	}

	private drawHexagon(coords: { x: number, y: number }, cell: Cell) {
		const [r, g, b] = cell.getColor();
		axel.bg(r, g, b);

		axel.box(coords.x, coords.y, BOX_WIDTH, BOX_HEIGHT);
		axel.fg(0,0,0);

		const label = cell.resources.toString();
		axel.text(coords.x + BOX_WIDTH / 2 - label.length / 2, coords.y + 1, label);
		axel.bg(0,0,0);
	}

	private toPixel(boardSize: number, x: number, y: number): { x: number, y: number } {
		return {
			x: (x + boardSize) * BOX_WIDTH + 20,
			y: (y + boardSize * 2.2) * 1 * BOX_HEIGHT
		};
	}

	private spaces(n: number): string {
		return Array(n+1).join(" ");
	}
}