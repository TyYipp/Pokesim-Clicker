const cloudinary = require("../config/Cloudinary");
const { Readable } = require("stream");

// Upload buffer to Cloudinary and return the result
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          return reject(new Error("Error uploading to Cloudinary: " + error.message));
        }
        resolve(result);
      }
    );

    Readable.from(buffer).pipe(stream);
  });
};

module.exports = { uploadToCloudinary };
