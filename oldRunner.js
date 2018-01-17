var http = require('http');
const cheerio = require("cheerio");
const fs = require('fs');

var hostname = 'http://www.saic.edu';

var links = [
  // '/vap/past/2016-present/',
  // '/vap/past/20112015/',
  '/vap/past/20062010/',
  '/vap/past/20002005/'
];

var getElementsOld = function(x) {
  var stream = fs.createWriteStream('audioFilesOld.txt', {flags: 'a'});

  let $ = cheerio.load(x);
  let lis = $('li');

  lis.each(function(i, elem) {
    let audio = $(elem).find('a')
    if (audio && audio.attr('href') ) {
      var href = audio.attr('href');
      if (href.indexOf('mp3') > 0) {
        console.log( $(elem).text() );
        stream.write( $(elem).text() + "\n");
        console.log( audio.attr('href') );
        stream.write( audio.attr('href') + "\n");
      }
    }
  });
}

var getElements = function(x) {
  var stream = fs.createWriteStream('audioFiles.txt', {flags: 'a'});

  let $ = cheerio.load(x);
  let lis = $('li.mp3.present');
  lis.each(function(i, item) {
    // Print text.
    // console.log( $(item).text() );
    stream.write( $(item).text() );
    stream.write( "\n" );

    // Look for sibling with audio element.
    let nextSibling = $(item).next();
    if ( $(nextSibling).hasClass('mp3link') ) {
    //   console.log(nextSibling);
      let audio = $(nextSibling).find('audio').find('source');
      stream.write( audio.attr('src') );
      stream.write( "\n" );
      // console.log( audio.attr('src'), 'audio');
      // for(var propName in audio) {
      //   console.log(propName);
      // }
    }
  });
return;
  let mp3s = $('div.mp3link');
  mp3s.each(function(i, elem) {
    // console.log(elem.name);
    let audio = $(elem).find('audio').find('source');
    console.log(audio.attr('src'));
  });
}

links.forEach(function(x) {
  // var page = http.get(hostname + x);
  var page = http.request({host: 'www.saic.edu', path: x}, function(res) {
    let body = '';
    res.on('data', function(chunk) {
      body += chunk;
    })
    res.on('end', function() {
      getElementsOld(body);
    })
    // console.log(res);
  });
  page.on('error', function(e) {
    console.log(e);
  })
  page.end();
});
