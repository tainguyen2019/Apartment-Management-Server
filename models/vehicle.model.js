const TABLE_NAMES = require('../constants/tables');
const VIEW_NAMES = require('../constants/views');
const {
  generateWhereParams,
  stringOperatorGenerator,
  notEqualOperatorGenerator,
} = require('../utils/db');
const dbService = require('../services/db.service');

const operatorMapping = {
  plate_number: stringOperatorGenerator,
  identity_card_number: stringOperatorGenerator,
  apartment_number: stringOperatorGenerator,
  block_number: stringOperatorGenerator,
  parking_no: stringOperatorGenerator,
};

class Vehicle {
  constructor() {
    this.tableName = TABLE_NAMES.vehicle;
    this.viewName = VIEW_NAMES.vehicle;
  }

  search(params, limit, offset) {
    const whereParams = generateWhereParams(params, operatorMapping);
    return dbService.search(this.viewName, '*', whereParams, limit, offset);
  }

  create(params) {
    return dbService.insertInto(this.tableName, {
      ...params,
      status: 'Chờ xử lý',
    });
  }

  async count(params = {}) {
    const whereParams = generateWhereParams(params, operatorMapping);
    const result = await dbService.count(this.viewName, whereParams);

    return result.rows[0].count;
  }

  update(id, values) {
    const whereParams = generateWhereParams({ id }, operatorMapping);
    return dbService.update(this.tableName, values, whereParams);
  }

  approve(id, values) {
    return this.update(id, {
      status: 'Đang gửi',
      parking_no: values.parking_no,
      start_date: new Date(),
    });
  }

  /**
   * Check if $packing_no is valid
   * @param {string} id ID
   * @param {string} parkingNo Packing Number
   */
  async isValidParkingNo(id, parkingNo) {
    const whereParams = generateWhereParams(
      { id, parking_no: parkingNo },
      {
        ...operatorMapping,
        id: notEqualOperatorGenerator,
      },
    );
    const result = await dbService.search(this.viewName, 'id', whereParams);
    const ids = result.rows.map(({ id }) => id);

    return ids.length === 0;
  }

  /**
   * Check if record exist
   * @param {string} id Record ID
   */
  async exist(id) {
    const count = await this.count({ id });
    return Number(count) === 1;
  }

  /**
   * Cancel a vehicle registration
   * @param {string} id Record ID
   */
  cancel(id) {
    return this.update(id, {
      status: 'Đã hủy',
      cancellation_date: new Date(),
    });
  }
}

const vehicleModel = new Vehicle();

module.exports = vehicleModel;
