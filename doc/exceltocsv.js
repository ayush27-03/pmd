// read-excel.js
import xlsx from "xlsx";
import fs from "fs";

// Read the Excel file
const workbook = xlsx.readFile("anyfile.xlsx"); // your file path - changing manually

// Get the first sheet
const sheetName = "Sheet...Name"; //changing manually
const sheet = workbook.Sheets[sheetName];

// Convert to JSON
const jsonData = xlsx.utils.sheet_to_json(sheet);// Explicit modification for MATHS, PHYSICS, CHEM Worksheets die to merged 0th row headers
fs.writeFileSync(`./studentData/${sheetName}.json`, JSON.stringify(jsonData, null, 2));

// Convert to CSV
const csvData = xlsx.utils.sheet_to_csv(sheet);// Explicit modification for MATHS, PHYSICS, CHEM Worksheets die to merged 0th row headers
fs.writeFileSync(`./studentData/${sheetName}.csv`, csvData);

console.log(`✅ Extracted ${jsonData.length} rows from ${sheetName}`);
