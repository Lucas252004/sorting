// ============================================================
//  VISUALIZER — maneja el canvas y la animación
// ============================================================

// ---- Estado global ----
let globalArray = [];
let arraySize   = 40;
let speedMs     = 50;   // ms entre frames (menor = más rápido)

// Estado por algoritmo
const state = {
  selection: { running: false, generator: null, originalArray: [] },
  insertion: { running: false, generator: null, originalArray: [] },
  merge:     { running: false, generator: null, originalArray: [] },
  quick:     { running: false, generator: null, originalArray: [] },
};

// ---- Colores ----
const COLORS = {
  default:   '#2e2e45',
  comparing: '#ff4d6d',
  swapping:  '#e8ff47',
  sorted:    '#4dffbf',
  min:       '#7b61ff',
};

// ---- Generar array aleatorio ----
function generateArray(size) {
  const arr = [];
  for (let i = 0; i < size; i++) {
    arr.push(Math.floor(Math.random() * 90) + 10); // valores entre 10 y 99
  }
  return arr;
}

// ---- Dibujar en canvas ----
function drawArray(canvasId, arr, comparing = [], swapping = [], sorted = [], minIndex = -1) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Ajustar resolución al tamaño real del canvas
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width  = rect.width  * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const W = rect.width;
  const H = rect.height;

  ctx.clearRect(0, 0, W, H);

  const barWidth  = W / arr.length;
  const maxVal    = Math.max(...arr);

  arr.forEach((val, idx) => {
    const barH = (val / maxVal) * (H - 4);
    const x    = idx * barWidth;
    const y    = H - barH;

    // Determinar color
    let color = COLORS.default;
    if (sorted.includes(idx))    color = COLORS.sorted;
    if (idx === minIndex)        color = COLORS.min;
    if (comparing.includes(idx)) color = COLORS.comparing;
    if (swapping.includes(idx))  color = COLORS.swapping;

    // Dibujar barra con gap de 1px
    ctx.fillStyle = color;
    ctx.fillRect(x + 0.5, y, Math.max(barWidth - 1, 1), barH);
  });
}

// ---- Actualizar estadísticas ----
function updateStats(algo, comparisons, swaps) {
  const cmpEl = document.getElementById(`cmp-${algo}`);
  const swpEl = document.getElementById(`swp-${algo}`);
  if (cmpEl) {
    cmpEl.textContent = comparisons;
    cmpEl.classList.add('flash');
    setTimeout(() => cmpEl.classList.remove('flash'), 200);
  }
  if (swpEl) {
    swpEl.textContent = swaps;
    swpEl.classList.add('flash');
    setTimeout(() => swpEl.classList.remove('flash'), 200);
  }
}

// ---- Reset de un algoritmo ----
function resetAlgo(algo) {
  const s = state[algo];
  s.running   = false;
  s.generator = null;

  document.getElementById(`card-${algo}`)?.classList.remove('sorting');
  document.getElementById(`cmp-${algo}`).textContent = '0';
  document.getElementById(`swp-${algo}`).textContent = '0';

  // Redibujar con el array original
  if (s.originalArray.length > 0) {
    drawArray(`canvas-${algo}`, s.originalArray);
  } else {
    drawArray(`canvas-${algo}`, globalArray);
  }
}

// ---- Correr un paso del generator ----
function stepAlgo(algo) {
  const s = state[algo];
  if (!s.running || !s.generator) return;

  const result = s.generator.next();

  if (result.done) {
    s.running = false;
    document.getElementById(`card-${algo}`)?.classList.remove('sorting');
    return;
  }

  const { array, comparing, swapping, sorted, minIndex, comparisons, swaps } = result.value;
  drawArray(`canvas-${algo}`, array, comparing, swapping, sorted, minIndex);
  updateStats(algo, comparisons, swaps);

  // Calcular delay según velocidad (1=lento, 100=rápido)
  const delay = Math.max(5, 200 - speedMs * 2);
  setTimeout(() => stepAlgo(algo), delay);
}

// ---- Iniciar algoritmo ----
function startAlgo(algo) {
  const s = state[algo];
  if (s.running) return;

  // Guardar el array que se va a ordenar
  s.originalArray = [...globalArray];
  s.generator     = ALGORITHMS[algo]([...globalArray]);
  s.running       = true;

  document.getElementById(`card-${algo}`)?.classList.add('sorting');
  stepAlgo(algo);
}

// ---- Dibujar todos los canvas con el array global ----
function drawAll() {
  ['selection', 'insertion', 'merge', 'quick'].forEach(algo => {
    if (!state[algo].running) {
      drawArray(`canvas-${algo}`, globalArray);
    }
  });
}

// ---- Inicialización ----
function init() {
  globalArray = generateArray(arraySize);
  drawAll();

  // Reset stats
  ['selection', 'insertion', 'merge', 'quick'].forEach(algo => {
    document.getElementById(`cmp-${algo}`).textContent = '0';
    document.getElementById(`swp-${algo}`).textContent = '0';
    state[algo].running   = false;
    state[algo].generator = null;
  });
}

// ============================================================
//  EVENT LISTENERS
// ============================================================

// Slider de tamaño
document.getElementById('arraySize').addEventListener('input', function () {
  arraySize = parseInt(this.value);
  document.getElementById('sizeValue').textContent = arraySize;
  globalArray = generateArray(arraySize);
  drawAll();
});

// Slider de velocidad
document.getElementById('speed').addEventListener('input', function () {
  speedMs = parseInt(this.value);
  document.getElementById('speedValue').textContent = speedMs;
});

// Botón generar
document.getElementById('generateBtn').addEventListener('click', () => {
  // Detener cualquier animación activa
  Object.keys(state).forEach(algo => { state[algo].running = false; });
  init();
});

// Botones de inicio y reset por algoritmo
document.querySelectorAll('.btn-start').forEach(btn => {
  btn.addEventListener('click', () => {
    const algo = btn.dataset.algo;
    if (!state[algo].running) {
      startAlgo(algo);
    }
  });
});

document.querySelectorAll('.btn-reset').forEach(btn => {
  btn.addEventListener('click', () => {
    const algo = btn.dataset.algo;
    resetAlgo(algo);
  });
});

// Redibujar al cambiar el tamaño de la ventana
window.addEventListener('resize', () => {
  drawAll();
});

// ---- Arrancar ----
init();
