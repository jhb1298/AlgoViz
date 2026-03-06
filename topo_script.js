const TOPO_SCRIPT = {
    "START": () => `Let's find a valid sequence for these tasks! Topological Sort helps us order things so that every prerequisite comes before its task.`,
    "IN_DEGREE": () => `First, we'll count how many incoming arrows each task has. This tells us how many things must happen before it.`,
    "ZERO_IN_DEGREE": (node) => `Aha! Task ${node} has zero incoming arrows. That means it's ready to be started!`,
    "REMOVING": (u, v) => `We finished task ${u}! Now task ${v} has one less prerequisite to worry about.`,
    "SUCCESS": () => `Every task is complete! We've found a perfect order where no one is waiting on a task that hasn't happened yet.`
};