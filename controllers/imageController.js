const cloudinary = require('../config/Cloudinary');

exports.showImageByPublicId = async (req, res) => {
  try {
    const publicId = req.params.publicId;

    // Generate a URL for the image
    const imageUrl = cloudinary.url(publicId, {
      width: 400,
      height: 400,
      crop: 'fill',
      secure: true,
    });

    res.render('imageDisplay', { imageUrl });
  } catch (err) {
    res.status(500).send('Error retrieving image: ' + err.message);
  }
};
