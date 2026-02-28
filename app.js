
class GameBoard {
    constructor() {
        this.gameBoard = [];
        this.selectedSquare = null;
        this.possibleMatch = null;
    }


    /* __________ GAME BOARD CREATION  _______________ 
    __________________________________________________*/

    makeBoard(container) {
        let c = 16;
        while (c > 0) {
            // Create a row
            const row = document.createElement("div");
            row.className = "row";

            // Append the columns to the rows
            let r = 16;
            while (r > 0) {
                // Create the columns
                const col = document.createElement("div");
                col.className = "col";

                row.appendChild(col);
                r--;
            }

            // Append the row to the container
            container.appendChild(row);
            c--;
        }

        return container;
    }

    initializeGameBoardState() {
        const types = ["circle", "triangle", "square", "pentagon"];
        for (let c = 0; c < 16; c++) {
            this.gameBoard[c] = [];
            for (let r = 0; r < 16; r++) {
                this.gameBoard[c][r] = types[Math.floor(Math.random() * types.length)];
            }
        }
        console.log(this.gameBoard)
    }

    renderState() {
        // Iterate the DOM
        for (let c = 0; c < gameBoardDOM.children.length; c++) {
            const row = gameBoardDOM.children[c];
            for (let r = 0; r < row.children.length; r++) {

                const square = gameBoardDOM.children[c].children[r];

                // And add the images
                const img = document.createElement("img");
                img.className = this.gameBoard[c][r];
                img.dataRow = c; 
                img.dataCol = r; 
                img.src = `./${this.gameBoard[c][r]}.png`;
                img.draggable = false;
                img.style.pointerEvents = "none";

                // Add an event listener
                square.addEventListener("click", (event) => {
                    this.handleSquareClick(event.target.children[0].className, event.target.children[0]);
                });

                square.innerHTML = "";
                square.appendChild(img);
            }
        }
    }


    /* __________   GAME PROCESSES    _______________ 
    __________________________________________________*/

    highlightSquare() {
       this.selectedSquare.style.border = "2px solid purple";
    }

    highlightPossibleMatch() {
        this.possibleMatch.style.border = "2px solid orange";
    }

    highlightMismatch() {
        this.selectedSquare.style.borderColor = "red";
        this.possibleMatch.style.borderColor = "red";
    }

    highlightMatch(direction) {
        // highlight the selected square
        const selectedCell = this.selectedSquare.parentElement;
        selectedCell.style.border = "none";
        selectedCell.style.border = "2px solid green";

        let neighborCell = null;
        let neighborTwoCell = null;
        let neighborThreeCell = null;

        if (direction === "left") {
            neighborCell = selectedCell.previousElementSibling;
            neighborTwoCell = neighborCell?.previousElementSibling;
            neighborThreeCell = neighborTwoCell?.previousElementSibling;
        } else if (direction === "right") {
            neighborCell = selectedCell.nextElementSibling;
            neighborTwoCell = neighborCell?.nextElementSibling;
            neighborThreeCell = neighborTwoCell?.nextElementSibling;
        }

        // Highlight neighbors if they exist
        [neighborCell, neighborTwoCell, neighborThreeCell].forEach(cell => {
            if (cell) cell.style.border = "none";
        });
        [neighborCell, neighborTwoCell, neighborThreeCell].forEach(cell => {
            if (cell) cell.style.border = "2px solid green";
        });
    }

    removeHighlight() {
        setTimeout(() => {
            console.log("Runs after 2 seconds");
            this.selectedSquare.style.borderColor = "black";
            this.selectedSquare.style.borderWidth = "1px";
            this.possibleMatch.style.borderColor = "black";
            this.possibleMatch.style.borderWidth = "1px";
        }, 2000); 
    }

    makeSwap(direction, selectedRow, selectedCol) {
        const row = gameBoardDOM.children[selectedRow];

        if (direction === "left") {
            const leftCell = row.children[selectedCol - 1];
            const selectedCell = row.children[selectedCol];

            const temp = selectedCell.children[0]; // save selected image

            // Swap nodes
            selectedCell.replaceChild(leftCell.children[0], selectedCell.children[0]);
            leftCell.appendChild(temp);

        } else if (direction === "right") {
            const rightCell = row.children[selectedCol + 1];
            const selectedCell = row.children[selectedCol];

            const temp = selectedCell.children[0]; // save selected image

            // Swap nodes
            selectedCell.replaceChild(rightCell.children[0], selectedCell.children[0]);
            rightCell.appendChild(temp);
        }
    }

    checkRow(selectedRow, selectedCol, possibleRow, possibleCol) {
        const shape = this.selectedSquare.className;
        const self = this;

        function checkLeftBoundary() {
            if (
                gameBoardDOM.children[selectedRow].children[selectedCol - 4] === undefined
            ) {
                console.log("mismatch: row boundary short");
            } else {
                //console.log("possible swap")
            }
        }

        function checkRightBoundary() {
            if (
                gameBoardDOM.children[selectedRow].children[selectedCol + 4] === undefined
            ) {
                console.log("mismatch: row boundary far");
            } else {
                //console.log("possible swap")
            }
        }

        function checkLeft() {
            if (shape !== gameBoardDOM.children[selectedRow].children[selectedCol - 2].children[0].className) {
                console.log("Mismatch shapes left");
                self.highlightMismatch();
                self.removeHighlight();
            } else if (shape !== gameBoardDOM.children[selectedRow].children[selectedCol - 3].children[0].className) {
                console.log("Mismatch shapes left");
                self.highlightMismatch();
                self.removeHighlight();
            } else if (shape !== gameBoardDOM.children[selectedRow].children[selectedCol - 4].children[0].className) {
                console.log("Mismatch shapes left");
                self.highlightMismatch();
                self.removeHighlight();
            } else {
                console.log("Match shapes left");
                self.makeSwap("left", selectedRow, selectedCol);
                self.highlightMatch("left");
            }
        }

        function checkRight() {
            if (shape !== gameBoardDOM.children[selectedRow].children[selectedCol + 2].children[0].className) {
                console.log("Mismatch shapes right");
                self.highlightMismatch();
                self.removeHighlight();
            } else if (shape !== gameBoardDOM.children[selectedRow].children[selectedCol + 3].children[0].className) {
                console.log("Mismatch shapes right");
                self.highlightMismatch();
                self.removeHighlight();
            } else if (shape !== gameBoardDOM.children[selectedRow].children[selectedCol + 4].children[0].className) {
                console.log("Mismatch shapes right");
                self.highlightMismatch();
                self.removeHighlight();
            } else {
                console.log("Match shapes right");
                self.makeSwap("right", selectedRow, selectedCol);
                self.highlightMatch("right");
            }
        }


        if (selectedCol > possibleCol) {
            console.log("greater");
            checkLeftBoundary();
            checkLeft();
        } else {
            console.log("lesser");
            checkRightBoundary();
            checkRight();
        }
        
    }

    checkCol(selectedRow, selectedCol, possibleRow, possibleCol) {

        function checkUp() {

        }

        function checkDown() {

        }

        checkUp();
        checkDown();

    }

    validateMatch() {
        const selectedRow = this.selectedSquare.dataRow;
        const selectedCol = this.selectedSquare.dataCol;
        const matchRow = this.possibleMatch.dataRow;
        const matchCol = this.possibleMatch.dataCol;

        // console.log(
        //     selectedRow, selectedCol,
        //     matchRow, matchCol
        // )

        if (selectedRow - matchRow > 1 || matchRow - selectedRow > 1) {
            console.log("Invalid attempt: row");
            this.highlightMismatch();
            this.removeHighlight();
            return;
        }  

        
        if (selectedCol - matchCol > 1 || matchCol - selectedCol > 1) {
            console.log("Invalid attempt: col");
            this.highlightMismatch();
            this.removeHighlight();
            return;
        } 
        
        this.highlightPossibleMatch();

        this.checkRow(selectedRow, selectedCol, matchRow, matchCol);
        this.checkCol(selectedRow, selectedCol, matchRow, matchCol);

    }


    /* __________   EVENT HANDLERS    _______________ 
    __________________________________________________*/

    handleSquareClick(shape, square) {
        if (this.selectedSquare !== null) {
            // The match in a possible match
            this.possibleMatch = square;
            this.validateMatch();
        } else {
            // The first square in a possible match
            this.selectedSquare = square;
            this.isSquareSelected = true;
            this.highlightSquare();
        }

        
    }


}

const container = document.getElementById("gameBoard");
const gameBoardInstance = new GameBoard();
const gameBoardDOM = gameBoardInstance.makeBoard(container);
gameBoardInstance.initializeGameBoardState();
gameBoardInstance.renderState();


/*

To do's

1. Add selection event listeners and handlers
    A. What to do on match?

2. Add highlights to the selected squares

3. Write functions for removing and repopulating the matched squares


*/