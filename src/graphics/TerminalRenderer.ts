import Renderer from "./Renderer";
import Board from "../game/Board";
import Player from "../game/Player";
import Cell from "../game/Cell";
import pos, { Position } from "../game/Position";

import * as axel from "axel";


const BOX_SIZE = 3;

export default class TerminalRenderer implements Renderer {
	private boxSize: number;
	
	constructor(boxSize: number) {
		this.boxSize = boxSize;
		axel.clear();
	}

	async render(board: Board): Promise<void> {
		axel.cursor.off();

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
		axel.cursor.on();
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

		axel.box(coords.x + 1, coords.y + 1, this.boxSize * 2 - 1, this.boxSize - 1);
		axel.fg(0,0,0);
		axel.bg(0,0,0);
		axel.box(coords.x, coords.y, 1, this.boxSize);
		axel.box(coords.x, coords.y, this.boxSize * 2, 1);

		axel.bg(r, g, b);
		const label = cell.resources.toString();
		axel.text(coords.x + this.boxSize - label.length / 2 + 1, coords.y + Math.floor(this.boxSize / 2), label);
		axel.bg(0,0,0);
	}

	private toPixel(boardSize: number, x: number, y: number): { x: number, y: number } {
		return {
			x: (x + boardSize) * this.boxSize * 2 + 10,
			y: ((y + boardSize) * this.boxSize) / 2 + (boardSize * this.boxSize) / 2 + 5
		};
	}

	private spaces(n: number): string {
		return Array(n+1).join(" ");
	}

	displayPlayers(boardSize: number, players: Player[]): void {
		axel.cursor.off();
		for(let i in players) {
			const player = players[i];

			if(player.alive) {
				const [r, g, b] = player.color;
				axel.bg(r, g, b);
			}
			else {
				axel.bg(120, 120, 120);
			}

			axel.box(2 * boardSize * this.boxSize * 2 + 30, 10 + Number(i) * 4, 40, 3);
			axel.fg(0,0,0);
			axel.text(2 * boardSize * this.boxSize * 2 + 32, 10 + Number(i) * 4 + 1, `${player.name} (${player.exceptions} exceptions)`);
		}
		axel.cursor.restore();
		axel.cursor.on();
	}
}
