const dayjs = require('dayjs');
const waterIndexModel = require('../models/water-index.model');
const { isNullable } = require('../utils/common');
const CustomError = require('../constants/CustomError');
const { CLIENT_DATE_FORMAT } = require('../constants/common');

const search = async (req, res, next) => {
  try {
    const { pageSize = 10, page = 1, ...queryParams } = req.query;

    const totalRecords = await waterIndexModel.count(queryParams);
    const offset = (page - 1) * pageSize;
    const { rows: waterIndexes } = await waterIndexModel.search(
      queryParams,
      pageSize,
      offset,
    );
    const totalPages = Math.ceil(totalRecords / pageSize);

    res.json({
      message: 'Yêu cầu thực hiện thành công.',
      data: {
        page,
        pageSize,
        totalPages,
        waterIndexes: waterIndexes,
        total: totalRecords,
      },
    });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const {
      date,
      apartment_id: apartmentId,
      start_index: startIndex,
      end_index: endIndex,
    } = req.body;

    // check water_index for selected date is existed
    // check if selected_date is smaller or equal the previous water_index's date
    // check start_index
    //    case: start_index = null
    //      check end_index is smaller or equal the previous end_index
    //    case: start_index > 0
    //      check if start_index is smaller|larger than the previous water_index's end_index
    //      check if start_index >= end_index
    //    case: start_index = 0
    //      check if (0 <= start_index < end_index ) => go ahead

    // Check if water index has date & apartment_id is existed
    const isExisted = await waterIndexModel.exist({
      apartment_id: apartmentId,
      date,
    });

    if (isExisted) {
      throw new CustomError('Chỉ số nước của ngày vừa chọn đã tồn tại.', 400);
    }

    const lastRecord = await waterIndexModel.getLastRecord({
      apartment_id: apartmentId,
    });

    // Check if water index has date & apartment_id is valid
    const lastDate = lastRecord ? lastRecord.date : '';

    if (lastDate && dayjs(lastDate).isAfter(dayjs(date), 'd')) {
      throw new CustomError(
        `Ngày vừa nhập nhỏ hơn ngày cuối kì gần nhất (${dayjs(lastDate).format(
          CLIENT_DATE_FORMAT,
        )})`,
        400,
      );
    }

    const isNullableStart = isNullable(startIndex);
    const lastIndex = Number(lastRecord ? lastRecord.end_index : 0);

    if (isNullableStart && endIndex <= lastIndex) {
      throw new CustomError(
        `Chỉ số mới phải lớn hơn chỉ số mới của kỳ gần nhất (${lastIndex}).`,
        400,
      );
    }

    // Check if the startIndex is different from the lastIndex
    if (startIndex > 0 && startIndex !== lastIndex) {
      throw new CustomError(
        `Chỉ số cũ vừa nhập phải bằng chỉ số mới của kỳ gần nhất (${lastIndex}).`,
        400,
      );
    }

    // Check if the startIndex is larger than the endIndex
    if (startIndex > endIndex) {
      throw new CustomError(`Chỉ số cũ phải nhỏ hơn chỉ số mới.`, 400);
    }

    const { rowCount } = await waterIndexModel.create({
      date,
      apartment_id: apartmentId,
      start_index: isNullableStart ? lastIndex : startIndex,
      end_index: endIndex,
    });

    res.json({
      message: 'Yêu cầu thực hiện thành công.',
      data: {
        rowCount,
      },
    });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      date,
      apartment_id: apartmentId,
      start_index: startIndex,
      end_index: endIndex,
    } = req.body;

    // can update only the latest water-index
    // check existed date
    // check if new_date is still the latest
    // check start_index:
    //  case null
    //    check end_index vs the previous end_index
    //  case 0
    //    go ahead
    //  case positive
    //    check start_index is smaller|larger than the previous end_index
    // check if end_index > start_index
    const isLastRecord = await waterIndexModel.isLastRecordId(id, {
      apartment_id: apartmentId,
    });

    if (!isLastRecord) {
      throw new CustomError('Chỉ được cập nhật chỉ số nước gân nhất.', 400);
    }

    // Check if water index has date & apartment_id is existed
    const isExisted = await waterIndexModel.exist({
      apartment_id: apartmentId,
      date,
      id,
    });

    if (isExisted) {
      throw new CustomError('Chỉ số nước của ngày vừa chọn đã tồn tại.', 400);
    }

    const previousRecord = await waterIndexModel.getLastRecord({
      apartment_id: apartmentId,
      id,
    });

    const lastDate = previousRecord ? previousRecord.date : '';

    if (lastDate && dayjs(date).isBefore(dayjs(lastDate))) {
      throw new CustomError(
        `Ngày vừa nhập phải lớn hơn ngày ghi nhận của kỳ gần nhất (${dayjs(
          lastDate,
        ).format(CLIENT_DATE_FORMAT)})`,
        400,
      );
    }

    const isNullableStart = isNullable(startIndex);
    const lastIndex = Number(previousRecord ? previousRecord.end_index : 0);

    if (isNullableStart && endIndex <= lastIndex) {
      throw new CustomError(
        `Chỉ số mới phải lớn hơn chỉ số mới của kỳ gần nhất (${lastIndex}).`,
        400,
      );
    }

    // Check if the startIndex is different from the lastIndex
    if (startIndex > 0 && startIndex !== lastIndex) {
      throw new CustomError(
        `Chỉ số cũ vừa nhập phải bằng chỉ số mới của kỳ gần nhất (${lastIndex}).`,
        400,
      );
    }

    // Check if the startIndex is larger than the endIndex
    if (startIndex > endIndex) {
      throw new CustomError(`Chỉ số cũ phải nhỏ hơn chỉ số mới.`, 400);
    }

    const { rowCount } = await waterIndexModel.update(id, {
      date,
      apartment_id: apartmentId,
      start_index: isNullableStart ? lastIndex : startIndex,
      end_index: endIndex,
    });

    res.json({
      message: 'Yêu cầu thực hiện thành công.',
      data: {
        rowCount,
      },
    });
  } catch (err) {
    next(err);
  }
};

const confirm = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rowCount } = await waterIndexModel.confirm(id);

    res.json({
      message: 'Yêu cầu thực hiện thành công.',
      data: {
        rowCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  search,
  create,
  update,
  confirm,
};
