// Games Component
class GamesManager {
    constructor() {
        this.games = {
            puzzle: {
                id: 'puzzle',
                title: 'Puzzle Challenge',
                description: 'Asah otak dengan puzzle menyenangkan',
                icon: '🧩',
                category: 'brain',
                difficulty: 'medium',
                plays: 1247,
                rating: 4.5
            },
            memory: {
                id: 'memory',
                title: 'Memory Match',
                description: 'Uji daya ingat Anda dengan kartu matching',
                icon: '🎯',
                category: 'memory',
                difficulty: 'easy',
                plays: 1893,
                rating: 4.2
            },
            quiz: {
                id: 'quiz',
                title: 'Quick Quiz',
                description: 'Jawab pertanyaan secepat mungkin',
                icon: '❓',
                category: 'knowledge',
                difficulty: 'various',
                plays: 2156,
                rating: 4.7
            }
        };
        
        this.currentGame = null;
        this.scores = JSON.parse(localStorage.getItem('game_scores')) || {};
    }

    init() {
        this.setupEventListeners();
        this.displayGames();
    }

    setupEventListeners() {
        // Game category filters
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('category-btn')) {
                this.filterGames(e.target.dataset.category);
            }
            
            if (e.target.closest('.game-card')) {
                const gameCard = e.target.closest('.game-card');
                const gameId = gameCard.dataset.game;
                this.startGame(gameId);
            }
            
            if (e.target.classList.contains('modal-close')) {
                this.closeGame();
            }
        });
    }

    displayGames() {
        const gamesContainer = document.querySelector('.games-grid');
        if (!gamesContainer) return;

        gamesContainer.innerHTML = Object.values(this.games).map(game => `
            <div class="game-card" data-game="${game.id}">
                <div class="game-icon">${game.icon}</div>
                <h3 class="game-title">${game.title}</h3>
                <p class="game-desc">${game.description}</p>
                
                <div class="game-features">
                    <span class="game-feature">${this.getDifficultyText(game.difficulty)}</span>
                    <span class="game-feature">${game.category}</span>
                </div>
                
                <div class="game-stats">
                    <div class="game-stat">
                        <span class="stat-number">${this.formatNumber(game.plays)}</span>
                        <span class="stat-label">Dimainkan</span>
                    </div>
                    <div class="game-stat">
                        <span class="stat-number">${game.rating}</span>
                        <span class="stat-label">Rating</span>
                    </div>
                </div>
                
                <button class="btn btn-primary">Main Sekarang</button>
            </div>
        `).join('');
    }

    filterGames(category) {
        const buttons = document.querySelectorAll('.category-btn');
        buttons.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');

        // Implement category filtering logic
        console.log('Filtering games by:', category);
    }

    startGame(gameId) {
        this.currentGame = this.games[gameId];
        this.showGameModal();
        
        switch(gameId) {
            case 'puzzle':
                this.initPuzzleGame();
                break;
            case 'memory':
                this.initMemoryGame();
                break;
            case 'quiz':
                this.initQuizGame();
                break;
        }
    }

    showGameModal() {
        const modal = document.createElement('div');
        modal.className = 'game-modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <div class="game-modal-header">
                    <div class="game-modal-icon">${this.currentGame.icon}</div>
                    <h2>${this.currentGame.title}</h2>
                    <p>${this.currentGame.description}</p>
                </div>
                
                <div class="instructions">
                    <h4>Cara Bermain:</h4>
                    <ol>
                        <li>Baca instruksi dengan seksama</li>
                        <li>Klik tombol mulai untuk memulai game</li>
                        <li>Ikuti petunjuk yang muncul di layar</li>
                        <li>Dapatkan skor tertinggi!</li>
                    </ol>
                </div>
                
                <div class="game-canvas-container">
                    <div id="game-canvas"></div>
                </div>
                
                <div class="game-controls">
                    <button class="control-btn control-primary" id="start-game">Mulai Game</button>
                    <button class="control-btn control-secondary" id="how-to-play">Cara Main</button>
                </div>
                
                <div class="score-display hidden">
                    <div class="score-value" id="current-score">0</div>
                    <div class="score-label">Skor Saat Ini</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners for modal buttons
        modal.querySelector('#start-game').addEventListener('click', () => {
            this.startCurrentGame();
        });
        
        modal.querySelector('.modal-close').addEventListener('click', () => {
            this.closeGame();
        });
    }

    closeGame() {
        const modal = document.querySelector('.game-modal');
        if (modal) {
            modal.remove();
        }
        this.currentGame = null;
    }

    initPuzzleGame() {
        const canvas = document.getElementById('game-canvas');
        canvas.innerHTML = `
            <div class="puzzle-game">
                <div class="puzzle-board" id="puzzle-board"></div>
                <div class="puzzle-controls">
                    <button class="btn btn-outline" id="shuffle-puzzle">Acak</button>
                    <button class="btn btn-outline" id="solve-puzzle">Selesaikan</button>
                </div>
            </div>
        `;
    }

    initMemoryGame() {
        const canvas = document.getElementById('game-canvas');
        canvas.innerHTML = `
            <div class="memory-game">
                <div class="memory-board" id="memory-board"></div>
                <div class="game-info">
                    <div class="moves">Langkah: <span id="move-count">0</span></div>
                    <div class="timer">Waktu: <span id="game-timer">00:00</span></div>
                </div>
            </div>
        `;
    }

    initQuizGame() {
        const canvas = document.getElementById('game-canvas');
        canvas.innerHTML = `
            <div class="quiz-game">
                <div class="quiz-question" id="quiz-question">
                    <h3>Loading question...</h3>
                </div>
                <div class="quiz-options" id="quiz-options"></div>
                <div class="quiz-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" id="quiz-progress" style="width: 0%"></div>
                    </div>
                    <div class="progress-text">Pertanyaan <span id="current-q">1</span>/10</div>
                </div>
            </div>
        `;
    }

    startCurrentGame() {
        const startBtn = document.querySelector('#start-game');
        const scoreDisplay = document.querySelector('.score-display');
        
        startBtn.classList.add('hidden');
        scoreDisplay.classList.remove('hidden');
        
        // Initialize game-specific logic
        switch(this.currentGame.id) {
            case 'puzzle':
                this.startPuzzleGame();
                break;
            case 'memory':
                this.startMemoryGame();
                break;
            case 'quiz':
                this.startQuizGame();
                break;
        }
    }

    startPuzzleGame() {
        // Implement puzzle game logic
        console.log('Starting puzzle game');
    }

    startMemoryGame() {
        // Implement memory game logic
        console.log('Starting memory game');
    }

    startQuizGame() {
        // Implement quiz game logic
        console.log('Starting quiz game');
        
        const questions = [
            {
                question: "Apa ibukota Indonesia?",
                options: ["Jakarta", "Surabaya", "Bandung", "Medan"],
                answer: 0
            },
            {
                question: "2 + 2 × 2 = ?",
                options: ["6", "8", "4", "10"],
                answer: 0
            },
            {
                question: "Planet terdekat dengan matahari?",
                options: ["Venus", "Mars", "Mercury", "Jupiter"],
                answer: 2
            }
        ];
        
        this.displayQuizQuestion(questions[0]);
    }

    displayQuizQuestion(question) {
        const questionEl = document.getElementById('quiz-question');
        const optionsEl = document.getElementById('quiz-options');
        
        questionEl.innerHTML = `<h3>${question.question}</h3>`;
        optionsEl.innerHTML = question.options.map((option, index) => `
            <button class="quiz-option" data-index="${index}">${option}</button>
        `).join('');
        
        // Add event listeners to options
        optionsEl.querySelectorAll('.quiz-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleQuizAnswer(parseInt(e.target.dataset.index), question.answer);
            });
        });
    }

    handleQuizAnswer(selected, correct) {
        const options = document.querySelectorAll('.quiz-option');
        
        options.forEach((option, index) => {
            if (index === correct) {
                option.classList.add('correct');
            } else if (index === selected && selected !== correct) {
                option.classList.add('wrong');
            }
            option.disabled = true;
        });
        
        // Move to next question after delay
        setTimeout(() => {
            // Implement next question logic
        }, 2000);
    }

    saveScore(gameId, score) {
        if (!this.scores[gameId]) {
            this.scores[gameId] = [];
        }
        
        this.scores[gameId].push({
            score: score,
            date: new Date().toISOString(),
            time: Date.now()
        });
        
        // Keep only top 10 scores
        this.scores[gameId].sort((a, b) => b.score - a.score);
        this.scores[gameId] = this.scores[gameId].slice(0, 10);
        
        localStorage.setItem('game_scores', JSON.stringify(this.scores));
    }

    getHighScore(gameId) {
        if (this.scores[gameId] && this.scores[gameId].length > 0) {
            return this.scores[gameId][0].score;
        }
        return 0;
    }

    getDifficultyText(difficulty) {
        const difficulties = {
            easy: 'Mudah',
            medium: 'Menengah',
            hard: 'Sulit',
            various: 'Beragam'
        };
        return difficulties[difficulty] || difficulty;
    }

    formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    }
}

// Initialize games when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.games-grid')) {
        window.gamesManager = new GamesManager();
        window.gamesManager.init();
    }
});
