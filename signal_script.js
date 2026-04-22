window.SIGNAL_SCRIPT = {
    "CONVOLUTION": {
        "START": (sig, kernel) => `Starting 1D Convolution! We'll slide our kernel over the signal to produce a filtered output.`,
        "FLIP": () => `First, we flip the kernel. This is what distinguishes convolution from correlation mathematically.`,
        "SLIDE": (pos) => `Sliding kernel to position ${pos}. Let's calculate the overlap.`,
        "MULTIPLY": (val1, val2, res) => `Multiplying ${val1} by ${val2} gives ${res}. We'll sum these products up.`,
        "RESULT": (sum, pos) => `The sum is ${sum.toFixed(2)}. This becomes the value of our output signal at index ${pos}.`,
        "SUCCESS": () => `Convolution complete! We've transformed the signal through the kernel.`
    },
    "CORRELATION": {
        "START": () => `1D Correlation initiated! Unlike convolution, we use the kernel as-is to find patterns or similarities.`,
        "SLIDE": (pos) => `Positioning the kernel at ${pos}. We're looking for how well the signals align here.`,
        "SUCCESS": () => `Correlation mapping finished. Peak values now indicate the strongest points of similarity.`
    }
};
