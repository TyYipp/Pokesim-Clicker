const multer = require('multer');

// Set up Multer to store the file in memory (without saving to disk)
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

module.exports = upload;
