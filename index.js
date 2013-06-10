var $          = require('jquery'),
    request    = require('request'),
    growl      = require('growl'),
    url        = 'http://techcrunch.com/2013/06/10/live-blog-wwdc-2013-keynote/',
    lastCount  = 0,
    lineLength = 76,
    clearSeq   = "\033[2J\033[0f";

function printLines(text, max_length) {
  var words = text.split(' '), chunks = [], length = 0;
  words.forEach(function(word){
    if (length + word.length >= max_length){
      console.log(chunks.join(' ')); length = 0; chunks = [];
    }
    chunks.push(word); length += word.length + 1;
  });
  if (length > 0) { console.log(chunks.join(' ')); }
}

function printEntrySeperator() {
  console.log('');
  console.log(charLine('=', lineLength));
  console.log(charLine('=', lineLength));
  console.log('');
}

function printSectionSeperator() {
  console.log(charLine('-', lineLength));
}

function charLine(ch, length) {
  line = '';
  for (var i = 0; i < length; i++) {
    line += ch; 
  }
  return line;
}

function printEntry(el) {
  var els = $(el).find('p');
  var title = $(els[0]).text();
  var body = $(els[1]).text();
  printSectionSeperator();
  printLines(title, lineLength);
  printSectionSeperator();
  printLines(body, lineLength);
  printSectionSeperator();
  printEntrySeperator();
}

function growlNotification(els) {
  if (els.length) {
    growl('WWDC ' + els.length + ' announcements', {title: 'WWDC', sticky: true});
  }
}

function getData() {
  request(url, function (err, response, body) {
    if (!err && response.statusCode == 200) {
      var $body = $(body),
          els   = $body.find("#liveblog-entries .liveblog-entry-text").toArray().reverse().slice(lastCount);
      els.forEach(function(el){
        printEntry(el);
      });
      growlNotification(els);
      lastCount += els.length;
    }
  });
}

console.log(clearSeq);
getData(); setInterval(getData, 8000);

