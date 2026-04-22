window.NQUEENS_SCRIPT = {
    "START": (n) => `Let's solve the classic ${n}-Queens puzzle! Our goal is to place ${n} queens on this board so that no two queens can attack each other.`,
    "TRYING": (row, col) => `Let's see if we can place a queen at row ${row + 1}, column ${col + 1}.`,
    "CONFLICT": (row, col) => `Oops! Row ${row + 1}, column ${col + 1} is under attack. We can't stay here!`,
    "SAFE": (row, col) => `Perfect! Column ${col + 1} is safe for our Queen at row ${row + 1}. She looks happy there!`,
    "BACKTRACK": (row) => `Oh no, we're stuck! There's no safe spot in row ${row + 1}. Let's go back one step and move the previous queen.`,
    "SUCCESS": () => `Aha! We did it! All queens are placed safely. It's a royal celebration!`,
    "NEXT_ROW": (row) => `Now that this queen is safe, let's move to row ${row + 1} and find a spot for her sister.`
};
