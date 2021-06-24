const TABLE_NAMES = require('../constants/tables');
const VIEW_NAMES = require('../constants/views');
const {
  generateWhereParams,
  stringOperatorGenerator,
  rangeOperatorGenerator,
  equalOperatorGenerator,
  notEqualOperatorGenerator,
  generateWhereParamsWithDateRange,
} = require('../utils/db');
const dbService = require('../services/db.service');
const { isNullable } = require('../utils/common');
const { WATER_INDEX_STATUSES } = require('../constants/common');

const operatorMapping = {
  apartment_number: stringOperatorGenerator,
  block_number: stringOperatorGenerator,
  date: rangeOperatorGenerator,
};

// Split from_date, to_date and push to date column condition
const customGenerateWhereParams = (params) =>
  generateWhereParamsWithDateRange(params, operatorMapping);

class WaterIndex {
  constructor() {
    this.tableName = TABLE_NAMES.water_index;
    this.viewName = VIEW_NAMES.water_index;
  }

  search(params, limit, offset) {
    const whereParams = customGenerateWhereParams(params);
    return dbService.search(this.viewName, '*', whereParams, limit, offset);
  }

  create(params) {
    return dbService.insertInto(this.tableName, {
      ...params,
      status: WATER_INDEX_STATUSES.draft,
    });
  }

  async count(params = {}) {
    const whereParams = customGenerateWhereParams(params);
    const result = await dbService.count(this.viewName, whereParams);

    return result.rows[0].count;
  }

  update(id, values) {
    const whereParams = generateWhereParams({ id }, operatorMapping);
    return dbService.update(this.tableName, values, whereParams);
  }

  async exist({ apartment_id: apartmentId, date, id = null }) {
    const params = { apartment_id: apartmentId, date };
    if (!isNullable(id)) {
      params.id = id;
    }

    const whereParams = generateWhereParams(params, {
      ...operatorMapping,
      date: equalOperatorGenerator,
      id: notEqualOperatorGenerator,
    });

    const result = await dbService.count(this.tableName, whereParams);
    const count = Number(result.rows[0].count);

    return count === 1;
  }

  async getLastRecord({ apartment_id: apartmentId, id = null }) {
    const params = { apartment_id: apartmentId };
    if (!isNullable(id)) {
      params.id = id;
    }
    const whereParams = generateWhereParams(params, {
      id: notEqualOperatorGenerator,
    });
    const result = await dbService.search(this.viewName, '*', whereParams, 1);

    return result.rows[0];
  }

  async isLastRecordId(id, { apartment_id: apartmentId }) {
    const lastRecord = await this.getLastRecord({ apartment_id: apartmentId });

    return lastRecord && id === lastRecord.id;
  }

  confirm(id) {
    return this.update(id, {
      status: WATER_INDEX_STATUSES.confirmed,
    });
  }
}

const waterIndexModel = new WaterIndex();

module.exports = waterIndexModel;
