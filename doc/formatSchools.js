import fs from "fs";
import path from "path";

//===============================================================================
// STEP 2: THE PARSING LOGIC
//===============================================================================
const processSchoolFile = (filePath) => {
  console.log(`\n========================================`);
  console.log(`🏫 Processing School Data: ${path.basename(filePath)}`);
  console.log(`========================================`);

  try {
    const rawData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const schoolNames = new Set();

    for (const row of rawData) {
      if (row.School && typeof row.School === 'string' && row.School.trim() !== '') {
        schoolNames.add(row.School.trim());
      }
    }

    // Format the data to match the MongoDB schema
    const cleanedData = Array.from(schoolNames)
      .filter(name => name !== 'NA')  // Remove any "NA" values
      .map(name => ({ name }));

    if (cleanedData.length === 0) {
      console.warn('⚠️ Warning: No school names were extracted. The output file will be empty.');
    }

    // 4. Write the cleaned data to a new file
    const outputFileName = `schools_cleaned.json`;
    const outputFilePath = path.join(path.dirname(filePath), outputFileName);
    fs.writeFileSync(outputFilePath, JSON.stringify(cleanedData, null, 2));

    console.log(`\n--- ✨ Transformation Complete ---`);
    console.log(`✅ Success! ${cleanedData.length} unique schools found.`);
    // console.log(cleanedData);
    console.log(`➡️ Your clean data has been saved to: ${outputFileName}`);
    console.log(`\nNow, you can drag and drop this file into your 'schools' collection in MongoDB Compass.`);

  } catch (error) {
    console.error('❌ An error occurred while processing the file:', error.message);
  }
};

//===============================================================================
// STEP 3: EXECUTION - Takes filename from command line
//===============================================================================
const filePathArg = process.argv[2];

if (!filePathArg) {
  console.error('❌ Please provide the path to the JSON file you want to process.');
  console.error('Example: node school_formatter.js SDP.json');
  process.exit(1);
}

processSchoolFile(path.resolve(filePathArg));