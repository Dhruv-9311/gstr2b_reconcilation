const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv"
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only Excel or CSV files are allowed"));
    }
    cb(null, true);
  }
});

module.exports = upload;