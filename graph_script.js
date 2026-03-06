const DIJKSTRA_SCRIPT = {
    "START": (src) => `Welcome to Dijkstra's journey! We're starting at node ${src} to find the quickest route to every other destination.`,
    "VISITING": (node) => `Visiting node ${node}. Let's look at all its neighbors to see if we can find any shortcuts.`,
    "RELAXING": (u, v, dist) => `Checking the path to ${v}. By going through ${u}, we found a shortcut! The total distance is now ${dist}.`,
    "NO_SHORTCUT": (v) => `The path to ${v} through our current node isn't shorter than what we already know. No change needed.`,
    "PICKING_NEXT": (node) => `All neighbors checked! Now, let's pick the closest unvisited node. That would be node ${node}!`,
    "SUCCESS": () => `We've explored every possible shortcut. Every node now has its guaranteed shortest path recorded!`
};

const BELLMANFORD_SCRIPT = {
    "START": (passes) => `Time for Bellman-Ford! We'll perform ${passes} passes over every edge to ensure we find the absolute shortest paths, even with negative values.`,
    "PASS_START": (p) => `Starting relaxation pass number ${p}. Here we go, checking every single edge on the map.`,
    "RELAXING": (u, v, dist) => `Looking at the edge from ${u} to ${v}. Aha! We can relax this path down to a distance of ${dist}.`,
    "CYCLE_CHECK": () => `One final pass to check for negative cycles. If a distance still drops now, we're in an infinite loop!`,
    "CYCLE_FOUND": () => `Wait! I found a shortcut that keeps getting shorter forever. That's a negative cycle! The math breaks here.`,
    "SUCCESS": () => `All passes complete. We've conquered the graph, negative edges and all!`
};

const SEARCH_SCRIPT = {
    "DFS": {
        "START": (src) => `Let's dive deep into the graph using Depth First Search! We're starting at node ${src}.`,
        "VISITING": (node) => `Exploring node ${node}. We'll follow one path as deep as possible before we ever turn back!`,
        "EXPLORING_EDGE": (u, v) => `From ${u}, let's see where node ${v} takes us. Down the rabbit hole we go!`,
        "BACKTRACKING": (node) => `Dead end at ${node}! No new neighbors here. Let's backtrack and see if we missed any turns earlier.`,
        "ALREADY_VISITED": (node) => `We've already been to ${node}, so we don't need to go there again.`,
        "SUCCESS": () => `We've reached every part of the graph we could find. The deep dive is complete!`
    },
    "BFS": {
        "START": (src) => `Time for Breadth First Search! We're starting at ${src} and spreading out like a ripple in a pond.`,
        "VISITING": (node) => `Visiting node ${node}. We explore everyone at this distance before moving further away.`,
        "ENQUEUE": (node) => `Spotted node ${node}! Adding it to our queue of neighbors to visit very soon.`,
        "ALREADY_VISITED": (node) => `Node ${node} is already on our list or visited. No need to double back!`,
        "SUCCESS": () => `The ripples have reached every corner! We've explored the graph layer by layer.`
    },
    "ASTAR": {
        "START": () => `Welcome to A-Star Search! It's like Dijkstra, but smarter! It uses a 'Heuristic'—a best guess of the remaining distance—to head straight for the target.`,
        "VISITING": (node, f, g, h) => `Checking cell ${node}. Its total score is ${f}. That's ${g} steps taken plus a ${h} step guess to the finish line!`,
        "RELAXING": (node, f) => `Found a better way to reach ${node}! Its new priority score is ${f}. We're getting closer!`,
        "TARGET_FOUND": () => `Target spotted! A-Star has found the most efficient path by looking only where it needed to.`,
        "SUCCESS": () => `Pathfinding complete! We navigated the obstacles and reached our goal with minimal effort.`
    },
    "PAGERANK": {
        "START": () => `Welcome to the PageRank Algorithm! We're measuring the "importance" of each node. Think of every link as a vote of confidence.`,
        "ITERATION_START": (i) => `Starting iteration ${i}. Let's see how the importance flows through the network!`,
        "FLOW": (u, v, amount) => `Node ${u} is sharing its rank with ${v}, sending ${amount.toFixed(3)} units of importance along the link.`,
        "DAMPING": () => `Applying the Damping Factor. This represents a "random surfer" who might jump to any page at random, keeping the math stable.`,
        "CONVERGED": () => `The scores have stabilized! We've found the true hierarchy of importance in our graph.`,
        "SUCCESS": () => `PageRank complete! The nodes with the most links from other important nodes have risen to the top.`
    }
};