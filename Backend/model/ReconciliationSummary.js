const mongoose = require("mongoose");

const reconciliationSummarySchema = new mongoose.Schema(
  {
    gstin: {
      type: String,
      required: true,
      uppercase: true
    },
    month: {
      type: String,
      required: true
    },
    totalInvoices: Number,
    eligibleITC: Number,
    ineligibleITC: Number,
    matchedCount: Number,
    mismatchCount: Number,
    missingCount: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "ReconciliationSummary",
  reconciliationSummarySchema
);
