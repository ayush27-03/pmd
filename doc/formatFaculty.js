import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

// --- CONFIGURATION ---
const MONGO_URI = 'mongodb://localhost:27017/pmd';
const SALT_ROUNDS = 10;

// Maps the headers from your JSON files to your schema keys
const HEADER_TO_SCHEMA_MAP = {
    'Name of Faculty': 'name',
    'Designation': 'designation'
};

// *** THIS IS THE NEW, EXPLICIT MAPPING ***
// It tells the script exactly which department or school each file belongs to.
const FILENAME_CONTEXT_MAP = {
    'CST': { type: 'department', name: 'computer science & technology' },
    'ECE': { type: 'department', name: 'electronics & communication engineering' },
    'ME': { type: 'department', name: 'mechanical engineering' },
    'CHEMISTRY': { type: 'department', name: 'chemistry' },
    'PHYSICS': { type: 'department', name: 'physics' },
    'MATHS': { type: 'department', name: 'mathematics' },
    'R&AI': { type: 'department', name: 'robotics & ai' },
    'LAW': { type: 'school', name: 'school of law' },
    'EDU-HUMANITIES': { type: 'school', name: 'school of education' },
    'MGMT-COMM': { type: 'school', name: 'school of management' }
};``
// --------------------

// --- DATABASE MODELS ---
const schoolSchema = new mongoose.Schema({ name: String }, { collection: 'schools' });
const departmentSchema = new mongoose.Schema({ name: String, schoolId: mongoose.Schema.Types.ObjectId }, { collection: 'departments' });
const School = mongoose.model('School', schoolSchema);
const Department = mongoose.model('Department', departmentSchema);

const formatFaculties = async (directoryPath) => {
    console.log(`\n======================================================`);
    console.log(`🧑‍🏫 Processing All Faculty Files in: ${path.basename(directoryPath)}`);
    console.log(`======================================================`);

    if (!fs.existsSync(directoryPath)) {
        throw new Error(`Directory not found at: ${directoryPath}`);
    }

    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB connection successful.');

        // Create lookup maps for schools and departments
        const schools = await School.find({});
        const schoolNameToIdMap = new Map(schools.map(s => [s.name.trim().toLowerCase(), s._id.toString()]));

        const departments = await Department.find({});
        const departmentNameToIdMap = new Map();
        departments.forEach(d => {
            departmentNameToIdMap.set(d.name.trim().toLowerCase(), {
                deptId: d._id.toString(),
                schoolId: d.schoolId.toString()
            });
        });
        console.log(`Found ${schoolNameToIdMap.size} schools and ${departmentNameToIdMap.size} departments to reference.`);

        const facultyMap = new Map();
        const files = fs.readdirSync(directoryPath);
        let facultyCounter = 1;

        for (const file of files) {
            if (path.extname(file) === '.json') {
                console.log(`   -> Reading ${file}...`);
                const filePath = path.join(directoryPath, file);
                const rawData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

                let headerRowIndex = -1;
                const keyMap = {};
                for (let i = 0; i < rawData.length; i++) {
                    if (Object.values(rawData[i]).includes('Name of Faculty')) {
                        headerRowIndex = i;
                        Object.keys(rawData[i]).forEach(rawKey => {
                            if (HEADER_TO_SCHEMA_MAP[rawData[i][rawKey]?.trim()]) {
                                keyMap[rawKey] = HEADER_TO_SCHEMA_MAP[rawData[i][rawKey]?.trim()];
                            }
                        });
                        break;
                    }
                }

                if (headerRowIndex === -1) {
                    console.warn(`⚠️ Warning: Could not find header row in ${file}. Skipping.`);
                    continue;
                }

                for (let i = headerRowIndex + 1; i < rawData.length; i++) {
                    const row = rawData[i];
                    const facultyName = row[Object.keys(keyMap)[0]]?.trim();
                    
                    // Cleanup messy data like "Dr.Aditi Chaudhary\nMoved to sheet of School of Law"
                    const cleanName = facultyName?.split('\n')[0].trim();

                    if (!cleanName || facultyMap.has(cleanName.toLowerCase())) {
                        continue;
                    }

                    const faculty = { 
                        role: 'faculty',
                        facultyId: `FAC${String(facultyCounter++).padStart(3, '0')}`
                    };
                    for (const rawKey in keyMap) {
                        const rawValue = row[rawKey]?.split('\n')[0].trim();
                        faculty[keyMap[rawKey]] = rawValue;
                    }

                    ////faculty.email = `${faculty.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@mru.edu.in`;
                    faculty.password = bcrypt.hashSync('password123', SALT_ROUNDS);
                    // If designation is missing after parsing, provide a default value.
                    if (!faculty.designation) {
                        faculty.designation = 'Not Available';
                    }

                    // *** USE THE NEW EXPLICIT MAP FOR LOOKUPS ***
                    const fileContextKey = path.basename(file, '.json').toUpperCase();
                    const context = FILENAME_CONTEXT_MAP[fileContextKey];

                    if (context) {
                        if (context.type === 'department') {
                            const deptInfo = departmentNameToIdMap.get(context.name);
                            if (deptInfo) {
                                faculty.departmentId = { "$oid": deptInfo.deptId };
                                faculty.schoolId = { "$oid": deptInfo.schoolId };
                            }
                        } else if (context.type === 'school') {
                            const schoolId = schoolNameToIdMap.get(context.name);
                            if (schoolId) {
                                faculty.schoolId = { "$oid": schoolId };
                            }
                        }
                    } else {
                        console.warn(`   - No context defined for file ${file}. Cannot assign school/department.`);
                    }

                    facultyMap.set(faculty.name.toLowerCase(), faculty);
                }
            }
        }

        const cleanedFaculties = Array.from(facultyMap.values());
        const outputFileName = 'faculties_cleaned.json';
        fs.writeFileSync(path.join(process.cwd(), outputFileName), JSON.stringify(cleanedFaculties, null, 2));

        console.log(`\n--- ✨ Transformation Complete ---`);
        console.log(`✅ Success! ${cleanedFaculties.length} unique faculty members have been formatted.`);
        console.log(`➡️ Your final data has been saved to: ${outputFileName}`);

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
    console.error('\n❌ Please provide the path to the directory containing your faculty JSON files.');
    process.exit(1);
}
formatFaculties(path.resolve(dirPathArg));