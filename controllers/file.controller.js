const fs = require('fs');
const path = require('path');

const CustomError = require('../constants/CustomError');
const dbService = require('../services/db.service');
const logger = require('../utils/logger');

const fileUploader = async (req, res) => {
  if (!req.file) {
    throw new CustomError('Missing file.', 400);
  }

  // file passed from multer
  const { originalname } = req.file;

  // field value from form data
  const { title } = req.body;

  const result = await dbService.insertInto('test-table', { name: title });

  logger.log(result.rows);

  res.json({
    message: `Upload file "${originalname}" successfully with title "${title}"`,
  });
};

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

module.exports = { fileUploader, downloadFile };
