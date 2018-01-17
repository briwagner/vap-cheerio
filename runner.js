var http = require('http');
const cheerio = require("cheerio");

var hostname = 'http://www.saic.edu';

var links = [
  '/vap/past/2016-present/',
  '/vap/past/20112015/',
  // '/vap/past/20062010/',
  // '/vap/past/20002005/'
];

var getElements = function(x) {
  let $ = cheerio.load(x);
  let lis = $('li.mp3.present');
  lis.each(function(i, item) {
    // console.log( $(item).text() );
    let nextSibling = item.nextSibling;
    console.log( $(nextSibling).tagName );
    if ( $(nextSibling).hasClass('mp3link') ) {
      let audio = nextSibling.find('audio');
      // console.log(audio);
    } else {
      // console.log( $(nextSibling).name );
    }
  })
}

links.forEach(function(x) {
  // var page = http.get(hostname + x);
  var page = http.request({host: 'www.saic.edu', path: x}, function(res) {
    let body = '';
    res.on('data', function(chunk) {
      body += chunk;
    })
    res.on('end', function() {
      getElements(body);
    })
    // console.log(res);
  });
  page.on('error', function(e) {
    console.log(e);
  })
  page.end();
});
