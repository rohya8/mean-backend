const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

// register user 
router.post("/signup", userController.createUser);

// authenticate user 
router.post("/login", userController.userLogin);

module.exports = router;
