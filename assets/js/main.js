const display = document.getElementById('display');

function appendNumber(number) {
  // Check if the total input length (excluding commas) exceeds 16 digits
  const currentLength = display.value.replace(/[^0-9]/g, '').length;
  if (currentLength >= 16) return; // Restrict input if limit is reached

  display.value += number;
  formatNumberWithCommas();
  adjustFontSize();
}

function appendOperator(operator) {
  const lastChar = display.value[display.value.length - 1];
  if (['+', '-', '*', '/', '%'].includes(lastChar)) {
    display.value = display.value.slice(0, -1) + operator;
  } else {
    display.value += operator;
  }
  adjustFontSize();
}

function clearDisplay() {
  display.value = '';
  adjustFontSize();
}

function deleteLast() {
  display.value = display.value.slice(0, -1);
  formatNumberWithCommas();
}

function calculate() {
  try {
    let expression = display.value.replace(/,/g, ''); // Remove commas before evaluation

    // Handle percentage calculations
    if (expression.includes('%')) {
      expression = expression.replace(/(\d+(\.\d+)?)(%)?/g, (match, num) => parseFloat(num) / 100);
    }

    display.value = eval(expression).toLocaleString(); // Add commas to the result
    adjustFontSize();
  } catch {
    display.value = 'Error';
  }
}

function formatNumberWithCommas() {
  const value = display.value.replace(/,/g, ''); // Remove existing commas
  const parts = value.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas to the integer part
  display.value = parts.join('.');
}

function adjustFontSize() {
  const maxFontSize = 2.5; // Maximum font size in 'em'
  const minFontSize = 0.8; // Minimum font size in 'em'
  const maxLength = 16; // Maximum length before resizing is needed
  const baseFontSize = maxFontSize;

  // Calculate the font size based on the length of the input
  const inputLength = display.value.length;
  const newFontSize = Math.max(minFontSize, baseFontSize - (inputLength - maxLength) * 0.1);

  display.style.fontSize = `${newFontSize}em`;
}


document.addEventListener('keydown', (event) => {
  const key = event.key;

  // Prevent input if total digits exceed 16
  const currentLength = display.value.replace(/[^0-9]/g, '').length;
  if (currentLength >= 16 && !['Backspace', 'Delete', 'Enter', '=', 'Escape'].includes(key)) {
    event.preventDefault();
    return;
  }

  if (!isNaN(key) || key === '.') {
    appendNumber(key);
  } else if (['+', '-', '*', '/', '%'].includes(key)) {
    appendOperator(key);
  } else if (key === 'Backspace') {
    deleteLast();
  } else if (key === 'Enter' || key === '=') {
    calculate();
  } else if (key === 'Escape') {
    clearDisplay();
  }
});