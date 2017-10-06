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

const SafetyMargin = 10;

/**
 * Neighbor cell owner constants
 */
const CellOwner = {
    Own: 0,
    Other: 1, //lololol //sabotage
    None: 2
};

/**
 * Class containing the logic for your strategy
 * 
 * @class MyStrategy
 */
class MyStrategy {

    constructor() {
        this.attemptedSave = {
            id: null,
            before: 0,
            expected: 0
        };
        this.abandonedCells = [];
    }

    /**
     * Processes the current state of the game and returns an action
     * 
     * @param {MyCell[]} myCells - Arrray of myCell objects representing the cells your strategy owns
     * @returns {Transaction} - Object representing the action taken by your strategy 
     * @memberof MyStrategy
     */
    turn(myCells) {
        // Filter out cells that were abandoned >5 turns ago

        //console.log("Checking abandoned...");

        for(let i in this.abandonedCells) {
            this.abandonedCells[i].turns++;
        }
        this.abandonedCells = this.abandonedCells.filter(cell => cell.turns < 5);
        //console.log("Checking attempted save...");

        // If we couldn't send resources to a certain cell, abandon it for now
        if(this.attemptedSave.id) {
            let cell = myCells.find(c => c.id === this.attemptedSave.id);
            if(cell && cell.resources < this.attemptedSave.expected) {
                this.abandonedCells.push({
                    id: cell.id,
                    turns: 0
                });
            }
            this.attemptedSave.id = null;
        }

        //console.log("Checking neutral...");


        // If there are neutral cells, take them!
        const neutralCell = this.getNeutralCell(myCells);
        if(neutralCell) {
            //console.log("Taking neutral cell");
            return {
                fromId: neutralCell.owned.id,
                toId: neutralCell.neutral.id,
                amountToTransfer: neutralCell.owned.resources - 1
            };
        }

        //console.log("Checking attack...");

        // If we're here, there are no threatened cells
        const enemyCell = this.getWeakestEnemyCell(myCells);
        if(enemyCell) {
            //console.log("Attack enemy!");
            return {
                fromId: enemyCell.owned.id,
                toId: enemyCell.enemy.id,
                amountToTransfer: enemyCell.owned.resources - 1
            };
        }
        //console.log("Checking defeense...");

        // If we're here, there are no neutral cells!
        const threatenedCell = this.getMostThreatenedCell(myCells);
        if(threatenedCell) {
            // A cell is threatened - save it!
            //console.log("Saving cell");
            const safeCell = this.getRichestSafeCell(myCells);

            if(safeCell) {
                this.attemptedSave.id = threatenedCell.id;
                this.attemptedSave.before = threatenedCell.resources;
                this.attemptedSave.expected = safeCell.resources - 1 + threatenedCell.resources;

                return {
                    fromId: safeCell.id,
                    toId: threatenedCell.id,
                    amountToTransfer: safeCell.resources - 1 // maybe try to keep threatened cells below 100 if possible
                }
            }
        }

        //console.log("Random transfer");

        // If none of the above, just transfer to the first frontline cell
        let richest = this.getRichestSafeCell(myCells);
        let frontline = this.getFrontlineCell(myCells);

        if(!richest || !frontline) {
            //console.log("Tiny transfer to spice things up");        
            richest = this.getCellWithFriendlyNeighbor(myCells);
            frontline = richest.neighbours.filter(c => c.owner === CellOwner.Own)[0];

            if(!frontline) {
                frontline = richest.neighbours[0];
            }
        }

        //console.log(richest.id);
        //console.log(frontline.id);

        return {
            fromId: richest.id,
            toId: frontline.id,
            amountToTransfer: richest.resources - 1
        }
    }

    getCellWithFriendlyNeighbor(myCells) {
        for(let cell of myCells) {
            for(let neighbour of cell.neighbours) {
                if(neighbour.owner === CellOwner.Own) {
                    return cell;
                }
            }
        }
        return null;
    }

    getMostThreatenedCell(myCells) {
        let greatestThreat = 0;
        let mostThreatened = null;

        for(let cell of myCells) {
            if(this.abandonedCells.find(c => c.id === cell.id)) continue; // cell is abandoned
            const threat = this.calculateThreat(cell);
            if (threat > greatestThreat) {
                greatestThreat = threat;
                mostThreatened = cell;
            }
        }

        return mostThreatened;
    }

    calculateThreat(cell) {
        const richest = cell.neighbours.filter(n => n.owner === CellOwner.Other).sort((n1, n2) => n2.resources - n1.resources)[0];
        if(richest) {
            return richest.resources - cell.resources + 1 + SafetyMargin * 2
        } else {
            return 0;
        }
    }

    getRichestSafeCell(myCells) {
        const safeCells = myCells
            .filter(cell => cell.neighbours.every(neighbour => neighbour.owner === CellOwner.Own));

        return safeCells.sort((n1, n2) => n2.resources - n1.resources)[0];
    }

    getNeutralCell(myCells) {
        for(let cell of myCells) {
            for(let neighbour of cell.neighbours) {
                if(neighbour.resources === 0) { // Actually check if the cell has 0 resources
                    // Neutral
                    //console.log(cell);
                    //console.log(neighbour);
                    return {
                        neutral: neighbour,
                        owned: cell
                    };
                }
            }
        }
    }

    getWeakestEnemyCell(myCells) {
        let greatestDelta = 0;
        let weakestCell = null;
        let strongestCell = null;

        for(let cell of myCells) {
            for(let enemy of cell.neighbours) {
                if(enemy.owner !== CellOwner.Own && cell.resources - enemy.resources > SafetyMargin && cell.resources - enemy.resources > greatestDelta) {
                    greatestDelta = cell.resources - enemy.resources;
                    weakestCell = enemy;
                    strongestCell = cell;
                }
            }
        }

        if(weakestCell && strongestCell) {
            return {
                owned: strongestCell,
                enemy: weakestCell
            };
        } else {
            return null;
        }
    }

    getFrontlineCell(myCells) {
        for(let cell of myCells) {
            for(let neighbour of cell.neighbours) {
                if(neighbour.owner == CellOwner.Other) {
                    return cell;
                }
            }
        }
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