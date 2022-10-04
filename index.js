const { Worker } = require('worker_threads');
const axios = require('axios');
const cheerio = require('cheerio');
const workDir = __dirname+"/dbWorker.js";

const fetchData = async (url) => {
  console.log("Crawling data...");

  const response = await axios(url);
  if(response.status !== 200) throw new Error("Could not fetch data"); 
  return response;
}

const formatStr = (arr, dataObj) => {
  // regex to match all the words before the first digit
  let regExp = /[^A-Z]*(^\D+)/;
  let newArr = arr[0].split(regExp);
  dataObj[newArr[1]] = newArr[2];
}

const mainFunc = async () => {
  const url = "https://www.iban.com/exchange-rates";
  const response = await fetchData(url).catch(err => { throw err });
  const { data: html } = response;
  if(!html) throw new Error("Invalid data Object");

  const dataObj = new Object();

  const $ = cheerio.load(html);

  const dataTable = $('.table.table-bordered.table-hover.downloads > tbody > tr');

  //Loop through all the table rows and get table data
  dataTable.each(function() {
    //Get all the text in all the td elements
    const title = $(this).find('td').text();
    let newStr = title.split("\t");
    newStr.shift();
    formatStr(newStr, dataObj);
  })
  
  return dataObj;
}

mainFunc().then(data => {
  //start worker 
  const worker = new Worker(workDir);

  console.log("Sending crawled data to dbWorker...");
  // send formatted data to worker thread
  worker.postMessage(data);

  //listen to message from worker thread
  worker.on("message", message => {
    console.log(message);
  })
})