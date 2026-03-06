const HANOI_SCRIPT = {
    "START": (n, src, dest) => `Let's move these ${n} disks from ${src} to ${dest}! Remember, no big disks on tiny ones!`,
    "THINKING": (n) => `To move the bottom disk, we first need to get the ${n} smaller ones out of the way.`,
    "MOVING": (disk, from, to) => `Found an opening! Picking up disk ${disk} and... Plop! Perfect fit on the ${to} peg.`,
    "RETURNING": (n) => `Great! One part is done. Now let's bring those ${n} smaller disks back on top of our new stack.`
};