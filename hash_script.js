const HASH_SCRIPT = {
    "START": (size) => `Welcome to the Hash Table! We have ${size} buckets to organize our data. Let's see where everything goes!`,
    "HASHING": (val, index) => `Hashing ${val}... Applying the formula gives us bucket index ${index}.`,
    "INSERTING": (val, index) => `Placing ${val} into bucket ${index}. If someone is already there, we'll just start a chain!`,
    "SEARCHING": (val, index) => `Looking for ${val}. Based on its hash, it must be in bucket ${index}. Let's check the chain!`,
    "FOUND": (val) => `Aha! Found ${val} in the chain. Search successful!`,
    "NOT_FOUND": (val) => `We've checked the entire chain and ${val} isn't there. It's not in the table!`,
    "COLLISION": (val, index) => `Collision detected! Bucket ${index} is already occupied. ${val} is joining the linked list chain.`,
    "DELETING": (val, index) => `Removing ${val} from bucket ${index}. We'll carefully unlink it from the chain.`,
    "SUCCESS": () => `Operation complete! Our hash table is perfectly organized.`
};