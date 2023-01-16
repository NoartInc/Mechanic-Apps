const multer = require("multer");
const path = require("path");
const moment = require("moment");

// determining upload location
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/images");
  },
  filename: async function (req, file, callback) {
    callback(
      null,
      `${file.originalname?.split(".")[0]}-${moment().format(
        "YYYYMMDDHHmmss"
      )}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage });

module.exports = {
  upload,
};
