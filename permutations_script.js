window.PERMUTATIONS_SCRIPT = {
    "START": (word) => `Let's see how many ways we can mix up the letters in ${word}! It's like a secret code generator.`,
    "THINKING": (char) => `I'll pick the letter ${char} for this spot. Now, what can we do with the letters that are left?`,
    "SUCCESS": (word) => `Bingo! We found a brand new arrangement: ${word}. Look at that code go!`,
    "RETURNING": (word) => `Finished with that branch! Let's go back and try a different starting letter.`
};
