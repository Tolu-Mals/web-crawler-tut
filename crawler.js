const Crawler = require('crawler');

const crawlerInstance = new Crawler({
  maxConnections: 10,
  callback: (error, res, done) => {
    if(error) console.log(error);
    else {
      const $ = res.$;
      const dataTable = $('.table.table-bordered.table-hover.downloads > tbody > tr');
      dataTable.each(function () {
        let title = $(dataTable).find('td').text();
        console.log(title);
      })
    }
    done();
  }
});

crawlerInstance.queue('https://www.iban.com/exchange-rates');
// crawlerInstance.queue([{
//   uri: 'http://www.facebook.com',
//   callback: (error, res, done) => {
//     if(error) console.log(error);
//     else console.log(res);

//     done
//   }
// }])