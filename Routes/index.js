const express = require("express");
const router = new express.Router();
const userRoutes = require("./User");
const locationRoutes = require("../Routes/Location.js");
const shopController = require("../controllers/shopController");
const logger = require("../middleware/logger.js");
router.use("/users", logger.logger, userRoutes);
router.use("/locations", locationRoutes);
router.get("/", (req, res) => {
  try {
    return res.send("We're Live");
  } catch (error) {
    console.log(error);
  }
});
router.get("/bank/:name/user/:user", (req, res) => {
  try {
    res.json(req.params.name);
  } catch (error) {
    console.log(error);
  }
});
router.post("/login", (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;
  res.send(`${username} has logged in`);
});
router.post("/add", shopController.createShop);
module.exports = router;