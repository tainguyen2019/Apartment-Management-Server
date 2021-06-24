const CustomError = require('../constants/CustomError');
const deviceModel = require('../models/device.model');

const getDevices = async (_req, res, next) => {
  try {
    const devices = await deviceModel.getDevices();

    res.json({
      data: { devices },
      message: 'Yêu cầu thực hiện thành công',
    });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const params = req.body;
    const { rowCount } = await deviceModel.create(params);

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
    const { rowCount } = await deviceModel.update(params, id);

    res.json({
      message: 'Thay đổi thông tin thành công.',
      data: {
        rowCount,
      },
    });
  } catch (e) {
    next(new CustomError('Thay đổi thất bại. Vui lòng thử lại.', 400));
  }
};

module.exports = {
  getDevices,
  create,
  update,
};
