import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

// --- CONFIGURATION ---
const MONGO_URI = 'mongodb://localhost:27017/pmd';
const SALT_ROUNDS = 10;

// Maps the positional keys from your JSON files to the schema fields
const COLUMN_KEYS = {
    school: 'School',
    department: 'Department',
    program: 'Program Name',
    rollNumber: 'Student Roll Number',
    name: 'Student Name',
    mobile: 'Mobile Number',
    email: 'EmailID',
    // semester: 'Semester'
};
// --------------------

// --- DATABASE MODELS ---
const schoolSchema = new mongoose.Schema({ name: String }, { collection: 'schools' });
const departmentSchema = new mongoose.Schema({ name: String, schoolId: mongoose.Schema.Types.ObjectId }, { collection: 'departments' });
const programSchema = new mongoose.Schema({ name: String, departmentId: mongoose.Schema.Types.ObjectId, schoolId: mongoose.Schema.Types.ObjectId }, { collection: 'programs' });

const School = mongoose.model('School', schoolSchema);
const Department = mongoose.model('Department', departmentSchema);
const Program = mongoose.model('Program', programSchema);

const formatStudents = async (directoryPath) => {
    console.log(`\n======================================================`);
    console.log(`🧑‍🎓 Processing All Student Files in: ${path.basename(directoryPath)}`);
    console.log(`======================================================`);

    if (!fs.existsSync(directoryPath)) {
        throw new Error(`Directory not found at: ${directoryPath}`);
    }

    try {
        // 1. Connect to MongoDB and fetch all reference data
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB connection successful.');

        const programs = await Program.find({});
        const programNameToIdsMap = new Map();
        for (const p of programs) {
            const departmentId = p.departmentId ? p.departmentId.toString() : null;
            programNameToIdsMap.set(p.name.trim().toLowerCase(), {
                programId: p._id.toString(),
                departmentId: departmentId,
                schoolId: p.schoolId.toString()
            });
        }
        console.log(`Found ${programNameToIdsMap.size} programs to reference.`);

        // const schools = await School.find({});
        // const schoolIdToNameMap = new Map(schools.map(s => [s._id.toString(), s.name]));

        // const departments = await Department.find({});
        // const departmentIdToInfoMap = new Map(departments.map(d => [d._id.toString(), { name: d.name, schoolId: d.schoolId.toString()}]));
        
        // const programs = await Program.find({});
        // const programNameToIdsMap = new Map();

        // 2. Process all JSON files in the directory
        const studentMap = new Map(); // Use Roll Number for deduplication
        const files = fs.readdirSync(directoryPath);

        for (const file of files) {
            if (path.extname(file) !== '.json') continue;
            
            console.log(`   -> Reading ${file}...`);
            const filePath = path.join(directoryPath, file);
            const rawData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

            for (const row of rawData) {
                const rollNumber = row[COLUMN_KEYS.rollNumber]?.trim();
                const studentName = row[COLUMN_KEYS.name]?.trim();

                if (!rollNumber || !studentName || studentMap.has(rollNumber)) {
                  continue; // Skip if roll number is empty or already processed
                }
                
                // Find the IDs using the program name from the file
                const programNameFromFile = row[COLUMN_KEYS.program]?.trim().toLowerCase();
                let specialization = undefined;
                const specializationMatch = programNameFromFile.match(/\((.*?)\)/);
                if (specializationMatch) {
                  specialization = specializationMatch[1].trim();
                  programNameFromFile = programNameFromFile.replace(specializationMatch[0], '').trim();
                }
                const referenceIds = programNameToIdsMap.get(programNameFromFile);

                if (!referenceIds) {
                  console.warn(`   ⚠️ Warning: Could not find program "${row[COLUMN_KEYS.program]}" in the database. Skipping student ${rollNumber}.`);
                  continue;
                }

                const student = {
                  rollNumber: rollNumber,
                  name: row[COLUMN_KEYS.name]?.trim(),
                  email: row[COLUMN_KEYS.email]?.trim() || 'NA',
                  mobileNumber: row[COLUMN_KEYS.mobile]?.toString().trim(),
                  password: bcrypt.hashSync('password123', SALT_ROUNDS),
                  role: 'student',
                  semester: 5,
                  programId: { "$oid": referenceIds.programId },
                  departmentId: referenceIds.departmentId ? { "$oid": referenceIds.departmentId } : null,
                  schoolId: { "$oid": referenceIds.schoolId }
                };
                // Add optional fields only if they exist
                if (specialization) {
                  student.specialization = specialization;
                }
                // (Future-proof) If a "Section" column is ever added, it can be handled here
                // if (row['Section']) {
                //     student.section = row['Section'].trim();
                // }
                studentMap.set(rollNumber, student);
            }
        }

        // 3. Write the final, deduplicated data to a file
        const cleanedStudents = Array.from(studentMap.values());
        const outputFileName = 'students_cleaned.json';
        fs.writeFileSync(path.join(process.cwd(), outputFileName), JSON.stringify(cleanedStudents, null, 2));
        // console.log(cleanedStudents);

        console.log(`\n--- ✨ Transformation Complete ---`);
        console.log(`✅ Success! ${cleanedStudents.length} unique students have been formatted.`);
        console.log(`➡️  Your final data has been saved to: ${outputFileName}`);

    } catch (error) {
        console.error('\n❌ An error occurred:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\nMongoDB connection closed.');
    }
};

// --- EXECUTION ---
const dirPathArg = process.argv[2];
if (!dirPathArg) {
    console.error('\n❌ Please provide the path to the directory containing your student JSON files.');
    console.error('Example: node formatStudents.js ./studentData');
    process.exit(1);
}
formatStudents(path.resolve(dirPathArg));