const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config({ path: './.env' });

const users = [
  {
    firstName: 'Admin',
    lastName: 'System',
    username: 'admin_sys',
    email: 'admin@placepro.com',
    password: 'password123',
    role: 'admin',
    phone: '9999999999'
  },
  {
    firstName: 'Tech',
    lastName: 'Corp',
    username: 'tech_corp',
    email: 'hr@techcorp.com',
    password: 'password123',
    role: 'company',
    phone: '8888888888'
  },
  {
    firstName: 'Alex',
    lastName: 'Chen',
    username: 'alexc_student',
    email: 'alex.c@university.edu',
    password: 'password123',
    role: 'student',
    phone: '1234567890',
    percentage10th: 92,
    percentageIntermediate: 89,
    cgpaBTech: 8.5
  },
  {
    firstName: 'Sarah',
    lastName: 'Jenkins',
    username: 'sarahj',
    email: 'sarah.j@university.edu',
    password: 'password123',
    role: 'student',
    phone: '2345678901',
    percentage10th: 85,
    percentageIntermediate: 91,
    cgpaBTech: 9.1
  },
  {
    firstName: 'Vikram',
    lastName: 'Sharma',
    username: 'vikram_s',
    email: 'vikram.s@university.edu',
    password: 'password123',
    role: 'student',
    phone: '3456789012',
    percentage10th: 95,
    percentageIntermediate: 94,
    cgpaBTech: 9.6
  },
  {
    firstName: 'Elena',
    lastName: 'Rodriguez',
    username: 'elena_r',
    email: 'elena.r@university.edu',
    password: 'password123',
    role: 'student',
    phone: '4567890123',
    percentage10th: 88,
    percentageIntermediate: 86,
    cgpaBTech: 7.8
  },
  {
    firstName: 'David',
    lastName: 'Kim',
    username: 'davidk',
    email: 'david.k@university.edu',
    password: 'password123',
    role: 'student',
    phone: '5678901234',
    percentage10th: 78,
    percentageIntermediate: 82,
    cgpaBTech: 6.9
  }
];

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/placement_system', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('MongoDB Connected for User Seeding...');
        
        // Wipe existing users to ensure clean slate
        await User.deleteMany();
        console.log('Legacy Users Cleared.');

        // Hash passwords before mass insertion
        const salt = await bcrypt.genSalt(10);
        const hashedUsers = users.map(user => {
            return {
                ...user,
                password: bcrypt.hashSync(user.password, salt)
            };
        });

        await User.insertMany(hashedUsers);
        console.log('7 Realistic User Profiles (Students, Admin, Company) successfully injected!');
        
        process.exit();
    } catch (err) {
        console.error('Seeding Failed:', err);
        process.exit(1);
    }
};

seedUsers();
