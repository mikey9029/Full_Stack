const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

mongoose.connect('mongodb://127.0.0.1:27017/placement_system', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log("Connected to MongoDB...");
    await mongoose.connection.db.dropDatabase();
    console.log("Entire database 'placement_system' dropped successfully.");
    process.exit(0);
})
.catch((err) => {
    console.error("Database deletion failed:", err);
    process.exit(1);
});
