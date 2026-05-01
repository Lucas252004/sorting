// ============================================================
//  ALGORITHMS — cada uno es un generator function
//  Yield devuelve el estado actual para que el visualizador
//  pueda animar paso a paso.
//
//  Estado devuelto en cada yield:
//  {
//    array:      número[],   copia del array en ese momento
//    comparing:  número[],   índices que se están comparando (rojo)
//    swapping:   número[],   índices que se están swapeando (amarillo)
//    sorted:     número[],   índices ya ordenados (verde)
//    minIndex:   número,     índice del mínimo actual (violeta)
//    comparisons: número,
//    swaps:       número
//  }
// ============================================================


// ------------------------------------------------------------
//  SELECTION SORT
// ------------------------------------------------------------
function* selectionSortGen(inputArray) {
  let array = [...inputArray];
  let largo = array.length;
  let comparisons = 0;
  let swaps = 0;
  let sorted = [];

  for (let i = 0; i < largo; i++) {
    let indiceMinimo = i;

    for (let j = i + 1; j < largo; j++) {
      comparisons++;
      yield {
        array: [...array],
        comparing: [j, indiceMinimo],
        swapping: [],
        sorted: [...sorted],
        minIndex: indiceMinimo,
        comparisons,
        swaps
      };
      if (array[j] < array[indiceMinimo]) {
        indiceMinimo = j;
      }
    }

    if (indiceMinimo !== i) {
      swaps++;
      let temp = array[i];
      array[i] = array[indiceMinimo];
      array[indiceMinimo] = temp;
      yield {
        array: [...array],
        comparing: [],
        swapping: [i, indiceMinimo],
        sorted: [...sorted],
        minIndex: -1,
        comparisons,
        swaps
      };
    }

    sorted.push(i);
  }

  sorted = array.map((_, idx) => idx);
  yield {
    array: [...array],
    comparing: [],
    swapping: [],
    sorted,
    minIndex: -1,
    comparisons,
    swaps
  };
}


// ------------------------------------------------------------
//  INSERTION SORT
// ------------------------------------------------------------
function* insertionSortGen(inputArray) {
  let array = [...inputArray];
  let largo = array.length;
  let comparisons = 0;
  let swaps = 0;
  let sorted = [0];

  for (let i = 1; i < largo; i++) {
    let j = i;

    while (j > 0 && array[j] < array[j - 1]) {
      comparisons++;
      yield {
        array: [...array],
        comparing: [j, j - 1],
        swapping: [],
        sorted: [...sorted],
        minIndex: -1,
        comparisons,
        swaps
      };

      swaps++;
      let temp = array[j];
      array[j] = array[j - 1];
      array[j - 1] = temp;

      yield {
        array: [...array],
        comparing: [],
        swapping: [j, j - 1],
        sorted: [...sorted],
        minIndex: -1,
        comparisons,
        swaps
      };

      j--;
    }

    sorted.push(i);
  }

  yield {
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: array.map((_, idx) => idx),
    minIndex: -1,
    comparisons,
    swaps
  };
}


// ------------------------------------------------------------
//  MERGE SORT
//
//  Capa 1 — mergeWithSteps: ejecuta el merge y registra pasos
//  Capa 2 — mergeSortRec: recursión que llama a mergeWithSteps
//  Capa 3 — mergeSortGen: generator que reproduce los pasos
// ------------------------------------------------------------

function mergeWithSteps(izq, der, fullArray, offset, steps, comparisons, swaps) {
  let i = 0;
  let j = 0;
  let res = [];

  while (i < izq.length && j < der.length) {
    let idxI = offset + i;
    let idxJ = offset + izq.length + j;
    comparisons.val++;
    steps.push({
      array: [...fullArray],
      comparing: [idxI, idxJ],
      swapping: [],
      sorted: [],
      minIndex: -1,
      comparisons: comparisons.val,
      swaps: swaps.val
    });

    if (izq[i] <= der[j]) {
      res.push(izq[i]);
      i++;
    } else {
      res.push(der[j]);
      j++;
    }
  }

  while (i < izq.length) { res.push(izq[i]); i++; }
  while (j < der.length)  { res.push(der[j]); j++; }

  for (let k = 0; k < res.length; k++) {
    if (fullArray[offset + k] !== res[k]) {
      swaps.val++;
      fullArray[offset + k] = res[k];
    }
  }

  steps.push({
    array: [...fullArray],
    comparing: [],
    swapping: res.map((_, k) => offset + k),
    sorted: [],
    minIndex: -1,
    comparisons: comparisons.val,
    swaps: swaps.val
  });

  return res;
}

function mergeSortRec(arr, offset, steps, comparisons, swaps) {
  if (arr.length <= 1) return arr;
  let medio = Math.floor(arr.length / 2);
  let izq = arr.slice(0, medio);
  let der = arr.slice(medio);
  izq = mergeSortRec(izq, offset,         steps, comparisons, swaps);
  der = mergeSortRec(der, offset + medio, steps, comparisons, swaps);
  return mergeWithSteps(izq, der, steps.length > 0 ? steps[steps.length - 1].array : [...arr], offset, steps, comparisons, swaps);
}

function* mergeSortGen(inputArray) {
  let array = [...inputArray];
  let steps = [];
  let comparisons = { val: 0 };
  let swaps       = { val: 0 };

  mergeSortRec([...array], 0, steps, comparisons, swaps);

  for (let step of steps) {
    const isLast = step === steps[steps.length - 1];
    yield {
      ...step,
      sorted: isLast ? array.map((_, idx) => idx) : step.sorted,
    };
  }

  const lastArray = steps.length > 0 ? steps[steps.length - 1].array : array;
  yield {
    array: lastArray,
    comparing: [],
    swapping: [],
    sorted: lastArray.map((_, idx) => idx),
    minIndex: -1,
    comparisons: comparisons.val,
    swaps: swaps.val
  };
}


// ------------------------------------------------------------
//  QUICK SORT
//
//  Capa 1 — partition: Lomuto, registra comparaciones y swaps
//  Capa 2 — quickSortRec: recursión que llama a partition
//  Capa 3 — quickSortGen: generator que reproduce los pasos
// ------------------------------------------------------------

function partition(array, inicio, fin, steps, comparisons, swaps, sorted) {
  let pivote = array[fin];
  let i = inicio - 1;

  for (let j = inicio; j < fin; j++) {
    comparisons.val++;

    // Frame: comparando j con el pivote
    steps.push({
      array: [...array],
      comparing: [j, fin],
      swapping: [],
      sorted: [...sorted],
      minIndex: fin,
      comparisons: comparisons.val,
      swaps: swaps.val
    });

    if (array[j] <= pivote) {
      i++;
      swaps.val++;
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;

      // Frame: swap de elementos menores al pivote
      steps.push({
        array: [...array],
        comparing: [],
        swapping: [i, j],
        sorted: [...sorted],
        minIndex: fin,
        comparisons: comparisons.val,
        swaps: swaps.val
      });
    }
  }

  // Colocar el pivote en su posición definitiva
  swaps.val++;
  let temp = array[i + 1];
  array[i + 1] = array[fin];
  array[fin] = temp;

  let pivoteFinal = i + 1;
  sorted.push(pivoteFinal);

  // Frame: pivote en su lugar definitivo
  steps.push({
    array: [...array],
    comparing: [],
    swapping: [pivoteFinal, fin],
    sorted: [...sorted],
    minIndex: -1,
    comparisons: comparisons.val,
    swaps: swaps.val
  });

  return pivoteFinal;
}

function quickSortRec(array, inicio, fin, steps, comparisons, swaps, sorted) {
  if (inicio < fin) {
    let p = partition(array, inicio, fin, steps, comparisons, swaps, sorted);
    quickSortRec(array, inicio,     p - 1, steps, comparisons, swaps, sorted);
    quickSortRec(array, p + 1, fin,        steps, comparisons, swaps, sorted);
  } else if (inicio === fin && !sorted.includes(inicio)) {
    sorted.push(inicio);
  }
}

function* quickSortGen(inputArray) {
  let array = [...inputArray];
  let steps = [];
  let comparisons = { val: 0 };
  let swaps       = { val: 0 };
  let sorted      = [];

  quickSortRec(array, 0, array.length - 1, steps, comparisons, swaps, sorted);

  for (let step of steps) {
    yield step;
  }

  const lastArray = steps.length > 0 ? steps[steps.length - 1].array : [...inputArray];
  yield {
    array: lastArray,
    comparing: [],
    swapping: [],
    sorted: lastArray.map((_, idx) => idx),
    minIndex: -1,
    comparisons: comparisons.val,
    swaps: swaps.val
  };
}


// Mapa para acceder fácilmente desde el visualizador
const ALGORITHMS = {
  selection: selectionSortGen,
  insertion: insertionSortGen,
  merge:     mergeSortGen,
  quick:     quickSortGen,
};
