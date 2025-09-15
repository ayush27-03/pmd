import fs from "fs";
import path from "path";
import mongoose from "mongoose";

// --- CONFIGURATION ---
const MONGO_URI = 'mongodb://localhost:27017/pmd';

// Since there are no headers, we define the keys for the first three columns
const COLUMN_KEYS = {
    SCHOOL: 'School', 
    DEPARTMENT: 'Department'
};
// --------------------

// Define a simple model to fetch schools from the 'schools' collection
const School = mongoose.model('School', new mongoose.Schema({ name: String }), 'schools');
// Define a temporary model for the new departments we will create
const Department = mongoose.model('Department', new mongoose.Schema({ name: String, schoolId: mongoose.Schema.Types.ObjectId }), 'departments');

const processStructureFile = async (filePath) => {
    console.log(`\n======================================================`);
    console.log(`🏛️  Processing by Column Position from: ${path.basename(filePath)}`);
    console.log(`======================================================`);

    if (!fs.existsSync(filePath)) {
        console.error(`\n❌ ERROR: The file was not found at: ${filePath}`);
        return;
    }

    try {
        // 1. Connect to MongoDB
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB connection successful.');

        // 2. Fetch all existing schools and map their names to their _id
        const schools = await School.find({});
        const schoolNameToIdMap = new Map(schools.map(s => [s.name.trim().toLowerCase(), s._id]));

        if (schoolNameToIdMap.size === 0) {
            throw new Error('CRITICAL: No schools found in the database. Please import schools first.');
        }
        console.log(`Found ${schoolNameToIdMap.size} schools to reference in the database.`);

        // 3. Read and parse the raw JSON file
        const rawData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        // 4. Process data rows using column positions
        const departments = new Map();
        let currentSchoolName = '';
        let currentDepartmentName = '';

        for (const row of rawData) {
            // Check if there's a new school name in the first column
            if (row[COLUMN_KEYS.SCHOOL] && row[COLUMN_KEYS.SCHOOL].trim() !== '') {
                currentSchoolName = row[COLUMN_KEYS.SCHOOL].trim();
            }

            // Check if there's a new department name in the second column
            if (row[COLUMN_KEYS.DEPARTMENT] && row[COLUMN_KEYS.DEPARTMENT].trim() !== '') {
              currentDepartmentName = row[COLUMN_KEYS.DEPARTMENT].trim();
            }

            const schoolId = schoolNameToIdMap.get(currentSchoolName.toLowerCase());
            if (!schoolId) {
                console.warn(`⚠️ Warning: School "${currentSchoolName}" from the file was not found in the database. Skipping its departments.`);
                continue;
            }

            // Add unique departments
            if (!departments.has(currentDepartmentName)) {
                departments.set(currentDepartmentName, {
                    name: currentDepartmentName,
                    schoolId: {
                      "$oid": schoolId
                    }
                });
            }

        }

        // 5. Format the final output
        const cleanedDepartments = Array.from(departments.values());
        
        console.log(`\nDiscovered ${cleanedDepartments.length} unique departments.`);

        // 6. Write the clean files
        const departmentsFile = 'departments_cleaned.json';
        fs.writeFileSync(path.join(path.dirname(filePath), departmentsFile), JSON.stringify(cleanedDepartments, null, 2));

        console.log(`\n--- ✨ Transformation Complete ---`);
        console.log(`\n➡️  Your clean data has been saved to:`);
        console.log(`   - ${departmentsFile} (Ready to import)`);

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
    console.error('Example: node structure_formatter.js SDP.json');
    process.exit(1);
}
processStructureFile(path.resolve(filePathArg));