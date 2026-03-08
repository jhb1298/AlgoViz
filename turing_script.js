const TURING_SCRIPT = {
    "START": (input) => `System initialized. Loading input string "${input}" onto the infinite tape. The Turing Machine is ready to compute.`,
    "READ": (symbol, state) => `Reading symbol "${symbol}" while in state ${state}. Searching the transition table for the next command.`,
    "WRITE": (symbol, nextState) => `Writing "${symbol}" to the current cell and transitioning to state ${nextState}.`,
    "MOVE": (dir) => `Moving the tape head one position to the ${dir === 'R' ? 'Right' : 'Left'}.`,
    "HALT": (success) => success ? `Calculation complete! The machine has reached an Accept state. Result finalized.` : `Process terminated. The machine has entered a Reject state or halted unexpectedly.`,
    "STEP": (count) => `Executing computational step ${count}.`
};