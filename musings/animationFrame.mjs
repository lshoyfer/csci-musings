// animationFrame & micro/macro task musings

console.log('macrotask');
setTimeout(() => console.log('queued macrotask'), 0);
requestAnimationFrame(() => console.log('aniframe'));
queueMicrotask(() => console.log('microtask'));
console.log('macrotask2');

const stop = Date.now() + 1000;
while (Date.now() < stop) {
}

/* should go:
    macrotask
    macrotask2 
    microtask
    aniframe
    queued macrotask
*/

// but if the while loop is missing, in that the browser isn't eager to repaint, the macrotask comes first
// but repaints will always jump in the task queue ahead, or "in an older state" of others if the browser
// deems it necessary, such as when the while loop blocks 100ms of tasking

/* without while loop / huge computation / low repaint prio:
    macrotask
    macrotask2 
    microtask
    queued macrotask
    aniframe
*/