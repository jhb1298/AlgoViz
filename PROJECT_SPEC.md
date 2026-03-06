# Project Specification: Recursive & Graph Algorithm Visualizer Suite

This document provides a technical overview of the visualizer suite for use by software engineers and AI agents.

## 1. System Overview
The project is a collection of interactive, cinematic visualizations for fundamental computer science algorithms. It emphasizes high-end UI/UX, synchronized educational narration, and "time-traveling" simulation playback.

## 2. Technical Stack
- **Frontend**: React (v18) via CDN.
- **Styling**: Tailwind CSS (v3) via CDN.
- **Transpilation**: Babel standalone for in-browser JSX parsing.
- **Narration**: Web Speech API (`SpeechSynthesis`).
- **Icons**: Lucide-inspired custom SVG components.

## 3. Core Architectural Patterns

### 3.1. Pre-Simulation "History" Pattern
Algorithms are not executed in real-time during visualization. Instead, they follow a "Pre-simulate and Snapshot" lifecycle:
1.  **Generation**: A recursive function executes the algorithm fully.
2.  **Recording**: At every significant event (function call, comparison, swap, base case), a `step` object is pushed into a `history` array.
    - **Step Schema**: `{ nodeId, status, desc, speech, state_data... }`
3.  **Playback**: React state tracks `currentStep` (index of `history`). The UI renders the snapshot at that index.

### 3.2. Synchronized Narration Logic
- Narration is decoupled from the UI but synchronized via the `currentStep` effect.
- **Event-Driven Transitions**: The `SpeechSynthesisUtterance.onend` event triggers the transition to the next step.
- **Fallback**: If muted or no speech exists, a `setTimeout` based on `playbackSpeed` is used.

### 3.3. Infinite Canvas & Camera
- **Canvas**: A `div` with `absolute` positioning, manipulated by `translate(${x}px, ${y}px) scale(${zoom})`.
- **Auto-Pan**: A `useEffect` calculates the center of the viewport relative to the `activeNode` in the current history step and updates the `camTarget`.
- **Interactivity**: Custom `onMouseDown`, `onMouseMove`, and `onWheel` handlers manage manual dragging and zooming.

### 3.4. Minimizable Control Panel
- A draggable React component with two distinct UI states:
    - **Minimized**: Essential playback controls (Prev, Play/Pause, Next) + centered grab handle.
    - **Expanded**: Full controls (Step slider, Speed, Mute, Description, expand/minimize toggle).

## 4. Graph & Tree Layout Engines

### 4.1. Tree Layout (Recursion)
- **DFS Pass 1**: Recursively calculates the `width` of every subtree to prevent node overlap.
- **DFS Pass 2**: Assigns `x` and `y` coordinates based on subtree widths and depth levels.

### 4.2. Circular Layout (Graphs)
- Used for Dijkstra, Bellman-Ford, Prim's, and Kruskal's.
- Distributes $N$ nodes evenly along a circle using polar coordinates:
  - $x = center + radius * \cos(2\pi * i / N)$
  - $y = center + radius * \sin(2\pi * i / N)$

## 5. File Manifest

### 5.1. Core Application Files
| File | Algorithm Category | Description |
| :--- | :--- | :--- |
| `home.html` | Landing Page | Portal to all simulations. |
| `hanoi.html` | Recursion | Classic 3-peg disk puzzle. |
| `factorial.html` | Recursion | Basic linear recursion accumulation. |
| `fibonacci.html` | Recursion | Binary tree recursion with overlapping subproblems. |
| `mergesort.html` | Divide & Conquer | Sorting via array splitting and merging. |
| `permutations.html` | Backtracking | String arrangement generation. |
| `minimax.html` | Game Theory | Minimax with Alpha-Beta pruning toggle. |
| `nqueens.html` | Backtracking | Chessboard queen placement constraints. |
| `dijkstra.html` | Graph | Greedy shortest path finding (positive weights). |
| `bellmanford.html` | Graph | Iterative shortest path (negative weights/cycles). |
| `prims.html` | Graph (MST) | Node-based Minimum Spanning Tree growth. |
| `kruskals.html` | Graph (MST) | Edge-based MST construction using DSU. |
| `astar.html` | Graph | Heuristic-based shortest pathfinding. |
| `genetic.html` | Optimization | Evolutionary string matching. |
| `simulated_annealing.html` | Optimization | TSP optimization via cooling. |
| `knapsack.html` | Dynamic Programming | Optimal item selection strategy. |
| `huffman.html` | Data Compression | Greedy tree-based compression. |
| `kmeans.html` | Machine Learning | Unsupervised pattern discovery. |
| `sudoku.html` | Backtracking | Grid-based logical backtracking solve. |
| `pagerank.html` | Graph | Measuring importance through link analysis. |
| `neural_network.html` | Machine Learning | Multilayer Perceptron (XOR) simulation. |

### 5.2. Educational Script Files (External)
| Script File | Target Simulation(s) |
| :--- | :--- |
| `hanoi_script.js` | `hanoi.html` |
| `factorial_script.js` | `factorial.html` |
| `fibonacci_script.js` | `fibonacci.html` |
| `mergesort_script.js` | `mergesort.html` |
| `permutations_script.js` | `permutations.html` |
| `minimax_script.js` | `minimax.html` |
| `nqueens_script.js` | `nqueens.html` |
| `graph_script.js` | `dijkstra.html`, `bellmanford.html`, `astar.html`, `pagerank.html` |
| `mst_script.js` | `prims.html`, `kruskals.html` |
| `optimization_script.js` | `genetic.html`, `simulated_annealing.html` |
| `dp_script.js` | `knapsack.html` |
| `compression_script.js` | `huffman.html` |
| `ml_script.js` | `kmeans.html`, `neural_network.html` |
| `sudoku_script.js` | `sudoku.html` |

## 6. Interaction Guidelines
- **Editing Graphs**: Use the "Edit Graph" modal. Format: `Node1 Node2 Weight`.
- **Stepping**: Use the slider or arrow keys (if implemented) or the control panel buttons.
- **Camera**: Zoom with scroll wheel, drag with left mouse button.
