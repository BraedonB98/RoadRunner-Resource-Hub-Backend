const express = require("express");

const resourceController = require("../controllers/resource-controller");
const checkAuth = require("../middleware/check-auth");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

//insert new routes that do not need authentication here
router.get("/public/:resourceType", resourceController.getPublicResources);

router.use(checkAuth); // every route after this requires an token

router.get("/dashboard", resourceController.getDashboardResources);

router.delete("/:rid", resourceController.deleteResource);

router.post(
  "/",
  (req, res, next) => {
    if (req.headers["content-type"] && req.headers["content-type"].includes("multipart/form-data")) {
      fileUpload.single("image")(req, res, next);
    } else {
      next();
    }
  },
  resourceController.createResource,
);

module.exports = router;
