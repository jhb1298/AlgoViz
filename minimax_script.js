const MINIMAX_SCRIPT = {
    "START": (depth, isPruning) => `Let's find the best move using Minimax! Max wants the highest score, Min wants the lowest. ${isPruning ? "We'll use Alpha-Beta pruning to skip useless branches!" : "We'll check every single possibility."}`,
    "MAX_TURN": (d) => `It's Max's turn at depth ${d}. I'm looking for the maximum value my children can offer!`,
    "MIN_TURN": (d) => `It's Min's turn at depth ${d}. I'll pick the smallest value to keep Max's score low!`,
    "LEAF": (val) => `We reached a leaf node! This outcome is worth exactly ${val}.`,
    "PRUNED": (type, val, limit) => `Stop! ${type === 'MAX' ? 'Alpha' : 'Beta'} pruning triggered. Since ${val} is ${type === 'MAX' ? 'greater' : 'smaller'} than our limit of ${limit}, we can skip the rest of this branch!`,
    "RETURN": (type, val) => `${type} has made a decision! Passing the value ${val} back up the tree.`
};