const HttpError = require("../models/http-error");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next(); // allows option request to continue without token
  }
  if (!req.headers.authorization) {
    return next(new HttpError("Authentication failed!", 401));
  }

  const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'
  if (!token) {
    return next(new HttpError("Authentication failed!", 401));
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_Key);
  } catch (err) {
    return next(new HttpError("Authentication failed!", 401));
  }

  if (!decodedToken) {
    return next(new HttpError("Authentication failed!", 401));
  }

  req.userData = { userId: decodedToken._id, isAdmin: decodedToken.adminAccount };
  //get admin account -> permissions
  const requestedUid = req.params.uid;
  if (requestedUID)
    if (req.userData.userId !== requestedUid && !req.userData.isAdmin) {
      return next(new HttpError("You are not allowed to access this resource.", 403));
    }

  next();
};
