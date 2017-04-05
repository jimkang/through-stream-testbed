var assertNoError = require('assert-no-error');
var through2 = require('through2');
var curry = require('lodash.curry');

function ThroughStreamTestbed({
    transformFn,
    inputItems,
    checkCollectedStreamOutput,
    checkOutputItem
  }) {

  return throughStreamTestbed;

  function throughStreamTestbed(t) {
    var items = [];
    var stream = through2({objectMode: true}, transformFn);
    stream
      .on('error', reportError)
      .on('data', saveItem)
      .on('end', checkItems);

    inputItems.forEach(writeToStream);
    stream.end();

    function writeToStream(item) {
      stream.write(item);
    }

    function reportError(error) {
      assertNoError(t.ok, error, 'No error in stream.');
    }

    function saveItem(item) {
      items.push(item);
    }

    function checkItems() {
      checkCollectedStreamOutput(t, items);
      items.forEach(curry(checkOutputItem)(t));
      t.end();
    }
  }
}

module.exports = ThroughStreamTestbed;
