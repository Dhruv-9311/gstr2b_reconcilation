const mongoose = require("mongoose");

const gstr2bInvoiceSchema = new mongoose.Schema(
  {
    gstin: {
      type: String,
      required: true,
      uppercase: true,
      index: true
    },
    supplierGSTIN: {
      type: String,
      required: true,
      uppercase: true,
      index: true
    },
    invoiceNo: {
      type: String,
      required: true,
      trim: true
    },
    invoiceDate: {
      type: Date,
      required: true
    },
    taxableValue: {
      type: Number,
      required: true
    },
    igst: {
      type: Number,
      default: 0
    },
    cgst: {
      type: Number,
      default: 0
    },
    sgst: {
      type: Number,
      default: 0
    },
    itcAvailable: {
      type: String,
      enum: ["YES", "NO"],
      required: true
    },
    itcBlockedReason: {
      type: String,
      default: null
    },
    month: {
      type: String, // "2024-07"
      index: true
    }
  },
  { timestamps: true }
);

// Fast reconciliation lookup
gstr2bInvoiceSchema.index(
  { supplierGSTIN: 1, invoiceNo: 1, invoiceDate: 1 },
  { unique: true }
);

module.exports = mongoose.model("GSTR2BInvoice", gstr2bInvoiceSchema);
