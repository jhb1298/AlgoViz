window.GEOMETRY_SCRIPT = {
    "JARVIS": {
        "START": () => `Welcome to the Jarvis March, also known as the Gift Wrapping algorithm! We'll find the convex hull by wrapping our points like a present.`,
        "PICK_START": (p) => `First, we find the leftmost point ${p.id}. This point is guaranteed to be on the outer boundary.`,
        "SCANNING": (current, candidate, target) => `From ${current.id}, is ${target.id} more counter-clockwise than our current best bet, ${candidate.id}?`,
        "NEXT_POINT": (p) => `Found the next point on the hull: ${p.id}! It's the most extreme point from our current position.`,
        "SUCCESS": () => `We're back where we started! The gift is wrapped, and our Convex Hull is complete.`
    },
    "GRAHAM": {
        "START": () => `Let's perform the Graham Scan! We'll sort the points and then use a stack to build the hull, filtering out any "inward" turns.`,
        "PICK_START": (p) => `We start with the point having the lowest Y-coordinate: ${p.id}.`,
        "SORTING": () => `Now we've sorted all other points based on the angle they make with our starting point.`,
        "CHECKING": (p) => `Looking at point ${p.id}. Does adding it keep our boundary convex?`,
        "BACKTRACKING": (p) => `Wait! Point ${p.id} makes an inward turn. That's not convex! Let's pop the previous point and try again.`,
        "PUSHING": (p) => `Point ${p.id} makes a perfect outward turn. Adding it to our hull stack.`,
        "SUCCESS": () => `The scan is finished! Our stack now contains the perfect sequence of points for the Convex Hull.`
    }
};
