const fs = require('fs');
const log = (msg) => { fs.appendFileSync('debug_output.txt', msg + '\n'); };
log("STARTING SCRIPT...");
try {
    const mongoose = require('mongoose');
    const cloudinary = require('cloudinary').v2;
    const Course = require('../models/Course');
    require('dotenv').config({ path: '../.env' });
    log("REQUIRED ALL MODULES.");

    (async () => {
        try {
            log("CONNECTING...");
            await mongoose.connect(process.env.MONGODB_URL);
            log("CONNECTED.");
            
            cloudinary.config({
                cloud_name: process.env.CLOUD_NAME,
                api_key: process.env.API_KEY,
                api_secret: process.env.API_SECRET,
            });
            log("CONFIGURED CLOUDINARY.");

            const imagePath = "C:\\Users\\anjan\\.gemini\\antigravity\\brain\\b7119367-ef1f-4411-bc1e-b3417e8f786e\\media__1774441806313.jpg";
            log("PATH: " + imagePath);
            
            const uploadRes = await cloudinary.uploader.upload(imagePath, { folder: "myData" });
            log("UPLOADED: " + uploadRes.secure_url);
            
            const res = await Course.findOneAndUpdate(
                { courseName: { $regex: /Go.*Game/i } },
                { thumbnail: uploadRes.secure_url }
            );
            log("DB UPDATED: " + (res ? res.courseName : "NOT FOUND"));
            
            await mongoose.disconnect();
            log("FINISHED.");
        } catch (e) {
            log("ASYNC ERROR: " + e.message + " " + e.stack);
        }
    })();
} catch (e) {
    log("SYNC ERROR: " + e.message + " " + e.stack);
}
