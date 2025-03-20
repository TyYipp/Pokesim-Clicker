const express = require("express");
const router = new express.Router();
///users/
router.get("/", (req, res) => {
  try {
    return res.send("User Path");
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
