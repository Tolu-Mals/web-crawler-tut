const { Worker, isMainThread, parentPort } = require('worker_threads');

/**
 * We use this to check if we're already in a worker thread,
 * without this check, we would keep creating worker threads
 * in an infinite loop.
 */

if(isMainThread){
  const worker = new Worker(__filename);
  worker.once('message', message => { console.log(message) });
  worker.postMessage('Main Thread: Hello!');
} else {
  parentPort.once('message', message => {
    console.log(message);
    parentPort.postMessage('Worker Thread: Hello!');
  })
}