import fs from "fs";
import path from "path";
import mongoose from "mongoose";

// --- CONFIGURATION ---
const MONGO_URI = 'mongodb://localhost:27017/pmd';
const INPUT_FILE = 'SDP.json'; // The source file for programs
const COLUMN_KEYS = {
    SCHOOL: 'School', 
    DEPARTMENT: 'Department',
    PROGRAM: 'PROGRAM',
    SPECIALIZATION: 'SPECIALIZATION'
};
// --------------------

// Define explicit schemas to ensure correct data fetching
const schoolSchema = new mongoose.Schema({
  name: String
}, { collection: 'schools' });

const departmentSchema = new mongoose.Schema({
  name: String,
  schoolId: mongoose.Schema.Types.ObjectId
}, { collection: 'departments' });

// Define simple models to fetch our existing data
const School = mongoose.model('School', schoolSchema);
const Department = mongoose.model('Department', departmentSchema);

const formatPrograms = async (filePath) => {
    console.log(`\n======================================================`);
    console.log(`🎓 Processing Programs from: ${path.basename(filePath)}`);
    console.log(`======================================================`);

    if (!fs.existsSync(filePath)) {
        console.error(`\n❌ ERROR: Input file not found at: ${filePath}`);
        process.exit(1);
    }

    try {
        // 1. Connect to MongoDB
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB connection successful.');

        // 2. Fetch all schools and departments and map their names to ObjectIds
        const schools = await School.find({});
        const schoolNameToIdMap = new Map(schools.map(s => [s.name.trim().toLowerCase(), s._id.toString()]));
        console.log(`Found ${schoolNameToIdMap.size} schools to reference.`);

        const departments = await Department.find({});
        const departmentNameToIdMap = new Map(departments.map(d => [d.name.trim().toLowerCase(), d._id.toString()]));
        console.log(`Found ${departmentNameToIdMap.size} departments to reference.`);

        // 3. Read the raw JSON file
        const rawData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const cleanedPrograms = [];
        let currentSchoolName = '';
        let currentDepartmentName = '';

        // 4. Process rows using positional logic
        for (const row of rawData) {
            // Update context when a new school or department is found
            if (row[COLUMN_KEYS.SCHOOL] && row[COLUMN_KEYS.SCHOOL].trim() !== '') {
                currentSchoolName = row[COLUMN_KEYS.SCHOOL].trim();
            }
            if (row[COLUMN_KEYS.DEPARTMENT] && row[COLUMN_KEYS.DEPARTMENT].trim() !== '') {
                currentDepartmentName = row[COLUMN_KEYS.DEPARTMENT].trim();
            }

            let programName = row[COLUMN_KEYS.PROGRAM]?.trim();
            if (!programName) continue; // Skip if there's no program name

            // Find the corresponding schoolId (required)
            const schoolId = schoolNameToIdMap.get(currentSchoolName.toLowerCase());
            if (!schoolId) {
                console.warn(`⚠️ Warning: School "${currentSchoolName}" not found. Skipping program "${programName}".`);
                continue;
            }

            // Find the corresponding departmentId (optional)
            // If department is "NA" or not found, set it to null, as per the schema
            let departmentId = departmentNameToIdMap.get(currentDepartmentName.toLowerCase());
            if (!departmentId || currentDepartmentName.toLowerCase() === 'na') {
                departmentId = null;
            }

            // Logic to extract specialization if it's in parentheses
            let specialization = undefined;
            const specializationMatch = programName.match(/\((.*?)\)/);
            if (specializationMatch) {
                specialization = specializationMatch[1].trim();
                programName = programName.replace(specializationMatch[0], '').trim();
            }
            
            // 5. Construct the final object matching the schema
            const finalProgram = {
                name: programName,
                schoolId: { "$oid": schoolId },
                departmentId: departmentId ? { "$oid": departmentId } : null
            };

            // Only add specialization if it was found
            if(specialization) {
              finalProgram.specialization = specialization;
            }

            cleanedPrograms.push(finalProgram);
        }

        // 6. Write the clean, final file
        const outputFileName = 'programs_cleaned.json';
        fs.writeFileSync(path.join(path.dirname(filePath), outputFileName), JSON.stringify(cleanedPrograms, null, 2));

        console.log(`\n--- ✨ Transformation Complete ---`);
        console.log(`✅ Success! ${cleanedPrograms.length} programs have been formatted.`);
        console.log(`➡️ Your final data has been saved to: ${outputFileName}`);
        console.log(`\nThis file is now ready for import.`);

    } catch (error) {
        console.error('\n❌ An error occurred:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\nMongoDB connection closed.');
    }
};

// --- EXECUTION ---
const filePathArg = process.argv[2];
if (!filePathArg) {
    console.error('\n❌ Please provide the path to the JSON file to process.');
    console.error(`Example: node formatPrograms.js ${INPUT_FILE}`);
    process.exit(1);
}
formatPrograms(path.resolve(filePathArg));