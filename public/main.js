import Board from './ui/board.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('App initialized!');

  const board = new Board(document.getElementById('boardElement'));
  board.drawBoard();

  document.getElementById('resetBoard').addEventListener('click', () => board.reset());
  document.getElementById('newBoard').addEventListener('click', () => {
    const difficulty = document.getElementById('difficulty').value || 'easy';
    board.new(difficulty);
  });
});