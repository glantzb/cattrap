/**
 * gol.js
 *
 * EECS 183: Final Project
 * Fall 2016
 *
 * Implements Game of Life.
 */


var Constants = {
    numberOfRows: 20,
    numberOfColumns: 40,
    cellSize: 20,
    aliveColor: "#2ecc71",
    deadColor: "#e74c3c",
    generationInterval: 0.5,
};


/**
 * Creates an HTML table representing canvas and inserts it into HTML.
 */
function createCanvas() {
    var canvasTable = $("<table>", {id: "canvas-table"});
    var canvasTableHead = $("<thead>");
    // add rows and columns
    for (var rowIndex = 0; rowIndex < Constants.numberOfRows; rowIndex++) {
        // make a row
        var canvasRow = $("<tr>");
        for (var columnIndex = 0; columnIndex < Constants.numberOfColumns; columnIndex++) {
            // make a cell
            var canvasCell = $("<td>");
            canvasRow.append(canvasCell);
        }
        canvasTableHead.append(canvasRow);
    }
    canvasTable.append(canvasTableHead);
    // add table to HTML
    $("#canvas-container").append(canvasTable);

    // set size of cells
    $("#canvas-table td").css({
        width: Constants.cellSize,
        height: Constants.cellSize,
    });
}


/**
 * Returns cell from HTML canvas table at specified rowIndex and columnIndex.
 */
function getCanvasCellAtIndex(rowIndex, columnIndex) {
    return $("#canvas-table tr:eq(" + rowIndex + ") td:eq(" + columnIndex + ")");
}


/**
 * Creates and returns 2d array represnting game grid.
 * Initializes each cell to an object with and isAlive as false 0 liveNeighbors.
 */
function createGameGrid() {
    var grid = new Array(Constants.numberOfRows);
    for (var row = 0; row < Constants.numberOfRows; row++) {
        grid[row] = new Array(Constants.numberOfColumns);
        for (var col = 0; col < Constants.numberOfColumns; col++) {
            grid[row][col] = {
                isAlive: false,
                liveNeighbors: 0,
            };
        }
    }
    return grid;
}


/**
 * Executes when entire HTML document loads.
 */
$(document).ready(function() {
    createCanvas();
    var gameGrid = createGameGrid();

    $("#still-life-btn, #oscillator-btn, #spaceship-btn").click(function () {
        var selector = $(this).attr("id");
        selector = "#" + selector.replace("btn", "select");
        var pattern = $(selector).val();
        var newRow = Math.floor(Math.random() * Constants.numberOfRows);
        var newCol = Math.floor(Math.random() * Constants.numberOfColumns);
        drawPattern(pattern, gameGrid, newRow, newCol);
    });

    // event loop
    var isRunning = false;
    var timer;
    function runGoL() {
        if (!isRunning) {
            isRunning = true;
            evolveStep(gameGrid);
            // wait to run again
            timer = setTimeout(function() {
                isRunning = false;
                runGoL();
            }, Constants.generationInterval * 1000);
        }
    }
    $("#start-game").click(function () {
        runGoL();
    });
    $("#stop-game").click(function () {
        isRunning = false;
        clearTimeout(timer);
    });

    // TODO: Add a click event listener for your clear button here.
    //       Do not modify any code above this!
})


/****************************** BEGIN CORE CODE ******************************/


/**
 * Requires: grid is a 2d array representing game grid
 *           0 <= row && row < Constants.numberOfRows
 *           0 <= col && col < Constants.numberOfColumns
 *           state is set to the string "alive" or the string "dead"
 * Modifies: grid and HTML table representing the grid
 * Effects:  Sets isAlive field in cell of grid to either true or false,
 *           depending on the value of state.
 *           Updates backgroundColor of cell in HTML table.
 */
function setCellState(state, grid, row, col) {
  if (state == "alive") {
  grid[row][col].isAlive = true;
  getCanvasCellAtIndex(row, col).css("backgroundColor", Constants.aliveColor);
}

else {
  grid[row][col].isAlive = false;
  getCanvasCellAtIndex(row, col).css("backgroundColor", Constants.aliveColor);
}
}



/**
 * Requires: grid is a 2d array representing game grid
 *           0 <= row && row < Constants.numberOfRows
 *           0 <= col && col < Constants.numberOfColumns
 * Modifies: Nothing.
 * Effects:  Counts the number of live neighbors for
 *           the cell at row, col in grid and returns the count.
 */
function countLiveNeighbors(grid, row, col) {
  var livers = 0;
    var tl = true;
    var tm = true;
    var tr = true;
    var ml = true;
    var mm = true;
    var mr = true;
    var bl = true;
    var bm = true;
    var br = true;

    if (row - 1 < 0) {
    tl = false;
    tm = false;
    tr = false;
    }

    if (row + 1 >= Constants.numberOfRows) {
        bl = false;
        bm = false;
        br = false;
    }

    if (col - 1 < 0) {
    tl = false;
    ml = false;
    bl = false;
    }

    if (col + 1 >= Constants.numberOfColumns) {
    tr = false;
    mr = false;
    br = false;
    }

    if (tl) {
        if (grid[row - 1][col - 1].isAlive == true) {
        livers++;
        }
    }

    if (tm) {
        if (grid[row - 1][col].isAlive == true) {
        livers++;
        }
    }

    if (tr) {
        if (grid[row - 1][col + 1].isAlive == true) {
        livers++;
        }
    }

    if (mr) {
        if (grid[row][col + 1].isAlive == true) {
        livers++;
        }
    }

    if (br) {
        if (grid[row + 1][col + 1].isAlive == true) {
        livers++;
        }
    }

    if (bm) {
        if (grid[row + 1][col].isAlive == true) {
        livers++;
        }
    }

    if (bl) {
        if (grid[row + 1][col - 1].isAlive == true) {
        livers++;
        }
    }

    if (ml) {
        if (grid[row][col - 1].isAlive == true) {
        livers++;
        }
    }

}



/**
 * Requires: grid is a 2d array representing game grid
 * Modifies: grid
 * Effects:  Updates the liveNeighbors field of each cell in grid
 */
function updateLiveNeighbors(grid) {
    for (var i = 0; i < Constants.numberOfRows; i++) {
        for (var j = 0; j < Constants.numberOfColumns; j++) {
            grid[i][j].liveNeighbors = countLiveNeighbors(grid, i, j);
        }
    }

}

/**
 * Requires: grid is a 2d array representing game grid
 * Modifies: grid
 * Effects:  Sets the state of cells in grid according to the number of
 *           liveNeighbors each cell has, and to the rules of the Game of Life.
 */
function updateCells(grid) {
    for (var i = 0; i < Constants.numberOfRows; i++) {
        for (var j = 0; j < Constants.numberOfColumns; j++) {
            if (grid[i][j].isAlive) {
                if (grid[i][j].liveNeighbors < 2) {
                    setCellState("dead", grid, i, j);
                }
                else if (grid[i][j].liveNeighbors < 4) {
                    setCellState("alive", grid, i, j);
                }
                else if (grid[i][j].liveNeighbors > 3) {
                    setCellState("dead", grid, i, j);
                }
            }
            else {
                if (grid[i][j].liveNeighbors == 3) {
                    setCellState("alive", grid, i, j);
                }
            }
        }
    }
}

/**
 * Requires: grid is a 2d array representing game grid
 * Modifies: grid
 * Effects:  Changes the grid to evolve the cells to the next generation according
 *           to the rules of the Game of Life. In order to correctly move forward,
 *           all cells should count the number of their live neighbors before
 *           proceeding to change the state of all cells.
 */
function evolveStep(grid) {

    updateLiveNeighbors(grid);

    updateCells(grid);
}

/**
 * Requires: patternName is a string
 *           grid is a 2d array representing game grid
 *           row and col represent the top left corner of the pattern
 *           0 <= row && row < Constants.numberOfRows
 *           0 <= col && col < Constants.numberOfColumns
 * Modifies: grid
 * Effects:  This function is called when a user clicks on one of the HTML
 *           "Draw <pattern>" buttons.
 *           Draws the pattern specified by patternName.
 */
function drawPattern(patternName, grid, row, col) {
  drawStillLife(patternName, grid, row, col);
  drawOscillator(patternName, grid, row, col);
  drawSpaceship(patternName, grid, row, col);
}

/**
 * Requires: patternName is one of {"Block", "Beehive", "Loaf", "Boat"}
 *           grid is a 2d array representing game grid
 *           row and col represent the top left corner of the pattern
 *           0 <= row && row < Constants.numberOfRows
 *           0 <= col && col < Constants.numberOfColumns
 * Modifies: grid
 * Effects:  Draws the pattern specified by patternName.
 *           This function should draw as much of the pattern as possible
 *           without going outside the boundaries of the canvas.
 */
function drawStillLife(patternName, grid, row, col) {
  if (patternName == "Loaf") {
     var colPlusOne = false;
     var colPlusTwo = false;
     var colPlusThree = false;
     var rowPlusOne = false;
     var rowPlusTwo = false;
     var rowPlusThree = false;

     // set [row][col + 1] to alive
     if (col + 1 < Constants.numberOfColumns) {
         colPlusOne = true;
           setCellState("alive", grid, row, col+1);
     }

     // set [row][col + 2] to alive
     if (col + 2 < Constants.numberOfColumns) {
         colPlusTwo = true;
           setCellState("alive", grid, row, col+2);
     }

     // check [col + 3] is in bounds
     if (col + 3 < Constants.numberOfColumns) {
         colPlusThree = true;
     }

     // set [row + 1][col] to alive
     if (row + 1 < Constants.numberOfRows) {
         rowPlusOne = true;
         setCellState("alive", grid, row+1, col);
     }

     // set [row + 1][col + 3] to alive
     if (rowPlusOne && colPlusThree) {
         setCellState("alive", grid, row+1, col+3);
     }

     // set [row + 2][col + 1] to alive
     if (row + 2 < Constants.numberOfRows) {
         rowPlusTwo = true;
             if (colPlusOne) {
                 setCellState("alive", grid, row+2, col+1);
         }
     }

     // set [row + 2][col + 3] to alive
     if (rowPlusTwo && colPlusThree) {
         setCellState("alive", grid, row+2, col+3);
     }

     // set [row + 3][col + 2] to alive
     if (row + 3 < Constants.numberOfRows) {
         rowPlusThree = true;
             if (colPlusTwo) {
                 setCellState("alive", grid, row+3, col+2);
             }
     }
 }
 if (patternName == "Boat") {
     var colPlusOne = false;
     var colPlusTwo = false;
     var rowPlusOne = false;
     var rowPlusTwo = false;

     if (col + 1 < Constants.numberOfColumns) {
         colPlusOne = true;
     }


     if (col + 2 < Constants.numberOfColumns) {
         colPlusTwo = true;
     }
     if (row + 1 < Constants.numberOfRows) {
         rowPlusOne = true;
     }


     if (row + 2 < Constants.numberOfRows) {
         rowPlusTwo = true;
     }
     setCellState("alive", grid, row, col);

     if(colPlusOne) {
       setCellState("alive", grid, row, col+1);
       if(rowPlusTwo) {
         setCellState("alive", grid, row+2, col+1);
       }
     }
     if(rowPlusOne) {
       setCellState("alive", grid, row+1, col);
       if(colPlusTwo) {
         setCellState("alive", grid, row+1, col+2);
       }
     }
  }

//Beehive

    if (patternName == "Beehive") {
        var colPlusOne = false;
        var colPlusTwo = false;
        var colPlusThree = false;
        var rowPlusOne = false;
        var rowPlusTwo = false;

        if (row + 1 < Constants.numberOfRows){
        	rowPlusOne = true;
        	setCellState("alive", grid, row + 1, col);
        }
        if (row + 2 < Constants.numberOfRows){
        	rowPlusTwo = true;
        }
        if (col + 1 < Constants.numberOfColumns){
        	colPlusOne = true;
        	setCellState("alive", grid, row, col + 1);
        }
        if (col + 2 < Constants.numberOfColumns){
        	colPlusTwo = true;
        	setCellState("alive", grid, row, col + 2);
        }
        if (col + 3 < Constants.numberOfColumns){
        	colPlusThree = true;
        }
        if (colPlusThree && rowPlusOne){
        	setCellState("alive", grid, row + 1, col + 3);
        }
        if (rowPlusTwo && colPlusOne){
        	setCellState("alive", grid, row + 2, col + 1);
        }
        if (rowPlusTwo && colPlusTwo){
        	setCellState("alive", grid, row + 2, col + 2);
        }
    }
}


/**
 * Requires: patternName is one of {"Blinker", "Toad", "Beacon", "Pulsar"}
 *           grid is a 2d array representing game grid
 *           row and col represent the top left corner of the pattern
 *           0 <= row && row < Constants.numberOfRows
 *           0 <= col && col < Constants.numberOfColumns
 * Modifies: grid
 * Effects:  Draws the pattern specified by patternName.
 *           This function should draw as much of the pattern as possible
 *           without going outside the boundaries of the canvas.
 */
function drawOscillator(patternName, grid, row, col) {
 //Blinker

    if (patternName == "Blinker") {
    	setCellState("alive", grid, row, col);
    	if (row + 1 < Constants.numberOfRows){
    		setCellState("alive", grid, row + 1, col);
    	}
    	if (row + 2 < Constants.numberOfRows){
    		setCellState("alive", grid, row + 2, col);
    	}
    }

    if (patternName == "Toad") {
      var colPlusOne = false;
      var colPlusTwo = false;
      var colPlusThree = false;
      var rowPlusOne = false;

      // set [row][col + 1] to alive
      if (col + 1 < Constants.numberOfColumns) {
          colPlusOne = true;
          setCellState("alive", grid, row, col+1);
      }

      // set [row][col + 1] to alive
      if (col + 2 < Constants.numberOfColumns) {
          colPlusTwo = true;
          setCellState("alive", grid, row, col+2);

      }

      // set [row][col + 3] to alive
      if (col + 3 < Constants.numberOfColumns) {
          colPlusThree = true;
          setCellState("alive", grid, row, col+3);

      }

      // set[row + 1][col] to alive
      if (row + 1 < Constants.numberOfRows) {
          rowPlusOne = true;
          setCellState("alive", grid, row+1, col);

      }

      // set[row + 1][col + 1] to alive
      if (rowPlusOne && colPlusOne) {
          setCellState("alive", grid, row+1, col+1);
      }

      // set[row + 1][col + 2] to alive
      if (rowPlusOne && colPlusTwo) {
        setCellState("alive", grid, row+1, col+2);
      }
  }
  if(patternName == "Pulsar") {
    var colPlusTwo = false;
    var colPlusThree = false;
    var colPlusFour = false;
    var colPlusFive = false;
    var colPlusSeven = false;
    var colPlusEight = false;
    var colPlusNine = false;
    var colPlusTen = false;
    var colPlusTweleve = false;
    var rowPlusTwo = false;
    var rowPlusThree = false;
    var rowPlusFour = false;
    var rowPlusFive = false;
    var rowPlusSeven = false;
    var rowPlusEight = false;
    var rowPlusNine = false;
    var rowPlusTen = false;
    var rowPlusTwelve = false;

    if(col+2<Constants.numberOfColumns) {
      colPlusTwo = true;
    }

    if(col+3<Constants.numberOfColumns) {
      colPlusThree = true;
    }

    if(col+4<Constants.numberOfColumns) {
      colPlusFour = true;
    }

    if(col+5<Constants.numberOfColumns) {
      colPlusFive = true;
    }

    if(col+7<Constants.numberOfColumns) {
      colPlusSeven = true;
    }

    if(col+8<Constants.numberOfColumns) {
      colPlusEight = true;
    }

    if(col+9<Constants.numberOfColumns) {
      colPlusNine = true;
    }

    if(col+10<Constants.numberOfColumns) {
      colPlusTen = true;
    }

    if(col+12<Constants.numberOfColumns) {
      colPlusTwelve = true;
    }

    if(row+2<Constants.numberOfRows) {
      rowPlusTwo = true;
    }

    if(row+3<Constants.numberOfRows) {
      rowPlusThree = true;
    }

    if(row+4<Constants.numberOfRows) {
      rowPlusFour = true;
    }

    if(row+5<Constants.numberOfRows) {
      rowPlusFive = true;
    }

    if(row+7<Constants.numberOfRows) {
      rowPlusSeven = true;
    }

    if(row+8<Constants.numberOfRows) {
      rowPlusEight = true;
    }

    if(row+9<Constants.numberOfRows) {
      rowPlusNine = true;
    }

    if(row+10<Constants.numberOfRows) {
      rowPlusTen = true;
    }

    if(row+12<Constants.numberOfRows) {
      rowPlusTwelve = true;
    }

    if(colPlusTwo) {
      setCellState("alive", grid, row, col + 2);
    }
    if(colPlusThree) {
      setCellState("alive", grid, row, col + 3);
    }
    if(colPlusFour) {
      setCellState("alive", grid, row, col + 4);
    }
    if(colPlusEight) {
      setCellState("alive", grid, row, col + 8);
    }
    if(colPlusNine) {
      setCellState("alive", grid, row, col + 9);
    }
    if(colPlusTen) {
      setCellState("alive", grid, row, col + 10);
    }
    if(rowPlusTwo) {
      setCellState("alive", grid, row+2, col);

      if(colPlusFive) {
        setCellState("alive", grid, row+2, col+5);
      }
      if(colPlusSeven) {
        setCellState("alive", grid, row+2, col+7);
      }
      if(colPlusTwelve) {
        setCellState("alive", grid, row+2, col+12);
      }
    }
    if(rowPlusThree) {
      setCellState("alive", grid, row+3, col);

      if(colPlusFive) {
        setCellState("alive", grid, row+3, col+5);
      }
      if(colPlusSeven) {
        setCellState("alive", grid, row+3, col+7);
      }
      if(colPlusTwelve) {
        setCellState("alive", grid, row+3, col+12);
      }
    }

    if(rowPlusFour) {
      setCellState("alive", grid, row+4, col);

      if(colPlusFive) {
        setCellState("alive", grid, row+4, col+5);
      }
      if(colPlusSeven) {
        setCellState("alive", grid, row+4, col+7);
      }
      if(colPlusTwelve) {
        setCellState("alive", grid, row+4, col+12);
      }
    }

    if(rowPlusFive) {
      if(colPlusTwo) {
        setCellState("alive", grid, row+5, col + 2);
      }
      if(colPlusThree) {
        setCellState("alive", grid, row+5, col + 3);
      }
      if(colPlusFour) {
        setCellState("alive", grid, row+5, col + 4);
      }
      if(colPlusEight) {
        setCellState("alive", grid, row+5, col + 8);
      }
      if(colPlusNine) {
        setCellState("alive", grid, row+5, col + 9);
      }
      if(colPlusTen) {
        setCellState("alive", grid, row+5, col + 10);
      }
    }

    if(rowPlusSeven) {
      if(colPlusTwo) {
        setCellState("alive", grid, row+7, col + 2);
      }
      if(colPlusThree) {
        setCellState("alive", grid, row+7, col + 3);
      }
      if(colPlusFour) {
        setCellState("alive", grid, row+7, col + 4);
      }
      if(colPlusEight) {
        setCellState("alive", grid, row+7, col + 8);
      }
      if(colPlusNine) {
        setCellState("alive", grid, row+7, col + 9);
      }
      if(colPlusTen) {
        setCellState("alive", grid, row+7, col + 10);
      }
    }

    if(rowPlusEight) {
      setCellState("alive", grid, row+8, col);

      if(colPlusFive) {
        setCellState("alive", grid, row+8, col+5);
      }
      if(colPlusSeven) {
        setCellState("alive", grid, row+8, col+7);
      }
      if(colPlusTwelve) {
        setCellState("alive", grid, row+8, col+12);
      }
    }

    if(rowPlusNine) {
      setCellState("alive", grid, row+9, col);

      if(colPlusFive) {
        setCellState("alive", grid, row+9, col+5);
      }
      if(colPlusSeven) {
        setCellState("alive", grid, row+9, col+7);
      }
      if(colPlusTwelve) {
        setCellState("alive", grid, row+9, col+12);
      }
    }

    if(rowPlusTen) {
      setCellState("alive", grid, row+10, col);

      if(colPlusFive) {
        setCellState("alive", grid, row+10, col+5);
      }
      if(colPlusSeven) {
        setCellState("alive", grid, row+10, col+7);
      }
      if(colPlusTwelve) {
        setCellState("alive", grid, row+10, col+12);
      }
    }

    if(rowPlusTwelve) {
      if(colPlusTwo) {
        setCellState("alive", grid, row+12, col + 2);
      }
      if(colPlusThree) {
        setCellState("alive", grid, row+12, col + 3);
      }
      if(colPlusFour) {
        setCellState("alive", grid, row+12, col + 4);
      }
      if(colPlusEight) {
        setCellState("alive", grid, row+12, col + 8);
      }
      if(colPlusNine) {
        setCellState("alive", grid, row+12, col + 9);
      }
      if(colPlusTen) {
        setCellState("alive", grid, row+12, col + 10);
      }
    }


  }


}


/**
 * Requires: patternName is one of {"Glider", "Lwss"}
 *           grid is a 2d array representing game grid
 *           row and col represent the top left corner of the pattern
 *           0 <= row && row < Constants.numberOfRows
 *           0 <= col && col < Constants.numberOfColumns
 * Modifies: grid
 * Effects:  Draws the pattern specified by patternName.
 *           This function should draw as much of the pattern as possible
 *           without going outside the boundaries of the canvas.
 */
function drawSpaceship(patternName, grid, row, col) {
  if (patternName == "Glider") {
     var colPlusOne = false;
     var colPlusTwo = false;
     var rowPlusOne = false;
     var rowPlusTwo = false;

     // set [row][col + 1] to alive
     if (col + 1 < Constants.numberOfColumns) {
         colPlusOne = true;
         setCellState("alive", grid, row, col+1);
     }

     // check [col + 2] is valid
     if (col + 2 < Constants.numberOfColumns) {
         colPlusTwo = true;
     }

     // set [row + 1][col + 2] to alive
     if (row + 1 < Constants.numberOfRows) {
         rowPlusOne = true;
             if (colPlusTwo) {
                 setCellState("alive", grid, row+1, col+2);
             }
     }

     // set [row + 2][col] to alive
     if (row + 2 < Constants.numberOfRows) {
         rowPlusTwo = true;
         setCellState("alive", grid, row+2, col);
     }

     // set [row + 2][col + 1] to alive
     if (rowPlusTwo && colPlusOne) {
        setCellState("alive", grid, row+2, col+1);
     }

     // set [row + 2][col + 2] to alive
     if (rowPlusTwo && colPlusTwo) {
         setCellState("alive", grid, row+2, col+2);
     }
 }

//LWSS

    if (patternName == "Lwss") {
        var colPlusOne = false;
        var colPlusTwo = false;
        var colPlusThree = false;
        var colPlusFour = false;
        var rowPlusOne = false;
        var rowPlusTwo = false;
        var rowPlusThree = false;

        if (col + 1 < Constants.numberOfColumns){
        	colPlusOne = true;
        	setCellState("alive", grid, row, col + 1);
        }
        if (col + 2 < Constants.numberOfColumns){
        	colPlusTwo = true;
        }
        if (col + 3 < Constants.numberOfColumns){
        	colPlusThree = true;
        }
        if (col + 4 < Constants.numberOfColumns){
        	colPlusFour = true;
        	setCellState("alive", grid, row, col + 4);
        }
        if (row + 1 < Constants.numberOfRows){
        	rowPlusOne = true;
        	setCellState("alive", grid, row + 1, col);
        }
        if (row + 2 < Constants.numberOfRows){
        	rowPlusTwo = true;
        	setCellState("alive", grid, row + 2, col);
        }
        if (row + 3 < Constants.numberOfRows){
        	rowPlusThree = true;
        	setCellState("alive", grid, row + 3, col);
        }

        if (rowPlusThree && colPlusOne){
        	setCellState("alive", grid, row + 3, col + 1);
        }
        if (rowPlusThree && colPlusTwo){
        	setCellState("alive", grid, row + 3, col + 2);
        }
        if (rowPlusThree && colPlusThree){
        	setCellState("alive", grid, row + 3, col + 3);
        }
        if (rowPlusTwo && colPlusFour){
        	setCellState("alive", grid, row + 2, col + 4);
        }
    }

}
