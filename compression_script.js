window.COMPRESSION_SCRIPT = {
    "HUFFMAN": {
        "START": (text) => `Welcome to Huffman Coding! We're going to compress the string: "${text}". First, let's count how many times each character appears.`,
        "FREQUENCIES": () => `Frequencies counted! Now, each character becomes a leaf node in our priority queue.`,
        "PICK_TWO": (n1, n2, f1, f2) => `Picking the two nodes with the lowest frequencies: '${n1}' (${f1}) and '${n2}' (${f2}).`,
        "MERGE": (sum) => `Merging them into a new parent node with a combined frequency of ${sum}. Let's add it back to the queue!`,
        "TREE_COMPLETE": () => `Priority queue is empty! Our Huffman tree is complete. Now, let's assign binary codes: 0 for left, 1 for right.`,
        "ASSIGN_CODE": (char, code) => `Tracing the path to '${char}' gives us the binary code: ${code}.`,
        "SUCCESS": (original, compressed) => `Compression finished! We've shrunk the data from ${original} bits down to ${compressed} bits. That's a huge saving!`
    }
};
