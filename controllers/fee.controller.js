const CustomError = require('../constants/CustomError');
const feeModel = require('../models/fee.model');
const { failChange } = require('../constants/errors');

const getFees = async (_req, res, next) => {
  try {
    const fees = await feeModel.getFees();

    res.json({
      data: { fees },
      message: 'Yêu cầu thực hiện thành công',
    });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const params = req.body;
    const { rowCount } = await feeModel.create(params);

    res.json({
      message: 'Thông tin đã được lưu lại',
      data: { rowCount },
    });
  } catch (e) {
    next(
      new CustomError('Thông tin chưa được lưu lại. Vui lòng thử lại.', 400),
    );
  }
};

const update = async (req, res, next) => {
  try {
    const params = req.body;
    const { id } = req.params;
    const { rowCount } = await feeModel.update(params, id);

    res.json({
      message: 'Thay đổi thông tin thành công.',
      data: {
        rowCount,
      },
    });
  } catch (e) {
    next(failChange);
  }
};

module.exports = {
  getFees,
  create,
  update,
};
