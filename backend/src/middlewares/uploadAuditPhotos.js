const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads/audits'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = crypto.randomBytes(16).toString('hex');
    cb(null, name + ext);
  }
});

function fileFilter(req, file, cb) {

  const allowed = [
    'image/jpeg',
    'image/png',
    'image/webp'
  ];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('invalid file type'), false);
  }

}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    files: 4,
    fileSize: 5 * 1024 * 1024
  }
});

module.exports = upload;
