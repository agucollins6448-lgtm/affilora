const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;

// helper upload function
module.exports.uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "affilora"
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};