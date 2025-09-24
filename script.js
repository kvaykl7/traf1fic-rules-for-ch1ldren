const gameData = [
    {
        question: "На какой сигнал светофора пешеходу можно переходить дорогу?",
        options: ["Красный", "Жёлтый", "Зелёный", "Синий"],
        correct: 2
    },
    {
        question: "Где безопаснее всего переходить дорогу?",
        options: ["Где удобно", "Только по пешеходному переходу", "Между машинами", "По газону"],
        correct: 1
    },
    {
        question: "Что нужно сделать перед началом перехода?",
        options: ["Посмотреть в телефон", "Побежать", "Посмотреть налево и направо", "Закрыть глаза"],
        correct: 2
    },
    {
        question: "Какой знак указывает место для перехода пешеходов?",
        options: ["Стоп", "Пешеходный переход", "Опасный поворот", "Парковка"],
        correct: 1
    },
    {
        question: "Можно ли перебегать дорогу перед близко едущей машиной?",
        options: ["Да", "Нет", "Только днём", "Только с друзьями"],
        correct: 1
    },
    {
        question: "Что означает красный сигнал светофора?",
        options: ["Идти можно", "Идти нельзя", "Можно бежать", "Можно только стоять на дороге"],
        correct: 1
    },
    {
        question: "Где надо ждать, пока загорится зелёный?",
        options: ["На проезжей части", "На разделительной полосе", "На тротуаре/у края дороги", "На зебре"],
        correct: 2
    },
    {
        question: "Можно ли переходить дорогу на перекрёстке по диагонали?",
        options: ["Да", "Нет", "Только ночью", "Только днём"],
        correct: 1
    },
    {
        question: "Что должен сделать водитель на знак ‘Стоп’?",
        options: ["Проехать быстрее", "Остановиться", "Посигналить", "Поморгать фарами"],
        correct: 1
    },
    {
        question: "Нужно ли снимать наушники при переходе?",
        options: ["Нет", "Да, чтобы лучше слышать", "Только зимой", "Только если идёшь один"],
        correct: 1
    }
];

// Переменные для викторины
let currentQuestion = 0;
let score = 0;
let gameStarted = false;

// DOM элементы для викторины
let startGameBtn;
let nextQuestionBtn;
let questionElement;
let optionsElement;
let scoreElement;
let questionNumberElement;
let resultElement;

// Переменные для симулятора
let simulatorActive = false;
let simulatorScore = 0;
let simulatorLevel = 1;
let simulatorTime = 60;
let currentLight = 'red';
let vehicles = [];
let pedestrians = [];
let gameInterval;
let timeInterval;

// DOM элементы для симулятора
let simulatorSection;
let simulatorScoreElement;
let simulatorLevelElement;
let simulatorTimeElement;
let gameTrafficLight;
let redLight;
let yellowLight;
let greenLight;
let vehiclesContainer;
let pedestriansContainer;
let startSimulatorBtn;
let pauseSimulatorBtn;
let stopSimulatorBtn;

// Функции викторины
function startGame() {
    console.log('Начинаем викторину!');
    gameStarted = true;
    currentQuestion = 0;
    score = 0;
    updateScore();
    showQuestion();
    startGameBtn.style.display = 'none';
    nextQuestionBtn.style.display = 'none';
    resultElement.style.display = 'none';
    nextQuestionBtn.onclick = null;
    nextQuestionBtn.textContent = 'Следующий вопрос';
}

function showQuestion() {
    if (currentQuestion >= gameData.length) {
        endGame();
        return;
    }

    const questionData = gameData[currentQuestion];
    questionElement.textContent = questionData.question;
    questionNumberElement.textContent = currentQuestion + 1;
    
    optionsElement.innerHTML = '';
    
    questionData.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = option;
        optionElement.addEventListener('click', () => selectOption(index));
        // Accessibility and haptics
        optionElement.setAttribute('role', 'button');
        optionElement.setAttribute('tabindex', '0');
        optionElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectOption(index);
            }
        });
        optionsElement.appendChild(optionElement);
    });
}

function selectOption(selectedIndex) {
    const questionData = gameData[currentQuestion];
    const options = optionsElement.querySelectorAll('.option');
    
    options.forEach(option => {
        option.style.pointerEvents = 'none';
    });
    
    options.forEach((option, index) => {
        if (index === questionData.correct) {
            option.classList.add('correct');
        } else if (index === selectedIndex && index !== questionData.correct) {
            option.classList.add('incorrect');
        }
    });
    
    if (selectedIndex === questionData.correct) {
        score++;
        updateScore();
        showResult('Правильно! 🎉', 'success');
        // Haptic feedback (success)
        if (navigator.vibrate) navigator.vibrate(30);
    } else {
        showResult(`Неправильно! Правильный ответ: ${questionData.options[questionData.correct]}`, 'error');
        // Haptic feedback (error)
        if (navigator.vibrate) navigator.vibrate([20, 40, 20]);
    }
    
    if (currentQuestion < gameData.length - 1) {
        nextQuestionBtn.textContent = 'Следующий вопрос';
        nextQuestionBtn.style.display = 'inline-block';
    } else {
        nextQuestionBtn.textContent = 'Завершить игру';
        nextQuestionBtn.style.display = 'inline-block';
        nextQuestionBtn.onclick = () => {
            endGame();
        };
    }
}

function showResult(message, type) {
    resultElement.textContent = message;
    resultElement.className = `result ${type}`;
    resultElement.style.display = 'block';
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion >= gameData.length) {
        endGame();
        return;
    }
    nextQuestionBtn.style.display = 'none';
    resultElement.style.display = 'none';
    nextQuestionBtn.onclick = null;
    nextQuestionBtn.textContent = 'Следующий вопрос';
    showQuestion();
}

function updateScore() {
    scoreElement.textContent = score;
}

function endGame() {
    const percentage = Math.round((score / gameData.length) * 100);
    let message = '';
    let type = '';
    
    if (percentage >= 90) {
        message = `Отлично! Вы набрали ${score} из ${gameData.length} баллов (${percentage}%) - Вы настоящий знаток ПДД! 🏆`;
        type = 'success';
    } else if (percentage >= 70) {
        message = `Хорошо! Вы набрали ${score} из ${gameData.length} баллов (${percentage}%) - Неплохие знания! 👍`;
        type = 'success';
    } else if (percentage >= 50) {
        message = `Удовлетворительно! Вы набрали ${score} из ${gameData.length} баллов (${percentage}%) - Есть куда расти! 📚`;
        type = 'error';
    } else {
        message = `Попробуйте еще раз! Вы набрали ${score} из ${gameData.length} баллов (${percentage}%) - Изучите правила лучше! 📖`;
        type = 'error';
    }
    
    questionElement.textContent = 'Игра завершена!';
    optionsElement.innerHTML = '';
    questionNumberElement.textContent = gameData.length;
    nextQuestionBtn.style.display = 'none';
    showResult(message, type);
    
    // Блок запуска игры "Юный пешеход"
    const unlockContainer = document.createElement('div');
    unlockContainer.style.cssText = 'display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1.25rem; align-items: center;';
    if (percentage >= 50) {
        const congratsMessage = document.createElement('div');
        congratsMessage.innerHTML = '<p style="margin: 0.5rem 0; color: #667eea; font-weight: bold;">🎉 Поздравляем! Игра "Юный пешеход" разблокирована.</p>';
        unlockContainer.appendChild(congratsMessage);
        const openPedestrianGameBtn = document.createElement('button');
        openPedestrianGameBtn.textContent = 'Играть в "Юный пешеход" 🚸';
        openPedestrianGameBtn.className = 'game-button';
        openPedestrianGameBtn.style.cssText = 'background: linear-gradient(45deg, #22c55e, #16a34a);';
        openPedestrianGameBtn.onclick = function() {
            const section = document.getElementById('pedestrian-game');
            if (section) {
                section.style.display = 'block';
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        };
        unlockContainer.appendChild(openPedestrianGameBtn);
    } else {
        const needMoreMsg = document.createElement('div');
        needMoreMsg.innerHTML = '<p style="margin-top: 0.5rem; color: #666; font-style: italic;">🚸 Игра "Юный пешеход" откроется при результате 50% и выше.</p>';
        unlockContainer.appendChild(needMoreMsg);
    }
    resultElement.appendChild(unlockContainer);
    
    startGameBtn.textContent = 'Играть снова';
    startGameBtn.style.display = 'inline-block';
}

// Функции
function startRacingGame() {
    simulatorSection.style.display = 'block';
    simulatorSection.scrollIntoView({ behavior: 'smooth' });
}

function initSimulator() {
    simulatorActive = true;
    simulatorScore = 0;
    simulatorLevel = 1;
    simulatorTime = 60;
    currentLight = 'red';
    vehicles = [];
    pedestrians = [];
    
    updateSimulatorUI();
    startSimulatorBtn.style.display = 'none';
    pauseSimulatorBtn.style.display = 'inline-block';
    stopSimulatorBtn.style.display = 'inline-block';
    
    setTrafficLight('red');
    
    gameInterval = setInterval(gameLoop, 100);
    timeInterval = setInterval(updateTimer, 1000);
    
    document.addEventListener('keydown', handleSimulatorKeyPress);
}

function gameLoop() {
    if (!simulatorActive) return;
    
    if (Math.random() < 0.02) {
        spawnVehicle();
    }
    if (Math.random() < 0.01) {
        spawnPedestrian();
    }
    
    moveVehicles();
    movePedestrians();
    checkViolations();
}

function spawnVehicle() {
    const vehicleTypes = ['🚗', '🚕', '🚙', '🚌', '🚛'];
    const randomType = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
    
    const vehicle = {
        type: randomType,
        id: Date.now(),
        element: null,
        x: -50,
        y: 50,
        speed: 1 + Math.random() * 2,
        moving: false
    };
    
    vehicles.push(vehicle);
    createVehicleElement(vehicle);
}

function createVehicleElement(vehicle) {
    const element = document.createElement('div');
    element.className = 'vehicle';
    element.textContent = vehicle.type;
    element.style.left = vehicle.x + 'px';
    element.style.top = vehicle.y + '%';
    element.id = 'vehicle-' + vehicle.id;
    
    vehiclesContainer.appendChild(element);
    vehicle.element = element;
}

function spawnPedestrian() {
    const pedestrianTypes = ['🚶', '🚶‍♀️', '🚶‍♂️'];
    const randomType = pedestrianTypes[Math.floor(Math.random() * pedestrianTypes.length)];
    
    const pedestrian = {
        type: randomType,
        id: Date.now(),
        element: null,
        x: Math.random() < 0.5 ? 0 : 100,
        y: 100,
        speed: 0.5 + Math.random(),
        moving: false
    };
    
    pedestrians.push(pedestrian);
    createPedestrianElement(pedestrian);
}

function createPedestrianElement(pedestrian) {
    const element = document.createElement('div');
    element.className = 'pedestrian';
    element.textContent = pedestrian.type;
    element.style.left = pedestrian.x + '%';
    element.style.top = pedestrian.y + '%';
    element.id = 'pedestrian-' + pedestrian.id;
    
    pedestriansContainer.appendChild(element);
    pedestrian.element = element;
}

function moveVehicles() {
    vehicles.forEach((vehicle, index) => {
        if (currentLight === 'green' && !vehicle.moving) {
            vehicle.moving = true;
            vehicle.element.classList.add('moving');
        } else if (currentLight === 'red' && vehicle.moving) {
            vehicle.moving = false;
            vehicle.element.classList.remove('moving');
        }
        
        if (vehicle.moving) {
            vehicle.x += vehicle.speed;
            vehicle.element.style.left = vehicle.x + 'px';
        }
        
        if (vehicle.x > 1000) {
            if (vehicle.element) {
                vehicle.element.remove();
            }
            vehicles.splice(index, 1);
            simulatorScore += 10;
        }
    });
}

function movePedestrians() {
    pedestrians.forEach((pedestrian, index) => {
        if (currentLight === 'red' && !pedestrian.moving) {
            pedestrian.moving = true;
            pedestrian.element.classList.add('moving');
        } else if (currentLight === 'green' && pedestrian.moving) {
            pedestrian.moving = false;
            pedestrian.element.classList.remove('moving');
        }
        
        if (pedestrian.moving) {
            if (pedestrian.x === 0) {
                pedestrian.x += pedestrian.speed;
            } else {
                pedestrian.x -= pedestrian.speed;
            }
            pedestrian.element.style.left = pedestrian.x + '%';
        }
        
        if (pedestrian.x < -10 || pedestrian.x > 110) {
            if (pedestrian.element) {
                pedestrian.element.remove();
            }
            pedestrians.splice(index, 1);
            simulatorScore += 5;
        }
    });
}

function checkViolations() {
    vehicles.forEach(vehicle => {
        if (currentLight === 'red' && vehicle.moving) {
            simulatorScore -= 20;
            showSimulatorMessage('Нарушение! Транспорт проехал на красный!', 'error');
        }
    });
    
    pedestrians.forEach(pedestrian => {
        if (currentLight === 'green' && pedestrian.moving) {
            simulatorScore -= 15;
            showSimulatorMessage('Нарушение! Пешеход переходит на зеленый!', 'error');
        }
    });
}

function setTrafficLight(light) {
    currentLight = light;
    
    redLight.classList.remove('active');
    yellowLight.classList.remove('active');
    greenLight.classList.remove('active');
    
    if (light === 'red') {
        redLight.classList.add('active');
    } else if (light === 'yellow') {
        yellowLight.classList.add('active');
    } else if (light === 'green') {
        greenLight.classList.add('active');
    }
}

function handleSimulatorKeyPress(event) {
    if (!simulatorActive) return;
    
    const key = event.key.toLowerCase();
    if (key === 'r') {
        setTrafficLight('red');
    } else if (key === 'y') {
        setTrafficLight('yellow');
    } else if (key === 'g') {
        setTrafficLight('green');
    }
}

function updateSimulatorUI() {
    simulatorScoreElement.textContent = simulatorScore;
    simulatorLevelElement.textContent = simulatorLevel;
    simulatorTimeElement.textContent = simulatorTime;
}

function updateTimer() {
    simulatorTime--;
    updateSimulatorUI();
    
    if (simulatorTime <= 0) {
        endSimulator();
    }
}

function showSimulatorMessage(message, type) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.style.cssText = `
        position: fixed;
        top: 20%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${type === 'error' ? '#ff4444' : '#44ff44'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        font-weight: bold;
        z-index: 1000;
    `;
    
    document.body.appendChild(messageElement);
    
    setTimeout(() => {
        messageElement.remove();
    }, 2000);
}

function pauseSimulator() {
    simulatorActive = false;
    clearInterval(gameInterval);
    clearInterval(timeInterval);
    document.removeEventListener('keydown', handleSimulatorKeyPress);
    
    startSimulatorBtn.style.display = 'inline-block';
    pauseSimulatorBtn.style.display = 'none';
}

function stopSimulator() {
    simulatorActive = false;
    clearInterval(gameInterval);
    clearInterval(timeInterval);
    document.removeEventListener('keydown', handleSimulatorKeyPress);
    
    vehicles.forEach(vehicle => {
        if (vehicle.element) {
            vehicle.element.remove();
        }
    });
    pedestrians.forEach(pedestrian => {
        if (pedestrian.element) {
            pedestrian.element.remove();
        }
    });
    
    vehicles = [];
    pedestrians = [];
    
    startSimulatorBtn.style.display = 'inline-block';
    pauseSimulatorBtn.style.display = 'none';
    stopSimulatorBtn.style.display = 'none';
    
    const finalScore = simulatorScore;
    let message = '';
    if (finalScore >= 500) {
        message = `Отлично! Вы набрали ${finalScore} очков! Вы отличный регулировщик! 🏆`;
    } else if (finalScore >= 300) {
        message = `Хорошо! Вы набрали ${finalScore} очков! Неплохая работа! 👍`;
    } else {
        message = `Попробуйте еще раз! Вы набрали ${finalScore} очков. Изучите ПДД лучше! 📚`;
    }
    
    showSimulatorMessage(message, finalScore >= 300 ? 'success' : 'error');
}

function endSimulator() {
    stopSimulator();
}

// Анимация светофора на главной странице
function animateTrafficLight() {
    const lights = document.querySelectorAll('.hero .light');
    let currentLight = 0;
    
    setInterval(() => {
        lights.forEach(light => {
            light.style.background = '#555';
            light.style.boxShadow = 'none';
        });
        
        lights[currentLight].style.background = 
            currentLight === 0 ? '#ff4444' : 
            currentLight === 1 ? '#ffaa00' : '#44ff44';
        lights[currentLight].style.boxShadow = 
            currentLight === 0 ? '0 0 20px #ff4444' : 
            currentLight === 1 ? '0 0 20px #ffaa00' : '0 0 20px #44ff44';
        
        currentLight = (currentLight + 1) % 3;
    }, 2000);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен, инициализируем элементы...');
    
    // Инициализируем элементы викторины
    startGameBtn = document.getElementById('startGame');
    nextQuestionBtn = document.getElementById('nextQuestion');
    questionElement = document.getElementById('question');
    optionsElement = document.getElementById('options');
    scoreElement = document.getElementById('score');
    questionNumberElement = document.getElementById('questionNumber');
    resultElement = document.getElementById('result');
    
    // Инициализируем элементы симулятора
    simulatorSection = document.getElementById('racing-game');
    simulatorScoreElement = document.getElementById('simulatorScore');
    simulatorLevelElement = document.getElementById('simulatorLevel');
    simulatorTimeElement = document.getElementById('simulatorTime');
    gameTrafficLight = document.getElementById('gameTrafficLight');
    redLight = document.getElementById('redLight');
    yellowLight = document.getElementById('yellowLight');
    greenLight = document.getElementById('greenLight');
    vehiclesContainer = document.getElementById('vehicles');
    pedestriansContainer = document.getElementById('pedestrians');
    startSimulatorBtn = document.getElementById('startSimulator');
    pauseSimulatorBtn = document.getElementById('pauseSimulator');
    stopSimulatorBtn = document.getElementById('stopSimulator');
    
    // Проверяем, что все элементы найдены
    if (!startGameBtn) {
        console.error('Элемент startGame не найден!');
        return;
    }
    
    console.log('Элементы найдены, добавляем обработчики событий...');
    
    // Обработчики событий для викторины
    startGameBtn.addEventListener('click', startGame);
    nextQuestionBtn.addEventListener('click', nextQuestion);
    
    // Обработчики событий для симулятора
    if (startSimulatorBtn) {
        startSimulatorBtn.addEventListener('click', initSimulator);
    }
    if (pauseSimulatorBtn) {
        pauseSimulatorBtn.addEventListener('click', pauseSimulator);
    }
    if (stopSimulatorBtn) {
        stopSimulatorBtn.addEventListener('click', stopSimulator);
    }
    
    console.log('Обработчики событий добавлены!');
    
    // Запускаем анимацию светофора на главной странице
    animateTrafficLight();
    
    // Хелпер подсветки активной ссылки
    const setActiveLink = (id) => {
        document.querySelectorAll('nav a[href^="#"]').forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
    };

    // Инициализация активного пункта при загрузке/хеше
    const initialId = (location.hash || '#home').replace('#','');
    setActiveLink(initialId);
    window.addEventListener('hashchange', () => {
        const id = (location.hash || '#home').replace('#','');
        setActiveLink(id);
    });

    // Плавная прокрутка для навигации
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                const id = this.getAttribute('href').replace('#','');
                setActiveLink(id);
            }
        });
    });
    
    // Обработчик для кнопки "Начать игру" в hero секции
    const heroStartButton = document.querySelector('.cta-button');
    if (heroStartButton) {
        heroStartButton.addEventListener('click', function(e) {
            e.preventDefault();
            const gameSection = document.querySelector('#game');
            if (gameSection) {
                gameSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
    
    console.log('Инициализация завершена!');

    // Reveal only on hero at startup
    try {
        const heroReveal = document.querySelector('.hero.reveal');
        if (heroReveal) {
            const obs = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('reveal-visible');
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15 });
            obs.observe(heroReveal);
        }
    } catch (_) {}

    // Light parallax for hero image on scroll (mobile-friendly)
    const hero = document.querySelector('.hero-image');
    if (hero) {
        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const y = window.scrollY || 0;
                    hero.style.transform = `translateY(${Math.min(20, y * 0.06)}px)`;
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // Active nav link highlighting
    // Scroll spy (reliable highlighting)
    const sections = Array.from(document.querySelectorAll('main section[id]'));
    const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));
    const setActive = (id) => navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
    const recalcActive = () => {
        const top = window.scrollY || document.documentElement.scrollTop || 0;
        if (top < 80) { setActive('home'); return; }
        let currentId = 'home';
        for (const sec of sections) {
            const rect = sec.getBoundingClientRect();
            const y = rect.top + top; // page offset
            if (top >= y - 100) currentId = sec.id; else break;
        }
        setActive(currentId);
    };
    recalcActive();
    window.addEventListener('scroll', recalcActive, { passive: true });

    // Рейтинг 1-5 звёзд (локально)
    const ratingEl = document.getElementById('ratingStars');
    const ratingStatus = document.getElementById('ratingStatus');
    const ratingSubmit = document.getElementById('ratingSubmit');
    const ratingAvgEl = document.getElementById('ratingAvg');
    const ratingTotalEl = document.getElementById('ratingTotal');
    const barEls = { 1: document.getElementById('bar1'), 2: document.getElementById('bar2'), 3: document.getElementById('bar3'), 4: document.getElementById('bar4'), 5: document.getElementById('bar5') };
    const countEls = { 1: document.getElementById('count1'), 2: document.getElementById('count2'), 3: document.getElementById('count3'), 4: document.getElementById('count4'), 5: document.getElementById('count5') };
    let currentRating = Number(localStorage.getItem('siteRating_selected') || 0);
    let ratingStats = null;
    try { ratingStats = JSON.parse(localStorage.getItem('siteRating_stats') || 'null'); } catch(_) {}
    if (!ratingStats) ratingStats = { counts: {1:0,2:0,3:0,4:0,5:0}, total: 0, avg: 0 };

    const renderStars = (hoverValue = 0) => {
        if (!ratingEl) return;
        const stars = ratingEl.querySelectorAll('.star');
        stars.forEach(star => {
            const val = Number(star.getAttribute('data-value'));
            star.classList.toggle('active', val <= (hoverValue || currentRating));
            star.classList.toggle('hover', hoverValue && val <= hoverValue);
        });
    };
    if (ratingEl) {
        ratingEl.addEventListener('mouseover', (e) => {
            const t = e.target;
            if (t.classList.contains('star')) renderStars(Number(t.getAttribute('data-value')));
        });
        ratingEl.addEventListener('mouseout', () => renderStars(0));
        ratingEl.addEventListener('click', (e) => {
            const t = e.target;
            if (!t.classList.contains('star')) return;
            currentRating = Number(t.getAttribute('data-value'));
            localStorage.setItem('siteRating', String(currentRating));
            renderStars();
        });
        renderStars();
    }
    const recalcStats = () => {
        const totalVotes = Object.values(ratingStats.counts).reduce((a,b)=>a+b,0);
        ratingStats.total = totalVotes;
        const sum = 1*ratingStats.counts[1] + 2*ratingStats.counts[2] + 3*ratingStats.counts[3] + 4*ratingStats.counts[4] + 5*ratingStats.counts[5];
        ratingStats.avg = totalVotes ? (sum / totalVotes) : 0;
        // render
        if (ratingAvgEl) ratingAvgEl.textContent = totalVotes ? ratingStats.avg.toFixed(2) : '—';
        if (ratingTotalEl) ratingTotalEl.textContent = String(totalVotes);
        for (let i=1;i<=5;i++) {
            if (countEls[i]) countEls[i].textContent = String(ratingStats.counts[i]);
            if (barEls[i]) barEls[i].style.width = totalVotes ? (ratingStats.counts[i] / totalVotes * 100).toFixed(1) + '%' : '0%';
        }
        localStorage.setItem('siteRating_stats', JSON.stringify(ratingStats));
    };
    recalcStats();

    if (ratingSubmit) {
        ratingSubmit.addEventListener('click', () => {
            if (!currentRating) {
                ratingStatus.textContent = 'Пожалуйста, выберите оценку от 1 до 5.';
                ratingStatus.className = 'result error';
                ratingStatus.style.display = 'block';
                return;
            }
            ratingStats.counts[currentRating] += 1;
            localStorage.setItem('siteRating_selected', String(currentRating));
            recalcStats();
            ratingStatus.textContent = `Спасибо! Ваша оценка: ${currentRating} ⭐`;
            ratingStatus.className = 'result success';
            ratingStatus.style.display = 'block';
        });
    }
});

// (Убрано) JS-обработчик формы — вместо формы используется кнопка на Telegram-бота

// ------------------ Игра "Юный пешеход" ------------------
let pgArea, pgPlayer, pgMsg, pgStartBtn, pgRestartBtn;
let pgRed, pgYellow, pgGreen;
let pgCars = [];
let pgRunning = false;
let pgAnimId = 0;
let pgLastTs = 0;
let pgPlayerPos = 300; // top px
const pgMinPos = 130;  // считаем финишом чуть выше края дороги (над зеброй)
const pgMaxPos = 300;  // стартовая позиция
let pgCanCross = false;
let pgLives = 3;
// Единая сложность
let pgLightState = 'red';
let pgLightTimer = 0;
const pgLightDurations = { red: 4000, green: 5000, yellow: 2000 };
let pgPassCount = 0;
let pgStreak = 0;
let pgBest = 0;
let pgGoal = 3;
let pgAwards = { 
    a3:false, a5:false, a10:false, a20:false,
    perfect:false, night:false, speed:false
};
let pgSettings = { 
    dark:false,
    character:'👦', theme:'normal'
};
let pgStats = {
    totalCrossings: 0,
    totalTime: 0,
    violations: 0,
    perfectStreaks: 0,
    nightCrossings: 0,
    speedCrossings: 0,
    lastPlayed: null
};

// Интервалы сезонных эффектов
let pgThemeIntervals = { snow: null, rain: null, leaves: null };

// Загрузка сохранённых данных
function pgLoadSavedData() {
    try {
        const saved = localStorage.getItem('pedestrianGameData');
        if (saved) {
            const data = JSON.parse(saved);
            pgPassCount = data.passCount || 0;
            pgStreak = data.streak || 0;
            pgBest = data.best || 0;
            pgGoal = data.goal || 3;
            pgAwards = data.awards || pgAwards;
            pgSettings = data.settings || pgSettings;
            pgStats = data.stats || pgStats;
        }
    } catch (e) {
        console.log('Ошибка загрузки сохранённых данных:', e);
    }
}

// Сохранение данных
function pgSaveData() {
    try {
        const data = {
            passCount: pgPassCount,
            streak: pgStreak,
            best: pgBest,
            goal: pgGoal,
            awards: pgAwards,
            settings: pgSettings,
            stats: pgStats
        };
        localStorage.setItem('pedestrianGameData', JSON.stringify(data));
    } catch (e) {
        console.log('Ошибка сохранения данных:', e);
    }
}
// Таймеры независимого спавна по полосам
let pgSpawnAccLane1 = 0;
let pgSpawnAccLane2 = 0;
let pgSpawnIntervalLane1 = 1200;
let pgSpawnIntervalLane2 = 1400;

function pgInitDomRefs() {
    pgArea = document.getElementById('pedestrianGameArea');
    pgPlayer = document.getElementById('pgPlayer');
    pgMsg = document.getElementById('pedestrianMessage');
    pgStartBtn = document.getElementById('pedestrianStart');
    pgRestartBtn = document.getElementById('pedestrianRestart');
    pgRed = document.querySelector('#pgTrafficLight .pgLight.red');
    pgYellow = document.querySelector('#pgTrafficLight .pgLight.yellow');
    pgGreen = document.querySelector('#pgTrafficLight .pgLight.green');
    
    // Загружаем сохранённые данные
    pgLoadSavedData();
    
    const passEl = document.getElementById('pedestrianCount');
    const streakEl = document.getElementById('pedestrianStreak');
    const bestEl = document.getElementById('pedestrianBest');
    const goalEl = document.getElementById('pedestrianGoal');
    if (pgStartBtn) pgStartBtn.addEventListener('click', pgStart);
    if (pgRestartBtn) pgRestartBtn.addEventListener('click', pgStart);
    if (passEl) passEl.textContent = String(pgPassCount);
    if (streakEl) streakEl.textContent = String(pgStreak);
    if (bestEl) bestEl.textContent = String(pgBest);
    if (goalEl) goalEl.textContent = String(pgGoal);
    // Инициализируем переключатели
    const setDark = document.getElementById('pgSetDark');
    const characterSelect = document.getElementById('pgCharacterSelect');
    const themeSelect = document.getElementById('pgThemeSelect');
    
    if (setDark) { setDark.checked = pgSettings.dark; setDark.onchange = () => { pgSettings.dark = setDark.checked; document.body.classList.toggle('pg-dark', pgSettings.dark); pgSaveData(); }; document.body.classList.toggle('pg-dark', pgSettings.dark); }
    if (characterSelect) { characterSelect.value = pgSettings.character; characterSelect.onchange = () => { pgSettings.character = characterSelect.value; if (pgPlayer) pgPlayer.textContent = pgSettings.character; pgSaveData(); }; }
    if (themeSelect) { themeSelect.value = pgSettings.theme; themeSelect.onchange = () => { pgSettings.theme = themeSelect.value; pgUpdateTheme(); pgSaveData(); }; }
    const openCollection = document.getElementById('pgOpenCollection');
    if (openCollection) openCollection.onclick = () => pgOpenAwards();
    const openStats = document.getElementById('pgOpenStats');
    if (openStats) openStats.onclick = () => pgOpenStats();
    const resetProgress = document.getElementById('pgResetProgress');
    if (resetProgress) resetProgress.onclick = () => pgResetProgress();
    window.addEventListener('keydown', pgKeyHandler);
    // Экранные кнопки
    const btnUp = document.getElementById('pgBtnUp');
    const btnDown = document.getElementById('pgBtnDown');
    const btnLeft = document.getElementById('pgBtnLeft');
    const btnRight = document.getElementById('pgBtnRight');
    const bind = (el, action) => {
        if (!el) return;
        const start = (e) => { e.preventDefault(); action(); };
        el.addEventListener('click', start);
        el.addEventListener('touchstart', start, { passive: false });
    };
    bind(btnUp, () => pgMove('up'));
    bind(btnDown, () => pgMove('down'));
    bind(btnLeft, () => pgMove('left'));
    bind(btnRight, () => pgMove('right'));
}

function pgKeyHandler(e) {
    if (!pgRunning) return;
    const key = e.key.toLowerCase();
    if (['arrowup','w'].includes(key)) { e.preventDefault(); pgMove('up'); }
    else if (['arrowdown','s'].includes(key)) { e.preventDefault(); pgMove('down'); }
    else if (['arrowleft','a'].includes(key)) { e.preventDefault(); pgMove('left'); }
    else if (['arrowright','d'].includes(key)) { e.preventDefault(); pgMove('right'); }
}

function pgMove(dir) {
    if (!pgRunning) return;
    if (dir === 'up') {
        // Разрешаем движение всегда; при нарушении показываем сообщение
        if (pgPlayerPos > pgMinPos) {
            pgPlayerPos -= 30;
            pgPlayer.style.top = pgPlayerPos + 'px';
            // Если вошли на дорожную часть на красный — нарушение
            const roadTop = 140; // начало дороги
            const roadBottom = 220; // конец дороги (top + height)
            const playerOnRoad = pgPlayerPos <= roadBottom && pgPlayerPos >= pgMinPos;
            if (!pgCanCross && playerOnRoad) {
                pgShowViolation();
                return;
            }
            pgShowHint('Идёте вперёд. Следите за машинами и светофором.');
            if (pgPlayerPos <= pgMinPos) pgFinishCrossing();
        }
    } else if (dir === 'down') {
        if (pgPlayerPos < pgMaxPos) {
            pgPlayerPos += 30;
            pgPlayer.style.top = pgPlayerPos + 'px';
            pgShowHint('Отступаете назад. Ждите зелёного сигнала.');
        }
    } else if (dir === 'left') {
        // Горизонтальные шаги по 20px в пределах поля
        const cur = parseFloat(getComputedStyle(pgPlayer).left);
        const next = Math.max(6, cur - 20);
        pgPlayer.style.left = next + 'px';
    } else if (dir === 'right') {
        const cur = parseFloat(getComputedStyle(pgPlayer).left);
        const maxLeft = pgArea.clientWidth - 42; // небольшой отступ
        const next = Math.min(maxLeft, cur + 20);
        pgPlayer.style.left = next + 'px';
    }
}

function pgShowHint(text) {
    if (pgMsg) pgMsg.innerHTML = text;
}

function pgReset() {
    pgCars.forEach(c => c.remove());
    pgCars = [];
    pgPlayerPos = pgMaxPos;
    if (pgPlayer) pgPlayer.style.top = pgPlayerPos + 'px';
    pgChangeLight('red');
    pgShowHint('Правила: дождитесь зелёного сигнала и переходите стрелкой вверх. Можно отступить стрелкой вниз.');
    // Подсказка по целям
    pgShowToast(`Цель: ${pgGoal} перехода(ов) подряд без нарушений!`, 'info');
    // Сброс и установка интервалов спавна по сложностям
    const intervals = pgGetSpawnIntervals();
    pgSpawnIntervalLane1 = intervals.lane1;
    pgSpawnIntervalLane2 = intervals.lane2;
    // Поставим аккумулированное время равным интервалам, чтобы сразу заспавнить машины
    pgSpawnAccLane1 = pgSpawnIntervalLane1;
    pgSpawnAccLane2 = pgSpawnIntervalLane2;
}

function pgStart() {
    if (!pgArea) pgInitDomRefs();
    if (!pgArea) return;
    pgReset();
    pgRunning = true;
    pgLastTs = 0;
    pgStartBtn.style.display = 'none';
    pgRestartBtn.style.display = 'none';
    requestAnimationFrame(pgLoop);
}

function pgEnd(success) {
    pgRunning = false;
    cancelAnimationFrame(pgAnimId);
    if (success) {
        // Единая сложность: просто похвала и перезапуск
        pgShowPraiseBanner('Отлично! Ты справился! 🚸');
        setTimeout(() => { pgStart(); }, 1200);
    } else {
        pgStreak = 0;
        const streakEl = document.getElementById('pedestrianStreak');
        if (streakEl) streakEl.textContent = String(pgStreak);
        
        // Сохраняем данные после столкновения (сброс серии)
        pgSaveData();
        
        pgShowHint('Столкновение! Осторожнее. Попробуй ещё раз.');
        pgRestartBtn.textContent = 'Играть снова';
        pgRestartBtn.style.display = 'inline-block';
    }
    if (!success) return;
}

function pgShowPraiseBanner(text) {
    // Красивый центрированный баннер поверх поля
    const banner = document.createElement('div');
    banner.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(34,197,94,0.95);
        color: #fff;
        padding: 16px 22px;
        border-radius: 12px;
        font-weight: 700;
        text-align: center;
        z-index: 1000;
        box-shadow: 0 10px 30px rgba(0,0,0,0.25);
        white-space: pre-line;
    `;
    banner.textContent = text;
    document.body.appendChild(banner);
    setTimeout(() => banner.remove(), 1300);
}

function pgCreateCar(lane, dir, speed) {
    const car = document.createElement('div');
    car.className = 'pgCar';
    car.style.top = (lane === 1 ? 140 : 180) + 'px';
    car.style.background = ['#ef4444','#3b82f6','#22c55e','#f59e0b','#a855f7','#06b6d4'][Math.floor(Math.random()*6)];
    car.dataset.dir = String(dir);
    car.dataset.speed = String(speed);
    if (dir === 1) car.style.left = '-60px';
    else car.style.left = (pgArea.clientWidth + 60) + 'px';
    pgArea.appendChild(car);
    pgCars.push(car);
}

function pgMoveCars(delta) {
    const toRemove = [];
    pgCars.forEach(car => {
        let left = parseFloat(car.style.left);
        const dir = parseInt(car.dataset.dir, 10);
        const speed = parseFloat(car.dataset.speed);
        // Остановка перед зеброй на зелёный, иначе едем
        let effectiveSpeed = speed;
        const crosswalk = document.querySelector('.pgCrosswalk');
        if (crosswalk) {
            const cwRect = crosswalk.getBoundingClientRect();
            const carRect = car.getBoundingClientRect();
            const approachingFromLeft = dir === 1 && carRect.right <= cwRect.left;
            const approachingFromRight = dir === -1 && carRect.left >= cwRect.right;
            const isInCrosswalkX = !(carRect.right < cwRect.left || carRect.left > cwRect.right);
            // если зелёный — стоп перед зеброй, если уже на зебре — проезжаем
            if (pgCanCross && (approachingFromLeft || approachingFromRight) && !isInCrosswalkX) {
                effectiveSpeed = 0;
            }
        }
        left += dir * effectiveSpeed * (delta / 16.67);
        car.style.left = left + 'px';
        if ((dir === 1 && left > pgArea.clientWidth + 80) || (dir === -1 && left < -80)) {
            toRemove.push(car);
        }
    });
    toRemove.forEach(c => { c.remove(); pgCars = pgCars.filter(x => x !== c); });
}

function pgCheckCollision() {
    const playerRect = pgPlayer.getBoundingClientRect();
    for (const car of pgCars) {
        const r = car.getBoundingClientRect();
        if (!(playerRect.right < r.left || playerRect.left > r.right || playerRect.bottom < r.top || playerRect.top > r.bottom)) {
            return true;
        }
    }
    return false;
}

function pgUpdateTrafficLight(delta) {
    pgLightTimer += delta;
    if (pgLightState === 'red' && pgLightTimer >= pgLightDurations.red) pgChangeLight('green');
    else if (pgLightState === 'green' && pgLightTimer >= pgLightDurations.green) pgChangeLight('yellow');
    else if (pgLightState === 'yellow' && pgLightTimer >= pgLightDurations.yellow) pgChangeLight('red');
}

function pgChangeLight(state) {
    pgLightState = state;
    pgLightTimer = 0;
    pgRed.classList.toggle('on', state === 'red');
    pgYellow.classList.toggle('on', state === 'yellow');
    pgGreen.classList.toggle('on', state === 'green');
    pgCanCross = state === 'green';
}

function pgGetCarSpeed() {
    // Единая сложность (средние значения)
    return 3 + Math.random()*2.5;
}

function pgGetSpawnIntervals() {
    // Единая сложность
    return { lane1: 1000 + Math.random()*300, lane2: 1200 + Math.random()*300 };
}

function pgLoop(ts) {
    if (!pgLastTs) pgLastTs = ts;
    const delta = ts - pgLastTs;
    pgLastTs = ts;
    pgUpdateTrafficLight(delta);
    pgMoveCars(delta);
    // Независимый спавн по полосам
    pgSpawnAccLane1 += delta;
    pgSpawnAccLane2 += delta;
    if (pgSpawnAccLane1 >= pgSpawnIntervalLane1) {
        pgSpawnAccLane1 = 0;
        pgCreateCar(1, 1, pgGetCarSpeed()); // верхняя полоса: слева направо
    }
    if (pgSpawnAccLane2 >= pgSpawnIntervalLane2) {
        pgSpawnAccLane2 = 0;
        pgCreateCar(2, -1, pgGetCarSpeed()); // нижняя полоса: справа налево
    }
    if (pgCheckCollision()) {
        pgEnd(false);
        return;
    }
    pgAnimId = requestAnimationFrame(pgLoop);
}

function pgFinishCrossing() {
    // Обновляем статистику только если не в режиме тренировки
    pgPassCount += 1;
    pgStats.totalCrossings += 1;
    pgStats.lastPlayed = new Date().toISOString();
    const passEl = document.getElementById('pedestrianCount');
    if (passEl) passEl.textContent = String(pgPassCount);
    
    pgStreak += 1;
    const streakEl = document.getElementById('pedestrianStreak');
    if (streakEl) streakEl.textContent = String(pgStreak);
    
    if (pgStreak > pgBest) { 
        pgBest = pgStreak; 
        const bestEl = document.getElementById('pedestrianBest'); 
        if (bestEl) bestEl.textContent = String(pgBest); 
    }
    
    // Проверяем специальные достижения
    if (pgSettings.dark) pgStats.nightCrossings += 1;
    
    // Проверяем быстрый переход (менее 3 секунд)
    const currentTime = Date.now();
    if (pgStats.lastCrossingTime && (currentTime - pgStats.lastCrossingTime) < 3000) {
        pgStats.speedCrossings += 1;
    }
    pgStats.lastCrossingTime = currentTime;
    
    // Сохраняем данные
    pgSaveData();
    
    // Проверка цели
    if (pgStreak >= pgGoal) {
        pgStats.perfectStreaks += 1;
        pgShowPraiseBanner(`Супер! Достигнута цель: ${pgGoal} подряд! ⭐`);
        // Повышаем цель: 3 -> 5 -> 10 -> 20 -> 30 -> 50 ... (экспоненциально-ступенчато)
        if (pgGoal < 5) pgGoal = 5;
        else if (pgGoal < 10) pgGoal = 10;
        else if (pgGoal < 20) pgGoal = 20;
        else if (pgGoal < 30) pgGoal = 30;
        else if (pgGoal < 50) pgGoal = 50;
        else pgGoal += 50; // дальше растём крупными шагами
        const goalEl = document.getElementById('pedestrianGoal');
        if (goalEl) goalEl.textContent = String(pgGoal);
        
        // Сохраняем обновлённую цель
        pgSaveData();
    }
    
    // Достижения
    if (!pgAwards.a3 && pgStreak >= 3) { pgAwards.a3 = true; pgShowSticker('🏅', 'Серия ×3', 'Отличное начало!'); pgCreateParticles(window.innerWidth/2, window.innerHeight/2); }
    if (!pgAwards.a5 && pgStreak >= 5) { pgAwards.a5 = true; pgShowSticker('🥇', 'Серия ×5', 'Очень аккуратно!'); pgCreateParticles(window.innerWidth/2, window.innerHeight/2); }
    if (!pgAwards.a10 && pgStreak >= 10) { pgAwards.a10 = true; pgShowSticker('🏆', 'Серия ×10', 'Мастер переходов!'); pgCreateParticles(window.innerWidth/2, window.innerHeight/2); }
    if (!pgAwards.a20 && pgStreak >= 20) { pgAwards.a20 = true; pgShowSticker('👑', 'Серия ×20', 'Легенда безопасности!'); pgCreateParticles(window.innerWidth/2, window.innerHeight/2); }
    
    // Проверяем дополнительные достижения
    pgCheckAchievements();
    
    pgShowPraiseBanner('Отлично! Ты аккуратно перешёл дорогу! 🚸');
    // Небольшая пауза, чтобы игрок увидел баннер
    pgRunning = false;
    setTimeout(() => {
        pgStart();
    }, 900);
}

function pgShowViolation() {
    // Обновляем статистику нарушений
    pgStats.violations += 1;
    
    // Сообщение о нарушении и пауза игры до перезапуска
    pgRunning = false;
    pgShowHint('Вы нарушили правила дорожного движения, попробуйте ещё раз');
    // Сбрасываем серию
    pgStreak = 0;
    const streakEl = document.getElementById('pedestrianStreak');
    if (streakEl) streakEl.textContent = String(pgStreak);
    
    // Сохраняем данные после нарушения (сброс серии)
    pgSaveData();
    
    if (pgRestartBtn) {
        pgRestartBtn.textContent = 'Играть снова';
        pgRestartBtn.style.display = 'inline-block';
    }
}

// Всплывающая подсказка (тост)
function pgShowToast(text, type='info') {
    const toast = document.createElement('div');
    toast.textContent = text;
    toast.style.cssText = `
        position: fixed;
        bottom: 24px; left: 50%; transform: translateX(-50%);
        background: ${type==='error' ? '#dc2626' : type==='success' ? '#16a34a' : '#2563eb'};
        color: #fff; padding: 10px 16px; border-radius: 999px; font-weight: 600; z-index: 1100;
        box-shadow: 0 10px 20px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(toast);
    setTimeout(()=> toast.remove(), 1800);
}

// Стикер-попап
function pgShowSticker(emoji, title, desc) {
    const box = document.createElement('div');
    box.style.cssText = 'position: fixed; right: 16px; bottom: 16px; background: #111827; color:#fff; border-radius:14px; padding:14px 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.35); z-index:1200; max-width: 260px;';
    box.innerHTML = `<div style="font-size:36px;">${emoji}</div><div style="font-weight:700; margin-top:6px;">${title}</div><div style="font-size:13px; opacity:.85;">${desc}</div>`;
    document.body.appendChild(box);
    setTimeout(()=> box.remove(), 2200);
}

// Коллекция наград
function pgOpenAwards() {
    const section = document.getElementById('awards');
    const grid = document.getElementById('awardsGrid');
    if (!section || !grid) return;
    grid.innerHTML = '';
    const items = [
        { id:'a3', emoji:'🏅', title:'Серия ×3', desc:'Три перехода подряд без нарушений' },
        { id:'a5', emoji:'🥇', title:'Серия ×5', desc:'Пять переходов подряд без нарушений' },
        { id:'a10', emoji:'🏆', title:'Серия ×10', desc:'Десять переходов подряд без нарушений' },
        { id:'a20', emoji:'👑', title:'Серия ×20', desc:'Двадцать переходов подряд без нарушений' },
        { id:'perfect', emoji:'💎', title:'Перфекционист', desc:'50 переходов без нарушений' },
        { id:'night', emoji:'🌙', title:'Ночной пешеход', desc:'10 переходов в тёмной теме' },
        { id:'speed', emoji:'⚡', title:'Скоростной', desc:'5 быстрых переходов' }
    ];
    items.forEach(it => {
        const card = document.createElement('div');
        card.className = 'award-card' + (pgAwards[it.id] ? '' : ' locked');
        card.innerHTML = `<div class="award-sticker">${it.emoji}</div><div class="award-title">${it.title}</div><div class="award-desc">${it.desc}</div>`;
        grid.appendChild(card);
    });
    section.style.display = 'block';
    const closeBtn = document.getElementById('awardsClose');
    if (closeBtn) closeBtn.onclick = () => { section.style.display = 'none'; };
    section.scrollIntoView({ behavior:'smooth', block:'start' });
}

// Сброс прогресса
function pgResetProgress() {
    if (!confirm('Сбросить прогресс (серии, рекорды, награды и цель)?')) return;
    pgPassCount = 0; pgStreak = 0; pgBest = 0; pgGoal = 3; 
    pgAwards = { a3:false, a5:false, a10:false, a20:false, perfect:false, night:false, speed:false };
    pgStats = { totalCrossings: 0, totalTime: 0, violations: 0, perfectStreaks: 0, nightCrossings: 0, speedCrossings: 0, lastPlayed: null };
    const passEl = document.getElementById('pedestrianCount'); if (passEl) passEl.textContent = '0';
    const streakEl = document.getElementById('pedestrianStreak'); if (streakEl) streakEl.textContent = '0';
    const bestEl = document.getElementById('pedestrianBest'); if (bestEl) bestEl.textContent = '0';
    const goalEl = document.getElementById('pedestrianGoal'); if (goalEl) goalEl.textContent = '3';
    pgSaveData();
    pgShowToast('Прогресс сброшен', 'success');
}

// Туториал на первый запуск
function pgMaybeShowTutorial() {
    const shown = localStorage.getItem('pgTutorialShown');
    if (shown === '1') return;
    const el = document.getElementById('pgTutorial');
    if (!el) return;
    el.style.display = 'grid';
    const btn = document.getElementById('pgTutorialClose');
    if (btn) btn.onclick = () => { el.style.display = 'none'; localStorage.setItem('pgTutorialShown','1'); };
}

// Звуки
let sfxSuccess, sfxError;
function pgLoadSounds() {
    sfxSuccess = new Audio('data:audio/mp3;base64,//uQZAAAAAAAA...');
    sfxError = new Audio('data:audio/mp3;base64,//uQZAAAAAAAA...');
}

// Лениво инициализируем DOM для игры при первом показе секции

// Обновление темы
function pgUpdateTheme() {
    const area = document.getElementById('pedestrianGameArea');
    if (!area) return;
    // Очистка классов темы
    area.className = area.className.replace(/winter|summer|rain/g, '');
    if (pgSettings.theme !== 'normal') area.classList.add(pgSettings.theme);

    // Очищаем старые элементы и интервалы
    ['snow','rain','leaves'].forEach(k => { if (pgThemeIntervals[k]) { clearInterval(pgThemeIntervals[k]); pgThemeIntervals[k] = null; } });
    area.querySelectorAll('.snowflake,.snowbank,.sun,.leaf,.raindrop,.puddle').forEach(el => el.remove());

    const spawn = (createFn, count = 1, intervalMs = 500) => {
        // моментальный вброс
        for (let i = 0; i < count; i++) createFn();
        // периодический спавн
        return setInterval(createFn, intervalMs);
    };

    const createSnowflake = () => {
        const el = document.createElement('div');
        el.className = 'snowflake';
        el.textContent = '❄';
        const size = 12 + Math.random()*10;
        el.style.left = Math.random() * (area.clientWidth - size) + 'px';
        el.style.fontSize = size + 'px';
        el.style.animationDuration = (5 + Math.random()*4) + 's';
        area.appendChild(el);
        setTimeout(() => el.remove(), 10000);
    };

    const createLeaf = () => {
        const el = document.createElement('div');
        el.className = 'leaf';
        el.textContent = Math.random() < 0.5 ? '🍃' : '🍂';
        const size = 16 + Math.random()*10;
        el.style.left = Math.random() * (area.clientWidth - size) + 'px';
        el.style.fontSize = size + 'px';
        el.style.animationDuration = (4 + Math.random()*3) + 's';
        area.appendChild(el);
        setTimeout(() => el.remove(), 8000);
    };

    const createRaindrop = () => {
        const el = document.createElement('div');
        el.className = 'raindrop';
        el.style.left = Math.random() * (area.clientWidth - 2) + 'px';
        el.style.animationDuration = (1.2 + Math.random()*0.8) + 's';
        area.appendChild(el);
        setTimeout(() => el.remove(), 3000);
    };

    if (pgSettings.theme === 'winter') {
        const bank = document.createElement('div');
        bank.className = 'snowbank';
        area.appendChild(bank);
        pgThemeIntervals.snow = spawn(createSnowflake, 6, 600);
    } else if (pgSettings.theme === 'summer') {
        const sun = document.createElement('div');
        sun.className = 'sun';
        area.appendChild(sun);
        pgThemeIntervals.leaves = spawn(createLeaf, 3, 900);
    } else if (pgSettings.theme === 'rain') {
        const puddle = document.createElement('div');
        puddle.className = 'puddle';
        area.appendChild(puddle);
        // дождя побольше
        pgThemeIntervals.rain = spawn(() => { for (let i=0;i<6;i++) createRaindrop(); }, 12, 300);
    }
}

// Фиксированные интервалы спавна машин (единая сложность)
function pgGetSpawnIntervals() {
    return { lane1: 1000 + Math.random()*300, lane2: 1200 + Math.random()*300 };
}

// Скорость машин (единая сложность)
function pgGetCarSpeed() {
    return 3 + Math.random()*2.5;
}

// Статистика
function pgOpenStats() {
    const section = document.getElementById('stats');
    const content = document.getElementById('statsContent');
    if (!section || !content) return;
    
    content.innerHTML = `
        <div class="stat-card">
            <div class="stat-value">${pgStats.totalCrossings}</div>
            <div class="stat-label">Всего переходов</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${pgStats.perfectStreaks}</div>
            <div class="stat-label">Идеальных серий</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${pgStats.violations}</div>
            <div class="stat-label">Нарушений</div>
        </div>
    `;
    
    section.style.display = 'block';
    const closeBtn = document.getElementById('statsClose');
    if (closeBtn) closeBtn.onclick = () => { section.style.display = 'none'; };
    section.scrollIntoView({ behavior:'smooth', block:'start' });
}

// Частицы при достижениях
function pgCreateParticles(x, y) {
    const container = document.createElement('div');
    container.className = 'particles';
    container.style.left = x + 'px';
    container.style.top = y + 'px';
    document.body.appendChild(container);
    
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = (Math.random() - 0.5) * 100 + 'px';
        particle.style.top = (Math.random() - 0.5) * 100 + 'px';
        particle.style.background = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1'][Math.floor(Math.random()*4)];
        container.appendChild(particle);
    }
    
    setTimeout(() => container.remove(), 1000);
}

// Обновленные достижения
function pgCheckAchievements() {
    // Перфекционист - 50 переходов без нарушений
    if (!pgAwards.perfect && pgStreak >= 50) {
        pgAwards.perfect = true;
        pgShowSticker('💎', 'Перфекционист', '50 переходов без нарушений!');
        pgCreateParticles(window.innerWidth/2, window.innerHeight/2);
    }
    
    // Ночной пешеход - 10 переходов в тёмной теме
    if (!pgAwards.night && pgSettings.dark && pgStats.nightCrossings >= 10) {
        pgAwards.night = true;
        pgShowSticker('🌙', 'Ночной пешеход', '10 переходов в темноте!');
        pgCreateParticles(window.innerWidth/2, window.innerHeight/2);
    }
    
    // Скоростной - 5 переходов за 30 секунд
    if (!pgAwards.speed && pgStats.speedCrossings >= 5) {
        pgAwards.speed = true;
        pgShowSticker('⚡', 'Скоростной', '5 быстрых переходов!');
        pgCreateParticles(window.innerWidth/2, window.innerHeight/2);
    }
}


const pedSectionObserver = new MutationObserver(() => {
    const section = document.getElementById('pedestrian-game');
    if (section && section.style.display !== 'none') {
        pgInitDomRefs();
        pgMaybeShowTutorial();
        pedSectionObserver.disconnect();
    }
});
pedSectionObserver.observe(document.documentElement, { attributes: true, childList: true, subtree: true });
