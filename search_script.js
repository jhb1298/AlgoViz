window.SEARCH_SCRIPT = {
    "BINARY": {
        "START": (target) => `Let's find the number ${target}! Since our list is already sorted, we can use Binary Search to find it much faster by cutting the work in half every time.`,
        "MID": (val) => `Checking the middle element: ${val}. How does it compare to our target?`,
        "TOO_HIGH": (val, target) => `${val} is larger than ${target}. That means our target must be in the left half. We can safely ignore everything to the right!`,
        "TOO_LOW": (val, target) => `${val} is smaller than ${target}. So our target must be in the right half. Let's discard the left side!`,
        "FOUND": (target, index) => `Aha! We found ${target} at index ${index}. Bullseye!`,
        "NOT_FOUND": (target) => `We've run out of numbers to check. ${target} isn't in this list!`,
        "SUCCESS": () => `Search complete! That's the power of logarithmic speed.`
    }
};
