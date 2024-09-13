const getRandomLower = () => String.fromCharCode(Math.floor(Math.random() * 26) + 97);
const getRandomUpper = () => String.fromCharCode(Math.floor(Math.random() * 26) + 65);
const getRandomNumber = () => String.fromCharCode(Math.floor(Math.random() * 10) + 48);
const getRandomSymbol = () => {
  const symbols = '!@#$%^&*(){}[]=<>/,.';
  return symbols[Math.floor(Math.random() * symbols.length)];
};

const randomFunc = {
  lower: getRandomLower,
  upper: getRandomUpper,
  number: getRandomNumber,
  symbol: getRandomSymbol,
};

// Function to get selected options
const getOptions = () => {
  const length = document.getElementById('lengthSlider').value; // Get the value from the range slider
  const uppercase = document.getElementById('uppercase').checked;
  const lowercase = document.getElementById('lowercase').checked;
  const numbers = document.getElementById('numbers').checked;
  const symbols = document.getElementById('symbols').checked;

  return { length: parseInt(length), uppercase, lowercase, numbers, symbols };
};

// Function to generate password
const generatePassword = async () => {
  const resultContainer = document.getElementById('result');
  const { length, uppercase, lowercase, numbers, symbols } = getOptions();
  
  let generatedPassword = '';
  const typesCount = uppercase + lowercase + numbers + symbols;
  const typesArr = [{ upper: uppercase }, { lower: lowercase }, { number: numbers }, { symbol: symbols }].filter(
    (item) => Object.values(item)[0]
  );

  if (typesCount === 0) {
    resultContainer.innerHTML = `<span class="text-red-400">Please select at least one option.</span>`;
    return '';
  }

  // Display loader
  document.getElementById('loader').classList.remove('hidden');
  resultContainer.classList.add('hidden'); // Hide the result box
  resultContainer.innerHTML = ''; // Clear previous content
  document.getElementById('copy-btn').classList.add('hidden'); // Hide the copy button

  // Simulate a delay to show the loader
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Loop and generate password
  for (let i = 0; i < length; i += typesCount) {
    typesArr.forEach((type) => {
      const funcName = Object.keys(type)[0];
      generatedPassword += randomFunc[funcName]();
    });
  }

  const finalPassword = generatedPassword.slice(0, length);
  displayPassword(finalPassword);

  // Hide the loader and show the result box
  document.getElementById('loader').classList.add('hidden');
  resultContainer.classList.remove('hidden'); // Show the result box
  document.getElementById('copy-btn').classList.remove('hidden'); // Show the copy button
};

// Function to display password with text reveal animation
const displayPassword = (password) => {
  const resultContainer = document.getElementById('result');
  resultContainer.innerHTML = ''; // Clear previous content

  password.split('').forEach((char, index) => {
    const span = document.createElement('span');
    span.className = 'inline-block text-green-400 reveal';
    span.style.animationDelay = `${index * 0.05}s`;
    span.textContent = char;
    resultContainer.appendChild(span);
  });
};

// Update slider value display
const updateSliderValue = () => {
  const slider = document.getElementById('lengthSlider');
  const lengthValue = document.getElementById('lengthValue');
  lengthValue.textContent = slider.value;
};

// Copy password to clipboard
const copyToClipboard = () => {
  const password = document.getElementById('result').innerText;
  navigator.clipboard.writeText(password).then(() => {
    alert('Password copied to clipboard!');
  });
};

document.getElementById('generate-btn').addEventListener('click', generatePassword);
document.getElementById('lengthSlider').addEventListener('input', updateSliderValue); // Update the slider value display
document.getElementById('copy-btn').addEventListener('click', copyToClipboard); // Copy password to clipboard
