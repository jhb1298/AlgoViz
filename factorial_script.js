window.FACTORIAL_SCRIPT = {
    "START": (val) => `Time to solve Factorial ${val}! But wait... I don't know the answer yet. I need to ask my smaller self for help!`,
    "BASE": (val) => `We found the bottom! Factorial 1 is just 1. That's our starting point!`,
    "THINKING": (val) => `I'll just wait here at the ${val} ladder. Hey, Factorial ${val-1}, what's your result?`,
    "RETURN": (val, res) => `Aha! I got the answer from below. Now I just multiply ${val} by ${res} and... Boom! We get ${val * res}!`
};
