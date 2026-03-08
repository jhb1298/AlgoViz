const HASH_SCRIPT = {
    "START": (size) => `Welcome to the Hash Table! We have ${size} buckets to organize our data. Let's see where everything goes!`,
    "HASHING": (val, index) => `Hashing ${val}... Applying the formula gives us bucket index ${index}.`,
    "INSERTING": (val, index) => `Placing ${val} into bucket ${index}. If someone is already there, we'll just start a chain!`,
    "SEARCHING": (val, index) => `Looking for ${val}. Based on its hash, it must be in bucket ${index}. Let's check the chain!`,
    "FOUND": (val) => `Aha! Found ${val} in the chain. Search successful!`,
    "NOT_FOUND": (val) => `We've checked the entire chain and ${val} isn't there. It's not in the table!`,
    "COLLISION": (val, index) => `Collision detected! Bucket ${index} is already occupied. ${val} is joining the linked list chain.`,
    "DELETING": (val, index) => `Removing ${val} from bucket ${index}. We'll carefully unlink it from the chain.`,
    "SUCCESS": () => `Operation complete! Our hash table is perfectly organized.`,
    "OPEN_ADDRESSING": {
        "LINEAR": {
            "START": () => `Using Linear Probing! If a spot is taken, we'll just check the very next one (index + 1). Simple!`,
            "PROBE": (idx, attempt) => `Spot ${idx} is busy. Trying the next slot... (Attempt ${attempt})`,
            "INSERT": (val, idx) => `Found an empty spot at ${idx}! Inserting ${val} here.`
        },
        "QUADRATIC": {
            "START": () => `Quadratic Probing time! We'll jump by squares (1², 2², 3²...) to avoid clustering.`,
            "PROBE": (idx, i) => `Spot occupied. Jumping ${i}² = ${i*i} steps ahead to check index ${idx}.`,
            "INSERT": (val, idx) => `Landed on empty spot ${idx}. ${val} fits perfectly!`
        },
        "DOUBLE": {
            "START": () => `Double Hashing! We'll use a second hash function to calculate a unique jump size for each key.`,
            "CALC_STEP": (step) => `Second hash says we should jump by ${step} steps every time we hit a wall.`,
            "PROBE": (idx, step) => `Collision! Jumping ${step} steps forward to index ${idx}.`,
            "INSERT": (val, idx) => `Success! Index ${idx} is free for ${val}.`
        }
    }
};