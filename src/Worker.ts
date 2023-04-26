/**
 * background worker
 */

self.addEventListener('message', e => {
    const message = e.data || e;
    console.log("Worker:", message);
});
