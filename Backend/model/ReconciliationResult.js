const mongoose = require("mongoose");

const reconciliationResultSchema = new mongoose.Schema(
  {
    gstin: {
      type: String,
      required: true,
      uppercase: true,
      index: true
    },
    supplierGSTIN: {
      type: String,
      uppercase: true
    },
    invoiceNo: {
      type: String
    },
    invoiceDate: {
      type: Date
    },
    status: {
      type: String,
      enum: [
        "MATCHED",
        "MISSING_IN_2B",
        "BLOCKED_ITC",
        "VALUE_MISMATCH",
        "MISSING_IN_PURCHASE"
      ],
      required: true
    },
    eligibleITC: {
      type: Number,
      default: 0
    },
    ineligibleITC: {
      type: Number,
      default: 0
    },
    remarks: {
      type: String
    },
    month: {
      type: String,
      index: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "ReconciliationResult",
  reconciliationResultSchema
);
