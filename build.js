const csvParse = require('csv-parse');
const fs = require('fs');
const os = require('os');

var map = new Map();
var stream = fs.createReadStream('index.csv').pipe(csvParse({columns: true, comment: '#'}));
stream.on('error', console.log);
stream.on('data', (r) => {
  r.cu = parseFloat(r.cu);
  map.set(r.group, r);
});
stream.on('end', () => {
  var z = `const CORPUS = new Map([${os.EOL}`;
  for(var [k, v] of map)
    z += `  ["${k}", ${JSON.stringify(v).replace(/\"(\w+)\":/g, '$1:')}],${os.EOL}`;
  z += `]);${os.EOL}`;
  z += `module.exports = CORPUS;${os.EOL}`;
  fs.writeFileSync('corpus.js', z);
});
