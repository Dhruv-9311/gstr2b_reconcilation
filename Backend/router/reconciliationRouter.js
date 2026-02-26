const express = require("express");
const router = express.Router();
const {
  runReconciliation
} = require("../controllers/reconciliationController");

router.post("/run", runReconciliation);

module.exports = router;