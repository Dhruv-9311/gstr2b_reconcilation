const mongoose = require("mongoose");

const purchaseInvoiceSchema = new mongoose.Schema(
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
    totalTax: {
      type: Number,
      required: true
    },
    month: {
      type: String, // e.g. "2024-07"
      index: true
    },
    uploadBatchId: {
      type: String
    }
  },
  { timestamps: true }
);

// Prevent duplicate invoice uploads
purchaseInvoiceSchema.index(
  { supplierGSTIN: 1, invoiceNo: 1, invoiceDate: 1 },
  { unique: true }
);

module.exports = mongoose.model("PurchaseInvoice", purchaseInvoiceSchema);
