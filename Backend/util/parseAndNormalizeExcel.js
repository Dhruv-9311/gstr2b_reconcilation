const XLSX = require("xlsx");

/**
 * Normalize GSTIN:
 * - Uppercase
 * - Remove spaces
 * - Validate length (15 chars)
 */
const normalizeGSTIN = (gstin) => {
  if (!gstin) return null;

  const cleaned = gstin.toString().trim().toUpperCase();

  if (cleaned.length !== 15) return null;

  return cleaned;
};

/**
 * Normalize Invoice Number:
 * - Convert to string
 * - Trim spaces
 * - Uppercase
 */
const normalizeInvoiceNo = (invoiceNo) => {
  if (!invoiceNo) return null;

  return invoiceNo.toString().trim().toUpperCase();
};

/**
 * Normalize Date:
 * Handles:
 * - Excel serial numbers
 * - ISO strings
 * - DD-MM-YYYY
 * - Date objects
 */
const normalizeDate = (dateValue) => {
  if (!dateValue) return null;

  // Excel serial date (number)
  if (typeof dateValue === "number") {
    const excelEpoch = new Date(1899, 11, 30);
    return new Date(
      excelEpoch.getTime() + dateValue * 24 * 60 * 60 * 1000
    );
  }

  // Already a Date object
  if (dateValue instanceof Date) {
    return dateValue;
  }

  // Date string
  const parsedDate = new Date(dateValue);
  if (!isNaN(parsedDate)) {
    return parsedDate;
  }

  return null;
};

/**
 * Parse Excel or CSV and normalize rows
 */
const parseAndNormalizeExcel = (fileBuffer) => {
  const workbook = XLSX.read(fileBuffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const rawRows = XLSX.utils.sheet_to_json(sheet, {
    defval: null
  });

  return rawRows.map((row, index) => ({
    rowNumber: index + 2, // Excel row number (header is row 1)
    gstin: normalizeGSTIN(row.GSTIN),
    supplierGSTIN: normalizeGSTIN(row.SupplierGSTIN),
    invoiceNo: normalizeInvoiceNo(row.InvoiceNo),
    invoiceDate: normalizeDate(row.InvoiceDate),
    taxableValue: Number(row.TaxableValue || 0),
    igst: Number(row.IGST || 0),
    cgst: Number(row.CGST || 0),
    sgst: Number(row.SGST || 0),
    month: row.Month
  }));
};

module.exports = {
  parseAndNormalizeExcel,
  normalizeGSTIN,
  normalizeInvoiceNo,
  normalizeDate
};