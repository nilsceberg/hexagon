/**
* Entry point of the strategy, do not delete or your submission won't compile correctly
* Gets called every turn by Hexagon
* 
* @param {MyCell[]} myCells - Arrray of myCell objects representing the cells your strategy owns
* @returns {any} - Object representing the action taken by your strategy 
*/
export function strategy(myCells) {
	return MyStrategy.instance.turn(myCells);
}

/**
* Neighbor cell owner constants
*/
const CellOwner = {
	Own: 0,
	Other: 1,
	None: 2
};

/**
* Class containing the logic for your strategy
* 
* @class MyStrategy
*/
class MyStrategy {
	
	constructor() {
		//Put your initialization logic here
	}
	
	/**
	* Processes the current state of the game and returns an action
	* 
	* @param {MyCell[]} myCells - Arrray of myCell objects representing the cells your strategy owns
	* @returns {Transaction} - Object representing the action taken by your strategy 
	* @memberof MyStrategy
	*/
	turn(myCells) {
		//Find all cells that has a neighbour that is not mine
		const availableCells = myCells
		.filter(cell => !cell.neighbours.every(neighbour => neighbour.owner === CellOwner.Own));
		
		//Sort all available cells by the maximum resources difference between itself and its enemy neighbours
		availableCells.sort((cellA, cellB) => this.getCellResourceDelta(cellB) - this.getCellResourceDelta(cellA));
		
		//Get the first cell with the greatest resource delta
		const attackingCell = availableCells[0];
		//Sort its neighbours by resources
		attackingCell.neighbours.sort((n1, n2) => n1.resources - n2.resources);
		//Get the weakest enemy neighbour
		const weakestNeighbour = attackingCell.neighbours.filter(n => n.owner !== CellOwner.Own)[0];
		
		//Attack the weakest enemy neighbour
		return {
			fromId: attackingCell.id,
			toId: weakestNeighbour.id,
			amountToTransfer: attackingCell.resources - 1
		};
	}
	
	/**
	* Calculates the resource delta of a cell
	* The resource delta is defined as the biggest difference between a cells resources and an neighbouring enemy cell
	* @param {MyCell} myCell - A cell I owner
	* @returns {number} - Resource delta of that cell
	*/
	getCellResourceDelta(myCell) {
		return myCell.resources -
		Math.min(...myCell.neighbours.filter(n => n.owner !== CellOwner.Own).map(n => n.resources));
	}
	
	
	/**
	* Implements the singleton pattern for the strategy with lazy initialization
	* 
	* @readonly
	* @static
	* @memberof MyStrategy
	*/
	static get instance() {
		if (_instance == null) {
			_instance = new MyStrategy();
		}
		
		return _instance;
	}
	
	
	
}

//Pseudo static member
let _instance = null