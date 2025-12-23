// Game elements
const gameContainer = document.getElementById('game-container');
const gun = document.getElementById('gun');
const gunColor = document.getElementById('gun-color');
const bulletContainer = document.getElementById('bullet-container');
const ballContainer = document.getElementById('ball-container');
const enemyContainer = document.getElementById('enemy-container');
const scoreDisplay = document.getElementById('score-display');
const livesDisplay = document.getElementById('lives-display');
const comboDisplay = document.getElementById('combo-display');
const levelDisplay = document.getElementById('level-display');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over');
const levelCompleteScreen = document.getElementById('level-complete');
const levelsScreen = document.getElementById('levels-screen');
const pauseScreen = document.getElementById('pause-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const nextLevelBtn = document.getElementById('next-level-btn');
const restartLevelBtn = document.getElementById('restart-level-btn');
const backToMenuBtn = document.getElementById('back-to-menu');
const menuBtn = document.getElementById('menu-btn');
const menuBtnLevel = document.getElementById('menu-btn-level');
const menuBtnQuit = document.getElementById('quit-to-levels-btn');
const pauseBtn = document.getElementById('pause-btn');
const resumeBtn = document.getElementById('resume-btn');
const finalScore = document.getElementById('final-score');
const levelScore = document.getElementById('level-score');
const levelReached = document.getElementById('level-reached');
const reachedLevel = document.getElementById('reached-level');
const nextLevelDisplay = document.getElementById('next-level');
const nextLevelTarget = document.getElementById('next-level-target');
const levelTarget = document.getElementById('level-target');
const levelsContainer = document.getElementById('levels-container');
const musicToggle = document.getElementById('music-toggle');

// Audio elements
const bgMusic = document.getElementById('bg-music');
const fireSound = document.getElementById('fire-sound');
const popSound = document.getElementById('pop-sound');
const clickSound = document.getElementById('click-sound');
const looseSound = document.getElementById('loose-sound');
const explosionSound = document.getElementById('explosion-sound');
const enemySpawnSound = document.getElementById('enemy-spawn-sound');
const enemyShootSound = document.getElementById('enemy-shoot-sound');
const bombDropSound = document.getElementById('bomb-drop-sound');
const enemyDeathSound = document.getElementById('enemy-death-sound');

// Game variables
const colors = ['#d82222', '#FFEB3B', '#2a9b2e', '#197ac9', '#9C27B0'];
const ballImages = {
    '#d82222': 'images/ball-red.png',
    '#FFEB3B': 'images/ball-yellow.png',
    '#2a9b2e': 'images/ball-green.png',
    '#197ac9': 'images/ball-blue.png',
    '#9C27B0': 'images/ball-purple.png'
};
const starImage = 'images/star.png';

let isPlaying = false;
let isPaused = false;
let score = 0;
let combo = 0;
let lives = 3;
let currentLevel = 1;
let unlockedLevels = 1;
let completedLevels = [];
let hasShield = false;
let shieldElement = null;
let currentEnemyType = null;
let activeEnemy = null;
let bulletsHitOnEnemy = 0;
let currentGunColor = colors[0];
let bullets = [];
let balls = [];
let enemies = [];
let enemyBullets = [];
let bombs = [];
let gameLoopId;
let isDragging = false;
let dragOffsetX = 0;
let bulletCounter = 0;
let lastBallTime = 0;
let lastColorChangeTime = 0;
let lastFireTime = 0;
let lastEnemySpawnTime = 0;
let lastEnemyShootTime = 0;
let lastBombDropTime = 0;
let lastShieldSpawnTime = 0;
let lastFrameTime = performance.now();
let lastPerformanceCheck = 0;
let frameCount = 0;
let fps = 60;
let isMusicMuted = false;



// Simplified level structure with one enemy type per level
const levels = [
    { // Level 1 - Basic introduction
        target: 200,
        ballSpeed: 1.0,
        ballInterval: 1400,
        bg: 'bg/bg-0.jpg',
        bonusChance: 0.10,
        enemyType: null, // No enemies in level 1
        enemySpawnRate: 0,
        enemyDuration: 0
    },
    { // Level 2 - Basic enemies
        target: 400,
        ballSpeed: 1.2,
        ballInterval: 1300,
        bg: 'bg/bg-1.png',
        bonusChance: 0.07,
        enemyType: 'basic',
        enemySpawnRate: 0.003,
        enemyDuration: 10000 // 10 seconds
    },
    {
        // Level 3 - Faster basic enemies with more frequent spawns
        target: 700,
        ballSpeed: 1.4,
        ballInterval: 1100,
        bg: 'bg/bg-2.png',
        bonusChance: 0.1,
        enemyType: 'basic',
        enemySpawnRate: 0.008,
        enemyDuration: 8000,
        enemySpeed: 1.3
    },
    { // Level 4 - Shooter enemies
        target: 800,
        ballSpeed: 1.6,
        ballInterval: 900,
        bg: 'bg/bg-4.png',
        bonusChance: 0.12,
        enemyType: 'shooter',
        enemySpawnRate: 0.007,
        enemyDuration: 15000 // 15 seconds
    },
    { // Level 5 - More frequent enemies
        target: 900,
        ballSpeed: 1.8,
        ballInterval: 800,
        bg: 'bg/bg-3.png',
        bonusChance: 0.15,
        enemyType: 'shooter',
        enemySpawnRate: 0.01,
        enemyDuration: 12000 // 12 seconds
    },
    { // Level 6 - Bomber enemies
        target: 1000,
        ballSpeed: 2.0,
        ballInterval: 700,
        bg: 'bg/bg-5.png',
        bonusChance: 0.18,
        enemyType: 'bomber',
        enemySpawnRate: 0.012,
        enemyDuration: 10000 // Reduced from 15 to 10 seconds
    },
    { // Level 7 - Shield power-up
        target: 1200,
        ballSpeed: 2.2,
        ballInterval: 600,
        bg: 'bg/bg-07.jpg',
        bonusChance: 0.2,
        enemyType: 'bomber',
        enemySpawnRate: 0.015,
        enemyDuration: 8000 // Reduced to 8 seconds
    },
    { // Level 8 - Fast and furious
        target: 1500,
        ballSpeed: 2.4,
        ballInterval: 500,
        bg: 'bg/bg-8.png',
        bonusChance: 0.22,
        enemyType: 'shooter',
        enemySpawnRate: 0.018,
        enemyDuration: 10000
    },
    { // Level 9 - Chaos mode (just faster)
        target: 1000,
        ballSpeed: 2.6,
        ballInterval: 1200,
        bg: 'bg/bg-9.png',
        bonusChance: 0.25,
        enemyType: 'bomber',
        enemySpawnRate: 0.02,
        enemyDuration: 7000 // Reduced to 7 seconds
    },
    { // Level 10 - Final boss
        target: 1000,
        ballSpeed: 2.0,
        ballInterval: 500,
        bg: 'bg/bg-10.png',
        bonusChance: 0.3,
        enemyType: 'shooter',
        enemySpawnRate: 0.025,
        enemyDuration: 15000
    }
];
const levelInstructions = [
    "Match bullet colors to balls! Wrong colors lose lives.",
    "Enemies appear! Shoot them to destroy.",
    "Faster enemies! They change direction quickly.",
    "Snipers shoot at you! Dodge their bullets.",
    "More aggressive snipers! Faster attacks!",
    "Bombers drop explosives & can't be killed! Avoid the blast!",
    "Shields available! Temporary protection.",
    "Ultra-fast snipers! Extreme challenge!",
    "Bomber frenzy! Multiple explosives!",
    "FINAL BOSS! Survive the onslaught!"
];

function init() {
    // Load saved progress
    loadProgress();

    // Force validation immediately to fix any bad state
    validateProgress();

    // Initialize audio
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    bgMusic.muted = isMusicMuted; // Set initial mute state

    // Ensure all sounds have initial mute state
    toggleAllSounds(isMusicMuted);

    // Set music toggle button initial state
    musicToggle.textContent = isMusicMuted ? '🔇' : '🎵';

    // Audio interaction handling
    document.addEventListener('click', () => {
        // Only try to play if not muted
        if (!isMusicMuted) {
            bgMusic.play().catch(e => console.log("Music autoplay blocked:", e));
        }
    }, { once: true });

    setupEventListeners();
}
function setupEventListeners() {
    startBtn.addEventListener('click', () => {
        playClickSound();
        showLevelsScreen();
    });

    restartBtn.addEventListener('click', () => {
        playClickSound();
        restartCurrentLevel();
    });


    restartLevelBtn.addEventListener('click', () => {
        playClickSound();
        restartCurrentLevel();
    });

    nextLevelBtn.addEventListener('click', () => {
        playClickSound();
        startNextLevel();
    });

    backToMenuBtn.addEventListener('click', () => {
        playClickSound();
        showMainMenu();
    });

    // Replace your current menu button listeners with these:
    menuBtn.addEventListener('click', () => {
        playClickSound();

        // First reset game state
        isPlaying = false;
        cancelAnimationFrame(gameLoopId);
        clearGameElements();

        // Then show levels screen
        showLevelsScreen();

        // Ensure game over screen is hidden
        gameOverScreen.style.display = 'none';
    });

    menuBtnLevel.addEventListener('click', () => {
        playClickSound();

        // First reset game state
        isPlaying = false;
        cancelAnimationFrame(gameLoopId);
        clearGameElements();

        // Then show levels screen
        showLevelsScreen();

        // Ensure level complete screen is hidden
        levelCompleteScreen.style.display = 'none';
    });

    menuBtnQuit.addEventListener('click', () => {
        playClickSound();
        // Stop the game and reset state
        isPlaying = false;
        isPaused = false;
        cancelAnimationFrame(gameLoopId);
        clearGameElements();

        // Restore sound state - fixes the music stopping bug when quitting
        toggleAllSounds(isMusicMuted);

        pauseScreen.style.display = 'none';
        showLevelsScreen();
    });

    // Update your pause/resume button setup
    pauseBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event bubbling
        console.log('Pause button clicked');
        playClickSound();
        togglePause();
    });

    resumeBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event bubbling
        console.log('Resume button clicked');
        playClickSound();
        togglePause();
    });

    musicToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event bubbling
        console.log('Music toggle clicked, current state:', isMusicMuted);

        isMusicMuted = !isMusicMuted;

        // Toggle all sounds
        const allAudio = document.querySelectorAll('audio');
        allAudio.forEach(audio => {
            audio.muted = isMusicMuted;
        });

        // Update button text
        musicToggle.textContent = isMusicMuted ? '🔇' : '🎵';

        // Play click sound only if we're unmuting
        if (!isMusicMuted) {
            playClickSound();
        }

        console.log('New music state:', isMusicMuted);
    });

    // Gun dragging
    gun.addEventListener('touchstart', handleDragStart);
    gun.addEventListener('mousedown', handleDragStart);
    document.addEventListener('touchmove', handleDragMove);
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('touchend', handleDragEnd);
    document.addEventListener('mouseup', handleDragEnd);
    // Update your JavaScript to handle the modal:
    const resetModal = document.getElementById('reset-confirm-modal');

    document.getElementById('reset-progress-btn').addEventListener('click', () => {
        playClickSound();
        resetModal.classList.add('active');
    });

    document.getElementById('confirm-reset-btn').addEventListener('click', () => {
        playClickSound();
        localStorage.removeItem('colorBlasterProgress');
        localStorage.removeItem('colorBlasterHighScores');
        localStorage.removeItem('colorBlasterStars');
        unlockedLevels = 1;
        completedLevels = [];
        currentLevel = 1;
        saveProgress(); // Ensure currentLevel 1 is saved to storage
        createLevelsScreen();
        resetModal.classList.remove('active');
    });

    document.getElementById('cancel-reset-btn').addEventListener('click', () => {
        playClickSound();
        resetModal.classList.remove('active');
    });

    // Close modal when clicking outside content
    resetModal.addEventListener('click', (e) => {
        if (e.target === resetModal) {
            playClickSound();
            resetModal.classList.remove('active');
        }
    });
}

function handleDragStart(e) {
    if (!isPlaying || isPaused) return;

    isDragging = true;
    const gunRect = gun.getBoundingClientRect();
    const clientX = e.clientX || e.touches[0].clientX;
    dragOffsetX = clientX - gunRect.left;

    e.preventDefault();
}

function handleDragMove(e) {
    if (!isDragging || !isPlaying || isPaused) return;

    const clientX = e.clientX || e.touches[0].clientX;
    let newX = clientX - dragOffsetX;

    newX = Math.max(0, Math.min(window.innerWidth - gun.offsetWidth, newX));

    gun.style.left = `${newX}px`;
    gun.style.transform = 'none';

    e.preventDefault();
}

function handleDragEnd() {
    isDragging = false;
}

function showMainMenu() {
    isPlaying = false;
    isPaused = false;
    cancelAnimationFrame(gameLoopId);
    clearGameElements();

    gameOverScreen.style.display = 'none';
    levelCompleteScreen.style.display = 'none';
    levelsScreen.style.display = 'none';
    pauseScreen.style.display = 'none';
    startScreen.style.display = 'flex';
}

function togglePause() {
    console.log('Toggle pause called, isPlaying:', isPlaying, 'isPaused:', isPaused); // Debug

    if (!isPlaying) return;

    isPaused = !isPaused;

    if (isPaused) {
        console.log('Pausing game...');
        pauseScreen.style.display = 'flex';
        cancelAnimationFrame(gameLoopId);
        // Also pause audio
        toggleAllSounds(true);
    } else {
        console.log('Resuming game...');
        pauseScreen.style.display = 'none';
        // Resume audio if not muted
        if (!isMusicMuted) {
            toggleAllSounds(false);
        }
        startGameLoop();
    }
}

function showLevelsScreen() {
    startScreen.style.display = 'none';
    createLevelsScreen();
    levelsScreen.style.display = 'flex';

    // Strictly scroll to Level 1 at the bottom
    setTimeout(() => {
        const level1Btn = document.querySelector('.level-btn[data-level="1"]');
        if (level1Btn) {
            // Using 'center' with a longer timeout is more reliable across browsers
            level1Btn.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }, 300);
}



// Level instructions functions
function showLevelInstructions(levelNum) {
    document.getElementById('instruction-level-num').textContent = levelNum;
    document.getElementById('instruction-text').textContent =
        levelInstructions[levelNum - 1] || "Complete the level!";

    document.getElementById('level-instructions').style.display = 'flex';
    levelsScreen.style.display = 'none';
    levelCompleteScreen.style.display = 'none';

    document.getElementById('continue-btn').onclick = function () {
        playClickSound();
        document.getElementById('level-instructions').style.display = 'none';

        // Now start the actual level
        isPlaying = true;
        currentLevel = levelNum;
        score = 0;
        combo = 0;
        lives = 3;
        hasShield = false;
        currentEnemyType = null;
        activeEnemy = null;
        bulletsHitOnEnemy = 0;

        if (shieldElement) {
            shieldElement.remove();
            shieldElement = null;
        }

        clearGameElements();
        updateDisplays();
        loadLevel(levelNum);
        startGameLoop();
    };
}

// Level progression functions
function startSpecificLevel(levelNum) {
    if (levelNum > unlockedLevels) return;
    showLevelInstructions(levelNum);
}

function startNextLevel() {
    currentLevel++;
    if (currentLevel > unlockedLevels) return;
    showLevelInstructions(currentLevel);
}


function startGame() {
    isPlaying = true;
    isPaused = false;
    score = 0;
    combo = 0;
    lives = 3;
    currentGunColor = colors[0];
    hasShield = false;
    currentEnemyType = null;
    activeEnemy = null;
    bulletsHitOnEnemy = 0;

    if (shieldElement) {
        shieldElement.remove();
        shieldElement = null;
    }

    clearGameElements();
    updateDisplays();
    gun.style.left = '50%';
    gun.style.transform = 'translateX(-50%)';

    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    levelCompleteScreen.style.display = 'none';
    pauseScreen.style.display = 'none';

    // Start from current level (not always level 1)
    loadLevel(currentLevel);
    startGameLoop();
}

function restartCurrentLevel() {
    isPlaying = true;
    isPaused = false;
    score = 0;
    combo = 0;
    lives = 3;
    hasShield = false;
    currentEnemyType = null;
    activeEnemy = null;
    bulletsHitOnEnemy = 0;

    if (shieldElement) {
        shieldElement.remove();
        shieldElement = null;
    }

    clearGameElements();
    updateDisplays();

    if (gameOverScreen.style.display === 'flex') {
        gameOverScreen.style.display = 'none';
    } else if (levelCompleteScreen.style.display === 'flex') {
        levelCompleteScreen.style.display = 'none';
    }

    loadLevel(currentLevel);
    startGameLoop();
}



function clearGameElements() {
    while (bulletContainer.firstChild) {
        bulletContainer.removeChild(bulletContainer.firstChild);
    }
    while (ballContainer.firstChild) {
        ballContainer.removeChild(ballContainer.firstChild);
    }
    while (enemyContainer.firstChild) {
        enemyContainer.removeChild(enemyContainer.firstChild);
    }
    bullets = [];
    balls = [];
    enemies = [];
    enemyBullets = [];
    bombs = [];
}

function updateDisplays() {
    scoreDisplay.textContent = `Score: ${score}`;
    comboDisplay.style.opacity = '0';
    levelDisplay.textContent = `Level: ${currentLevel}`;
    gunColor.style.backgroundColor = currentGunColor;

    livesDisplay.innerHTML = '';
    for (let i = 0; i < lives; i++) {
        const life = document.createElement('div');
        life.className = 'life';
        livesDisplay.appendChild(life);
    }
}

function startGameLoop() {
    lastBallTime = performance.now();
    lastColorChangeTime = performance.now();
    lastFireTime = performance.now();
    lastEnemySpawnTime = performance.now();
    lastEnemyShootTime = performance.now();
    lastBombDropTime = performance.now();
    lastShieldSpawnTime = performance.now();
    lastFrameTime = performance.now();
    lastPerformanceCheck = performance.now();
    frameCount = 0;
    gameLoopId = requestAnimationFrame(gameLoop);
}

function loadLevel(levelNum) {
    const level = levels[levelNum - 1];
    document.getElementById('current-target-display').textContent =
        `Target: ${level.target}`;
    if (!level) return;
    currentLevel = levelNum;
    gameContainer.style.backgroundImage = `url('${level.bg}')`;
    levelDisplay.textContent = `Level: ${currentLevel}`;

    if (levelNum === 1) {
        levelTarget.textContent = `Score ${level.target} points to complete Level 1!`;
    } else {
        nextLevelDisplay.textContent = levelNum;
        if (levelNum <= levels.length) {
            nextLevelTarget.textContent = `Score ${level.target} points to complete Level ${levelNum}!`;
        } else {
            nextLevelTarget.textContent = "You've completed all levels!";
        }
    }
}

function playClickSound() {
    clickSound.currentTime = 0;
    clickSound.play().catch(e => console.log("Audio play failed:", e));
}

function gameLoop(timestamp) {
    if (!isPlaying || isPaused) return;

    // Performance monitoring
    frameCount++;
    if (timestamp >= lastPerformanceCheck + 1000) {
        fps = Math.round((frameCount * 1000) / (timestamp - lastPerformanceCheck));
        frameCount = 0;
        lastPerformanceCheck = timestamp;
    }

    const delta = Math.min((timestamp - lastFrameTime) / 16.67, 2.5);
    lastFrameTime = timestamp;

    const currentLevelConfig = levels[currentLevel - 1];

    // Change gun color periodically
    if (timestamp - lastColorChangeTime > 5000) {
        currentGunColor = colors[Math.floor(Math.random() * colors.length)];
        gunColor.style.backgroundColor = currentGunColor;
        lastColorChangeTime = timestamp;
    }

    // Automatic firing
    if (timestamp - lastFireTime > 300) {
        fireBullet();
        lastFireTime = timestamp;
    }

    // Generate balls
    if (timestamp - lastBallTime > currentLevelConfig.ballInterval) {
        createBall();
        lastBallTime = timestamp;
    }

    // Enemy spawning and management
    if (currentLevelConfig.enemyType &&
        !activeEnemy &&
        timestamp - lastEnemySpawnTime > 3000 &&
        Math.random() < currentLevelConfig.enemySpawnRate) {

        createEnemy(currentLevelConfig.enemyType);
        lastEnemySpawnTime = timestamp;

        // Set automatic despawn timer for enemy
        setTimeout(() => {
            if (activeEnemy && activeEnemy.element.parentNode) {
                activeEnemy.element.remove();
                activeEnemy = null;
                currentEnemyType = null;
            }
        }, currentLevelConfig.enemyDuration);

        // Show spawn notification
        const notification = document.createElement('div');
        notification.className = 'enemy-spawn-notification';
        // Replace the notification.textContent line with:
        let enemyName = "";
        switch (currentLevelConfig.enemyType) {
            case 'basic':
                enemyName = "DROID ATTACKING!";
                break;
            case 'shooter':
                enemyName = "SNIPER ALERT!";
                break;
            case 'bomber':
                enemyName = "BOMBER INCOMING!";
                break;
            default:
                enemyName = "ENEMY APPROACHING!";
        }
        notification.textContent = enemyName;
        gameContainer.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);

        enemySpawnSound.currentTime = 0;
        enemySpawnSound.play().catch(e => { });
    }

    // Shield power-up
    if (currentLevel >= 7 &&
        !hasShield &&
        timestamp - lastShieldSpawnTime > 15000 &&
        Math.random() < 0.01) {
        createShield();
        lastShieldSpawnTime = timestamp;
    }

    // Enemy actions
    if (activeEnemy) {
        // Move enemy
        const moveAmount = 1 * delta;

        if (activeEnemy.direction === 'left') {
            activeEnemy.x -= moveAmount;
            if (activeEnemy.x < 0) {
                activeEnemy.direction = 'right';
                activeEnemy.x = 0;
            }
        } else {
            activeEnemy.x += moveAmount;
            const maxX = window.innerWidth - activeEnemy.element.offsetWidth;
            if (activeEnemy.x > maxX) {
                activeEnemy.direction = 'left';
                activeEnemy.x = maxX;
            }
        }

        // Only update DOM if position changed significantly
        if (Math.abs(activeEnemy.x - activeEnemy.lastRenderedX) > 2) {
            activeEnemy.element.style.left = `${activeEnemy.x}px`;
            activeEnemy.lastRenderedX = activeEnemy.x;
        }

        // Bomber enemy drops bombs every 2 seconds
        if (activeEnemy.type === 'bomber' &&
            timestamp - lastBombDropTime > 2000) {
            createBomb(activeEnemy.x + activeEnemy.element.offsetWidth / 2,
                activeEnemy.y + activeEnemy.element.offsetHeight);
            lastBombDropTime = timestamp;

            bombDropSound.currentTime = 0;
            bombDropSound.play().catch(e => { });
        }

        // Shooter enemy fires bullets every 6 seconds
        if (activeEnemy.type === 'shooter' &&
            timestamp - lastEnemyShootTime > 6000) {
            createEnemyBullet(activeEnemy.x + activeEnemy.element.offsetWidth / 2,
                activeEnemy.y + activeEnemy.element.offsetHeight);
            lastEnemyShootTime = timestamp;

            enemyShootSound.currentTime = 0;
            enemyShootSound.play().catch(e => { });
        }
    }

    // Update bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];

        if (!bullet.element || !bullet.element.parentNode) {
            bullets.splice(i, 1);
            continue;
        }

        bullet.y -= 12 * delta;
        bullet.element.style.top = `${bullet.y}px`;

        // Check collision with balls
        let bulletHit = false;
        for (let j = balls.length - 1; j >= 0; j--) {
            const ball = balls[j];
            const bulletRect = bullet.element.getBoundingClientRect();
            const ballRect = ball.element.getBoundingClientRect();

            const collision = checkCollision(
                bulletRect.left + bulletRect.width / 2,
                bulletRect.top + bulletRect.height / 2,
                ballRect.left + ballRect.width / 2,
                ballRect.top + ballRect.height / 2,
                ballRect.width / 2
            );

            if (collision) {
                if (bullet.color === ball.color || ball.isBonus) {
                    ball.element.classList.add('bounce');
                    setTimeout(() => {
                        ball.element.classList.remove('bounce');
                    }, 300);

                    if (ball.isBonus) {
                        score += 50;
                        createParticles(
                            ballRect.left + ballRect.width / 2,
                            ballRect.top + ballRect.height / 2,
                            '#FFEB3B',
                            20
                        );
                    } else {
                        combo++;
                        score += 10 * combo;
                        createParticles(
                            ballRect.left + ballRect.width / 2,
                            ballRect.top + ballRect.height / 2,
                            ball.color,
                            15
                        );
                    }
                    showCombo();

                    setTimeout(() => {
                        if (ball.element.parentNode) {
                            ball.element.remove();
                        }
                    }, 100);
                    popSound.currentTime = 0;
                    popSound.play().catch(e => { });
                    popSound.volume = 0.4;
                    balls.splice(j, 1);
                }

                bulletHit = true;
                break;
            }
        }

        // Check collision with active enemy
        if (activeEnemy && !bulletHit) {
            const bulletRect = bullet.element.getBoundingClientRect();
            const enemyRect = activeEnemy.element.getBoundingClientRect();

            const collision = checkCollision(
                bulletRect.left + bulletRect.width / 2,
                bulletRect.top + bulletRect.height / 2,
                enemyRect.left + enemyRect.width / 2,
                enemyRect.top + enemyRect.height / 2,
                enemyRect.width / 2
            );

            if (collision) {
                // Bomber enemies can't be killed
                if (activeEnemy.type === 'bomber') {
                    bulletHit = true;
                }
                // Shooter enemies take 4 hits to kill
                else if (activeEnemy.type === 'shooter') {
                    bulletsHitOnEnemy++;

                    activeEnemy.element.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        if (activeEnemy && activeEnemy.element) {
                            activeEnemy.element.style.transform = 'scale(1)';
                        }
                    }, 100);

                    if (bulletsHitOnEnemy >= 4) {
                        destroyEnemy();
                    }
                    bulletHit = true;
                }
                // Basic enemies die in one hit
                else if (activeEnemy.type === 'basic') {
                    // Show explosion effect
                    createParticles(
                        enemyRect.left + enemyRect.width / 2,
                        enemyRect.top + enemyRect.height / 2,
                        '#FF0000',
                        15
                    );

                    // Play death sound
                    enemyDeathSound.currentTime = 0;
                    enemyDeathSound.play().catch(e => { });

                    // Remove enemy from game
                    if (activeEnemy.element.parentNode) {
                        activeEnemy.element.remove();
                    }
                    activeEnemy = null;
                    currentEnemyType = null;

                    // Add score and update display
                    score += 30;
                    updateScore();

                    bulletHit = true;
                }
            }


        }

        if (bulletHit || bullet.y < -30) {
            if (bullet.element && bullet.element.parentNode) {
                bullet.element.remove();
            }
            bullets.splice(i, 1);
            if (!bulletHit) resetCombo();
        }
    }

    // Update enemy bullets
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        const eBullet = enemyBullets[i];
        eBullet.y += eBullet.speed * delta;
        eBullet.element.style.top = `${eBullet.y}px`;

        const bulletRect = eBullet.element.getBoundingClientRect();
        const gunRect = gun.getBoundingClientRect();

        if (checkCollision(
            bulletRect.left + bulletRect.width / 2,
            bulletRect.top + bulletRect.height / 2,
            gunRect.left + gunRect.width / 2,
            gunRect.top + gunRect.height / 2,
            Math.max(bulletRect.width / 2, gunRect.width / 2)
        )) {
            if (!hasShield) {
                loseLife();
            }

            if (eBullet.element.parentNode) {
                eBullet.element.remove();
            }
            enemyBullets.splice(i, 1);
            continue;
        }

        if (eBullet.y > window.innerHeight + 50) {
            if (eBullet.element.parentNode) {
                eBullet.element.remove();
            }
            enemyBullets.splice(i, 1);
        }
    }

    // Update bombs
    for (let i = bombs.length - 1; i >= 0; i--) {
        const bomb = bombs[i];
        bomb.y += bomb.speed * delta;
        bomb.element.style.top = `${bomb.y}px`;

        const bombRect = bomb.element.getBoundingClientRect();
        const gunRect = gun.getBoundingClientRect();

        if (checkCollision(
            bombRect.left + bombRect.width / 2,
            bombRect.top + bombRect.height / 2,
            gunRect.left + gunRect.width / 2,
            gunRect.top + gunRect.height / 2,
            Math.max(bombRect.width / 2, gunRect.width / 2)
        )) {
            if (!hasShield) {
                loseLife();
                loseLife();
            }

            createParticles(
                bombRect.left + bombRect.width / 2,
                bombRect.top + bombRect.height / 2,
                '#FF0000',
                30
            );

            explosionSound.currentTime = 0;
            explosionSound.play().catch(e => { });

            if (bomb.element.parentNode) {
                bomb.element.remove();
            }
            bombs.splice(i, 1);
            continue;
        }

        if (bomb.y > window.innerHeight + 50) {
            if (bomb.element.parentNode) {
                bomb.element.remove();
            }
            bombs.splice(i, 1);
        }
    }

    // Move balls
    for (let i = balls.length - 1; i >= 0; i--) {
        const ball = balls[i];
        ball.velocity = (ball.velocity || 0) + 0.01 * delta;
        ball.y += (currentLevelConfig.ballSpeed + ball.velocity) * delta;

        ball.element.style.top = `${ball.y}px`;

        const ballRect = ball.element.getBoundingClientRect();
        const gunRect = gun.getBoundingClientRect();

        if (checkCollision(
            ballRect.left + ballRect.width / 2,
            ballRect.top + ballRect.height / 2,
            gunRect.left + gunRect.width / 2,
            gunRect.top + gunRect.height / 2,
            Math.max(ballRect.width / 2, gunRect.width / 2)
        )) {
            ball.element.classList.add('bounce');
            setTimeout(() => {
                ball.element.classList.remove('bounce');
            }, 300);

            if (ball.color !== currentGunColor && !hasShield) {
                loseLife();
            } else {
                score += 5;
                updateScore();
            }

            setTimeout(() => {
                if (ball.element.parentNode) {
                    ball.element.remove();
                }
            }, 100);
            balls.splice(i, 1);
            continue;
        }

        if (ball.y > window.innerHeight + 100) {
            if (ball.element.parentNode) {
                ball.element.remove();
            }
            balls.splice(i, 1);
        }
    }

    // Update shield position if active
    if (hasShield && shieldElement) {
        const gunRect = gun.getBoundingClientRect();
        shieldElement.style.left = `${gunRect.left - (shieldElement.offsetWidth - gunRect.width) / 2}px`;
        shieldElement.style.top = `${gunRect.top - (shieldElement.offsetHeight - gunRect.height) / 2}px`;
    }

    updateScore();

    if (score >= currentLevelConfig.target) {
        levelComplete();
        return;
    }

    gameLoopId = requestAnimationFrame(gameLoop);
}

// Add this helper function outside your game loop
function destroyEnemy() {
    const enemyRect = activeEnemy.element.getBoundingClientRect();
    createParticles(
        enemyRect.left + enemyRect.width / 2,
        enemyRect.top + enemyRect.height / 2,
        '#FF0000',
        20
    );

    enemyDeathSound.currentTime = 0;
    enemyDeathSound.play().catch(e => { });

    if (activeEnemy.element.parentNode) {
        activeEnemy.element.remove();
    }
    activeEnemy = null;
    currentEnemyType = null;
    bulletsHitOnEnemy = 0;
    score += 30;
    updateScore();
}
function checkCollision(x1, y1, x2, y2, radius) {
    const dx = x1 - x2;
    const dy = y1 - y2;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < radius;
}

function createParticles(x, y, color, count) {
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.backgroundColor = color;
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';

        const size = Math.random() * 8 + 4;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';

        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 100 + 50;
        const dx = Math.cos(angle) * (Math.random() * 150);
        const dy = Math.sin(angle) * (Math.random() * 150);

        gameContainer.appendChild(particle);

        particle.animate([
            { transform: 'translate(0, 0)', opacity: 1 },
            { transform: `translate(${dx}px, ${dy}px)`, opacity: 0 }
        ], {
            duration: 500 + Math.random() * 500,
            easing: 'ease-out'
        }).onfinish = () => particle.remove();
    }
}

function fireBullet() {
    fireSound.currentTime = 0;
    fireSound.play().catch(e => { });

    const bullet = document.createElement('div');
    bullet.className = 'bullet';
    bullet.style.backgroundColor = currentGunColor;

    const gunRect = gun.getBoundingClientRect();
    const gunCenterX = gunRect.left + gunRect.width / 2;
    const gunTop = gunRect.top;

    bullet.style.left = `${gunCenterX - 12.5}px`;
    bullet.style.top = `${gunTop}px`;

    bulletContainer.appendChild(bullet);
    bullets.push({
        element: bullet,
        x: gunCenterX - 12.5,
        y: gunTop,
        color: currentGunColor,
        id: ++bulletCounter
    });
}

function createBall() {
    const ball = document.createElement('div');
    ball.className = 'ball';

    const x = 50 + Math.random() * (window.innerWidth - 100);
    const color = colors[Math.floor(Math.random() * colors.length)];
    const currentLevelConfig = levels[currentLevel - 1];
    const isBonus = Math.random() < currentLevelConfig.bonusChance;

    ball.style.left = `${x}px`;
    ball.style.top = '-7vmin';
    ball.style.backgroundColor = color;
    ball.style.backgroundImage = `url('${isBonus ? starImage : ballImages[color]}')`;

    if (isBonus) {
        ball.classList.add('star');
    }

    ballContainer.appendChild(ball);
    balls.push({
        element: ball,
        x: x,
        y: -70,
        color: color,
        isBonus: isBonus,
        velocity: 0
    });
}

function createEnemy(type) {
    const enemyElement = document.createElement('div');
    enemyElement.className = `enemy ${type}`;
    enemyElement.style.left = '0';
    enemyElement.style.top = '50px';

    enemyContainer.appendChild(enemyElement);

    const x = Math.random() * (window.innerWidth - 100);
    activeEnemy = {
        element: enemyElement,
        x: x,
        y: 50,
        type: type,
        direction: Math.random() > 0.5 ? 'left' : 'right',
        lastRenderedX: x
    };

    enemyElement.style.left = `${x}px`;
    return activeEnemy;
}

function createEnemyBullet(x, y) {
    const bullet = document.createElement('div');
    bullet.className = 'enemy-bullet';
    bullet.style.left = `${x - 15}px`;
    bullet.style.top = `${y}px`;

    enemyContainer.appendChild(bullet);
    enemyBullets.push({
        element: bullet,
        x: x - 15,
        y: y,
        speed: 5
    });
}

function createBomb(x, y) {
    const bomb = document.createElement('div');
    bomb.className = 'bomb';
    bomb.style.left = `${x - 40}px`;
    bomb.style.top = `${y}px`;

    enemyContainer.appendChild(bomb);
    bombs.push({
        element: bomb,
        x: x - 40,
        y: y,
        speed: 3
    });
}

function createShield() {
    if (hasShield || shieldElement) return;

    const gunRect = gun.getBoundingClientRect();
    shieldElement = document.createElement('div');
    shieldElement.className = 'shield';
    shieldElement.style.left = `${gunRect.left - (shieldElement.offsetWidth - gunRect.width) / 2}px`;
    shieldElement.style.top = `${gunRect.top - (shieldElement.offsetHeight - gunRect.height) / 2}px`;

    gameContainer.appendChild(shieldElement);
    hasShield = true;

    setTimeout(() => {
        if (shieldElement && shieldElement.parentNode) {
            shieldElement.remove();
        }
        shieldElement = null;
        hasShield = false;
    }, 10000);
}

// Add this function AFTER your other functions
function validateProgress() {
    // Strict validation: Level N is unlocked ONLY if Level N-1 is completed
    let validUnlocked = 1;

    // Sanity Check: Ensure completed levels actually have a high score
    // This fixes the issue where Level 1 appears completed without playing
    const highScores = getHighScores();
    completedLevels = completedLevels.filter(level => {
        // Keep level if it has a high score > 0
        return highScores[level] && highScores[level] > 0;
    });

    // Check consecutive completion
    for (let i = 1; i < levels.length; i++) {
        if (completedLevels.includes(i)) {
            validUnlocked = i + 1;
        } else {
            // If level i is not completed, we cannot have i+1 unlocked
            break;
        }
    }

    // Force reset if no levels completed
    if (completedLevels.length === 0) {
        validUnlocked = 1;
    }

    // Update unlockedLevels if it exceeds the valid limit
    if (unlockedLevels > validUnlocked) {
        unlockedLevels = validUnlocked;
    }

    // Ensure we don't exceed level count
    if (unlockedLevels > levels.length) {
        unlockedLevels = levels.length;
    }

    // Remove any invalid completed levels (e.g. levels that don't exist)
    completedLevels = completedLevels.filter(level =>
        level >= 1 && level <= levels.length
    );

    // Save the corrected state immediately
    saveProgress();
}

// Optional: Track high scores per level
function getHighScores() {
    return JSON.parse(localStorage.getItem('colorBlasterHighScores')) || {};
}

function saveHighScore(level, score, stars = 0) {
    const highScores = getHighScores();
    if (!highScores[level] || score > highScores[level]) {
        highScores[level] = score;
        localStorage.setItem('colorBlasterHighScores', JSON.stringify(highScores));
    }

    // Save stars rating if provided
    if (stars > 0) {
        const allStars = JSON.parse(localStorage.getItem('colorBlasterStars')) || {};
        if (!allStars[level] || stars > allStars[level]) {
            allStars[level] = stars;
            localStorage.setItem('colorBlasterStars', JSON.stringify(allStars));
        }
    }
}

// UPDATE your loadProgress function to include validation:
function loadProgress() {
    const savedProgress = localStorage.getItem('colorBlasterProgress');
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        unlockedLevels = progress.unlockedLevels || 1;
        completedLevels = progress.completedLevels || [];
        currentLevel = progress.currentLevel || 1;

        // Add this validation:
        validateProgress();
    }
}

// UPDATE your saveProgress function:
function saveProgress() {
    // Add validation before saving:
    // Avoid infinite recursion by checking if called from validateProgress
    // validateProgress calls saveProgress, so we don't call it here to avoid loop
    // Instead we rely on validateProgress being called at key points (init, level complete)

    const progress = {
        unlockedLevels: unlockedLevels,
        completedLevels: completedLevels,
        currentLevel: currentLevel,
        timestamp: new Date().toISOString()
    };

    localStorage.setItem('colorBlasterProgress', JSON.stringify(progress));
}

// UPDATE your createLevelsScreen function with the missing logic:
// Helper to determine stars based on score
function getStarsForScore(levelIndex, score) {
    const allStars = JSON.parse(localStorage.getItem('colorBlasterStars')) || {};
    return allStars[levelIndex + 1] || 0;
}

function createLevelsScreen() {
    // Validate progress before showing levels to ensure lock states are correct
    validateProgress();

    levelsContainer.innerHTML = '';
    const highScores = getHighScores();

    for (let i = 1; i <= levels.length; i++) {
        const btn = document.createElement('button');
        btn.className = 'level-btn';
        btn.setAttribute('data-level', i);

        // Add level title label near planet
        const levelTitle = document.createElement('div');
        levelTitle.className = 'level-title';
        levelTitle.textContent = `LEVEL ${i}`;
        btn.appendChild(levelTitle);

        // Add planet image
        const planetImg = document.createElement('img');
        planetImg.src = `images/planets/p${i}.png`;
        planetImg.className = 'planet-img';
        btn.appendChild(planetImg);

        // Add stars based on high score
        const starContainer = document.createElement('div');
        starContainer.className = 'level-stars';

        const score = highScores[i] || 0;
        const starCount = getStarsForScore(i - 1, score);

        for (let s = 1; s <= 3; s++) {
            const star = document.createElement('div');
            star.className = s <= starCount ? 'star filled' : 'star empty';
            starContainer.appendChild(star);
        }
        btn.appendChild(starContainer);

        if (i > unlockedLevels) {
            btn.classList.add('locked');
            btn.disabled = true;
        } else if (completedLevels.includes(i)) {
            btn.classList.add('completed');
        }

        if (i === currentLevel && unlockedLevels >= i) {
            btn.classList.add('current-level');
        }

        btn.addEventListener('click', () => {
            if (i <= unlockedLevels) {
                playClickSound();
                setTimeout(() => {
                    startSpecificLevel(i);
                }, 150);
            }
        });

        levelsContainer.appendChild(btn);
    }

    // Optional: Add these functions if you want the zigzag connections:
    // addMapMarkers();
    // setTimeout(() => createZigzagConnections(), 50);
}

// OPTIONAL: Add marker functions if you want them:
function addMapMarkers() {
    // Remove existing markers first
    document.querySelectorAll('.start-marker, .end-marker').forEach(el => el.remove());

    // Add START marker
    const startMarker = document.createElement('div');
    startMarker.className = 'start-marker';
    startMarker.textContent = 'START';
    levelsContainer.appendChild(startMarker);

    // Add END marker
    const endMarker = document.createElement('div');
    endMarker.className = 'end-marker';
    endMarker.textContent = 'FINISH';
    levelsContainer.insertBefore(endMarker, levelsContainer.firstChild);
}

// OPTIONAL: Add zigzag connection function:
function createZigzagConnections() {
    const levelButtons = document.querySelectorAll('.level-btn');
    const containerRect = levelsContainer.getBoundingClientRect();

    // Remove any existing connectors
    document.querySelectorAll('.zigzag-connector').forEach(el => el.remove());

    // Create zigzag lines between levels
    for (let i = 0; i < levelButtons.length - 1; i++) {
        const currentBtn = levelButtons[i];
        const nextBtn = levelButtons[i + 1];

        const currentRect = currentBtn.getBoundingClientRect();
        const nextRect = nextBtn.getBoundingClientRect();

        // Calculate positions
        const currentX = currentRect.left - containerRect.left + currentRect.width / 2;
        const currentY = currentRect.top - containerRect.top + currentRect.height / 2;
        const nextX = nextRect.left - containerRect.left + nextRect.width / 2;
        const nextY = nextRect.top - containerRect.top + nextRect.height / 2;

        // Calculate distance and angle
        const dx = nextX - currentX;
        const dy = nextY - currentY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        // Create connection line
        const connector = document.createElement('div');
        connector.className = 'zigzag-connector';
        connector.style.width = `${distance}px`;
        connector.style.left = `${currentX}px`;
        connector.style.top = `${currentY}px`;
        connector.style.transform = `rotate(${angle}deg)`;
        connector.style.transformOrigin = '0 0';

        // Insert before first button
        levelsContainer.insertBefore(connector, levelButtons[0]);
    }
}

function showCombo() {
    if (combo > 1) {
        comboDisplay.textContent = `COMBO x${combo}!`;
        comboDisplay.style.opacity = '1';
        setTimeout(() => {
            comboDisplay.style.opacity = '0';
        }, 1000);
    }
    updateScore();
}

function resetCombo() {
    combo = 0;
}

function loseLife() {
    lives--;
    resetCombo();

    looseSound.currentTime = 0;
    looseSound.volume = 0.7;
    looseSound.play().catch(e => { });

    if (livesDisplay.children.length > 0) {
        livesDisplay.removeChild(livesDisplay.children[livesDisplay.children.length - 1]);
    }

    gun.style.backgroundColor = '#f72585';
    setTimeout(() => {
        gun.style.backgroundColor = 'transparent';
    }, 300);

    if (lives <= 0) {
        endGame(false);
    }
}

function updateScore() {
    document.getElementById('score-display').textContent = `Score: ${score}`;
}
function levelComplete() {
    isPlaying = false;
    cancelAnimationFrame(gameLoopId);
    clearGameElements();

    // Only add to completedLevels if not already there
    if (!completedLevels.includes(currentLevel)) {
        completedLevels.push(currentLevel);
        // Sort to maintain order
        completedLevels.sort((a, b) => a - b);
    }

    // Unlock the next level if it exists
    if (currentLevel === unlockedLevels && currentLevel < levels.length) {
        unlockedLevels++;
    }

    // Save high score and stars (based on lives) for this level
    saveHighScore(currentLevel, score, lives);

    // Validate and save progress
    validateProgress();
    saveProgress();

    levelScore.textContent = score;

    if (currentLevel < levels.length) {
        nextLevelDisplay.textContent = currentLevel + 1;
        nextLevelTarget.textContent = `Score ${levels[currentLevel].target} points to complete Level ${currentLevel + 1}!`;
    } else {
        nextLevelDisplay.textContent = currentLevel;
        nextLevelTarget.textContent = "You've completed all levels!";
    }

    levelCompleteScreen.style.display = 'flex';
}
function endGame(isWin = false) {
    isPlaying = false;
    cancelAnimationFrame(gameLoopId);

    if (isWin) {
        document.querySelector('#game-over h1').textContent = 'VICTORY!';
    } else {
        document.querySelector('#game-over h1').textContent = 'GAME OVER';
    }

    finalScore.textContent = score;
    reachedLevel.textContent = currentLevel;
    gameOverScreen.style.display = 'flex';

    const gunRect = gun.getBoundingClientRect();
    createParticles(
        gunRect.left + gunRect.width / 2,
        gunRect.top + gunRect.height / 2,
        isWin ? '#4cc9f0' : '#f72585',
        50
    );
}

function toggleAllSounds(muted) {
    const allAudio = document.querySelectorAll('audio');
    allAudio.forEach(audio => {
        audio.muted = muted;
    });
    console.log('All sounds muted:', muted);
}