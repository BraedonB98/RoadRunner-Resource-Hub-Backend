const express = require("express");

const userController = require("../controllers/user-controller");
const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth");
const router = express.Router();
const app = express();

router.post("/student/createstudent", userController.createStudentUser);

router.post("/login", userController.login);

router.use(checkAuth); //Routes after require Auth

router.get("/userinfo/:userkey/:uservalue", userController.getUserInformation);

router.patch("/:uid/info/photo", fileUpload.single("image"), userController.photoUpload);

module.exports = router;
