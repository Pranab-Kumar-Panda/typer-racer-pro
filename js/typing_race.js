import { getQuotes, getProgrammingSnippets, getSpeeches, getAIQuotes } from './quotes.js';

document.addEventListener('DOMContentLoaded', () => {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const typingInput = document.getElementById('typingInput');
    const timerElement = document.getElementById('timer');
    const wpmElement = document.getElementById('wpm');
    const accuracyElement = document.getElementById('accuracy');
    const errorsElement = document.getElementById('errors');
    const startRaceBtn = document.getElementById('startRaceBtn');
    const restartBtn = document.getElementById('restartBtn');
    const newSentenceBtn = document.getElementById('newSentenceBtn');
    const categoryButtons = document.querySelectorAll('.btn-category');
    const countdownOverlay = document.getElementById('countdownOverlay');
    const countdownNumber = document.getElementById('countdownNumber');
    const resultsPopup = document.getElementById('resultsPopup');
    const finalWPM = document.getElementById('finalWPM');
    const finalAccuracy = document.getElementById('finalAccuracy');
    const finalErrors = document.getElementById('finalErrors');
    const playAgainBtn = document.getElementById('playAgainBtn');
    const goToLeaderboardBtn = document.getElementById('goToLeaderboardBtn');

    let currentQuote = '';
    let timer;
    let timeLeft = 60;
    let characterCount = 0;
    let correctCharacters = 0;
    let errors = 0;
    let gameStarted = false;
    let currentCategory = 'quotes';
    let startTime; // Added startTime variable

    const getQuoteByCategory = (category) => {
        switch (category) {
            case 'quotes':
                return getQuotes();
            case 'programming':
                return getProgrammingSnippets();
            case 'speeches':
                return getSpeeches();
            case 'ai_quotes':
                return getAIQuotes();
            default:
                return getQuotes();
        }
    };

    const loadNewSentence = () => {
        const quotes = getQuoteByCategory(currentCategory);
        currentQuote = quotes[Math.floor(Math.random() * quotes.length)];
        quoteDisplay.innerHTML = '';

        currentQuote.split('').forEach(char => {
            const charSpan = document.createElement('span');
            charSpan.classList.add('character');
            if (char === ' ') {
                charSpan.innerHTML = '&nbsp;'; // Use &nbsp; for visible spaces
            } else {
                charSpan.textContent = char;
            }
            quoteDisplay.appendChild(charSpan);
        });

        characterCount = 0;
        correctCharacters = 0;
        errors = 0;
        typingInput.value = '';
        typingInput.disabled = true;
        wpmElement.textContent = '0';
        accuracyElement.textContent = '0%';
        errorsElement.textContent = '0';
        resetCharacterStyling();
        startRaceBtn.disabled = false;
        restartBtn.disabled = true;
        newSentenceBtn.disabled = false;
        timerElement.textContent = timeLeft;
    };

    const resetCharacterStyling = () => {
        Array.from(quoteDisplay.children).forEach(span => {
            span.classList.remove('correct', 'incorrect', 'current');
        });
    };

    const startGame = () => {
        gameStarted = true;
        typingInput.disabled = false;
        typingInput.focus();
        startRaceBtn.disabled = true;
        restartBtn.disabled = false;
        newSentenceBtn.disabled = true;
        startTime = Date.now(); // Record start time

        timer = setInterval(() => {
            timeLeft--;
            timerElement.textContent = timeLeft;
            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
    };

    const endGame = () => {
        clearInterval(timer);
        gameStarted = false;
        typingInput.disabled = true;
        calculateResults();
        resultsPopup.classList.add('show');
        saveScoreToLeaderboard(parseInt(finalWPM.textContent), parseInt(finalAccuracy.textContent), parseInt(finalErrors.textContent), currentCategory);
    };

    const calculateResults = () => {
        const endTime = Date.now();
        const durationInMinutes = (endTime - startTime) / 1000 / 60; // Calculate duration in minutes

        const wpm = (correctCharacters / 5) / durationInMinutes;
        const accuracy = characterCount === 0 ? 0 : ((correctCharacters / characterCount) * 100).toFixed(2);

        finalWPM.textContent = isFinite(wpm) ? Math.round(wpm) : 0;
        finalAccuracy.textContent = `${accuracy}%`;
        finalErrors.textContent = errors;
        wpmElement.textContent = isFinite(wpm) ? Math.round(wpm) : 0;
        accuracyElement.textContent = `${accuracy}%`;
        errorsElement.textContent = errors;
    };

    const resetGame = () => {
        clearInterval(timer);
        timeLeft = 60;
        characterCount = 0;
        correctCharacters = 0;
        errors = 0;
        gameStarted = false;
        loadNewSentence();
        timerElement.textContent = timeLeft;
        wpmElement.textContent = '0';
        accuracyElement.textContent = '0%';
        errorsElement.textContent = '0';
        typingInput.value = '';
        typingInput.disabled = true;
        startRaceBtn.disabled = false;
        restartBtn.disabled = true;
        newSentenceBtn.disabled = false;
        resultsPopup.classList.remove('show');
    };

    typingInput.addEventListener('input', () => {
        if (!gameStarted) return;

        const typedText = typingInput.value;
        const quoteChars = Array.from(quoteDisplay.children);

        characterCount = typedText.length;
        correctCharacters = 0;
        errors = 0;

        resetCharacterStyling();

        for (let i = 0; i < quoteChars.length; i++) {
            const charSpan = quoteChars[i];
            const correctChar = currentQuote[i];
            const typedChar = typedText[i];

            if (typedChar == null) {
                charSpan.classList.remove('correct', 'incorrect');
            } else if (typedChar === correctChar) {
                charSpan.classList.add('correct');
                charSpan.classList.remove('incorrect');
                correctCharacters++;
            } else {
                charSpan.classList.add('incorrect');
                charSpan.classList.remove('correct');
                errors++;
            }

            if (i === typedText.length) {
                charSpan.classList.add('current');
            }
        }

        if (typedText.length === currentQuote.length && correctCharacters === currentQuote.length) {
            endGame();
        }

        const currentTime = Date.now();
        const elapsedTimeInMinutes = (currentTime - startTime) / 1000 / 60;
        const wpm = (correctCharacters / 5) / elapsedTimeInMinutes;
        wpmElement.textContent = isFinite(wpm) ? Math.round(wpm) : 0;
        const accuracy = characterCount === 0 ? 0 : ((correctCharacters / characterCount) * 100).toFixed(2);
        accuracyElement.textContent = `${accuracy}%`;
        errorsElement.textContent = errors;
    });

    startRaceBtn.addEventListener('click', () => {
        countdownOverlay.classList.add('active');
        let count = 3;
        countdownNumber.textContent = count;

        const countdownInterval = setInterval(() => {
            count--;
            countdownNumber.textContent = count;
            if (count === 0) {
                countdownNumber.textContent = 'Go!';
            }
            if (count < 0) {
                clearInterval(countdownInterval);
                countdownOverlay.classList.remove('active');
                startGame();
            }
        }, 1000);
    });

    restartBtn.addEventListener('click', resetGame);
    newSentenceBtn.addEventListener('click', resetGame);

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentCategory = button.dataset.category;
            resetGame();
        });
    });

    playAgainBtn.addEventListener('click', () => {
        resultsPopup.classList.remove('show');
        resetGame();
    });

    goToLeaderboardBtn.addEventListener('click', () => {
        window.location.href = 'leaderboard.html';
    });

    const saveScoreToLeaderboard = (wpm, accuracy, errors, category) => {
        const scores = JSON.parse(localStorage.getItem('typerProLeaderboard')) || [];
        const newScore = {
            name: 'Guest',
            wpm: wpm,
            accuracy: accuracy,
            errors: errors,
            category: category,
            date: new Date().toLocaleString()
        };
        scores.push(newScore);
        scores.sort((a, b) => {
            if (b.wpm !== a.wpm) {
                return b.wpm - a.wpm;
            }
            return b.accuracy - a.accuracy;
        });
        localStorage.setItem('typerProLeaderboard', JSON.stringify(scores.slice(0, 10)));
    };

    loadNewSentence();
});
