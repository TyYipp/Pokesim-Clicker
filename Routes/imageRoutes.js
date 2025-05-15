const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');

// Route to show an image by public_id
router.get('/image/:publicId', imageController.showImageByPublicId);

module.exports = router;
