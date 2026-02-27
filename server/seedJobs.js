const mongoose = require('mongoose');
const Company = require('./models/Company');
const Job = require('./models/Job');
require('dotenv').config({ path: './.env' });

const roles = [
  { title: 'Software Engineer (IT)', role: 'IT', salary: '8 - 12 LPA' },
  { title: 'Business Process Analyst (BP)', role: 'BP', salary: '6 - 9 LPA' },
  { title: 'Data Scientist', role: 'IT', salary: '12 - 18 LPA' },
  { title: 'System Reliability Expert', role: 'IT', salary: '10 - 15 LPA' },
  { title: 'Frontend Systems Specialist', role: 'IT', salary: '8 - 14 LPA' },
  { title: 'Cloud Infrastructure Architect', role: 'IT', salary: '15 - 25 LPA' },
  { title: 'Product Manager', role: 'Management', salary: '14 - 20 LPA' },
  { title: 'Human Resources Associate', role: 'HR', salary: '5 - 8 LPA' },
];

const locations = ['Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Remote'];
const cgpaThresholds = [6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log("Database Connected. Initiating Realistic Recruitment Job Seeder...");
    
    try {
        console.log("Wiping legacy placeholder jobs...");
        await Job.deleteMany({});
        
        const companies = await Company.find({});
        if (companies.length === 0) {
            console.log("No companies found in database. Please run importMNC.js first.");
            process.exit(1);
        }

        const jobsToInsert = [];

        companies.forEach(company => {
            // Generate 1 to 3 jobs per company
            const numJobs = getRandomInt(1, 3);
            for(let i=0; i<numJobs; i++){
                const roleData = getRandom(roles);
                jobsToInsert.push({
                    title: roleData.title,
                    company: company._id,
                    description: `We are looking for exceptional talent to join our dynamic team as a ${roleData.title} at ${company.name}. You will be responsible for scaling operations and maintaining excellence.`,
                    role: roleData.role,
                    salary: roleData.salary,
                    location: getRandom(locations),
                    minCgpa: getRandom(cgpaThresholds),
                    minPercentage: 60.0,
                    status: 'Open',
                    skills: ['Communication', 'Analytical Thinking', 'Problem Solving']
                });
            }
        });

        console.log(`Prepared ${jobsToInsert.length} highly realistic jobs mapped to ${companies.length} MNCs.`);
        await Job.insertMany(jobsToInsert);
        
        console.log("✅ Seeding Complete: Placement Engine fully populated with realistic roles and dynamic eligibility constraints.");
        process.exit(0);
    } catch(err) {
        console.error("❌ Critical Error during Seeding:", err);
        process.exit(1);
    }
});
