const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: path.resolve(__dirname, '../upload'),
  filename: (req, file, callback) => {
    const ext = path.extname(file.originalname);
    const fileName = path.basename(file.originalname, ext);
    callback(null, `${fileName}-${Date.now()}${ext}`);
  },
});

const uploader = multer({
  storage,
});

module.exports = uploader;
