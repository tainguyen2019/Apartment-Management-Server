const CustomError = require('../constants/CustomError');
const { failChange } = require('../constants/errors');
const areaModel = require('../models/area.model');

const getAreas = async (_req, res, next) => {
  try {
    const areas = await areaModel.getAreas();

    if (!areas) throw new CustomError('Không tìm thấy', 404);

    res.json({
      message: 'Yêu cầu thực hiện thành công.',
      data: {
        areas,
      },
    });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const params = req.body;
    const { rowCount } = await areaModel.create(params);

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
    const { rowCount } = await areaModel.update(params, id);

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
  getAreas,
  create,
  update,
};
