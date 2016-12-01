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
    clickedColor: "#2ecc71",
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
                isClicked: false,
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

    $( "#td" ).click(function() {
        getCanvasCellAtIndex(row, col).css("backgroundColor", Constants.clickedColor));
        grid[row][col].isClicked = true;
    });

})
