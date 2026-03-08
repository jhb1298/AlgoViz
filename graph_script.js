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
        "VISITING": (node) => `Visiting node node ${node}. We explore everyone at this distance before moving further away.`,
        "ENQUEUE": (node) => `Spotted node ${node}! Adding it to our queue of neighbors to visit very soon.`,
        "ALREADY_VISITED": (node) => `Node ${node} is already on our list or visited. No need to double back!`,
        "SUCCESS": () => `The ripples have reached every corner! We've explored the graph layer by layer.`
    },
    "GREEDY": {
        "START": (src, target) => `Let's start Greedy Best-First Search! We want to find node ${target}, starting from ${src}. We'll always pick the node that "looks" closest to our goal.`,
        "VISITING": (node, h) => `Visiting node ${node}. Its estimated distance to the target is ${h.toFixed(1)}. It's our best bet right now!`,
        "ENQUEUE": (node, h) => `Spotted node ${node}! Its heuristic value is ${h.toFixed(1)}. Adding it to our priority list.`,
        "TARGET_FOUND": (node) => `Target ${node} reached! Greedy Search found a path by always heading straight for the goal.`,
        "SUCCESS": () => `Search complete! We've successfully navigated the graph using only our best guesses.`
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
        },
        "FLOYD_WARSHALL": {
        "START": () => `Welcome to the Floyd-Warshall algorithm! We're going to find the shortest path between every single pair of nodes simultaneously.`,
        "PHASE": (k) => `Phase ${k}: Let's see if we can find shorter routes by using node ${k} as an intermediate "stepping stone."`,
        "UPDATING": (i, j, k, oldDist, newDist) => `Checking path from ${i} to ${j}. Going through ${k} gives us a distance of ${newDist.toFixed(1)}, which is better than our current knowledge. Updating matrix!`,
        "SUCCESS": () => `All pairs shortest paths calculated! The distance matrix is now complete and optimized.`
        }
        };

const BIPARTITE_SCRIPT = {
    "START": () => `Let's check if this graph is Bipartite! We'll try to color every node using only two colors, ensuring no two neighbors share the same one.`,
    "COLORING": (node, color) => `Coloring node ${node} with ${color === 0 ? 'Blue' : 'Pink'}. Let's see if its neighbors can take the opposite color!`,
    "ENQUEUE": (node) => `Adding node ${node} to the queue to check its neighbors very soon.`,
    "CHECKING": (u, v) => `Checking the link between ${u} and ${v}. They must have different colors!`,
    "IMBALANCE": (u, v) => `Wait! Both ${u} and ${v} have the same color. That's a conflict! This graph is NOT Bipartite.`,
    "BIPARTITE_FORM": () => `Success! Every node is perfectly colored. Now, let's rearrange the graph into its two independent sets!`,
    "SUCCESS": () => `The graph is officially Bipartite! We've split it into two distinct groups where links only exist between groups, never within them.`
};