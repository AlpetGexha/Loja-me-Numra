const game = {
    secret: "",
    guesses: [],
    maxGuesses: 10,
    numDigits: 4,
    currentGuess: "",
    gameOver: false,
    mode: "easy", // Set the default mode

    levels: {
        easy: {
            numDigits: 3,
            maxGuesses: 10
        },
        medium: {
            numDigits: 4,
            maxGuesses: 7
        },
        hard: {
            numDigits: 6,
            maxGuesses: 4
        },
        impossible: {
            numDigits: 8,
            maxGuesses: 1
        },
    },
};

function generateNumber() {
    let digits = new Set();

    while (digits.size < game.numDigits) {
        digits.add(Math.floor(Math.random() * 10));
    }

    game.secret = Array.from(digits).join('');

    // let secretNumber = document.getElementById('secretNumber');
    // secretNumber.innerHTML = `Secret number: ${game.secret}`;
}

function checkGuess() {
    let guessInput = document.getElementById('guessInput');
    let guess = guessInput.value;

    if (guess.length > game.numDigits) {
        guess = guess.slice(0, game.numDigits);
    }

    if (!isValidGuess(guess)) {
        alert(`Please enter a ${game.numDigits}-digit number with unique digits.`);
        guessInput.value = '';
        return;
    }

    if (!isNumric(guess)) {
        alert(`Please enter a number.`);
        guessInput.value = '';
        return;
    }


    game.guesses.push(guess);
    game.currentGuess = guess;
    let guessResult;

    if (game.mode == 'hard') {
        guessResult = getGuessResultMode2(guess);
    } else {
        guessResult = getGuessResult(guess);
    }

    let guessList = document.getElementById('guessList');
    let guessItem = document.createElement('li');

    guessItem.innerHTML = guessResult;
    guessList.appendChild(guessItem);

    guessInput.value = '';
    guessInput.focus();


    if (game.secret === guess) {
        game.gameOver = true;
        let score = calculateScore();

        alert(`Urime, ju fitoni! Rezultati juaj është ${score}.`);
        restartGame();
    } else if (game.guesses.length >= game.maxGuesses) {
        game.gameOver = true;
        disableGuessing();

        alert(`Keni humbur. Numri ishte ${game.secret}.`);
        restartGame();
    }

    howMuchLeft();
}

function howMuchLeft() {
    document.getElementById('guessLeft').innerHTML = `Ju keni edhe ${game.maxGuesses - game.guesses.length} mundesi.`;
    document.getElementById('guessDigit').innerHTML = `Numir është me ${game.numDigits} karaktere.`;
}

function getGuessResult(guess) {
    let result = '';
    for (let i = 0; i < game.numDigits; i++) {
        let digit = guess[i];
        let index = game.secret.indexOf(digit);
        if (index === i) {
            result += `<span class="green">${digit}</span>`;
        } else if (index !== -1) {
            result += `<span class="yellow">${digit}</span>`;
        } else {
            result += `<span class="red">${digit}</span>`;
        }
    }
    return result;
}


function getGuessResultMode2(guess) {
    let result = '';
    let currectOrder = 0;
    let diffrentOrder = 0;
    for (let i = 0; i < game.numDigits; i++) {
        let digit = guess[i];
        let index = game.secret.indexOf(digit);
        if (index === i) {
            currectOrder++
        } else if (index !== -1) {
            diffrentOrder++
        } else {

        }
    }

    result += `<span> ${guess} - `;

    if (currectOrder != 0) {
        result += `${currectOrder} i fiksuar </span>`;
    }

    if (diffrentOrder != 0) {
        result += `${diffrentOrder} i qelluar </span>`;
    }

    if (currectOrder == 0 && diffrentOrder == 0) {
        result += `0 te fiksuar dhe 0 te qelluar </span>`;
    }

    return result;
}

function disableGuessing() {
    document.getElementById('guessButton').disabled = true;

    document.getElementById('guessInput').disabled = true;
}

function enableGuessing() {
    let guessButton = document.getElementById('guessButton');
    guessButton.disabled = false;

    let guessInput = document.getElementById('guessInput');
    guessInput.disabled = false;

    guessInput.focus();
}

function restartGame() {
    game.secret = '';
    game.guesses = [];
    game.currentGuess = '';
    game.gameOver = false;
    generateNumber();
    remainingGuesses = game.maxGuesses;
    let guessList = document.getElementById('guessList');
    guessList.innerHTML = '';
    enableGuessing();

    howMuchLeft();
    document.getElementById('guessInput').setAttribute('maxlength', game.numDigits);

}

function setGameLevel(mode) {
    const selectedLevel = game.levels[mode] || game.levels.medium;

    game.numDigits = selectedLevel.numDigits;
    game.maxGuesses = selectedLevel.maxGuesses;

    restartGame();
}

function setGameMode(mode) {
    game.mode = mode;
    restartGame();
}

function isValidGuess(guess) {
    let uniqueDigits = new Set(guess);
    return guess.length === game.numDigits && uniqueDigits.size === game.numDigits;
}

function isNumric(guess) {
    return /^\d+$/.test(guess);
}

function refreshPage() {
    location.reload();
}

function calculateScore() {
    let score = (game.maxGuesses - game.guesses.length + 1) * 100;
    return score > 0 ? score : 0;
}

window.onload = function () {
    generateNumber();

    let guessButton = document.getElementById('guessButton');
    guessButton.addEventListener('click', checkGuess);

    howMuchLeft();

    let guessInput = document.getElementById('guessInput');
    guessInput.setAttribute('maxlength', game.numDigits);
    guessInput.addEventListener('keydown', function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            guessButton.click();
        }
    });

    let restartButton = document.getElementById('restartButton');
    restartButton.addEventListener('click', refreshPage);
};