const { toArray, isNullable } = require('./common');

const convertToSetValues = (array, parseFn = String) => {
  const convertedArray = array.map((item) => `'${parseFn(item)}'`);
  return `(${convertedArray.join(',')})`;
};

/**
 * Create operator generator
 * @param {string} operator Operator
 * @returns {(value: any) => {value: any; operator: string}} operator generator
 */
const createOperatorGenerator = (operator) => (value) => ({
  value,
  operator,
});

/**
 * Equal operator generator
 */
const equalOperatorGenerator = createOperatorGenerator('=');

/**
 * not equal operator generator
 */
const notEqualOperatorGenerator = createOperatorGenerator('!=');

/**
 * String operator generator
 * @param {string} value Value
 * @returns {{value: string; operator: 'ilike'}}
 */
const stringOperatorGenerator = (value) => ({
  value: `%${value}%`,
  operator: 'ilike',
});

/**
 * Range operator
 * Support number range $fromValue <= column_name <= $toValue
 * @param {number | number[]} value range
 * @returns {{value: any; operator: string}[]}
 */
const rangeOperatorGenerator = (value) => {
  const [fromValue, toValue] = toArray(value);
  const result = [];

  if (!isNullable(fromValue)) {
    result.push({
      operator: '>=',
      value: fromValue,
    });
  }

  if (!isNullable(toValue)) {
    result.push({
      operator: '<=',
      value: toValue,
    });
  }

  return result;
};

/**
 * Generate where params
 * @param {{[colName: string]: any}} params Params
 * @param {{[colName: string]: (value: any) => {value: any; operator: string} | {value: any; operator: string}[]}} operatorMapping
 * @returns {{[colName: string]: {value: any; operator: string}[]}}
 */
const generateWhereParams = (params, operatorMapping = {}) => {
  const whereParams = Object.entries(params).reduce((prev, [key, value]) => {
    const generator = operatorMapping[key] || equalOperatorGenerator;
    return {
      ...prev,
      [key]: toArray(generator(value)),
    };
  }, {});

  return whereParams;
};

/**
 * Generate where conditions
 * @param {{[colName: string]: {value: any; operator: string}[]}} whereParams Where params
 * @param {number} lastIndex Last index of placeholder $i
 */
const generateWhereConditions = (whereParams, lastIndex = 0) => {
  const whereColumns = Object.keys(whereParams);
  const whereConditions = whereColumns.reduce((prev, column) => {
    const prevCount = prev.length;
    const paramObjects = toArray(whereParams[column]);
    const condition = paramObjects.map(({ operator }, index) => {
      const placeholderIndex = lastIndex + prevCount + index + 1;
      const statement = `${column} ${operator} $${placeholderIndex}`;

      return statement;
    });

    return prev.concat(condition);
  }, []);

  return whereConditions;
};

/**
 * Generate where arguments
 * @param {{[colName: string]: {value: any; operator: string}[]}} whereParams Where params
 * @return {any[]} arguments array
 */
const generateWhereArguments = (whereParams) => {
  const whereColumns = Object.keys(whereParams);
  const args = whereColumns.reduce((prev, column) => {
    const conditionObjects = toArray(whereParams[column]);
    return prev.concat(conditionObjects.map(({ value }) => value));
  }, []);

  return args;
};

/**
 * Generate select clause
 * @param {string | string[]} selectColumns Select columns
 * @returns {string} select clause
 */
const generateSelectClause = (selectColumns) => {
  const columns = toArray(selectColumns);
  const selectClause = `select ${columns.join(',')}`;

  return selectClause;
};

/**
 * Generate where clause
 * @param {{[colName: string]: {value: any; operator: string}[]}} whereParams Where params
 * @param {number} lastIndex Last index of placeholder $i
 * @returns {string} where clause
 */
const generateWhereClause = (whereParams, lastIndex = 0) => {
  const whereConditions = generateWhereConditions(whereParams, lastIndex);
  const whereClause = whereConditions.length
    ? `where ${whereConditions.join(' and ')}`
    : '';

  return whereClause;
};

/**
 * Generate records arguments
 * @param {Record<string, any>| Array<Record<string, any>>} records Records
 * @returns {any[]} arguments
 */
const generateRecordArguments = (records) => {
  const parsedRecords = toArray(records);
  const schemaColumns = Object.keys(parsedRecords[0]);
  const flattedArgs = parsedRecords
    .map((recordParams) => schemaColumns.map((column) => recordParams[column]))
    .flat();

  return flattedArgs;
};

/**
 * Generate values statements fir insert queries
 * @param {Record<string, any>| Array<Record<string, any>>} records Records
 * @returns {any[]} values statements
 */
const generateValuesStatements = (records) => {
  const parsedRecords = toArray(records);
  const schemaColumns = Object.keys(parsedRecords[0]);
  const numOfColumns = schemaColumns.length;

  const valuesStatements = parsedRecords.map((_, recordIndex) => {
    const placeholders = schemaColumns.map((_, columnIndex) => {
      const index = recordIndex * numOfColumns + (columnIndex + 1);

      return `$${index}`;
    });

    return `(${placeholders.join(',')})`;
  });

  return valuesStatements;
};

/**
 * Generate returning clause for select queries
 * @param {string | string[]} returnColumns Returning columns
 * @returns {string} returning clause
 */
const generateReturningClause = (returnColumns) => {
  const parsedReturnColumns = toArray(returnColumns);
  const returningClause = parsedReturnColumns.length
    ? `returning ${parsedReturnColumns.join(',')}`
    : '';

  return returningClause;
};

/**
 * generate value statements for update queries
 * @param {{[columnName: string]: any;}} updateValues Update values
 * @returns {string[]} value statements
 */
const generateUpdateValueStatements = (updateValues) => {
  const updatedColumns = Object.keys(updateValues);
  const valueStatements = updatedColumns.map(
    (column, index) => `${column} = $${index + 1}`,
  );

  return valueStatements;
};

/**
 * Split from_date, to_date and push to $dateColumnName column condition
 * Returns where params
 *
 * @param {{[colName: string]: any}} params Params
 * @param {{[colName: string]: (value: any) => {value: any; operator: string} | {value: any; operator: string}[]}} operatorMapping
 * @param {string} dateColumnName Date column name
 * @returns {{[colName: string]: {value: any; operator: string}[]}} where params
 */
const generateWhereParamsWithDateRange = (
  params,
  operatorMapping,
  dateColumnName = 'date',
) => {
  const { from_date: fromDate, to_date: toDate, ...rest } = params;

  // Case: both dates are nullable
  if ([fromDate, toDate].every(isNullable)) {
    return generateWhereParams(rest, operatorMapping);
  }

  // Case: have date range to query
  const whereParams = generateWhereParams(
    {
      ...rest,
      [dateColumnName]: [fromDate, toDate],
    },
    operatorMapping,
  );
  return whereParams;
};

module.exports = {
  convertToSetValues,
  createOperatorGenerator,
  equalOperatorGenerator,
  generateRecordArguments,
  generateReturningClause,
  generateSelectClause,
  generateUpdateValueStatements,
  generateValuesStatements,
  generateWhereArguments,
  generateWhereClause,
  generateWhereConditions,
  generateWhereParams,
  notEqualOperatorGenerator,
  rangeOperatorGenerator,
  stringOperatorGenerator,
  generateWhereParamsWithDateRange,
};
