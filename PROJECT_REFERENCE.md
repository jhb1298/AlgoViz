# Project Reference: Recursive Algorithm Visualizer

This document outlines the architecture and patterns used in the "Recursive Hanoi Master" project. Use this as a blueprint for building a similar visualizer for "All Possible Permutations of a Word".

## 1. Project Architecture
The project is a single-file React application (`index.html`) using:
- **Tailwind CSS**: For utility-first styling.
- **React (v18)**: For UI components and state management.
- **Babel**: To transpile JSX directly in the browser.
- **D3-like Tree Layout**: Custom logic to calculate node positions and connect them with SVG edges.

## 2. Core Engine: The "Simulation" Pattern
To allow for "time-traveling" (stepping forward/backward), the algorithm is not executed live. Instead, it is "pre-simulated".

### Step 1: Generate the Tree & History
1.  **Tree Structure**: Create a recursive function that builds a tree object where each node represents a function call.
2.  **Step History**: Maintain a global `history` array. Every "event" (function start, move, recursive call, return) is pushed into this array as a `step` object.
    - Each step should contain: `nodeId`, `current_state` (e.g., current word, remaining letters), `status`, and `description`.

### Step 2: Calculate Layout
1.  **Width Calculation**: Recursively determine the width of each subtree to ensure no nodes overlap.
2.  **Coordinate Assignment**: Assign `x` and `y` coordinates to every node based on the calculated widths and depth levels.

## 3. Key Components

### `App` (The Orchestrator)
- **State**: `currentStep`, `isPlaying`, `zoom`, `cameraOffset`.
- **Hooks**:
    - `useMemo`: Re-run the simulation only when the input (e.g., word length) changes.
    - `useEffect`: Handle the auto-play timer and auto-pan the camera to the `activeNode`.

### `NodeComponent`
- Displays the internal state of a specific recursive call.
- **Code Highlighting**: Uses the `step.line` property to highlight which line of the "pseudocode" is currently executing.
- **Visual State**: Renders the specific visualization (e.g., the word construction) for that specific call.

### `Edge` (SVG Connections)
- Renders cubic bezier curves between parent and child nodes.
- Changes color or thickness based on whether the path is currently "active" in the recursion stack.

## 4. Adapting for "Permutations of a Word"

### Data Structure Changes
- **Input**: A string (e.g., "ABC").
- **Node State**: 
    - `currentWord`: The string built so far.
    - `remainingChars`: The characters left to pick from.
- **Visualization**: A visual representation of picking a character and moving it from `remaining` to `current`.

### Pseudocode for Permutation Node
```javascript
function permute(current, remaining) {
  if (remaining.length === 0) {
    // Found a permutation!
    return;
  }
  for (let i = 0; i < remaining.length; i++) {
    // 1. Pick char: remaining[i]
    // 2. permute(current + char, remaining - char)
    // 3. Backtrack (implicit in recursion)
  }
}
```

## 5. UI/UX Features to Port
- **Infinite Canvas**: Draggable and zoomable using mouse events and CSS transforms.
- **Step Slider**: A range input linked to the `history` array length.
- **Breadcrumbs**: Highlight the path from the root to the currently executing node.
- **Playback Controls**: Play, Pause, Fast Forward, Rewind, and Speed adjustment.
