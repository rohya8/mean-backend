const jwt = require("jsonwebtoken");
const CONSTANT = require("../CONSTANT.json");

// Validate request
module.exports = (req, res, next) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    jwt.verify(token,CONSTANT.tryAgain);
    next();
  } catch (err) {
    res.status(401).json({
      message: CONSTANT.loginMsg,
    });
  }
};
