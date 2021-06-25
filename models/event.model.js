const {
  generateWhereParams,
  stringOperatorGenerator,
  rangeOperatorGenerator,
  generateWhereParamsWithDateRange,
} = require('../utils/db');
const dbService = require('../services/db.service');
const VIEW_NAMES = require('../constants/views');
const TABLE_NAMES = require('../constants/tables');

const operatorMapping = {
  name: stringOperatorGenerator,
  apartment_number: stringOperatorGenerator,
  block_number: stringOperatorGenerator,
  staff_name: stringOperatorGenerator,
  date: rangeOperatorGenerator,
};

const customGenerateWhereParams = (params) =>
  generateWhereParamsWithDateRange(params, operatorMapping);

class Event {
  constructor() {
    this.tableName = TABLE_NAMES.event;
    this.viewName = VIEW_NAMES.event;
  }

  search(params, limit, offset) {
    const whereParams = customGenerateWhereParams(params);
    return dbService.search(this.viewName, '*', whereParams, limit, offset);
  }

  create(params) {
    return dbService.insertInto(this.tableName, params);
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

  approve(id, approverID) {
    return this.update(id, {
      status: 'Đã phê duyệt',
      approver_id: approverID,
    });
  }

  cancel(id, note, approver) {
    return this.update(id, {
      note,
      approver_id: approver,
      status: 'Đã hủy',
    });
  }

  async isOverlapDateTime(data, id = '') {
    if (await this.isOverlapStartTime(data, id)) return true;

    if (await this.isOverlapEndTime(data, id)) return true;

    if (await this.isIncludedTime(data, id)) return true;

    return false;
  }

  // case 1: bookedStart <= startInput <= bookedEnd
  async isOverlapStartTime(data, id = '') {
    // eslint-disable-next-line camelcase
    const { start_time, date } = data;
    const whereParams = {
      date: { value: date, operator: '=' },
      start_time: { value: start_time, operator: '<=' },
      end_time: { value: start_time, operator: '>=' },
    };
    if (id) {
      whereParams.id = { value: id, operator: '<>' };
    }
    const { rows } = await dbService.count(this.tableName, whereParams);

    return Number(rows[0].count) > 0;
  }

  // case 2: bookedStart <= endInput <= bookedEnd
  async isOverlapEndTime(data, id = '') {
    // eslint-disable-next-line camelcase
    const { end_time, date } = data;
    const whereParams = {
      date: { value: date, operator: '=' },
      start_time: { value: end_time, operator: '<=' },
      end_time: { value: end_time, operator: '>=' },
    };
    if (id) {
      whereParams.id = { value: id, operator: '<>' };
    }

    const { rows } = await dbService.count(this.tableName, whereParams);

    return Number(rows[0].count) > 0;
  }

  // case 3: startInput <= bookedStart && endInput >= bookedEnd
  async isIncludedTime(data, id = '') {
    // eslint-disable-next-line camelcase
    const { start_time, end_time, date } = data;
    const whereParams = {
      date: { value: date, operator: '=' },
      start_time: { value: start_time, operator: '>=' },
      end_time: { value: end_time, operator: '<=' },
    };
    if (id) {
      whereParams.id = { value: id, operator: '<>' };
    }

    const { rows } = await dbService.count(this.tableName, whereParams);

    return Number(rows[0].count) > 0;
  }
}

const eventModel = new Event();

module.exports = eventModel;

/* 
  validateDateTime(){
    p1 = isValidDate();
    if(p1) return true;

    c1 = isOverlapStartRange();
    if(c1) return false;

    c2 = isOverlapEndRange();
    if(c2) return false;

    c3 = isOverlapMiddleRange();
    if(c3) return false;

    return true;
  }

  isOverlapStartRange(){
    start <= bookedStart <= end
  }

  isOverlapEndRange(){
    start <= bookedEnd <= end
  }

  isOverlapMiddleRange(){

  }


  case 1: bookedStart <= startInput <= bookedEnd
  case 2: bookedStart <= endInput <= bookedEnd
  case 3: startInput <= bookedStart && endInput >= bookedEnd

*/
