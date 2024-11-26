const express = require("express");

const userController = require("../../controllers/user-controller");
const fileUpload = require("../../middleware/file-upload");
const checkAuth = require("../../middleware/check-auth");

const router = express.Router();

//everything in this file requires authentication.





module.exports = router;