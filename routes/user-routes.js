const express = require("express");

const userController = require("../controllers/user-controller");
const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth");
const studentRoutes = require("./user-routes/student-routes");
const router = express.Router();
const app = express();
router.post("/createuser", userController.createUser);

router.post("/login", userController.login);

router.use(checkAuth); //Routes after require Auth

app.use("/student", studentRoutes); //api/user/student

router.patch(
  "/:uid/info/photo",
  fileUpload.single("image"),
  userController.photoUpload
);



module.exports = router;
