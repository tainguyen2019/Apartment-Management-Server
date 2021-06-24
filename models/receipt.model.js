const {
  generateWhereParams,
  stringOperatorGenerator,
  rangeOperatorGenerator,
  generateWhereParamsWithDateRange,
} = require('../utils/db');
const VIEW_NAMES = require('../constants/views');
const TABLE_NAMES = require('../constants/tables');
const { generateDetailReceiptQuery } = require('../constants/query');
const dbService = require('../services/db.service');

const operatorMapping = {
  content: stringOperatorGenerator,
  apartment_number: stringOperatorGenerator,
  block_number: stringOperatorGenerator,
  date: rangeOperatorGenerator,
};

const customGenerateWhereParams = (params) =>
  generateWhereParamsWithDateRange(params, operatorMapping);

class Receipt {
  constructor() {
    this.viewName = VIEW_NAMES.receipt;
    this.detailViewName = VIEW_NAMES.receiptDetail;
    this.tableName = TABLE_NAMES.receipt;
    this.detailTableName = TABLE_NAMES.receiptDetail;
  }

  search(params, limit, offset) {
    const whereParams = customGenerateWhereParams(params, operatorMapping);
    return dbService.search(this.viewName, '*', whereParams, limit, offset);
  }

  create(params) {
    return dbService.insertInto(this.tableName, params, 'id');
  }

  async count(params = {}) {
    const whereParams = customGenerateWhereParams(params, operatorMapping);
    const result = await dbService.count(this.viewName, whereParams);

    return result.rows[0].count;
  }

  update(id, values) {
    const whereParams = generateWhereParams({ id });
    return dbService.update(this.tableName, values, whereParams);
  }

  getDetails(id) {
    const whereParams = generateWhereParams({ receipt_id: id });
    return dbService.search(this.detailViewName, '*', whereParams);
  }

  createDetail(id, params) {
    const parseParams = params.map((item) => ({ receipt_id: id, ...item }));
    return dbService.insertInto(this.detailTableName, parseParams);
  }

  approve(id) {
    return this.update(id, {
      status: 'Đã thanh toán',
    });
  }

  async prepareDetailReceipt(apartmentID, staffID, year, month) {
    const queryParams = [
      apartmentID,
      apartmentID,
      year,
      month,
      year,
      month,
      apartmentID,
      year,
      month,
      year,
      month,
      apartmentID,
      year,
      month,
      apartmentID,
      year,
      month,
    ];

    const { rows: details } = await dbService.query(
      generateDetailReceiptQuery,
      queryParams,
    );

    const total = details.reduce(
      (total, { factor, price }) => total + factor * price,
      0,
    );
    const content = `Thu phí chung cư tháng ${month}/${year}`;
    const status = 'Chưa thanh toán';
    const type = 'generate';
    const receipt = {
      content,
      total,
      month,
      year,
      type,
      status,
      apartment_id: apartmentID,
      staff_id: staffID,
    };

    return { receipt, details };
  }

  async isExistGenerateDetails(apartmentID, year, month) {
    const whereParams = generateWhereParams({
      apartment_id: apartmentID,
      year,
      month,
    });
    const { rows } = await dbService.search(this.tableName, '*', whereParams);

    if (rows.length === 0) return false;

    return true;
  }

  async delete(id) {
    const queryDeleteReceipt = `delete from ${this.tableName} where id=$1`;
    const queryDeleteDetails = `delete from ${this.detailTableName} where receipt_id=$1`;

    const { rowCount: details } = await dbService.query(queryDeleteDetails, [
      id,
    ]);

    if (details === 0) return;

    return dbService.query(queryDeleteReceipt, [id]);
  }
}

const receiptModel = new Receipt();

module.exports = receiptModel;
