const fs = require('fs');
const path = require('path');

const fileObj = {}

fs.readdir('.', (err, files) => {
  files.forEach((f) => {
    const file = path.posix.parse(f);
    if(file.ext === '.png' || file.ext === '.gif') {
      fileObj[file.name] = f;
    }
  });

  fs.writeFile('./dictionary.json', JSON.stringify(fileObj, null, 2), (err) => console.log('done - ' + err));
});