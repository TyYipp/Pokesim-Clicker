exports.logger = function (req, res, next) {
    console.log(req.body);
    next();
  };
  
  