const express = require("express");
const userController = require("../controllers/user.controller");
const router = express.Router();

router.get("/", (res) => {
  res.send("Hello");
});

router.post("/login", userController.loginUser);
router.post("/verify", userController.verifyToken);
router.post("/logout", userController.logoutUser);


module.exports = router;
