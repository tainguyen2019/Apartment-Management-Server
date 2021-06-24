const dbService = require('../services/db.service');

const processParams = (params) => {
  const keys = Object.keys(params);
  const conditionParams = [];
  let page = 0;
  let pageSize = 0;

  keys.forEach((key) => {
    const value = params[key];
    if (key === 'page') {
      page = Number.parseInt(value);
    } else if (key === 'pageSize') {
      pageSize = Number.parseInt(value);
    } else {
      conditionParams.push({ key, value });
    }
  });

  return { conditionParams, limit: pageSize, offset: (page - 1) * pageSize };
};

const computeWhereClause = (conditions) => {
  const conditionArr = [];
  conditions.forEach((condition, index) => {
    const conditionString = `${condition.key}=$${index + 1}`;
    conditionArr.push(conditionString);
  });

  const whereClause = `where ${conditionArr.join(' and ')}`;

  return whereClause;
};

const createGetTotalDataWithParams = (tableName) => async (params) => {
  const selectClause = `select count(*) from ${tableName}`;
  const { conditionParams } = processParams(params);
  let whereClause = '';

  const queryArgs = conditionParams.map((condition) => condition.value);

  if (conditionParams.length > 0) {
    whereClause = computeWhereClause(conditionParams);
  }

  const queryString = [selectClause, whereClause].join(' ');
  const { rows } = await dbService.query(queryString, queryArgs);

  if (rows.length === 0) return 0;

  return rows[0].count;
};

const createGetDataWithParams = (tableName) => async (params) => {
  const selectClause = `select * from ${tableName}`;
  const { conditionParams, limit, offset } = processParams(params);
  const queryArgs = [];
  const paramLength = conditionParams.length;
  let whereClause, limitClause, offsetClause;

  if (conditionParams.length > 0) {
    const conditionValues = conditionParams.map((condition) => condition.value);
    queryArgs.push(...conditionValues);
    whereClause = computeWhereClause(conditionParams);
  }

  if (limit) {
    queryArgs.push(limit);
    limitClause = `limit $${paramLength + 1}`;
  }

  if (offset) {
    queryArgs.push(offset);
    offsetClause = `offset $${paramLength + 2}`;
  }

  const queryString = [
    selectClause,
    whereClause,
    limitClause,
    offsetClause,
  ].join(' ');

  const { rows } = await dbService.query(queryString, queryArgs);

  if (rows.length === 0) {
    return [];
  }
  return rows;
};

module.exports = {
  createGetDataWithParams,
  createGetTotalDataWithParams,
  computeWhereClause,
  processParams,
};
