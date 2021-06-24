const fs = require('fs');
const { promisify } = require('util');
const path = require('path');
const logger = require('../utils/logger');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const sqlFiles = [
  'create-table.sql',
  'constraints.sql',
  'triggers.sql',
  'insert-data.sql',
  'view-script.sql',
];

const bundledSqlFileName = 'final-sql-script.sql';

const main = async () => {
  const dist = path.resolve(__dirname, '../sql', bundledSqlFileName);
  const readContents = await Promise.all(
    sqlFiles.map((sqlFile) => {
      const filePath = path.resolve(__dirname, '../sql', sqlFile);
      logger.log('Processing file', filePath);
      return readFileAsync(filePath);
    }),
  );
  const contents = sqlFiles.map((sqlFile, index) => {
    return `-- file: ${sqlFile}\n\n${readContents[index]}`;
  });

  await writeFileAsync(dist, contents.join('\n\n'));

  logger.log('Done.');
};

main();
