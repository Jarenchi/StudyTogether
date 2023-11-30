const multer = require("multer");

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  console.log(file);
  console.log(req.file);
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    cb(new Error("Please upload an image"));
  }
  cb(null, true);
};
const limits = { fileSize: 1000000 }; // 1MB
const uploadImage = multer({ storage, fileFilter, limits }).single("image");

module.exports = { uploadImage };
