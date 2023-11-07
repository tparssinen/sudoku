class Cell {
  constructor(value, col, row, correctString) {
    this.value = value;
    this.col = col;
    this.row = row;
    this.correctString = correctString;

    this.cellValue = document.createElement('div');
    this.cellValue.className = 'value';
    this.cellValue.innerHTML = this.value;

    this.element = document.createElement('div');
    this.element.className = 'cell';

    if (this.cellValue.innerHTML >= '1' && this.cellValue.innerHTML <= '9') {
      this.element.classList.add('original');
    }

    this.element.appendChild(this.cellValue);

    this.element.addEventListener('click', this.activate.bind(this));
    this.element.addEventListener('dblclick', this.highlight.bind(this));
    window.addEventListener('keydown', this.handleKeyPress.bind(this));
  }

  activate() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.classList.remove('active', 'highlight'));

    if (!this.element.classList.contains('original')) this.element.classList.add('active');
  }

  highlight() {
    // double clicking a cell will highlight all cells with the same value
    const cells = document.querySelectorAll('.cell');
    const value = this.cellValue.innerHTML;

    // if value is not a number, do nothing
    if (value < '1' || value > '9') return;
    cells.forEach(cell => {
      const valueToCompare = cell.querySelectorAll('.value')[0].innerHTML;
      (valueToCompare == value) ? cell.classList.add('highlight') : cell.classList.remove('highlight');
    });
  }

  handleKeyPress(event) {
    if (this.element.classList.contains('active') && event.key >= '1' && event.key <= '9') {
      this.value = event.key;
      this.cellValue.innerHTML = this.value;

      // Get value from #errorCount element
      const errorCount = document.getElementById('errorCount').innerHTML;

      const correctValue = this.correctString[this.row * 9 + this.col];
      if (this.value !== correctValue) {
        this.element.classList.add('incorrect');

        // Increase error count by 1
        document.getElementById('errorCount').innerHTML = Number(errorCount) + 1;
      } else {
        this.element.classList.remove('incorrect');
      }

      const changeEvent = new CustomEvent('change', { detail: this.value });
      this.element.dispatchEvent(changeEvent);
    } else if (this.element.classList.contains('active') && event.key === 'Backspace') {
      this.value = '';
      this.cellValue.innerHTML = this.value;
      this.element.classList.remove('incorrect', 'highlight');
    }
  }
}

export default Cell;