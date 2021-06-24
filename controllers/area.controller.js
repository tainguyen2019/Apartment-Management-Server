const CustomError = require('../constants/CustomError');
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

module.exports = {
  getAreas,
};
