const HttpError = require("../models/http-error");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next(); // allows option request to continue without token
  }
  try {
    const token = req.headers.authorization.split(" ")[1]; //Authorization: 'Bearer TOKEN'
    if (!token) {
      return next(new HttpError("Authentication failed!", 401));
    }
    const decodedToken = jwt.verify(token, process.env.JWT_Key);
    req.userData = { _id: decodedToken._id }; //stores user id in req.userData._id
    next();
  } catch (error) {
    return next(new HttpError("Authentication Failed, Session Expired or Invalid", 403));
  }
};
