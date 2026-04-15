const ALGORITHM_PSEUDOCODE = {
    "BFS": [
        "1. Initialize queue Q with source node S",
        "2. Mark S as visited",
        "3. While Q is not empty:",
        "4.   u = Q.dequeue()",
        "5.   For each neighbor v of u:",
        "6.     If v is not visited:",
        "7.       Mark v as visited",
        "8.       Q.enqueue(v)"
    ],
    "DFS": [
        "1. Push source node S onto stack ST",
        "2. While ST is not empty:",
        "3.   u = ST.pop()",
        "4.   If u is not visited:",
        "5.     Mark u as visited",
        "6.     For each neighbor v of u:",
        "7.       Push v onto ST"
    ],
    "DIJKSTRA": [
        "1. dist[S] = 0, others = Infinity",
        "2. Add all nodes to Priority Queue Q",
        "3. While Q is not empty:",
        "4.   u = Q.extract_min()",
        "5.   For each neighbor v of u:",
        "6.     alt = dist[u] + weight(u, v)",
        "7.     If alt < dist[v]:",
        "8.       dist[v] = alt",
        "9.       parent[v] = u"
    ],
    "BUBBLE": [
        "1. For i from 0 to n-1:",
        "2.   For j from 0 to n-i-2:",
        "3.     If arr[j] > arr[j+1]:",
        "4.       Swap(arr[j], arr[j+1])"
    ],
    "INSERTION": [
        "1. For i from 1 to n-1:",
        "2.   key = arr[i], j = i - 1",
        "3.   While j >= 0 and arr[j] > key:",
        "4.     arr[j+1] = arr[j]",
        "5.     j = j - 1",
        "6.   arr[j+1] = key"
    ],
    "SELECTION": [
        "1. For i from 0 to n-2:",
        "2.   min_idx = i",
        "3.   For j from i+1 to n-1:",
        "4.     If arr[j] < arr[min_idx]:",
        "5.       min_idx = j",
        "6.   Swap(arr[i], arr[min_idx])"
    ],
    "ASTAR": [
        "1. Initialize Open List with source S",
        "2. While Open List is not empty:",
        "3.   u = node in Open List with lowest f(n)",
        "4.   If u is target, return Success",
        "5.   For each neighbor v of u:",
        "6.     g = dist[u] + cost(u, v)",
        "7.     If v not in Open or g < g[v]:",
        "8.       g[v] = g, f[v] = g + h(v)",
        "9.       parent[v] = u, Add v to Open"
    ],
    "GREEDY": [
        "1. Initialize Open List with source S",
        "2. While Open List is not empty:",
        "3.   u = node in Open List with lowest h(n)",
        "4.   If u is target, return Success",
        "5.   For each neighbor v of u:",
        "6.     If v is not visited:",
        "7.       Add v to Open List"
    ],
    "BELLMANFORD": [
        "1. dist[S] = 0, others = Infinity",
        "2. Repeat n-1 times:",
        "3.   For each edge (u, v) with weight w:",
        "4.     If dist[u] + w < dist[v]:",
        "5.       dist[v] = dist[u] + w",
        "6. Check for negative cycles"
    ],
    "KRUSKAL": [
        "1. Sort all edges by weight",
        "2. Initialize empty MST and Disjoint Set",
        "3. For each edge (u, v) in sorted order:",
        "4.   If Find(u) != Find(v):",
        "5.     Add (u, v) to MST",
        "6.     Union(u, v)"
    ],
    "PRIMS": [
        "1. Start with an arbitrary node S",
        "2. Mark S as in-MST",
        "3. While MST has < n nodes:",
        "4.   Find cheapest edge (u, v) where:",
        "5.     u is in-MST and v is NOT in-MST",
        "6.   Add (u, v) to MST",
        "7.   Mark v as in-MST"
    ],
    "FLOYD_WARSHALL": [
        "1. Initialize dist[i][j] with edge weights",
        "2. For k from 1 to n:",
        "3.   For i from 1 to n:",
        "4.     For j from 1 to n:",
        "5.       If dist[i][k] + dist[k][j] < dist[i][j]:",
        "6.         dist[i][j] = dist[i][k] + dist[k][j]"
    ],
    "FIBONACCI_RECURSIVE": [
        "1. Function fib(n):",
        "2.   If n <= 1 return n",
        "3.   Return fib(n-1) + fib(n-2)"
    ],
    "FIBONACCI_DP": [
        "1. Function fib(n):",
        "2.   If n in memo return memo[n]",
        "3.   If n <= 1 return n",
        "4.   res = fib(n-1) + fib(n-2)",
        "5.   memo[n] = res",
        "6.   Return res"
    ],
    "PAGERANK": [
        "1. Initialize PR(u) = 1/N for all nodes",
        "2. Repeat for each iteration:",
        "3.   For each node u:",
        "4.     new_PR[u] = (1-d)/N",
        "5.     For each node v linking to u:",
        "6.       new_PR[u] += d * (PR[v] / L[v])",
        "7.   Update PR = new_PR"
    ],
    "HUFFMAN": [
        "1. Count frequency of each character",
        "2. Create a Leaf node for each char and add to Priority Queue PQ",
        "3. While PQ has more than one node:",
        "4.   Remove two nodes with lowest frequency (left, right)",
        "5.   Create internal node with freq = left.freq + right.freq",
        "6.   Set children to left and right, add to PQ",
        "7. Remaining node is root of Huffman Tree",
        "8. Traverse tree (left=0, right=1) to assign codes"
    ]
};

// Map file titles or internal IDs to the pseudocode keys
window.getAlgorithmPseudocode = (algoKey) => {
    return ALGORITHM_PSEUDOCODE[algoKey] || [];
};
