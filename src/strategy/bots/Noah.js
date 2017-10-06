/**
 * Entry point of the strategy, do not delete or your submission won't compile correctly
 * Gets called every turn by Hexagon
 * 
 * @param {MyCell[]} myCells - Arrray of myCell objects representing the cells your strategy owns
 * @returns {Transaction} - Object representing the action taken by your strategy 
 */
export function strategy(myCells) {
    var cellsWithNeutrals = getMycellsWithNeutrals(myCells);

    //take all neutrals
    if(cellsWithNeutrals.length > 0){
        cellsWithNeutrals.sort(function (myCellA, myCellB) {
            return (myCellB.resources - myCellB.enemies[0]) - (myCellA.resources - myCellA.enemies[0]);
        });

        var targetI = Math.floor(Math.random() * cellsWithNeutrals.length)

        var targetCell = cellsWithNeutrals[targetI];

        return {
            fromId: targetCell.id,
            toId: targetCell.enemies[0].id,
            amountToTransfer: targetCell.resources - 1
        };
    }

    var cellsWithEnemies = getMyCellsWithEnemies(myCells);
    var cellsWithFriends = getMyCellsWithFriends(myCells);
 
    cellsWithNeutrals.sort(function (myCellA, myCellB) {
            return (myCellB.resources) - (myCellA.resources);
    });

    cellsWithFriends.sort(function (myCellA, myCellB) {
            return (myCellB.resources) - (myCellA.resources);
    });

    if(cellsWithEnemies[0].resources - 150 >= cellsWithEnemies[0].enemies[0].resources){
        //console.log("attack")
        return {
            fromId: cellsWithEnemies[0].id,
            toId: cellsWithEnemies[0].enemies[0].id,
            amountToTransfer: Math.floor(cellsWithEnemies[0].resources/3) + 1
        };
    }
    else{
        //console.log("move around")
        return {
            fromId: cellsWithFriends[0].id,
            toId: cellsWithEnemies[0].id,
            amountToTransfer: cellsWithFriends[0].resources - 1
        };
    }

/*
    var randi = Math.floor(Math.random() * cellsWithEnemies.length)
    var randtar = Math.floor(Math.random() * ellsWithEnemies[randi].enemies.length)
    return {
        
            fromId: cellsWithEnemies[randi].id,
            toId: cellsWithEnemies[randi].enemies[randtar].id,
            amountToTransfer: cellsWithEnemies[randi].resources - 1
        };
		*/


    
}

/**
 * Gets all cells that has atleast one cell that is an enemy cell. It attaches an enemy property to the object for easy access.
 * The enemy property is sorted by resources in ascending order
 * @param {MyCell[]} myCells - Cells you want  to check for enemies
 * @returns {any[]} Cells with enemy property attached
 */
function getMyCellsWithEnemies(myCells){
    var cellsWithEnemies = [];
    for (var cellIndex = 0; cellIndex < myCells.length; cellIndex++) {

        var current = myCells[cellIndex];

        var enemies = getEnemies(current);

        if (enemies.length > 0) {

            enemies.sort(function (e1, e2) {
                return e1.resources - e2.resources;
            });
            
            current.enemies = enemies;
            cellsWithEnemies.push(current);
        }
    }

    return cellsWithEnemies;
}


function getMyCellsWithFriends(myCells){
    var cellsWithFriends = [];
    for (var cellIndex = 0; cellIndex < myCells.length; cellIndex++) {

        var current = myCells[cellIndex];

        var friends = getEnemies(current);


        if (friends.length == 0) {

            friends.sort(function (e1, e2) {
                return e1.resources - e2.resources;
            });

            current.friends = friends;
            cellsWithFriends.push(current);
        }
    }

    return cellsWithFriends;
}

function getMycellsWithNeutrals(myCells) {

    var cellsWithNeutrals = [];
    for (var cellIndex = 0; cellIndex < myCells.length; cellIndex++) {

        var current = myCells[cellIndex];

        var enemies = getNeutrals(current);

        if (enemies.length > 0) {

            enemies.sort(function (e1, e2) {
                return e1.resources - e2.resources;
            });

            current.enemies = enemies;
            cellsWithNeutrals.push(current);
        }
    }

    return cellsWithNeutrals;
}

/**
 * Finds all neutrals surrounding a cell
 * @param {MyCell} myCell 
 * @returns {} 
 */
function getNeutrals(myCell) {
    var neutrals = [];
    for (var neighbourIndex = 0; neighbourIndex < myCell.neighbours.length; neighbourIndex++) {
        if (myCell.neighbours[neighbourIndex].owner == CellOwner.None) {
            neutrals.push(myCell.neighbours[neighbourIndex]);
        }
    }

    return neutrals;
}

function getEnemies(myCell) {
    var enemies = [];
    for (var neighbourIndex = 0; neighbourIndex < myCell.neighbours.length; neighbourIndex++) {
        if (myCell.neighbours[neighbourIndex].owner != CellOwner.Own) {
            enemies.push(myCell.neighbours[neighbourIndex]);
        }
    }

    return enemies;
}




/**
 * Neighbor cell owner constants
 */
const CellOwner = {
    Own: 0,
    Other: 1,
    None: 2
};

