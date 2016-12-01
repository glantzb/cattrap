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

    $("#clear-grid").click(function () {
      for (var i = 0; i < Constants.numberOfRows; i++) {
          for (var j = 0; j < Constants.numberOfColumns; j++) {
            gameGrid[i][j].isAlive = false;
            getCanvasCellAtIndex(i, j).css("backgroundColor", "#ffffff");
          }
    }
    });

})
