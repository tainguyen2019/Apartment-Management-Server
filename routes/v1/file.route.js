const express = require('express');
const router = express.Router();

const uploader = require('../../middlewares/uploader.middleware');
const {
  fileUploader,
  downloadFile,
} = require('../../controllers/file.controller');

// need to declare file fieldName from the form
const fileFieldName = 'file';

router.post('/', uploader.single(fileFieldName), fileUploader);
router.get('/:fileName', downloadFile);

module.exports = router;
