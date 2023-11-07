class Cell {
  constructor(value, correctValue) {
    this.value = value;
    this.correctValue = correctValue;
    this.pencilMarks = [];

    this.cellValue = document.createElement('div');
    this.cellValue.className = 'value';
    this.cellValue.innerHTML = this.value;

    this.element = document.createElement('div');
    this.element.className = 'cell';

    if (this.cellValue.innerHTML >= '1' && this.cellValue.innerHTML <= '9') {
      this.element.classList.add('original');
    }

    this.element.appendChild(this.cellValue);

    // Keep a reference to the event handlers
    this.activateHandler = this.activate.bind(this);
    this.highlightHandler = this.highlight.bind(this);
    this.keyPressHandler = this.handleKeyPress.bind(this);

    // Remove the old event listeners before adding new ones
    this.element.removeEventListener('click', this.activateHandler);
    this.element.removeEventListener('dblclick', this.highlightHandler);
    window.removeEventListener('keydown', this.keyPressHandler);

    this.element.addEventListener('click', this.activateHandler);
    this.element.addEventListener('dblclick', this.highlightHandler);
    window.addEventListener('keydown', this.keyPressHandler);
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
      const pencilMarksToCompare = cell.querySelectorAll('.pencil-mark');

      if (valueToCompare == value) {
        cell.classList.add('highlight');
        cell.classList.remove('pencil-highlight');
      } else if (Array.from(pencilMarksToCompare).some(mark => mark.innerHTML == value)) {
        console.log('pencil mark found');
        cell.classList.add('pencil-highlight');
        cell.classList.remove('highlight');
      } else {
        cell.classList.remove('highlight', 'pencil-highlight');
      }
    });
  }

  handleKeyPress(event) {
    if (!this.element.classList.contains('active')) return;

    // if pencil mark checkbox is checked, add pencil marks
    if (document.getElementById('pencilMark').checked) {
      if (event.key >= '1' && event.key <= '9') {
        this.updatePencilMarks(event.key);
      } else if (event.key === 'Backspace') {
        this.clearPencilMarks();
      }
      this.drawPencilMarks();
    } else {
      if (event.key >= '1' && event.key <= '9') {
        this.updateValue(event.key);
      } else if (event.key === 'Backspace') {
        this.clearValue();
      }
    }
  }

  updatePencilMarks(value) {
    // push value to pencilMarks array if it doesn't already exist
    if (!this.pencilMarks.includes(value)) {
      this.pencilMarks.push(value);
      this.pencilMarks.sort();
    } else {
      this.pencilMarks.splice(this.pencilMarks.indexOf(value), 1);
    }
  }

  clearPencilMarks() {
    this.pencilMarks = [];
  }

  drawPencilMarks() {
    this.element.querySelectorAll('.pencil-mark').forEach(mark => mark.remove());
    this.pencilMarks.forEach(mark => {
      const markElement = document.createElement('span');
      markElement.className = 'pencil-mark';
      markElement.innerHTML = mark;
      this.element.appendChild(markElement);
    });
  }

  updateValue(value) {
    this.value = value;
    this.cellValue.innerHTML = this.value;

    if (this.value !== this.correctValue) {
      this.element.classList.add('incorrect');
      this.updateErrorCount();
    } else {
      this.element.classList.remove('incorrect');
      this.clearPencilMarks();
      this.drawPencilMarks();
    }

    this.dispatchChangeEvent();
  }

  clearValue() {
    this.value = '';
    this.cellValue.innerHTML = this.value;
    this.element.classList.remove('incorrect', 'highlight');
  }

  updateErrorCount() {
    const errorCountElement = document.getElementById('errorCount');
    errorCountElement.innerHTML = Number(errorCountElement.innerHTML) + 1;
  }

  dispatchChangeEvent() {
    const changeEvent = new CustomEvent('change', { detail: this.value });
    this.element.dispatchEvent(changeEvent);
  }

  reset() {
    // Remove the event listener
    window.removeEventListener('keydown', this.keyPressHandler);
  }
}

export default Cell;