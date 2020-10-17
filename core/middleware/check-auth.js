const jwt = require("jsonwebtoken");
const CONSTANT = require("../CONSTANT.json");

// Validate request
module.exports = (req, res, next) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch (err) {
    res.status(401).json({
      message: CONSTANT.invalid_credentials,
    });
  }
};
