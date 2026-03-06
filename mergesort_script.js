const MERGESORT_SCRIPT = {
    "START": (arr) => `This array is way too messy! Let's chop it in half and deal with smaller pieces.`,
    "BASE": (val) => `A single number! It's already sorted by default. You can't be messy if you're all alone!`,
    "THINKING": (dir) => `Let's focus on the ${dir} side first. Keep splitting!`,
    "MERGE": (left, right, merged) => `Time for the magic! Let's zip these two groups back together in the perfect order. Zip, zap, zoom!`
};