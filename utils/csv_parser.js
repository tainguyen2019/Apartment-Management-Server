const fs = require('fs');
const csv = require('fast-csv');

const csvParser = (filePath) => {
  return new Promise((resolve, reject) => {
    const parsedRows = [];
    fs.createReadStream(filePath)
      .pipe(csv.parse({ headers: true }))
      .on('error', (error) => reject(error))
      .on('data', (row) => parsedRows.push(row))
      .on('end', (_rowCount) => {
        resolve(parsedRows);
      });
  });
};

module.exports = csvParser;
