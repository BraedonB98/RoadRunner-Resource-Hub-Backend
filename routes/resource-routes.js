const express = require("express");

const resourceController = require("../controllers/resource-controller");
const checkAuth = require("../middleware/check-auth");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

//insert new routes that do not need authentication here
router.get("/resources/public/:resourceType", resourceController.getPublicResources);

router.use(checkAuth); // every route after this requires an token

router.get("/resources/dashboard", resourceController.getDashboardResources);

router.delete("/resources/:rid", resourceController.deleteResource);

router.post("/resources", fileUpload.single("image"), resourceController.createResource);

module.exports = router;
