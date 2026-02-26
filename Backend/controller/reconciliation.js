const PurchaseInvoice = require("../models/PurchaseInvoice");
const GSTR2BInvoice = require("../models/GSTR2BInvoice");
const ReconciliationResult = require("../models/ReconciliationResult");

// Date tolerance check (±2 days)
const isDateWithinTolerance = (d1, d2, toleranceDays = 2) => {
  const diff = Math.abs(new Date(d1) - new Date(d2));
  return diff <= toleranceDays * 24 * 60 * 60 * 1000;
};

exports.runReconciliation = async (req, res) => {
  try {
    const { gstin, month } = req.body;

    // 1️⃣ Fetch all purchase invoices for month
    const purchaseInvoices = await PurchaseInvoice.find({ gstin, month });

    if (!purchaseInvoices.length) {
      return res.status(404).json({
        message: "No purchase invoices found"
      });
    }

    const results = [];

    // 2️⃣ Loop purchase invoices
    for (const purchase of purchaseInvoices) {

      // 3️⃣ Find matching GSTR-2B invoice
      const gstr2bInvoice = await GSTR2BInvoice.findOne({
        supplierGSTIN: purchase.supplierGSTIN,
        invoiceNo: purchase.invoiceNo,
        month
      });

      let status;
      let eligibleITC = 0;
      let ineligibleITC = 0;
      let remarks = "";

      // 4️⃣ If invoice not found in GSTR-2B
      if (!gstr2bInvoice) {
        status = "MISSING_IN_2B";
        ineligibleITC = purchase.totalTax;
        remarks = "Invoice not found in GSTR-2B";
      }
      // 5️⃣ Date mismatch check
      else if (
        !isDateWithinTolerance(
          purchase.invoiceDate,
          gstr2bInvoice.invoiceDate
        )
      ) {
        status = "VALUE_MISMATCH";
        ineligibleITC = purchase.totalTax;
        remarks = "Invoice date mismatch";
      }
      // 6️⃣ ITC blocked
      else if (gstr2bInvoice.itcAvailable === "NO") {
        status = "BLOCKED_ITC";
        ineligibleITC = purchase.totalTax;
        remarks = gstr2bInvoice.itcBlockedReason || "ITC blocked in GSTR-2B";
      }
      // 7️⃣ Tax mismatch
      else if (
        purchase.igst !== gstr2bInvoice.igst ||
        purchase.cgst !== gstr2bInvoice.cgst ||
        purchase.sgst !== gstr2bInvoice.sgst
      ) {
        status = "VALUE_MISMATCH";
        ineligibleITC = purchase.totalTax;
        remarks = "Tax amount mismatch";
      }
      // 8️⃣ Perfect match
      else {
        status = "MATCHED";
        eligibleITC = purchase.totalTax;
        remarks = "Invoice matched successfully";
      }

      results.push({
        gstin,
        supplierGSTIN: purchase.supplierGSTIN,
        invoiceNo: purchase.invoiceNo,
        invoiceDate: purchase.invoiceDate,
        status,
        eligibleITC,
        ineligibleITC,
        remarks,
        month
      });
    }

    // 9️⃣ Save reconciliation results
    await ReconciliationResult.insertMany(results);

    res.status(200).json({
      message: "Reconciliation completed",
      totalInvoices: results.length
    });

  } catch (error) {
    res.status(500).json({
      message: "Reconciliation failed",
      error: error.message
    });
  }
};