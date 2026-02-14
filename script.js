// script.js (обновлённый)

// ========== ГЛОБАЛЬНЫЕ НАСТРОЙКИ ==========
const CONFIG = {
  COLUMNS: {
    FRONT_WIDTH: 300,
    BACK_WIDTH: 150,
    ROWS: 30,
    COLS: 20,
    SPEED: 0.15,
  },
  HEART: {
    CELL_SIZE: 40,
    CANVAS_WIDTH: 1300,
    CANVAS_HEIGHT: 1000,
    TWINKLE_INTERVAL: 150,
    BEAT_SCALE: 1.1,
  },
  CRACK: {
    STEPS: 5,
    STEP_DELAY: 500,
    SHAKE_TIMES: 3,
    SHAKE_DURATION: 300,
  },
  FLASH_DURATION: 1000,
  CAROUSEL_SHOW_DELAY: 1500,
};

// ========== DOM ЭЛЕМЕНТЫ ==========
const elements = {
  backLeft: document.getElementById('backleftColumn'),
  backRight: document.getElementById('backrightColumn'),
  left: document.getElementById('leftColumn'),
  right: document.getElementById('rightColumn'),
  heart: document.getElementById('heartCanvas'),
  flash: document.getElementById('flash'),
  carousel: document.getElementById('carouselContainer'),
  body: document.body,
  
};

elements.backLeft.width = 150;
elements.backLeft.height = window.innerHeight;
elements.backRight.width = 150;
elements.backRight.height = window.innerHeight;
elements.left.width = 300;
elements.left.height = window.innerHeight;
elements.right.width = 300;
elements.right.height = window.innerHeight;
elements.heart.width = CONFIG.HEART.CANVAS_WIDTH;
elements.heart.height = CONFIG.HEART.CANVAS_HEIGHT;

// Контексты
const ctx = {
  backLeft: elements.backLeft.getContext('2d'),
  backRight: elements.backRight.getContext('2d'),
  left: elements.left.getContext('2d'),
  right: elements.right.getContext('2d'),
  heart: elements.heart.getContext('2d'),
};

// ========== СОСТОЯНИЯ ==========
const state = {
  timeOffset: 0,
  isExploding: false,
  isBeating: false,
  isCarouselVisible: false,
  twinkleInterval: null,
};

// ========== МАТРИЦЫ СТОЛБОВ ==========
const columnMatrices = {
  backLeft: [],
  backRight: [],
  left: [],
  right: [],
};

function buildColumnMatrix(rows = CONFIG.COLUMNS.ROWS, cols = CONFIG.COLUMNS.COLS) {
  const matrix = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      row.push(Math.floor(Math.random() * 10));
    }
    matrix.push(row);
  }
  return matrix;
}

// Инициализация
columnMatrices.backLeft = buildColumnMatrix();
columnMatrices.backRight = buildColumnMatrix();
columnMatrices.left = buildColumnMatrix();
columnMatrices.right = buildColumnMatrix();

// ========== СТОЛБЫ: НАСТРОЙКА И АНИМАЦИЯ ==========
function resizeColumns() {
  elements.backLeft.height = window.innerHeight;
  elements.backRight.height = window.innerHeight;
  elements.left.height = window.innerHeight;
  elements.right.height = window.innerHeight;
}
resizeColumns();
window.addEventListener('resize', resizeColumns);

function drawColumn(ctx, direction, matrix, scaleFactor = 1.0) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  ctx.clearRect(0, 0, w, h);

  const rows = matrix.length;
  const cols = matrix[0].length;
  const baseFontSize = 20 * scaleFactor;
  const a = 100 * scaleFactor;
  const b = 40 * scaleFactor;
  const startY = 40 * scaleFactor;
  const centerX = w / 2;
  const rowHeight = (h - 80 * scaleFactor) / rows;
  const angleStep = (2 * Math.PI) / cols;
  const baseAngle = 0;
  const speed = CONFIG.COLUMNS.SPEED;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const angle = baseAngle + col * angleStep + state.timeOffset * direction * speed;
      const x = centerX + a * Math.sin(angle);
      const y = startY + row * rowHeight + b * Math.cos(angle);
      const charScale = (0.5 + 0.5 * Math.cos(angle)) * scaleFactor;

      ctx.save();
      ctx.translate(x, y);
      ctx.scale(charScale, charScale);
      ctx.font = `${baseFontSize}px "Share Tech Mono", monospace`;
      ctx.fillStyle = '#0f0';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(matrix[row][col], 0, 0);
      ctx.restore();
    }
  }
}

function animateColumns() {
  drawColumn(ctx.backLeft, 1, columnMatrices.backLeft, 0.6);
  drawColumn(ctx.backRight, -1, columnMatrices.backRight, 0.6);
  drawColumn(ctx.left, 1, columnMatrices.left, 1.0);
  drawColumn(ctx.right, -1, columnMatrices.right, 1.0);
  state.timeOffset += 0.1;
  requestAnimationFrame(animateColumns);
}
animateColumns();

// ========== СЕРДЦЕ ==========
const HEART_MATRIX = [
  '       ████████         ████████       ',
  '     ████████████     ████████████     ',
  '   ████████████████ ████████████████   ',
  '  ███████████████████████████████████  ',
  '  ███████████████████████████████████  ',
  '   █████████████████████████████████   ',
  '    ███████████████████████████████    ',
  '     █████████████████████████████     ',
  '      ███████████████████████████      ',
  '       █████████████████████████       ',
  '        ███████████████████████        ',
  '         █████████████████████         ',
  '          ███████████████████          ',
  '           █████████████████           ',
  '            ███████████████            ',
  '             █████████████             ',
  '              ███████████              ',
  '               █████████               ',
  '                ███████                ',
  '                 █████                 ',
  '                  ███                  ',
  '                   █                   '
];

const SYMBOL_POOL = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'λ', 'μ', 'ξ', 'π', 'σ', 'φ', 'ψ', 'ω',
  '!', '@', '#', '$', '%', '&', '*', '+', '=', '?',
  '♥', '♦', '♣', '♠', '●', '○', '■', '□', '▲', '△', '▼', '▽',
  '░', '▒', '▓', '█'];

let heartParticles = [];

function buildHeartMatrix() {

  heartParticles = [];
  const startX = (CONFIG.HEART.CANVAS_WIDTH - HEART_MATRIX[0].length * CONFIG.HEART.CELL_SIZE) / 2;
  const startY = (CONFIG.HEART.CANVAS_HEIGHT - HEART_MATRIX.length * CONFIG.HEART.CELL_SIZE) / 2;
  HEART_MATRIX.forEach((row, rIdx) => {
    [...row].forEach((ch, cIdx) => {
      if (ch !== ' ') {
        heartParticles.push({
          x: startX + cIdx * CONFIG.HEART.CELL_SIZE + CONFIG.HEART.CELL_SIZE / 2,
          y: startY + rIdx * CONFIG.HEART.CELL_SIZE + CONFIG.HEART.CELL_SIZE / 2,
          row: rIdx,
          col: cIdx,
          char: SYMBOL_POOL[Math.floor(Math.random() * SYMBOL_POOL.length)],
          vx: 0, vy: 0,
          life: 1,
        });
      }
    });
  });
}
buildHeartMatrix();

function drawHeart() {
  ctx.heart.clearRect(0, 0, CONFIG.HEART.CANVAS_WIDTH, CONFIG.HEART.CANVAS_HEIGHT);
  ctx.heart.font = `${CONFIG.HEART.CELL_SIZE}px "Share Tech Mono", monospace`;
  ctx.heart.fillStyle = '#0f0';
  ctx.heart.textAlign = 'center';
  ctx.heart.textBaseline = 'middle';
  heartParticles.forEach(p => ctx.heart.fillText(p.char, p.x, p.y));
}
drawHeart();
// Мерцание
function startTwinkle() {
  if (state.twinkleInterval) clearInterval(state.twinkleInterval);
  state.twinkleInterval = setInterval(() => {
    if (!state.isExploding) {
      heartParticles.forEach(p => {
        if (Math.random() < 0.15) {
          p.char = SYMBOL_POOL[Math.floor(Math.random() * SYMBOL_POOL.length)];
        }
      });
      drawHeart();
    }
  }, CONFIG.HEART.TWINKLE_INTERVAL);
}
startTwinkle();

// Пульсация при наведении
elements.heart.addEventListener('mouseenter', () => {
  if (state.isExploding) return;
  state.isBeating = true;
  beatAnimation();
});

elements.heart.addEventListener('mouseleave', () => {
  state.isBeating = false;
  elements.heart.style.transform = 'translate(-50%, -50%) scale(1)';
});

function beatAnimation() {
  if (!state.isBeating || state.isExploding) return;

  sounds.beat_in.play();
  elements.heart.style.transform = `translate(-50%, -50%) scale(${CONFIG.HEART.BEAT_SCALE})`;
  setTimeout(() => {
    sounds.beat_out.play();
    elements.heart.style.transform = 'translate(-50%, -50%) scale(1)';
  }, 300);
  setTimeout(() => {
    if (state.isBeating) beatAnimation();
  }, 600);
}

// ========== ЗВУКИ ==========
const sounds = {
  background: new Audio('assets/sounds/background.mp3'),
  beat_in: new Audio('assets/sounds/heartbeat_in.mp3'),
  beat_out: new Audio('assets/sounds/heartbeat_out.mp3'),
  crack: new Audio('assets/sounds/crack.mp3'),
  flash: new Audio('assets/sounds/flash.mp3'),
  backgroundStart: new Audio('assets/sounds/background_start.mp3'),
};

// Настройка звуков (зацикливание фона, низкая громкость)
sounds.backgroundStart.loop = true;
sounds.backgroundStart.volume = 0.3;

sounds.background.loop = true;
sounds.background.volume = 0.1;
sounds.beat_in.volume = 0.6;
sounds.beat_out.volume = 0.6;
sounds.crack.volume = 0.8;
sounds.flash.volume = 0.5;

// Фон включается при первом взаимодействии с сердцем (наведение или клик)
let soundStarted = false;
function startBackgroundSound() {
  if (!soundStarted) {
    sounds.background.play().catch(() => {}); // игнорируем блокировку автовоспроизведения
    soundStarted = true;
  }
}

function initBackground() {
  const playPromise = sounds.backgroundStart.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Автовоспроизведение заблокировано – ждём первого взаимодействия
      document.addEventListener('click', function playOnFirstClick() {
        sounds.backgroundStart.play().catch(e => console.warn('Ошибка воспроизведения:', e));
        document.removeEventListener('click', playOnFirstClick);
      }, { once: true });
    });
  }
}
// Вызвать при загрузке
initBackground();

// ========== РАЗРУШЕНИЕ (КЛИК) ==========
const CRACKED_HEART_MATRIX = [
  '       ████████         █░██████       ',
  '     ░███████████     ██░░░███████     ',
  '   ███░████████████ ████████░███████   ',
  '  █████░██████████░███████████░░█████  ',
  '  █████░███████░░███████░█████░██████  ',
  '   █████░████░░███░███░██████░██████   ',
  '    ████████░████████░███████░█████    ',
  '     █████████████████░█████░████     ',
  '      ████████████░██░███████░███      ',
  '       ░░░░████████░░█████████░█       ',
  '        ███░██████░██░██░░████        ',
  '         ███░████░████░░█░████         ',
  '          ███████░███████████          ',
  '           █████░███████████           ',
  '            ███░█████░░████            ',
  '             ██░████░█████             ',
  '              ░█████░░░██              ',
  '               ░░██░██░               ',
  '                ███████                ',
  '                 █████                 ',
  '                  ███                  ',
  '                   █                   '
 ];

 const SPLIT_HEART_MATRIX = [
  '       ████████         ████████       ',
  '     ████████████     ████████████     ',
  '   ████████████████@████████████████   ',
  '  █████████████████@█████████████████  ',
  '  ████████████████@██████████████████  ',
  '   ██████████████@██████████████████   ',
  '    █████████████@█████████████████    ',
  '     █████████████@██████████████     ',
  '      ████████████@██████████████      ',
  '       ████████████@████████████       ',
  '        ███████████@██████████        ',
  '         ███████████@█████████         ',
  '          ███████████@███████          ',
  '           ███████████@█████           ',
  '            ██████████@████            ',
  '             █████████@████             ',
  '              ██████@@███              ',
  '               █████@███               ',
  '                ███@███                ',
  '                 █@███                 ',
  '                  @██                  ',
  '                   █                   '
 ];

elements.heart.addEventListener('click', () => {
  sounds.backgroundStart.pause()
  if (state.isExploding) return;
  startBackgroundSound(); // убедимся, что фон играет
  state.isExploding = true;
  state.isBeating = false;
  clearInterval(state.twinkleInterval);

  // Звук трещины
  

  // Столбы уезжают вниз
  elements.left.style.transform = 'translateY(100vh)';
  elements.right.style.transform = 'translateY(100vh)';
  elements.backLeft.style.transform = 'translateY(100vh)';
  elements.backRight.style.transform = 'translateY(100vh)';

  // Начинаем анимацию трещин
  startCrackAnimation();
});

async function startCrackAnimation() {
  const candidates = heartParticles.filter(p => {
    return CRACKED_HEART_MATRIX[p.row] && CRACKED_HEART_MATRIX[p.row][p.col] === '░';
  });

  // Сортировка от краёв к центру
  const centerX = CONFIG.HEART.CANVAS_WIDTH / 2;
  const centerY = CONFIG.HEART.CANVAS_HEIGHT / 2;
  candidates.sort((a, b) => {
    const distA = Math.hypot(a.x - centerX, a.y - centerY);
    const distB = Math.hypot(b.x - centerX, b.y - centerY);
    return distB - distA;
  });

  const total = candidates.length;
  const stepSize = Math.ceil(total / CONFIG.CRACK.STEPS);

  for (let step = 0; step < CONFIG.CRACK.STEPS; step++) {
    const start = step * stepSize;
    const end = Math.min(start + stepSize, total);
    for (let i = start; i < end; i++) {
      candidates[i].char = '█';
    }
    drawHeart();
    sounds.crack.play();
   
    await shakeHeart(CONFIG.CRACK.SHAKE_TIMES, CONFIG.CRACK.SHAKE_DURATION);

   
    if (step < CONFIG.CRACK.STEPS - 1) {
      await new Promise(resolve => setTimeout(resolve, CONFIG.CRACK.STEP_DELAY));
    }
  }


  startSplitAndFlash();
}

function shakeHeart(times, duration) {
  return new Promise(resolve => {
    let count = 0;
    const originalTransform = elements.heart.style.transform;

    function step() {
      if (count >= times) {
        elements.heart.style.transform = originalTransform;
        resolve();
        return;
      }
      const dx = (Math.random() - 0.5) * 10;
      const dy = (Math.random() - 0.5) * 10;
      elements.heart.style.transform = `translate(-50%, -50%) translate(${dx}px, ${dy}px)`;
      count++;

      setTimeout(() => {
        elements.heart.style.transform = originalTransform;
        setTimeout(step, 50);
      }, duration);
    }
    step();
  });
}

function startSplitAndFlash() {
  sounds.background.volume = 0.05
  sounds.flash.play();
  document.body.style.backgroundColor = 'white';
  document.body.style.color = 'black';
  
  elements.flash.style.opacity = '1';
  setTimeout(() => {
    elements.flash.style.opacity = '0';
  }, 500);

  const splitParticles = prepareSplitParticles();
  if (splitParticles.length === 0) {
    finishSplit();
    return;
  }

  splitHeartAnimation(splitParticles, finishSplit);
}

function finishSplit() {
  sounds.background.pause()
  elements.heart.style.display = 'none';
  elements.left.style.display = 'none';
  elements.right.style.display = 'none';
  elements.backLeft.style.display = 'none';
  elements.backRight.style.display = 'none';
  
  loadCarouselContent();
  elements.carousel.classList.remove('hidden');
}

function prepareSplitParticles() {
  const splitColMap = {};
  for (let r = 0; r < SPLIT_HEART_MATRIX.length; r++) {
    const idx = SPLIT_HEART_MATRIX[r].indexOf('@');
    splitColMap[r] = idx !== -1 ? idx : 23;
  }

  const newParticles = [];
  heartParticles.forEach(p => {
    const splitCol = splitColMap[p.row] ?? 23;
    if (p.col === splitCol) return; 
    const direction = p.col < splitCol ? -1 : 1;
    newParticles.push({
      startX: p.x,
      startY: p.y,
      char: p.char,
      direction: direction,
    });
  });
  return newParticles;
}

function splitHeartAnimation(particles, onComplete) {
  const duration = 1000;
  const offset = 200;
  const startTime = performance.now();

  function animate(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);

    ctx.heart.clearRect(0, 0, CONFIG.HEART.CANVAS_WIDTH, CONFIG.HEART.CANVAS_HEIGHT);
    ctx.heart.fillStyle = '#000000';
    ctx.heart.font = `${CONFIG.HEART.CELL_SIZE}px "Share Tech Mono", monospace`;
    ctx.heart.textAlign = 'center';
    ctx.heart.textBaseline = 'middle';

    particles.forEach(p => {
      const x = p.startX + p.direction * offset * progress;
      const y = p.startY; 
      ctx.heart.fillText(p.char, x, y);
    });

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      onComplete();
    }
  }

  requestAnimationFrame(animate);
}

// ========== МАТРИЧНЫЙ ДЕКОДЕР ДЛЯ ТЕКСТА ==========
const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
const randomChar = () => charset[Math.floor(Math.random() * charset.length)];
const randomString = (length) => Array.from({ length }, randomChar).join('');

let decodingInterval = null;

function resetDecoding() {
  const elements = document.querySelectorAll('.decoding-text');
  elements.forEach(el => {
    const target = el.getAttribute('data-target') || '';
    el.textContent = randomString(target.length);
  });

  if (decodingInterval) clearInterval(decodingInterval);
  initDecodingForSlides();
}

function initDecodingForSlides() {

  if (decodingInterval) clearInterval(decodingInterval);

  const elements = document.querySelectorAll('.decoding-text');
  if (elements.length === 0) return;


  const states = [];
  elements.forEach(el => {
    const target = el.getAttribute('data-target') || '';
    const current = randomString(target.length).split('');
    el.textContent = current.join('');
    states.push({
      element: el,
      target: target,
      current: current,
    });
  });

  decodingInterval = setInterval(() => {
    let allFinished = true;

    states.forEach(state => {
      const { element, target, current } = state;
   
      const mismatchIndices = [];
      for (let i = 0; i < target.length; i++) {
        if (current[i] !== target[i]) mismatchIndices.push(i);
      }

      if (mismatchIndices.length > 0) {
        allFinished = false;
   
        let replacements = Math.floor(Math.random() * 3) + 2;
        replacements = Math.min(replacements, mismatchIndices.length);

   
        for (let i = mismatchIndices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [mismatchIndices[i], mismatchIndices[j]] = [mismatchIndices[j], mismatchIndices[i]];
        }

      
        for (let k = 0; k < replacements; k++) {
          const idx = mismatchIndices[k];
          current[idx] = target[idx];
        }

    
        element.textContent = current.join('');
      }
    });

    if (allFinished) {
      clearInterval(decodingInterval);
      decodingInterval = null;
    }
  }, 80);
}

// ========== КАРУСЕЛЬ ==========
function loadCarouselContent() {
  const slidesContainer = document.querySelector('.slides');
  slidesContainer.innerHTML = '';

  const testPhotos = [
    { src: 'assets/photos/photo1.jpg', comment: '18.05.2024 - Мой день Рождения. Помнишь как тусили в Москва-Сити и гуляли по Царицыно?' },
    { src: 'assets/photos/photo2.jpg', comment: '31.05.2024 - Тут мы смотрели нового Майора Грома. Тебе очень не понравилась концовка...' },
    { src: 'assets/photos/photo3.jpg', comment: '27.06.2024 - Твой выпускной) Торжественная выдача аттестатов и не менее веселая ночь. Помнишь как мы сидели в автобусе и пели песни?' },
    { src: 'assets/photos/photo4.jpg', comment: 'Наши поездки друг другу на дачу. Прогулки по Калязину и окрестностям, встреча с твоей родней остались в тёплых воспоминаниях' },
    { src: 'assets/photos/photo5.jpg', comment: 'Твои поездки ко мне в Красноармейск) Как мы фоткались на полянках, смотрели на закат... А ведь сейчас в Банном лесу целый парк' },
    { src: 'assets/photos/photo6.jpg', comment: 'Наши прогулки по Москве... Где мы только не были: Москва-Сити, Остров Мечты, всевозможные парки и ТЦшки. Было весело' },
    { src: 'assets/photos/photo7.jpg', comment: 'Наше с тобой романтическое свидание с походом в ресторан в элегантных костюмах. К сожалению только одно(' },
  ];

  testPhotos.forEach(photo => {
    const slide = document.createElement('div');
    slide.className = 'slide';

    const img = document.createElement('img');
    img.src = photo.src;
    img.alt = 'Фото';

    const p = document.createElement('p');
    p.className = 'decoding-text';
    p.setAttribute('data-target', photo.comment);
    p.textContent = randomString(photo.comment.length);

    slide.appendChild(img);
    slide.appendChild(p);
    slidesContainer.appendChild(slide);
  });


  initDecodingForSlides();


  const carousel = elements.carousel;
  carousel.addEventListener('click', (e) => {
    if (e.target.classList.contains('prev')) {
      resetDecoding();
      slidesContainer.scrollBy({ left: -slidesContainer.clientWidth, behavior: 'smooth' });
    } else if (e.target.classList.contains('next')) {
      resetDecoding();
      slidesContainer.scrollBy({ left: slidesContainer.clientWidth, behavior: 'smooth' });
    }
  });
}