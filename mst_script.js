const PRIMS_SCRIPT = {
    "START": (src) => `Welcome to Prim's forest! We're starting at node ${src} to grow a Minimum Spanning Tree that connects everyone for the lowest cost.`,
    "EXPLORING": (node) => `We're at node ${node}. Let's look at all the available edges leading out to unvisited nodes.`,
    "PICKING": (u, v, weight) => `Found it! The cheapest available edge connects ${u} to ${v} with a cost of ${weight}. Let's add it to our tree!`,
    "ALREADY_VISITED": (v) => `Node ${v} is already in our tree, so we'll skip this edge to avoid making a loop.`,
    "SUCCESS": (total) => `Our spanning tree is complete! We've connected every node using the cheapest paths possible. Total cost: ${total}.`
};

const KRUSKALS_SCRIPT = {
    "START": () => `Let's build a Minimum Spanning Tree using Kruskal's method! First, we'll sort every single edge from cheapest to most expensive.`,
    "CHECKING": (u, v, w) => `Checking the edge between ${u} and ${v} with weight ${w}. Is it safe to add?`,
    "ADDING": (u, v) => `Yes! Node ${u} and ${v} are currently in different groups. Connecting them won't create a cycle. Added!`,
    "SKIPPING": (u, v) => `Wait! Node ${u} and ${v} are already connected through other paths. Adding this edge would create a cycle. Skip!`,
    "SUCCESS": (total) => `The forest has merged into a single tree! We've found the minimum cost to connect everything. Total cost: ${total}.`
};