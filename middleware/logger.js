// logger.js
exports.logger = function (req, res, next) {
    console.log(req.body);  // Logs the request body
    next();  // Passes control to the next middleware or route handler
  };