const apartmentModel = require('../models/apartment.model');
const CustomError = require('../constants/CustomError');

const getApartmentByAccount = async (req, res, next) => {
  try {
    const { accountID } = req.params;
    const { rows } = await apartmentModel.getApartmentByAccount(accountID);
    const apartment = rows[0];
    if (!apartment) {
      throw new CustomError('Không tìm thấy', 404);
    }
    res.json({ apartment });
  } catch (err) {
    next(err);
  }
};

const searchApartments = async (req, res, next) => {
  try {
    const { pageSize = 10, page = 1, ...queryParams } = req.query;
    const totalRecords = await apartmentModel.count(queryParams);
    const offset = (page - 1) * pageSize;
    const { rows: apartments } = await apartmentModel.search(
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
        apartments,
      },
    });
  } catch (err) {
    next(err);
  }
};

const createApartment = async (req, res, next) => {
  try {
    const data = req.body;
    const { rowCount } = await apartmentModel.create(data);

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

const updateApartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const { rowCount } = await apartmentModel.update(id, data);

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
  getApartmentByAccount,
  searchApartments,
  updateApartment,
  createApartment,
};
