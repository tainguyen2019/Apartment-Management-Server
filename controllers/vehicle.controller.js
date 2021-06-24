const vehicleModel = require('../models/vehicle.model');
const CustomError = require('../constants/CustomError');

const search = async (req, res, next) => {
  try {
    const { pageSize = 10, page = 1, ...queryParams } = req.query;
    const searchParams = {
      ...queryParams,
    };

    if (req.apartment_id) {
      searchParams.apartment_id = req.apartment_id;
    }
    const totalRecords = await vehicleModel.count(searchParams);
    const offset = (page - 1) * pageSize;
    const { rows: vehicles } = await vehicleModel.search(
      searchParams,
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
        vehicles,
      },
    });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const data = req.body;

    const { rowCount } = await vehicleModel.create(data);

    res.json({
      data: { rowCount },
      message: 'Đăng ký thành công. Chờ phê duyệt',
    });
  } catch (err) {
    next(new CustomError('Đăng ký thất bại. Vui lòng thử lại', 400));
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isValidId = await vehicleModel.exist(id);
    if (!isValidId) {
      throw new CustomError('Thông tin gửi xe không tồn tại', 400);
    }

    const data = req.body;
    const { rowCount } = await vehicleModel.update(id, data);

    res.json({
      message: 'Yêu cầu thực hiện thành công.',
      data: {
        rowCount,
      },
    });
  } catch (err) {
    next(new CustomError('Thay đổi thất bại. Vui lòng thử lại', 400));
  }
};

const approve = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isValidId = await vehicleModel.exist(id);
    if (!isValidId) {
      throw new CustomError('Thông tin gửi xe không tồn tại', 400);
    }

    const { parking_no: parkingNo } = req.body;
    if (!parkingNo) {
      throw new CustomError('Thiếu thông tin số thẻ gửi xe', 400);
    }

    const isValidParkingNo = await vehicleModel.isValidParkingNo(id, parkingNo);
    if (!isValidParkingNo) {
      throw new CustomError('Số thẻ gửi xe đã tồn tại', 400);
    }

    const { rowCount } = await vehicleModel.approve(id, {
      parking_no: parkingNo,
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

const cancel = async (req, res, next) => {
  try {
    const { id } = req.params;

    const isValidId = await vehicleModel.exist(id);
    if (!isValidId) {
      throw new CustomError('Thông tin gửi xe không tồn tại', 400);
    }

    const { rowCount } = await vehicleModel.cancel(id);

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

module.exports = {
  search,
  update,
  create,
  approve,
  cancel,
};
