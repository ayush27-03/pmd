import fs from "fs";
import path from "path";
import mongoose from "mongoose";

// --- CONFIGURATION ---
const MONGO_URI = 'mongodb://localhost:27017/pmd';

// Your updated and correct header map
const HEADER_TO_SCHEMA_MAP = {
    'Problem Statement': 'title',
    'IDPaspectInproblemStatement': 'description',
    'Name of Faculty': 'primaryFacultyMentorName', // Using a temporary key
    'Designation of the faculty mentor': 'designation',
    'facultyComentorFromMRU': 'facultyCoMentorsMRU',
    'industryMentor': 'industryMentors',
    'alumniMentor': 'alumniMentors',
    'facultyComentorOutsideMRU': 'externalFacultyMentors',
    'DisciplinesInvovled': 'disciplinesInvolved',
    'ExpectedOutcome': 'expectedOutcomes',
    'SDGs': 'sdgImpact',
    'societalOrIndustrialImpact': 'impactStatement'
};
// --------------------

// --- DATABASE MODELS ---
const facultySchema = new mongoose.Schema({ name: String }, { collection: 'faculties' });
const Faculty = mongoose.model('Faculty', facultySchema);

const formatProjects = async (directoryPath) => {
    console.log(`\n======================================================`);
    console.log(`Final Simplified Processing of All Project Files...`);
    console.log(`======================================================`);

    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB connection successful.');

        const faculties = await Faculty.find({});
        const facultyNameToIdMap = new Map(faculties.map(f => [f.name.trim().toLowerCase(), f._id.toString()]));
        console.log(`Found ${facultyNameToIdMap.size} faculties to reference.`);

        const cleanedProjects = [];
        const files = fs.readdirSync(directoryPath);

        for (const file of files) {
            if (path.extname(file) !== '.json') continue;
            
            console.log(`   -> Reading ${file}...`);
            const filePath = path.join(directoryPath, file);
            const rawData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

            let headerRowIndex = -1;
            const keyMap = {};
            for (let i = 0; i < rawData.length; i++) {
                const rowValues = Object.values(rawData[i]).map(v => String(v)?.trim());
                if (rowValues.includes('Problem Statement')) {
                    headerRowIndex = i;
                    Object.keys(rawData[i]).forEach(rawKey => {
                        const headerText = String(rawData[i][rawKey])?.trim();
                        if (HEADER_TO_SCHEMA_MAP[headerText]) {
                            keyMap[rawKey] = HEADER_TO_SCHEMA_MAP[headerText];
                        }
                    });
                    break;
                }
            }

            if (headerRowIndex === -1) {
                console.warn(`   ⚠️ Warning: Could not find headers in ${file}. Skipping.`);
                continue;
            }

            // Start the loop *after* the header row
            for (let i = headerRowIndex + 1; i < rawData.length; i++) {
                const row = rawData[i];
                const project = { status: 'Open', appliedStudentIds: [] };

                // Directly map all values from the row to the project object
                for(const rawKey in keyMap) {
                    const cleanKey = keyMap[rawKey];
                    const value = row[rawKey];
                    project[cleanKey] = value ? String(value).trim() : '';
                }

                if (!project.title) continue;

                const mentorNameRaw = project.primaryFacultyMentorName;
                if (!mentorNameRaw) {
                    console.warn(`   ⚠️ Warning: Mentor name is missing for project "${project.title}". Skipping.`);
                    continue;
                }
                
                // Clean up mentor name and find the ID
                const mentorNameToFind = mentorNameRaw.split('\n')[0].trim().toLowerCase();
                const mentorId = facultyNameToIdMap.get(mentorNameToFind);

                if (!mentorId) {
                    console.warn(`   ⚠️ Warning: Could not find mentor "${mentorNameRaw}" for project "${project.title}". Skipping.`);
                    continue;
                }

                // Replace the temporary mentor name with the real ID
                project.primaryFacultyMentorId = { "$oid": mentorId };
                delete project.primaryFacultyMentorName;

                cleanedProjects.push(project);
            }
        }

        const outputFileName = 'projects_cleaned.json';
        fs.writeFileSync(path.join(process.cwd(), outputFileName), JSON.stringify(cleanedProjects, null, 2));

        console.log(`\n--- ✨ Final Transformation Complete ---`);
        console.log(`✅ Success! ${cleanedProjects.length} projects have been formatted.`);
        console.log(`➡️  Your final data is ready for import in: ${outputFileName}`);

    } catch (error) {
        console.error('\n❌ An error occurred:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\nMongoDB connection closed.');
    }
};

const dirPathArg = process.argv[2];
if (!dirPathArg) {
    console.error('\n❌ Please provide the path to the directory containing your project JSON files.');
    process.exit(1);
}
formatProjects(path.resolve(dirPathArg));