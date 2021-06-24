const CustomError = require('../constants/CustomError');
const receiptModel = require('../models/receipt.model');
const logger = require('../utils/logger');

const search = async (req, res, next) => {
  try {
    const { pageSize = 10, page = 1, ...queryParams } = req.query;
    const searchParams = {
      ...queryParams,
    };

    if (req.apartment_id) {
      searchParams.apartment_id = req.apartment_id;
    }
    const totalRecords = await receiptModel.count(searchParams);
    const offset = (page - 1) * pageSize;
    const { rows: receipts } = await receiptModel.search(
      searchParams,
      pageSize,
      offset,
    );
    const totalPages = Math.ceil(totalRecords / pageSize);

    res.json({
      message: 'Yêu cầu thực hiện thành công.',
      data: {
        receipts,
        totalPages,
        page: Number(page),
        pageSize: Number(pageSize),
      },
    });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { receipt, details } = req.body;
    if (details.length === 0)
      throw new CustomError('Vui lòng nhập ít nhất một chi tiết');
    const { rows } = await receiptModel.create({
      ...receipt,
      status: 'Chưa thanh toán',
    });

    const { id } = rows[0];
    const { rowCount } = receiptModel.createDetail(id, details);

    res.json({
      message: 'Phiếu thu đã được lưu thành công',
      data: { rowCount },
    });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

const getDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows: details } = await receiptModel.getDetails(id);

    res.json({
      message: 'Yêu cầu thực hiện thành công.',
      data: {
        details,
      },
    });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

const approve = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rowCount } = await receiptModel.approve(id);

    res.json({
      message: 'Phiếu thu đã được thanh toán thành công.',
      data: {
        rowCount,
      },
    });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

const generate = async (req, res, next) => {
  try {
    const {
      year,
      month,
      staff_id: staffID,
      apartment_id: apartmentID,
    } = req.body;

    const isExistReceipt = await receiptModel.isExistGenerateDetails(
      apartmentID,
      year,
      month,
    );
    if (isExistReceipt)
      throw new CustomError(
        'Phiếu thu này đã được tạo. Vui lòng xóa phiếu thu đã phát sinh và thử lại',
      );

    const { receipt, details } = await receiptModel.prepareDetailReceipt(
      apartmentID,
      staffID,
      year,
      month,
    );

    const { rows: receipts } = await receiptModel.create(receipt);
    const { rowCount } = await receiptModel.createDetail(
      receipts[0].id,
      details,
    );

    res.json({
      message: 'Yêu cầu thực hiện thành công.',
      data: {
        receipt,
        details,
      },
    });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

const deleteReceipt = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rowCount } = await receiptModel.delete(id);

    res.json({
      message: 'Phiếu thu đã được xóa thành công.',
      data: {
        rowCount,
      },
    });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

module.exports = {
  search,
  create,
  approve,
  getDetails,
  generate,
  deleteReceipt,
};
