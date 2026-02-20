const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const {
  uploadPurchaseRegister
} = require("../controllers/purchaseController");

router.post(
  "/upload",
  upload.single("file"),
  uploadPurchaseRegister
);

module.exports = router;