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
    "QUICKSORT": [
        "1. If low >= high: return (base case)",
        "2. Choose pivot = arr[high]",
        "3. Partition: place pivot in correct position",
        "4.   Elements < pivot go left, > pivot go right",
        "5. Recurse: QuickSort(arr, low, pi-1)",
        "6. Recurse: QuickSort(arr, pi+1, high)"
    ],
    "MERGESORT": [
        "1. If array has 1 element, return (base case)",
        "2. Divide: split array into two halves",
        "3. Recurse: MergeSort(left half)",
        "4. Recurse: MergeSort(right half)",
        "5. Merge: compare front of each half",
        "6. Append smaller element to result"
    ],
    "HEAPSORT": [
        "1. Build a Max Heap from input array",
        "2. For i from n-1 down to 1:",
        "3.   Swap arr[0] (max) with arr[i]",
        "4.   Heapify down on arr[0..i-1]",
        "5.   Restore heap property"
    ],
    "HEAPIFY": [
        "1. Start at last non-leaf: i = n/2 - 1",
        "2. For each node from bottom to root:",
        "3.   largest = max(node, left, right)",
        "4.   If largest != current: swap",
        "5.   Recursively heapify affected subtree"
    ],
    "SHELLSORT": [
        "1. Choose initial gap = n/2",
        "2. While gap > 0:",
        "3.   For i from gap to n-1:",
        "4.     key = arr[i], j = i",
        "5.     While j >= gap and arr[j-gap] > key:",
        "6.       arr[j] = arr[j-gap], j -= gap",
        "7.   gap = floor(gap / 2)"
    ],
    "RADIX": [
        "1. Find max number to get digit count d",
        "2. For each digit position (1s, 10s, ...):",
        "3.   Count occurrences of each digit 0–9",
        "4.   Compute cumulative prefix counts",
        "5.   Place elements into sorted output array",
        "6.   Copy output back to input array"
    ],
    "COUNTINGSORT": [
        "1. Find range [min, max] of input",
        "2. Initialize count array of size max-min+1",
        "3. Count occurrences of each element",
        "4. Compute running prefix sums",
        "5. Place each element at correct output index"
    ],
    "BUCKETSORT": [
        "1. Create n empty buckets",
        "2. For each element x: insert into bucket",
        "3.   bucket_index = floor(n * normalize(x))",
        "4. Sort each non-empty bucket individually",
        "5. Concatenate all sorted buckets"
    ],
    "COMBSORT": [
        "1. gap = n, shrink = 1.3, sorted = false",
        "2. While gap > 1 or not sorted:",
        "3.   gap = floor(gap / shrink)",
        "4.   If gap <= 1: gap = 1, sorted = true",
        "5.   For i from 0 to n-gap-1:",
        "6.     If arr[i] > arr[i+gap]: swap"
    ],
    "CYCLESORT": [
        "1. For each start position cycleStart:",
        "2.   Find correct position for current item",
        "3.   If item is already in place: skip",
        "4.   Place item at its correct sorted position",
        "5.   Rotate cycle until back at cycleStart"
    ],
    "TOPOLOGICAL": [
        "1. Compute in-degree for all vertices",
        "2. Enqueue all vertices with in-degree 0",
        "3. While queue is not empty:",
        "4.   Dequeue vertex u, add to order",
        "5.   For each neighbor v of u:",
        "6.     Decrement in-degree of v",
        "7.     If in-degree of v = 0: enqueue v"
    ],
    "BIPARTITE": [
        "1. Assign color 0 to source vertex",
        "2. Use BFS to traverse graph",
        "3. For each vertex u being processed:",
        "4.   For each neighbor v of u:",
        "5.     If v is uncolored: assign opposite color",
        "6.     If v has same color as u: NOT bipartite",
        "7. No conflicts found: graph IS bipartite"
    ],
    "GRAPH_COLORING": [
        "1. Assign color 1 to first vertex",
        "2. For each remaining vertex v:",
        "3.   Find all colors used by neighbors",
        "4.   Assign smallest unused color to v",
        "5. Count distinct colors used"
    ],
    "MAP_COLORING": [
        "1. If all regions colored: return true",
        "2. Select next uncolored region v",
        "3. For each color c (1 to maxColors):",
        "4.   If no adjacent region uses c:",
        "5.     Assign c to v, recurse",
        "6.     If success: return true",
        "7. No valid color found: backtrack"
    ],
    "FACTORIAL": [
        "1. Function factorial(n):",
        "2.   Base case: if n <= 1, return 1",
        "3.   Recursive call: factorial(n-1)",
        "4.   Return n * factorial(n-1)"
    ],
    "HANOI": [
        "1. Function hanoi(n, from, to, via):",
        "2.   If n == 1: Move disk from rod to rod",
        "3.   Move top (n-1) disks: from → via",
        "4.   Move nth disk: from → to",
        "5.   Move (n-1) disks: via → to"
    ],
    "NQUEENS": [
        "1. If row == n: solution found!",
        "2. For each column c in current row:",
        "3.   Check if placing queen is safe",
        "4.   (No conflicts in row/col/diagonal)",
        "5.   If safe: place queen, recurse next row",
        "6.   If recursion fails: remove (backtrack)"
    ],
    "SUDOKU": [
        "1. Find the next empty cell",
        "2. If no empty cell: puzzle solved!",
        "3. For each digit 1 to 9:",
        "4.   Check if digit is valid in this cell",
        "5.   If valid: place digit, recurse",
        "6.   If recursion fails: remove (backtrack)"
    ],
    "KNAPSACK": [
        "1. Init dp table (n+1) x (W+1) with zeros",
        "2. For each item i from 1 to n:",
        "3.   For each capacity w from 0 to W:",
        "4.     If item weight > w: dp[i][w] = dp[i-1][w]",
        "5.     Else: dp[i][w] = max(skip, include)",
        "6.       include = dp[i-1][w-wt] + value"
    ],
    "PERMUTATIONS": [
        "1. Function permute(arr, start):",
        "2.   If start == arr.length: output result",
        "3.   For i from start to arr.length-1:",
        "4.     Swap arr[start] with arr[i]",
        "5.     Recurse: permute(arr, start+1)",
        "6.     Undo swap (backtrack)"
    ],
    "INFIX": [
        "1. For each token in expression:",
        "2.   If operand: output directly",
        "3.   If '(': push to stack",
        "4.   If ')': pop until '(' is found",
        "5.   If operator: pop higher/equal precedence",
        "6.   Push current operator to stack",
        "7. Pop all remaining operators from stack"
    ],
    "PREFIX": [
        "1. Reverse the infix expression",
        "2. Swap all '(' and ')' brackets",
        "3. Apply infix-to-postfix algorithm",
        "4. Reverse the result to get prefix"
    ],
    "POSTFIX": [
        "1. For each token in expression:",
        "2.   If operand: push to stack",
        "3.   If operator:",
        "4.     Pop operand b, then operand a",
        "5.     Compute result = a op b",
        "6.     Push result onto stack",
        "7. Stack top is the final result"
    ],
    "MINIMAX": [
        "1. If terminal state: return heuristic value",
        "2. If Maximizer's turn:",
        "3.   best = -Infinity",
        "4.   For child: best = max(best, minimax(child))",
        "5. If Minimizer's turn:",
        "6.   best = +Infinity",
        "7.   For child: best = min(best, minimax(child))"
    ],
    "GRAHAM_SCAN": [
        "1. Find point P0 with lowest y-coordinate",
        "2. Sort all other points by polar angle from P0",
        "3. Push P0, P1, P2 onto stack",
        "4. For each remaining point Q:",
        "5.   While last three make a CW turn:",
        "6.     Pop from stack",
        "7.   Push Q onto stack"
    ],
    "JARVIS_MARCH": [
        "1. Start from the leftmost point",
        "2. While next hull point != start:",
        "3.   current = last hull point",
        "4.   For each point q in set:",
        "5.     If q is more CCW than candidate:",
        "6.       candidate = q",
        "7.   Add candidate to convex hull"
    ],
    "TURING_MACHINE": [
        "1. Start in initial state, head at position 0",
        "2. While state != HALT:",
        "3.   Read symbol at tape[head]",
        "4.   Look up (state, symbol) in delta table",
        "5.   Write new symbol to tape[head]",
        "6.   Move head Left (-1) or Right (+1)",
        "7.   Transition to next state"
    ],
    "NEURAL_NETWORK": [
        "1. Initialize weights W and biases b randomly",
        "2. Forward pass for each layer:",
        "3.   z = W * input + b",
        "4.   output = activation(z) (ReLU/sigmoid)",
        "5. Compute loss at output layer",
        "6. Backward pass: compute gradients dL/dW",
        "7. Update: W = W - learning_rate * dL/dW"
    ],
    "KMEANS": [
        "1. Randomly assign K centroids",
        "2. Repeat until convergence:",
        "3.   Assign each point to nearest centroid",
        "4.   Recompute each centroid as cluster mean",
        "5. Convergence: centroids no longer change"
    ],
    "GENETIC": [
        "1. Generate initial random population",
        "2. For each generation:",
        "3.   Evaluate fitness of each individual",
        "4.   Select parents (fitness-proportional)",
        "5.   Crossover: combine parent chromosomes",
        "6.   Mutation: randomly flip genes",
        "7. Return fittest individual found"
    ],
    "SIMULATED_ANNEALING": [
        "1. Start with random solution S, temp T",
        "2. While T > threshold:",
        "3.   Generate neighbor solution S'",
        "4.   delta E = cost(S') - cost(S)",
        "5.   If delta < 0: accept S' (better)",
        "6.   Else: accept with prob e^(-deltaE/T)",
        "7.   T = T * cooling_rate (reduce temp)"
    ],
    "SIGNAL_1D": [
        "1. Input: discrete-time signal x[n]",
        "2. Apply Discrete Fourier Transform (DFT)",
        "3.   X[k] = sum(x[n] * e^(-j2pi*k*n/N))",
        "4. Analyze frequency components X[k]",
        "5. Apply filter in frequency domain",
        "6. Inverse DFT to recover time domain signal"
    ],
    "FACTORIAL": [
        "1. if (n <= 1) return 1",
        "2. res = fact(n - 1)",
        "3. return n * res"
    ],
    "HANOI": [
        "1. Function hanoi(n, src, dest, aux):",
        "2.   If n == 1: move disk from src to dest",
        "3.   Else:",
        "4.     hanoi(n-1, src, aux, dest)",
        "5.     move disk n from src to dest",
        "6.     hanoi(n-1, aux, dest, src)"
    ],
    "NQUEENS": [
        "1. for col from 0 to N-1:",
        "2.   if isSafe(row, col):",
        "3.     placeQueen(row, col)",
        "4.     solve(row + 1)",
        "5. backtrack()"
    ],
    "SUDOKU": [
        "1. For each cell in grid:",
        "2.   If cell is empty:",
        "3.     For digit 1 to 9:",
        "4.       If isSafe(grid, row, col, digit):",
        "5.         grid[row][col] = digit",
        "6.         If solve(grid) is true: return true",
        "7.         grid[row][col] = 0 (Backtrack)",
        "8.     Return false (No digit works)",
        "9. Return true (All cells filled)"
    ],
    "KNAPSACK": [
        "1. For i from 1 to n:",
        "2.   For w from 1 to W:",
        "3.     If weight[i-1] <= w:",
        "4.       dp[i][w] = max(value[i-1] + dp[i-1][w-weight[i-1]], dp[i-1][w])",
        "5.     Else:",
        "6.       dp[i][w] = dp[i-1][w]"
    ],
    "PERMUTATIONS": [
        "1. Function permute(curr, rem):",
        "2.   If rem is empty:",
        "3.     add curr to results",
        "4.     return",
        "5.   For each char in rem:",
        "6.     permute(curr + char, rem - char)"
    ],
    "INFIX": [
        "1. For each token in expression:",
        "2.   If token is a number: push to values stack",
        "3.   If token is '(': push to operator stack",
        "4.   If token is ')': evaluate until '(' is found",
        "5.   If token is operator: evaluate while precedence matches, then push",
        "6. Evaluate remaining operators in stack",
        "7. Return top of values stack"
    ],
    "PREFIX": [
        "1. For each token from right to left:",
        "2.   If token is a number:",
        "3.     push to stack",
        "4.   If token is an operator:",
        "5.     pop top two values",
        "6.     evaluate with operator",
        "7.     push result to stack",
        "8. Return top of stack"
    ],
    "POSTFIX": [
        "1. For each token from left to right:",
        "2.   If token is a number:",
        "3.     push to stack",
        "4.   If token is an operator:",
        "5.     pop top two values (b then a)",
        "6.     evaluate a op b",
        "7.     push result to stack",
        "8. Return top of stack"
    ],
    "MINIMAX": [
        "1. function minimax(node, depth, isMaximizing):",
        "2.   if depth == 0 or node is leaf:",
        "3.     return evaluate(node)",
        "4.   if isMaximizing:",
        "5.     maxVal = -∞",
        "6.     For each child: maxVal = max(maxVal, minimax(child, depth-1, false))",
        "7.     return maxVal",
        "8.   else:",
        "9.     minVal = +∞",
        "10.    For each child: minVal = min(minVal, minimax(child, depth-1, true))",
        "11.    return minVal"
    ],
    "GRAHAM_SCAN": [
        "1. Find the lowest (then leftmost) point P0",
        "2. Sort all other points by polar angle with P0",
        "3. Push first 3 sorted points onto stack",
        "4. For each remaining point P:",
        "5.   While turn(stack[-2], stack[-1], P) is not left:",
        "6.     pop stack[-1]",
        "7.   Push P onto stack",
        "8. Stack contains convex hull"
    ],
    "JARVIS_MARCH": [
        "1. Find leftmost point as start",
        "2. Repeat:",
        "3.   Set q = (current + 1) % n",
        "4.   For each point i:",
        "5.     If crossProduct(current, i, q) < 0: q = i",
        "6.   Add q to hull",
        "7.   current = q",
        "8. Until current == start (hull complete)"
    ],
    "TURING_MACHINE": [
        "1. Initialize tape with input string",
        "2. Set head to position 0, state = q0",
        "3. While state != HALT:",
        "4.   Read symbol at head position",
        "5.   Look up (state, symbol) in transitions",
        "6.   Write new symbol to tape",
        "7.   Transition to next state",
        "8.   Move head Left or Right",
        "9. Accept if in HALT state"
    ],
    "SIGNAL_1D": [
        "1. Initialize signal x[n] and kernel h[n]",
        "2. For convolution: flip kernel h[-n]",
        "3. Pad signal with zeros on both sides",
        "4. For each output position n:",
        "5.   Slide kernel over padded signal",
        "6.   Multiply aligned elements",
        "7.   Sum products to get y[n]",
        "8. Output complete result signal y[n]"
    ],
    "NEURAL_NETWORK": [
        "1. Initialize random weights and biases",
        "2. For each epoch:",
        "3.   For each training sample:",
        "4.     Forward pass: compute activations",
        "5.     Compute output & loss",
        "6.     Backward pass: compute gradients",
        "7.     Update weights via gradient descent",
        "8. Repeat until convergence"
    ],
    "KMEANS": [
        "1. Place K centroids at random positions",
        "2. Repeat:",
        "3.   Assignment: assign each point to nearest centroid",
        "4.   Update: move centroid to cluster mean",
        "5.   Check if centroids moved",
        "6. Until convergence (no movement)",
        "7. Return cluster assignments"
    ],
    "GENETIC": [
        "1. Create initial population randomly",
        "2. Evaluate fitness of each individual",
        "3. Repeat each generation:",
        "4.   Select parents by fitness",
        "5.   Crossover parents to create offspring",
        "6.   Mutate offspring randomly",
        "7.   Replace population with offspring",
        "8. Until target fitness is reached"
    ],
    "SIMULATED_ANNEALING": [
        "1. Start with a random initial solution",
        "2. Set initial temperature T",
        "3. While T > threshold:",
        "4.   Swap two random cities (neighbor)",
        "5.   Compute delta distance",
        "6.   If better: accept new path",
        "7.   Else: accept with probability e^(-delta/T)",
        "8.   Cool temperature: T = T * cooling_rate",
        "9. Return best path found"
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
    ],
    "HASH_CHAINING": [
        "1. index = key % table_size",
        "2. Access bucket[index]",
        "3. If Collision: Insert key at head/tail of linked list",
        "4. Else: Create new linked list with key"
    ],
    "HASH_LINEAR": [
        "1. index = key % table_size",
        "2. i = 0",
        "3. while bucket[(index + i) % table_size] is occupied:",
        "4.   i = i + 1",
        "5. bucket[(index + i) % table_size] = key"
    ],
    "HASH_QUADRATIC": [
        "1. index = key % table_size",
        "2. i = 0",
        "3. while bucket[(index + i²) % table_size] is occupied:",
        "4.   i = i + 1",
        "5. bucket[(index + i²) % table_size] = key"
    ],
    "HASH_DOUBLE": [
        "1. index = hash1(key)",
        "2. step = hash2(key)",
        "3. i = 0",
        "4. while bucket[(index + i * step) % table_size] is occupied:",
        "5.   i = i + 1",
        "6. bucket[(index + i * step) % table_size] = key"
    ],
    "BTREE": [
        "1. Start at root, search for leaf node L",
        "2. Find appropriate position for K in L",
        "3. If L has space, Insert K",
        "4. Else Split(L):",
        "5.   Move median key to parent",
        "6.   Split remaining keys into two nodes",
        "7.   Repeat split up if parent becomes full"
    ],
    "BPLUS": [
        "1. Search for leaf L containing K",
        "2. If L has space, Insert K into L",
        "3. Else SplitLeaf(L):",
        "4.   Keep first half in L, move second half to L'",
        "5.   Copy smallest key of L' to parent",
        "6.   If parent full, SplitInternal(parent):",
        "7.     Move median key to higher parent",
        "8.     Split remaining keys/children"
    ],
    "BINARY_SEARCH": [
        "1. Initialize low = 0, high = n-1",
        "2. While low <= high:",
        "3.   mid = floor((low + high) / 2)",
        "4.   If arr[mid] == target: return Found",
        "5.   If arr[mid] < target: low = mid + 1",
        "6.   Else: high = mid - 1",
        "7. Target not in array"
    ],
    "BST_INSERT": [
        "1. If node is null, return new Node(val)",
        "2. If val < node.val: node.left = Insert(node.left, val)",
        "3. Else if val > node.val: node.right = Insert(node.right, val)",
        "4. Return node"
    ],
    "BST_SEARCH": [
        "1. If node is null, return Not Found",
        "2. If val == node.val: return Found",
        "3. If val < node.val: return Search(node.left, val)",
        "4. Else: return Search(node.right, val)"
    ],
    "BST_DELETE": [
        "1. Find node to delete using BST search",
        "2. If leaf or one child: Remove node, link parent to child",
        "3. If two children: Find In-order Successor (min in right subtree)",
        "4. Swap node value with successor, Delete successor"
    ],
    "AVL_INSERT": [
        "1. Perform standard BST Insertion",
        "2. Update height of current node",
        "3. Calculate Balance Factor (BF = H[L] - H[R])",
        "4. If BF > 1 (Left Heavy):",
        "5.   If val < left.val: RightRotate (LL Case)",
        "6.   Else: Left-Right Rotate (LR Case)",
        "7. If BF < -1 (Right Heavy):",
        "8.   If val > right.val: LeftRotate (RR Case)",
        "9.   Else: Right-Left Rotate (RL Case)"
    ],
    "AVL_SEARCH": [
        "1. Standard BST Search starting from Root",
        "2. Move down tree based on value comparisons",
        "3. Return Found if match, else Not Found"
    ],
    "AVL_DELETE": [
        "1. Perform standard BST Deletion",
        "2. Update height and calculate Balance Factor",
        "3. Perform rotations if |BF| > 1 to restore balance",
        "4. Recurse up the tree to the root"
    ]
};

// Map file titles or internal IDs to the pseudocode keys
window.getAlgorithmPseudocode = (algoKey) => {
    return ALGORITHM_PSEUDOCODE[algoKey] || [];
};
