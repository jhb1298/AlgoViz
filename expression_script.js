const EXPRESSION_SCRIPT = {
    "POSTFIX": {
        "START": (expr) => `Let's evaluate the postfix expression: ${expr}. We'll scan it from left to right, using a stack to keep track of our numbers!`,
        "NUMBER": (val) => `Found a number: ${val}. Into the stack it goes!`,
        "OPERATOR": (op) => `Spotted an operator: ${op}. Time to do some math! We'll pop the top two numbers from our stack.`,
        "CALC": (a, b, op, res) => `Calculating ${a} ${op} ${b}. The result is ${res}. Let's push that back onto the stack!`,
        "SUCCESS": (final) => `We've reached the end! The only number left in our stack is ${final}. That's our answer!`
    },
    "PREFIX": {
        "START": (expr) => `Let's solve this prefix expression: ${expr}. For prefix, it's easier to scan from right to left. Grab your stack, here we go!`,
        "NUMBER": (val) => `Found number ${val}. Pushing it onto the stack.`,
        "OPERATOR": (op) => `Operator ${op} found! Let's take the top two numbers from our stack and apply it.`,
        "CALC": (a, b, op, res) => `Operating ${a} ${op} ${b} gives us ${res}. Back into the stack it goes!`,
        "SUCCESS": (final) => `Scanning complete! The final survivor in our stack is ${final}. Puzzle solved!`
    },
    "INFIX": {
        "START": (expr) => `Infix evaluation time: ${expr}. This is tricky because we have to respect operator precedence and parentheses! We'll use two stacks: one for numbers and one for operators.`,
        "NUMBER": (val) => `A number! ${val} goes into the operand stack.`,
        "OPEN_PAREN": () => `An open parenthesis! This starts a high-priority sub-problem. Into the operator stack!`,
        "CLOSE_PAREN": () => `Closing parenthesis! Let's solve everything inside until we hit the opening bracket.`,
        "OPERATOR": (op) => `Operator ${op} found. If the top operator in our stack is more important, we'll solve that one first!`,
        "CALC": (a, b, op, res) => `Popping ${a} and ${b} to apply ${op}. Result ${res} goes to the number stack.`,
        "SUCCESS": (final) => `All tokens processed and all operators applied. Our final answer is ${final}!`
    }
};