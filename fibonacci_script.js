window.FIBONACCI_SCRIPT = {
    "START": (val) => `Let's find Fibonacci of ${val}. We'll need to solve two smaller puzzles and add them together!`,
    "BASE": (val) => `Easy peasy! Fibonacci of ${val} is just ${val}. No more math needed here!`,
    "THINKING": (val, branch) => `Time to explore the ${branch} branch! Let's see what we find...`,
    "RETURN": (left, right, final) => `Teamwork complete! We added ${left} and ${right} to get ${final}. We're growing the tree!`,
    
    // DP SPECIFIC
    "DP_START": (val) => `Let's solve Fibonacci ${val} using Dynamic Programming! We'll use a 'Memo Table' to remember our answers so we don't repeat work.`,
    "MEMO_CHECK": (n) => `Checking our Memo Table... do we already know the result for Fibonacci ${n}?`,
    "MEMO_FOUND": (n, val) => `Aha! We've seen ${n} before! It's already in our table as ${val}. We can skip this entire branch!`,
    "MEMO_STORE": (n, val) => `We just found Fibonacci ${n} is ${val}. Let's save that in our table for later!`,
    "DP_SUCCESS": (val) => `All done! Because we remembered our results, we solved this much faster than the simple recursive way. The answer is ${val}.`
};
