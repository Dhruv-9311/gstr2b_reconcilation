const XLSX = require("xlsx");
const PurchaseInvoice = require("../models/PurchaseInvoice");

exports.uploadPurchaseRegister = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    // Read Excel
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(sheet);

    if (!rows.length) {
      return res.status(400).json({ message: "Empty file uploaded" });
    }

    // Map Excel rows to schema format
    const invoices = rows.map(row => ({
      gstin: row.GSTIN?.toUpperCase(),
      supplierGSTIN: row.SupplierGSTIN?.toUpperCase(),
      invoiceNo: String(row.InvoiceNo).trim(),
      invoiceDate: new Date(row.InvoiceDate),
      taxableValue: Number(row.TaxableValue),
      igst: Number(row.IGST || 0),
      cgst: Number(row.CGST || 0),
      sgst: Number(row.SGST || 0),
      totalTax:
        Number(row.IGST || 0) +
        Number(row.CGST || 0) +
        Number(row.SGST || 0),
      month: row.Month // e.g. "2024-07"
    }));

    // Insert into MongoDB (skip duplicates)
    const result = await PurchaseInvoice.insertMany(invoices, {
      ordered: false
    });

    res.status(201).json({
      message: "Purchase register uploaded successfully",
      insertedCount: result.length
    });

  } catch (error) {
    // Duplicate invoice error handling
    if (error.code === 11000) {
      return res.status(207).json({
        message: "File uploaded with some duplicate invoices skipped"
      });
    }

    res.status(500).json({
      message: "Upload failed",
      error: error.message
    });
  }
};