const mongoose = require('mongoose');
const cloudinary = require('../config/Cloudinary'); // Import the Cloudinary configuration

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  public_id: {
    type: String,
    required: true,
  },
});

const Image = mongoose.model('Image', imageSchema);

// Add a method to upload an image to Cloudinary
Image.uploadToCloudinary = async (buffer) => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) {
            return reject(new Error('Error uploading to Cloudinary: ' + error.message));
          }
          resolve(result);
        }
      );
      
      // Stream the file to Cloudinary
      uploadStream.end(buffer);
    });
  } catch (error) {
    throw new Error('Error uploading to Cloudinary: ' + error.message);
  }
};

module.exports = Image;
