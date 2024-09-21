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

(function () {
    const game = new Hangman();
    let numberOfFilledBoxes = 0; // 0 at the start of the game

    function createTextBoxes(count) { // Factory function to create text boxes
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
        let textLifes = element.textContent; // Get the content of the element
        let numberLifes = parseInt(textLifes.match(/(\d+)/)[0]); // Extract the number
        --numberLifes;
        let updatedText = textLifes.replace(/(\d+)/, numberLifes);
        element.textContent = updatedText; // Update the content
        console.log("The letter doesn't exist in the word. You lose one life.");
        return numberLifes;
    }

    function displayMessage(messageBoxId, closeBtnId) { // Show message when user wins or loses
        const messageBox = document.getElementById(messageBoxId);
        const closeBtn = document.getElementById(closeBtnId);
        if (messageBox && closeBtn) {
            messageBox.classList.remove('hidden');
            closeBtn.addEventListener('click', () => location.reload());
        }
    }

    document.addEventListener('DOMContentLoaded', function () { // Initialize text boxes based on word length
        const wordLength = game.getWordLength();
        createTextBoxes(wordLength);
    });

    document.getElementById('addLetter').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            let letter = toUpperCase(this.value);
            if (letter.length > 1) {
                this.value = '';  // Clear input
                alert("Please enter a single letter.");
            } else if (letter.length === 1) {
                console.log("The entered letter is:", letter);

                if (game.doesLetterExist(letter)) { // If the letter exists in the word
                    let indices = game.getLetterIndices(letter); // Get the indices of the letter in the word
                    const textBoxes = document.getElementsByClassName('textBox');
                    for (let index of indices) {
                        textBoxes[index].value = letter; // Add letter to the correct position
                        ++numberOfFilledBoxes;
                    }
                    this.value = ''; // Clear input

                    if (numberOfFilledBoxes === game.getWordLength()) { // If the player wins
                        displayMessage('message-boxWin', 'closeBtnWin');
                    }
                } else {
                    const element = document.querySelector('.card-textLives');
                    const remainingLives = updateLivesLeft(element);

                    if (remainingLives === 0) { // If the player loses
                        displayMessage('message-boxLose', 'closeBtnLose');
                    }
                    this.value = '';
                }
            }
        }
    });
})();
