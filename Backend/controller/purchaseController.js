const {
  parseAndNormalizeExcel
} = require("../utils/parseAndNormalizeExcel");

const PurchaseInvoice = require("../models/PurchaseInvoice");

exports.uploadPurchaseRegister = async (req, res) => {
  try {
    const invoices = parseAndNormalizeExcel(req.file.buffer);

    // Validate mandatory fields
    const validInvoices = invoices.filter(inv =>
      inv.gstin &&
      inv.supplierGSTIN &&
      inv.invoiceNo &&
      inv.invoiceDate
    );

    if (!validInvoices.length) {
      return res.status(400).json({
        message: "No valid invoices found"
      });
    }

    await PurchaseInvoice.insertMany(validInvoices, {
      ordered: false
    });

    res.status(201).json({
      message: "File parsed and normalized successfully",
      inserted: validInvoices.length
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(207).json({
        message: "Duplicates skipped during upload"
      });
    }

    res.status(500).json({
      message: "Upload failed",
      error: error.message
    });
  }
};