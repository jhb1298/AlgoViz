window.TREE_SCRIPT = {
    "HEAPIFY": {
        "START": () => `Let's build a Max-Heap! Our mission is to make sure every parent is larger than its children.`,
        "COMPARING": (p, c) => `Checking parent ${p} against child ${c}. The parent must be the boss!`,
        "SWAPPING": (p, c) => `Aha! Child ${c} is bigger than parent ${p}. Let's swap them and bubble the value up!`,
        "DONE": () => `This subtree now follows the Max-Heap rule. Perfect structure!`
    },
    "BST": {
        "START": () => `Welcome to the Binary Search Tree! Here, smaller numbers go left and larger numbers go right. It's perfectly organized.`,
        "INSERT": (val) => `Inserting ${val}. Let's follow the rules to find its new home.`,
        "SEARCH": (val, node) => `Looking for ${val}. At node ${node}... should we go left or right?`,
        "FOUND": (val) => `Found it! There's our target value ${val}.`,
        "NOT_FOUND": (val) => `We've reached the end and didn't find ${val}. It's not in our tree!`,
        "DELETE": (val) => `Removing ${val}. We'll need to carefully stitch the tree back together.`,
        "COMPARING": (val, node) => `Comparing ${val} with ${node}.`
    },
    "AVL": {
        "START": () => `This is an AVL Tree! It's a BST that balances itself automatically using rotations. It never gets too lopsided.`,
        "INSERT": (val) => `Inserting ${val}. Let's find its place and ensure the tree remains perfectly balanced.`,
        "SEARCH": (val, node) => `Searching for ${val}. Current node: ${node}. AVL trees make searching super fast!`,
        "FOUND": (val) => `Found ${val}! The tree structure kept our search path short and efficient.`,
        "NOT_FOUND": (val) => `${val} is not in the tree. We checked the entire path in O(log n) time.`,
        "DELETE": (val) => `Removing ${val}. After removal, we might need to re-balance the tree from the bottom up.`,
        "IMBALANCE": (node) => `Node ${node} is out of balance! The height difference is too big.`,
        "ROTATE_LEFT": (node) => `Performing a Left Rotation on ${node} to restore balance. Swing it round!`,
        "ROTATE_RIGHT": (node) => `Performing a Right Rotation on ${node}. Pivot and shift!`,
        "BALANCED": () => `The tree is perfectly balanced once again. Efficient and fast!`
    },
    "BPLUS": {
        "START": (order) => `Welcome to the B+ Tree! This is a multi-way search tree with an order of ${order}. All values live in the leaf level.`,
        "INSERT": (val) => `Inserting ${val}. Let's traverse down to the leaf level where all our actual data lives.`,
        "SEARCH": (val) => `Searching for ${val}. We follow the internal node pointers to reach the correct leaf bucket.`,
        "LEAF_REACHED": (leaf) => `We've reached leaf node [${leaf.join(', ')}]. This is where the actual data resides!`,
        "SPLIT_LEAF": () => `Leaf full! Splitting and copying the smallest key from the new leaf to the parent.`,
        "SPLIT_INTERNAL": () => `Internal node full! Splitting and moving the middle key to the parent node.`,
        "PROMOTE": (val) => `Promoting key ${val} to keep the tree balanced.`,
        "SUCCESS": () => `Operation complete! The B+ tree is perfectly balanced and optimized for range scans.`
    },
    "BTREE": {
        "START": (order) => `Welcome to the B-Tree! This is a balanced search tree designed for high-performance storage.`,
        "INSERT": (val) => `Inserting ${val}. Unlike B+ trees, keys in a B-Tree can reside in internal nodes as well.`,
        "SEARCH": (val) => `Searching for ${val}. We check each node's keys; if not found, we follow the correct child pointer.`,
        "NODE_REACHED": (keys) => `Current node: [${keys.join(', ')}]. Let's check if our value is here or if we go deeper.`,
        "SPLIT": () => `Node overflow! We must split this node and promote the median key to maintain tree constraints.`,
        "PROMOTE": (val) => `Promoting ${val} to the parent node.`,
        "SUCCESS": () => `B-Tree operation finished. The structure remains perfectly balanced.`
    }
};
