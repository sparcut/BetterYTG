const fs = require('fs');
const path = require('path');

const mustacheFormat = (string, replacements) => {
  return string.replace(/\{\{(.*?)\}\}/g, (_, key) => replacements[key]);
}

const wordReplacements = {
  'colon': ':'
}

const fileArr = [];

fs.readdir('.', (err, files) => {
  files.forEach((rawFile) => {
    const file = path.posix.parse(rawFile);
    if(file.ext === '.png' || file.ext === '.gif') {
      const needsFormat = file.name.indexOf('{') !== -1;
      if(needsFormat) {
        fileArr.push([ mustacheFormat(file.name, wordReplacements), rawFile ]);
      } else {
        fileArr.push([ file.name, rawFile ]);
      }
    }
  });

  fileArr.sort((a, b) => (
    a[0] < b[0] ? 
      -1 : 
      (a[0] > b[0] ?
        1 :
        0)
  ));

  const JSONString = JSON
    .stringify(fileArr, null, 2)
    .replace(/\[\s{5}"/g, '[ "') // Removes whitespace/newline in multi line array (at start)
    .replace(/",\s{4}/g, '",') // Removes newline in mutli line array (inside array)
    .replace(/"\s{3}]/g, '" ]'); // Removes whitespace/newline in multi line array (at end)

  fs.writeFile('./dictionary.json', JSONString, (err) => {
    if(err) return console.log(err);
    console.log('Done');
  });
});