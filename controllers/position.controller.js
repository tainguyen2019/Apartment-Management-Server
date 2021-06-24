const CustomError = require('../constants/CustomError');
const positionModel = require('../models/position.model');

const getPositions = async (_req, res, next) => {
  try {
    const positions = await positionModel.getPositions();

    if (!positions) throw new CustomError('Không tìm thấy', 404);

    res.json({
      message: 'Yêu cầu thực hiện thành công.',
      data: {
        positions,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPositions,
};
