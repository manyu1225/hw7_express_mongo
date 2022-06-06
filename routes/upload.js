const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../service/image");
const UploadController = require("../controller/upload");

router.post("/", auth.isAuth, upload, UploadController.uploadFile);

module.exports = router;
