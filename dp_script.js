const DP_SCRIPT = {
    "KNAPSACK": {
        "START": () => `Welcome to the 0/1 Knapsack Problem! We have a bag with limited capacity and a set of valuable items. Our goal is to maximize the total value without breaking the bag.`,
        "CELL_EVAL": (i, w) => `Evaluating item ${i} at capacity ${w}. Should we take it or leave it?`,
        "EXCLUDE": (val) => `This item is too heavy or not worth it. We'll carry over the best value we had before: ${val}.`,
        "INCLUDE": (newVal, oldVal) => `Found a better combination! By including this item, our value jumps from ${oldVal} to ${newVal}.`,
        "BACKTRACK_START": () => `Table complete! Now, let's work backwards from the bottom-right to see exactly which items made it into our optimal selection.`,
        "ITEM_SELECTED": (name) => `Aha! The value changed here, which means the ${name} must be in our bag!`,
        "SUCCESS": (finalVal) => `Optimization complete! The maximum value we can carry is ${finalVal}. We've found the most valuable combination possible!`
    }
};