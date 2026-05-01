# 📊 Sorting Visualizer

Visualizador interactivo de algoritmos de ordenamiento, desarrollado como proyecto de portfolio para la **Licenciatura en Ciencias de la Computación — UBA**.

---

## 🎯 Sobre el proyecto

El objetivo de este proyecto fue implementar desde cero cuatro algoritmos de ordenamiento clásicos y visualizarlos de forma interactiva en el navegador.

**Los algoritmos fueron desarrollados enteramente por mí**, partiendo del pseudocódigo, corrigiéndolo y traduciéndolo a JavaScript. La estructura de la página, el canvas, las animaciones y el sistema de generators que permite la visualización paso a paso son una plantilla base que sirve como soporte visual para mostrar el funcionamiento de cada algoritmo.

---

## 🧠 Algoritmos implementados

### Selection Sort — O(n²)
Busca el elemento mínimo del subarray no ordenado y lo intercambia con el primer elemento de ese subarray. Repite el proceso avanzando hacia la derecha hasta ordenar todo el array.

### Insertion Sort — O(n²)
Toma cada elemento y lo inserta en su posición correcta dentro de la parte ya ordenada, desplazando los elementos mayores hacia la derecha. Funciona de forma similar a ordenar cartas en la mano.

### Merge Sort — O(n log n)
Algoritmo divide and conquer. Divide el array recursivamente a la mitad hasta tener subarrays de un elemento, luego los fusiona de a pares comparando elemento a elemento para construir el resultado ordenado.

### Quick Sort — O(n log n) promedio
Algoritmo divide and conquer. Elige un pivote (último elemento), particiona el array dejando los menores a su izquierda y los mayores a su derecha, y repite recursivamente en cada mitad. Implementado con el esquema de partición de Lomuto.

---

## 🎨 ¿Qué hace la plantilla?

Todo lo que no son los algoritmos en sí es infraestructura para poder visualizarlos:

- **Canvas y animación** — dibuja las barras y las colorea según el estado de cada paso
- **Generator functions** — permiten "pausar" la ejecución del algoritmo cuadro a cuadro para animarlo. Los algoritmos recursivos (Merge Sort y Quick Sort) usan una estrategia de precálculo de pasos para compatibilizar la recursión con los generators
- **Sistema de colores** — 🔴 comparando, 🟡 swap en curso, 🟢 elemento en posición final, 🟣 pivote o mínimo actual
- **Controles** — tamaño del array, velocidad de animación y botones por algoritmo
- **Contadores** — cantidad de comparaciones y swaps realizados en tiempo real

---

## 📁 Estructura del proyecto

```
sorting-visualizer/
├── index.html       # Estructura de la página y las cards
├── style.css        # Diseño visual (plantilla)
├── algorithms.js    # Implementación de los algoritmos ← desarrollo propio
└── visualizer.js    # Canvas, animación y eventos (plantilla)
```

---

## 🚀 Cómo correrlo

No requiere instalación ni dependencias. Simplemente cloná el repositorio y abrí `index.html` en tu navegador:

```bash
git clone https://github.com/tu-usuario/sorting-visualizer.git
cd sorting-visualizer
# Abrí index.html en tu navegador
```

---

## 📚 Contexto académico

Este proyecto fue desarrollado mientras cursaba **Algoritmos y Estructuras de Datos** en la Licenciatura en Ciencias de la Computación de la UBA. El objetivo fue reforzar la comprensión de los algoritmos implementándolos desde cero, partiendo del pseudocódigo y construyendo cada función de manera incremental.

Materias relacionadas cursadas:
- Algoritmos y Estructuras de Datos
- Paradigmas de Programación
- Sistemas Digitales
- Arquitectura y Organización de las Computadoras (cursando)

---

## 🛠️ Tecnologías

- HTML5 / CSS3
- JavaScript vanilla (ES6+)
- Canvas API
- Generator functions (`function*`)

---

*Licenciatura en Ciencias de la Computación — Facultad de Ciencias Exactas y Naturales, UBA*
