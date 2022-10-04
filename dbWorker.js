const { parentPort } = require('worker_threads');
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-credentials.json');

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const db = admin.firestore();

const date = new Date();
const currDate = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;

//receive crawled data from main thread
parentPort.once("message", message => {
  console.log("Received data from mainWorker...");

  //store data gotten from main thread in database
  db.collection("Rates").doc(currDate).set({
    rates: JSON.stringify(message)
  }).then(() => {
    //send data back to main thread if operation was successful
    parentPort.postMessage("Data saved successfully");
  })
  .catch(err => console.log(err));
})