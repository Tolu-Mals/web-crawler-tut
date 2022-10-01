const axios = require('axios');
const cheerio = require('cheerio');
const url = "https://www.iban.com/exchange-rates";

const fetchData = async () => {
  console.log("Crawling data...");

  const response = await axios(url);
  if(response.status !== 200) throw new Error("Could not fetch data"); 
  return response.data;
}

fetchData()
.then(html => {
  const $ = cheerio.load(html);
  const dataTable = $('.table.table-bordered.table-hover.downloads > tbody > tr');
  dataTable.each(function (){
    let title = $(this).find('td').text();
    console.log(title);
  })
})
.catch(err => console.log(err));

