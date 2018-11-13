import Cell from "./Cell";
import Player from "./Player";
import * as Constants from "./Constants";
import pos, { Position } from "./Position";


type MapData = {[c: number]: {[r: number]: Cell}};

export default class Board {
	private radius: number;
	private map: MapData;
	private idMap: {[uuid: string]: Cell};

	constructor(radius: number) {
		this.radius = radius;

		this.map = {};
		this.idMap = {};

		this.fill();
	}

	private fill() {
		let position = pos(0,0,0);
		this.putCell(position);
		for(let ring = 1; ring <= this.radius; ++ring) {
			position = position.north;
			let sidePosition = position;
			for(let hex = 0; hex < ring; ++hex) {
				for(let p of sidePosition.rotations) {
					this.putCell(p);
				}
				sidePosition = sidePosition.southEast;
			}
		}
	}

	private putCell(position: Position) {
		const {c, r} = position.axial;
		if(!this.map[c]) this.map[c] = {};
		const cell = new Cell(position);
		this.map[c][r] = cell;
		this.idMap[cell.id] = cell;
	}

	get mirror(): Position {
		return pos(
			2 * this.radius + 1,
			-this.radius,
			-this.radius - 1
		);
	}

	placePlayers(players: Player[]) {
		let randomStartResources = new Array(6).fill(0).map(n => Math.floor(Math.random() * 100));

		this.placePlayer(players[0], pos(0,0,0), randomStartResources);

		if(players.length > 1) {
			let position = pos(-4, 0, 4);
			for(let i = 1; i < players.length && i < 7; ++i) {
				this.placePlayer(players[i], position, randomStartResources);
				position = position.rotate();
			}
		}
	}

	private placePlayer(player: Player, position: Position, randomStartResources: number[]) {
		randomStartResources = randomStartResources.slice();

		const cell = this.getCellAt(position);
		cell.owner = player;
		cell.resources = Constants.STARTING_RESOURCES;

		// place random start resources into neighbouring neutral cells
		cell.position.neighbours.map((p, i) => {
			this.getCellAt(p).resources = randomStartResources.splice(
				Math.floor(Math.random() * randomStartResources.length), 1
			)[0];
		})
	}

	wrap(position: Position): Position {
		const enteredMirror = this.mirror.rotations.find(center => center.distance(position) <= this.radius);

		if (enteredMirror) {
			return position.subtract(enteredMirror);
		}
		else {
			return position;
		}
	}

	getCellAt(position: Position): Cell {
		let { c, r } = position.axial;
		return this.map[c][r];
	}

	getCell(id: string): Cell {
		return this.idMap[id];
	}

	getMapSize(): number {
		return this.radius;
	}

	get positions(): Position[] {
		let positions: Position[] = [];
		for(let c in this.map) {
			for(let r in this.map[c]) {
				positions.push(Position.fromAxial(Number(c), Number(r)));
			}
		}
		return positions;
	}
}
