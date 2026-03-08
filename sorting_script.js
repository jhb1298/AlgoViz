const SORTING_SCRIPT = {
    "BUBBLE": {
        "START": () => `Welcome to the Bubble Sort party! We're going to compare adjacent numbers and swap them if they're in the wrong order. The big numbers will bubble up to the top!`,
        "COMPARING": (a, b) => `Comparing ${a} and ${b}. Should they swap places?`,
        "SWAPPING": (a, b) => `Yes! ${a} is bigger than ${b}, so let's swap them. Bubble, bubble, toil and trouble!`,
        "FIXED": (val) => `Aha! The number ${val} has bubbled all the way to its final spot. It's locked in!`,
        "SUCCESS": () => `The party is over, and everyone is standing in line perfectly! All sorted.`
    },
    "INSERTION": {
        "START": () => `Let's try Insertion Sort! It's like organizing a hand of cards. we'll take one number at a time and slide it into its perfect spot in the sorted section.`,
        "PICKING": (val) => `Picking up ${val}. Now let's find where it belongs in our sorted line.`,
        "SLIDING": (val, target) => `${val} is smaller than ${target}, so let's slide ${target} to the right to make some room!`,
        "INSERTING": (val) => `Found it! This is the perfect home for ${val}. Plop!`,
        "SUCCESS": () => `All cards—I mean numbers—are organized! That's a winning hand.`
    },
    "SELECTION": {
        "START": () => `Time for a scavenger hunt! Selection Sort will scan the messy part of the list to find the absolute smallest number and bring it to the front.`,
        "SCANNING": (val) => `Checking ${val}... is it the smallest one we've seen so far?`,
        "NEW_MIN": (val) => `Found a new winner! ${val} is currently the smallest. Let's keep looking.`,
        "SWAPPING": (min, front) => `Search complete! We're swapping our smallest find, ${min}, with ${front} at the front of the line.`,
        "SUCCESS": () => `The scavenger hunt is over. We've built a perfectly ordered line from smallest to largest!`
    },
    "QUICK": {
        "START": () => `Ready for some speed? Quick Sort uses a pivot to divide the work! We'll put small numbers on the left and big ones on the right.`,
        "PIVOT": (val) => `Choosing ${val} as our Pivot! It's the judge for this round.`,
        "PARTITIONING": (val, pivot) => `Is ${val} smaller than our pivot ${pivot}? Let's move it to the correct side.`,
        "RECURSING": (side) => `Now let's repeat the magic on the ${side} group!`,
        "SUCCESS": () => `Divide and conquer was a success! The entire array is now lightning-fast sorted.`
    },
    "HEAP": {
        "START": () => `Welcome to the Heap Sort construction site! First, we'll organize these numbers into a Max-Heap tree where every parent is larger than its children.`,
        "HEAPIFY": (p, c) => `Comparing parent ${p} with child ${c}. The parent must be the boss!`,
        "EXTRACTING": (val) => `The king of the heap, ${val}, is moving to his final spot at the end.`,
        "REBUILDING": () => `The king is gone! Let's reshuffle the tree to find the next largest leader.`,
        "SUCCESS": () => `The tree has been fully harvested! All numbers are sorted and ready to go.`
    },
    "RADIX": {
        "START": () => `Radix Sort is all about looking at the digits! We'll sort everything by the ones place, then the tens, then the hundreds.`,
        "BUCKETING": (val, digit, place) => `Looking at the ${place}s place of ${val}. It's a ${digit}, so into bucket ${digit} it goes!`,
        "COLLECTING": (place) => `Buckets full! Let's collect them back into the array, now sorted by their ${place}s place.`,
        "SUCCESS": () => `We've checked every digit! The numbers have been sorted through the power of place-values.`
    },
    "COUNTING": {
        "START": () => `Welcome to Counting Sort! Instead of comparing numbers, we'll just count how many times each one appears. It's like taking a census!`,
        "COUNTING": (val) => `Spotted a ${val}! Let's increment our count for ${val}.`,
        "CUMULATIVE": (val, count) => `Calculating the position: everything up to ${val} needs ${count} spots in our final array.`,
        "PLACING": (val, pos) => `Placing ${val} into its correct spot at index ${pos}. No guessing needed!`,
        "SUCCESS": () => `The census is complete! Every number knows its place, and the array is perfectly sorted.`
    },
    "BUCKET": {
        "START": () => `Time for Bucket Sort! We'll distribute these numbers into different buckets based on their range, then sort each bucket individually.`,
        "BUCKETING": (val, bucket) => `${val} belongs in the range for bucket ${bucket}. Off it goes!`,
        "SORTING_BUCKET": (bucket) => `Now let's sort the contents of bucket ${bucket} so they're in perfect order.`,
        "COLLECTING": (bucket) => `Bucket ${bucket} is ready! Let's pour its sorted contents back into our main array.`,
        "SUCCESS": () => `All buckets have been emptied and combined! Our scattered numbers are now one harmonious sorted list.`
    },
    "COMB": {
        "START": () => `Let's try Comb Sort! It improves on Bubble Sort by using a gap to eliminate "turtles"—small values near the end of the list.`,
        "GAP": (gap) => `Setting our comparison gap to ${gap}. We'll compare elements that are this far apart.`,
        "COMPARING": (a, b) => `Comparing ${a} and ${b} with our current gap. Do they need a swap?`,
        "SUCCESS": () => `The gap has shrunk to one and all swaps are done! The turtles have been defeated and the array is sorted.`
    },
    "CYCLE": {
        "START": () => `Welcome to Cycle Sort! This is an in-place, unstable sorting algorithm that is theoretically optimal in terms of the total number of writes.`,
        "PICK_ITEM": (val) => `Picking up ${val}. We're going to find its absolute correct position in the entire array.`,
        "FIND_POS": (val, pos) => `Counting elements smaller than ${val}... it belongs at index ${pos}.`,
        "SWAPPING": (val, target) => `Placing ${val} into its new home and picking up ${target} to continue the cycle.`,
        "SUCCESS": () => `Every item has completed its cycle and landed in its final destination. Minimal writes, maximum efficiency!`
    },
    "SHELL": {
        "START": () => `Shell Sort is here! It's a generalized version of Insertion Sort that allows for the exchange of items that are far apart.`,
        "GAP": (gap) => `Starting a new pass with a gap of ${gap}. This helps move distant elements closer to their final spots.`,
        "INSERTION": (val, gap) => `Performing a gap-based insertion for ${val} using our ${gap}-step interval.`,
        "SUCCESS": () => `The gaps have closed and the final insertion pass is complete! The array is now fully organized.`
    }
};