window.SUDOKU_SCRIPT = {
    "START": () => `Welcome to the Sudoku Solver! We're using backtracking to solve this puzzle. It's a systematic way of trying every possibility until we find the perfect fit.`,
    "TRYING": (val, r, c) => `Trying the number ${val} at row ${r + 1}, column ${c + 1}. Let's see if it follows the rules.`,
    "CONFLICT": (val, reason) => `Wait! Placing ${val} here causes a conflict in the ${reason}. We can't use this number.`,
    "SAFE": (val) => `Great! ${val} is safe for now. Moving on to the next empty cell.`,
    "BACKTRACK": (r, c) => `We hit a dead end! Every possibility from here failed. We need to backtrack and change our previous choice at row ${r + 1}, column ${c + 1}.`,
    "SUCCESS": () => `Puzzle solved! Every cell has been filled according to the rules of Sudoku. Logic prevails!`
};
