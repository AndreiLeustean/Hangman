class Hangman {
    constructor() {
        this.words = ["ANIMAL", "CAR", "VEGETABLE", "SPAIN", "CHAIR", "SCHOOL"];
        this.wordCount = this.words.length;
        this.currentWord = this.getRandomWord();
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    getRandomWord() {
        const randomIndex = this.getRandomInt(this.wordCount);
        const selectedWord = this.words[randomIndex];
        return selectedWord;
    }

    getWordLength() {
        return this.currentWord.length;
    }

    doesLetterExist(letter) {
        return this.currentWord.includes(letter);
    }

    getLetterIndices(letter) {
        let word = this.currentWord;
        let indices = [];
        for (let i = 0; i < word.length; ++i) {
            if (letter === word.charAt(i)) {
                indices.push(i);
            }
        }
        return indices;
    }
}


const game = new Hangman();
let numberOfFilledBoxes = 0;

function createTextBoxes(count) {
    const container = document.getElementById('inputContainer');
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const textBox = document.createElement('input');
        textBox.type = 'text';
        textBox.value = '_';
        textBox.style.textAlign = 'center';
        textBox.maxLength = 1;
        textBox.style.width = '50px';
        textBox.classList.add('textBox');
        container.appendChild(textBox);
    }
}

function toUpperCase(value) {
    return value.toUpperCase();
}

function updateLivesLeft(element) {
    let textLifes = element.textContent;
    let numberLifes = parseInt(textLifes.match(/(\d+)/)[0]);
    --numberLifes;
    let updatedText = textLifes.replace(/(\d+)/, numberLifes);
    element.textContent = updatedText;
    console.log("The letter doesn't exist in the word. You lose one life.");
    return numberLifes;
}

function displayMessage(messageBoxId, closeBtnId) {
    const messageBox = document.getElementById(messageBoxId);
    const closeBtn = document.getElementById(closeBtnId);
    if (messageBox && closeBtn) {
        messageBox.classList.remove('hidden');
        closeBtn.addEventListener('click', () => location.reload());
    }
}

function handleEnterPress(inputElement) {
    let letter = inputElement.value.toUpperCase();
    if (letter.length > 1) {
        inputElement.value = '';
        alert("Please enter a single letter.");
    } else if (letter.length === 1) {
        console.log("The entered letter is:", letter);

        if (game.doesLetterExist(letter)) {
            let indices = game.getLetterIndices(letter);
            const textBoxes = document.getElementsByClassName('textBox');
            for (let index of indices) {
                textBoxes[index].value = letter;
                ++numberOfFilledBoxes;
            }
            inputElement.value = '';

            if (numberOfFilledBoxes === game.getWordLength()) {
                displayMessage('message-boxWin', 'closeBtnWin');
            }
        } else {
            const element = document.querySelector('.card-textLives');
            const remainingLives = updateLivesLeft(element);

            if (remainingLives === 0) {
                displayMessage('message-boxLose', 'closeBtnLose');
            }
            inputElement.value = '';
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const wordLength = game.getWordLength();
    createTextBoxes(wordLength);
});

document.getElementById('addLetter').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        handleEnterPress(this);
    }
});
