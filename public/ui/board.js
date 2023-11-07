import Cell from './cell.js';
import Sudoku from '../@gmussi/sudokujs/src/Sudoku.js';

class Board {
  constructor(boardElement) {
    this.boardElement = boardElement;
    this.boardElement.className = 'board';
    this.cells = [];
    this.sudoku = new Sudoku();
    this.boardString = this.sudoku.generate("easy");
    this.boardData = this.initializeBoard(this.boardString);
    this.timerElement = document.getElementById('timer');
    this.errorCountElement = document.getElementById('errorCount');
    this.winMessageElement = document.getElementById('winMessage');
  }

  initializeBoard(boardString) {
    let counter = 0;
    return Array(9).fill().map(() => Array(9).fill().map(() => {
      const char = boardString[counter++];
      return char === '.' ? null : Number(char);
    }));
  }

  correctString() {
    return this.sudoku.solve(this.boardString);
  }

  drawBoard() {
    this.resetCells();
    console.log('Drawing board...');
    this.boardElement.innerHTML = '';
    this.cells = [];

    for (let i = 0; i < 9; i++) {
      const row = document.createElement('div');
      row.className = 'row';

      for (let j = 0; j < 9; j++) {
        const correctValue = this.correctString()[i * 9 + j];
        const cell = new Cell(this.boardData[i][j], correctValue);
        cell.element.addEventListener('change', (event) => {
          console.log(`Cell value changed to ${event.detail}`);
          this.checkBoard();
        });
        this.cells.push(cell);
        row.appendChild(cell.element);
      }

      this.boardElement.appendChild(row);
    }

    this.resetErrorCount();
    this.resetWinMessage();
    this.startTimer();
  }

  resetErrorCount() {
    this.errorCountElement.innerHTML = 0;
  }

  resetWinMessage() {
    this.winMessageElement.innerHTML = '';
  }

  startTimer() {
    let seconds = 0;
    this.timerElement.innerHTML = '00:00';

    this.interval = setInterval(() => {
      seconds++;
      this.timerElement.innerHTML = `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
    }, 1000);
  }

  reset() {
    console.log('Resetting board...');
    this.drawBoard();
  }

  new(difficulty) {
    this.boardString = this.sudoku.generate(difficulty);
    this.boardData = this.initializeBoard(this.boardString);
    this.drawBoard();
  }

  boardToString() {
    return this.cells.reduce((str, cell) => str + (cell.value || '.'), '');
  }

  checkBoard() {
    const currentBoard = this.boardToString();
    const solvedBoard = this.sudoku.solve(currentBoard);
    console.log(`Board is ${currentBoard === solvedBoard ? '' : 'not '}solved!`);

    if (currentBoard === solvedBoard) {
      this.stopTimer();
      this.displayWinMessage();
    }
  }

  resetCells() {
    console.log('Resetting cells...');
    this.cells.forEach(cell => cell.reset());
  }

  stopTimer() {
    clearInterval(this.interval);
  }

  displayWinMessage() {
    const errors = this.errorCountElement.innerHTML == 0 ? 'no' : 'only ' + this.errorCountElement.innerHTML;
    this.winMessageElement.innerHTML = `You solved the Sudoku in ${this.timerElement.innerHTML}, making ${errors} errors!`;
  }
}

document.addEventListener('click', (event) => {
  if (!event.target.closest('.cell')) {
    document.querySelectorAll('.cell').forEach(cell => cell.classList.remove('active'));
  }
});

export default Board;