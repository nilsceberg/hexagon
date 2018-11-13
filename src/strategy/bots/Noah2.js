const CellOwner = {
    Own: 0,
    Other: 1,
    None: 2
};

const ActionTypes = {
    None: 0,
    Attack: 1,
    Move: 2,
};

let lastNumberOfHexes = 1;
let currentNumberOfHexes =  1;
let lastAction = ActionTypes.None;
let lastCells = [];
let currentCells = [];

/**
 * Entry point of the strategy, do not delete or your submission won't compile correctly
 * Gets called every turn by Hexagon
 * 
 * @param {MyCell[]} myCells - Arrray of myCell objects representing the cells your strategy owns
 * @returns {any} - Object representing the action taken by your strategy 
 */
export function strategy(myCells) {
    lastCells = currentCells;
    currentCells = myCells;


    //var cellsWithNeutralNeighbours = getMycellsWithNeighbourType(myCells, CellOwner.None);
    


    //var cellsWithEnemies = getMycellsWithNeighbourType(myCells, CellOwner.Other)
    var cellsWithNeutral = []
    var cellsWithEnemies = []
    for(var i = 0; i < myCells.length; i++){
                var currentCell = myCells[i];
                /*if(cellGotNeutral(currentCell))
                    cellsWithNeutral.push(currentCell);*/

                if(cellGotEnemy(currentCell))
                    cellsWithEnemies.push(currentCell);
            }



    //Early game but also takes easy targets
    //Old early game

    /*
   
    var cellsWithEnemyEasyTargetsNeighbours = getMycellsWithEasyTargetsEnemyNeighbour(myCells);
    if(cellsWithEnemyEasyTargetsNeighbours.length > 0 && getMycellsWithNeighbourType(myCells,CellOwner.None).length > 0){
        //console.log("Attacking neutral or weak enemy")
        //console.log(showObject(target));
        var target = getMostFrequentNeighbourFromCells(cellsWithEnemyEasyTargetsNeighbours);

        return submitTurn(target.myCells[0].id, target.id, target.myCells[0].resources - 1)
    }*/

    //EARLY GAME

    if(getMycellsWithNeighbourType(myCells,CellOwner.None).length > 0){
        //console.log(EarlyGameAttack(cellsWithEnemies));
        return EarlyGameAttack(cellsWithEnemies);
    }


    //if we lost at least one hex
    /*if(lastNumberOfHexes > currentNumberOfHexes || (lastAction == ActionTypes.Attack && lastNumberOfHexes == currentNumberOfHexes)){
        //console.log("Lost hex looking for easy target");

        if(cellsWithEnemyEasyTargetsNeighbours.length > 0)
        {
            //console.log("Easy target found, attacking")
             //console.log(showObject(target));
            var target = getMostFrequentNeighbourFromCells(cellsWithEnemyEasyTargetsNeighbours);
            lastAction = ActionTypes.Attack;
            return submitTurn(target.myCells[0].id, target.id, target.myCells[0].resources - 1)
        }
        else{
            //console.log("No easy target found")
        }
    }*/
    
    var cellsWithEnemies = getMycellsWithNeighbourType(myCells, CellOwner.Other)
    var target = getMostFrequentNeighbourFromCells(cellsWithEnemies)

    //console.log("My R: " + target.myCells[0].resources);
    //console.log("Enemy R: " + target.resources);

    if(target.myCells[0].resources - 50 > target.resources){
        //console.log("Attacking targeted enemy");

        lastAction = ActionTypes.Attack;
        return submitTurn(target.myCells[0].id, target.id, target.myCells[0].resources - 50);
    }
    else{
        //console.log("Move resources to cell")
        var safeCells = getMyCellsWithOnlyFriends(myCells);
        //console.log("L: " + safeCells.length);
        //console.log(showObject(safeCells[0]));

        lastAction = ActionTypes.Move;
        return submitTurn(safeCells[0].id, target.myCells[0].id, safeCells[0].resources - 1);
    }
}

function submitTurn(myId, toId, amount){
    return {
            fromId: myId,
            toId: toId,
            amountToTransfer: amount
    };
}

function EarlyGameAttack(cells){
    for(var i = 1; i <= 6; i++){
        for(var cellIndex = 0; cellIndex < cells.length; cellIndex++){
            var currentCell = cells[cellIndex];
             if(numberOfEnemies(currentCell) == i){
                for(var neighbourIndex = 0; neighbourIndex < currentCell.neighbours.length; neighbourIndex++){
                    var neighbour = currentCell.neighbours[neighbourIndex];
                    if(neighbour.owner != CellOwner.Own && currentCell.resources - 1 > neighbour.resources){
                        return submitTurn(currentCell.id, neighbour.id, currentCell.resources - 1);
                    }
                }
             }
        }
    }
    //console.log("ERROR")
}

function numberOfEnemies(cell){
    var result = 0;
    for(var i = 0; i < cell.neighbours.length; i++){
    if(cell.neighbours[i].owner != CellOwner.Own)
        result++;
    }
    return result;
}

 function cellGotEnemy(cell){
    for(var i = 1; i < cell.neighbours.length; i++){
        if(cell.neighbours[i].owner != CellOwner.Own) return true;
    }
    return false;
}

function getMyCellsWithOnlyFriends(myCells){
     var cellsWithFriendlyNeighbours = [];
     for (var i = 0; i < myCells.length; i++) {

        var current = myCells[i];
        var neighbours = getNeighboursOfType(current, CellOwner.Own);
        if (neighbours.length === 6) {
            current.neighbours = neighbours;
            cellsWithFriendlyNeighbours.push(current);
        }
    }

    cellsWithFriendlyNeighbours.sort(function(a, b) {
                return b.resources - a.resources;
    });

    return cellsWithFriendlyNeighbours;
}

function getMycellsWithNeighbourType(myCells,owner) {

    var cellsWithNeighbours = [];
    for (var i = 0; i < myCells.length; i++) {

        var current = myCells[i];
        var neighbours = getNeighboursOfType(current, owner);

        if (neighbours.length > 0) {

            /*neighbours.sort(function (e1, e2) {
                return e1.resources - e2.resources;
            });*/

            current.neighbours = neighbours;
            cellsWithNeighbours.push(current);
        }
    }

    return cellsWithNeighbours;
}

/**
 * Finds neighbours of type
 */
function getNeighboursOfType(myCell, owner) {
    var cells = [];
    for (var i = 0; i < myCell.neighbours.length; i++) {
        if (myCell.neighbours[i].owner == owner) {
            cells.push(myCell.neighbours[i]);
        }
    }
    return cells;
}

function getMycellsWithEasyTargetsEnemyNeighbour(myCells) {

    var cellsWithNeighbours = [];
    for (var i = 0; i < myCells.length; i++) {

        var current = myCells[i];
        var neighbours = getEasyTargetsEnemyNeighbours(current);

        if (neighbours.length > 0) {

            /*neighbours.sort(function (e1, e2) {
                return e1.resources - e2.resources;
            });*/

            current.neighbours = neighbours;
            cellsWithNeighbours.push(current);
        }
    }

    return cellsWithNeighbours;
}

function getEasyTargetsEnemyNeighbours(myCell) {
    var cells = [];
    for (var i = 0; i < myCell.neighbours.length; i++) {
        if (myCell.neighbours[i].owner == CellOwner.None || (myCell.neighbours[i].owner == CellOwner.Other && myCell.neighbours[i].resources < myCell.resources)) {
            cells.push(myCell.neighbours[i]);
        }
    }
    return cells;
}

function getCellsWithMyNeighbour(myCells, otherCells){
    var result = [];

    for(var i = 0; i < myCells.length; i++){
        for(var j = 0; j < myCells[i].neighbours.length; j++){
            for(var k = 0; k < otherCells.length; k++){
                if(myCells[i].neighbours[j].id == otherCells[k].id){
                    result.push(otherCells[k]);
                }
            }
        }
    }

    return dedupe(result);
}

function dedupe(arr) {
  return arr.reduce(function (p, c) {
    var key = [c.x, c.y].join('|');
    if (p.temp.indexOf(key) === -1) {
      p.out.push(c);
      p.temp.push(key);
    }
    return p;
  }, { temp: [], out: [] }).out;
}

function getMostFrequentNeighbourFromCells(cells) {
    var occ = {}
    for(var i = 0; i < cells.length; i++){
        var current = cells[i];
        for(j = 0; j < current.neighbours.length; j++){
            if(occ.hasOwnProperty(current.neighbours[j].id)){
                occ[current.neighbours[j].id].occurrence++;
                occ[current.neighbours[j].id].id = current.neighbours[j].id;
                occ[current.neighbours[j].id].myCells.push(current)
            }
            else{
                occ[current.neighbours[j].id] = {
                    id: current.neighbours[j].id,
                    occurrence: 1,
                    resources: current.neighbours[j].resources,
                    myCells: []
                }
                occ[current.neighbours[j].id].myCells.push(current)
            }
        }
    }

    var bestNeighbour = {
        id: "Error, not real id",
        occurrence: 0,
        myCells: []
    };
   
    for (var neighbourId in occ) {
        var neighbour = occ[neighbourId];
        if(neighbour.occurrence > bestNeighbour.occurrence){
            bestNeighbour = neighbour
        }
        else if(neighbour.occurrence == bestNeighbour.occurrence && neighbour.resources < bestNeighbour.occurrence){
            bestNeighbour = neighbour
        }

        if(bestNeighbour.occurrence == 5)
            break
    }


    bestNeighbour.myCells.sort(function(a, b) {
        return b.resources - a.resources;
    });

    return bestNeighbour
}
    
function showObject(obj) {
  var result = "";
  for (var p in obj) {
    if( obj.hasOwnProperty(p) ) {
      result += p + " , " + obj[p] + "\n";
    } 
  }              
  return result;
}


/*function getNumberOfMyCellsNeighbouring(myCells, cellsToCheckFor,owner){


    for(var i = 0; i < myCells.length; i++){
        getNeighboursOfType(myCells[i],owner)


    }
}*/

