const fs = require('fs');
const path = require('path');

const CustomError = require('../constants/CustomError');

const downloadFile = (req, res, next) => {
  try {
    const { fileName } = req.params;
    const filePath = path.resolve(__dirname, '../upload', fileName);

    if (!fs.existsSync(filePath)) {
      throw new CustomError('Không tìm thấy file.', 400);
    }

    res.download(filePath, fileName);
  } catch (error) {
    next(error);
  }
};

module.exports = { downloadFile };
