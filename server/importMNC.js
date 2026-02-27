const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const Company = require('./models/Company');
const path = require('path');
require('dotenv').config({ path: './.env' });

const processTags = (tagStr) => {
    if (!tagStr || tagStr === '[]') return [];
    try {
        // Replace single quotes with double quotes to make it valid JSON
        // e.g. "['Foreign MNC', 'IT Services']" -> '["Foreign MNC", "IT Services"]'
        const jsonReady = tagStr.replace(/'/g, '"');
        return JSON.parse(jsonReady);
    } catch (e) {
        // Fallback: manually strip brackets and split
        let clean = tagStr.replace(/^\[|\]$/g, '');
        return clean.split(',').map(s => s.replace(/'/g, '').trim());
    }
};

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to Database. Initiating Migration...");
    
    const companies = [];
    const csvPath = path.resolve(__dirname, '../../MNC.csv');
    console.log("Reading CSV from:", csvPath);

    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
          if (!row.company) return; // Skip empty rows
          
          let parsedTags = processTags(row.tags);
          
          companies.push({
              name: row.company.trim(),
              rating: parseFloat(row.rating) || 0,
              reviews: row.reviews ? row.reviews.trim() : "",
              tags: parsedTags,
              // Intelligently assign the 'type' to the first tag like 'Foreign MNC' or default
              type: parsedTags.length > 0 ? parsedTags[0] : 'Other'
          });
      })
      .on('end', async () => {
          try {
             console.log(`Parsed ${companies.length} corporate profiles. Synchronizing to Atlas...`);
             
             let successCount = 0;
             // Using Upsert to prevent duplicate key crash if a company already exists
             for (let c of companies) {
                 const result = await Company.updateOne(
                    { name: c.name }, 
                    { $set: c }, 
                    { upsert: true }
                 );
                 if (result.upsertedId || result.modifiedCount > 0) successCount++;
             }
             
             console.log(`✅ System Sync Complete: ${successCount} companies merged into the network.`);
             process.exit(0);
          } catch(err) {
             console.error("❌ Critical Import Error", err);
             process.exit(1);
          }
      });
})
.catch(err => {
    console.error("Database connection failed", err);
    process.exit(1);
});
