const fs = require('fs');
const log = (msg) => { console.log(msg); fs.appendFileSync('final_log.txt', msg + '\n'); };
log("STARTING SCRIPT (IIFE PROPERLY AWAITED)...");

const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const Course = require('../models/Course');
require('dotenv').config({ path: '../.env' });

async function run() {
    try {
        log("CONNECTING...");
        await mongoose.connect(process.env.MONGODB_URL);
        log("CONNECTED.");
        
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET,
        });

        const imagePath = "C:\\Users\\anjan\\.gemini\\antigravity\\brain\\b7119367-ef1f-4411-bc1e-b3417e8f786e\\media__1774441806313.jpg";
        log("UPLOADING: " + imagePath);
        
        const uploadRes = await cloudinary.uploader.upload(imagePath, { folder: "myData" });
        log("UPLOADED URL: " + uploadRes.secure_url);
        
        const res = await Course.findOneAndUpdate(
            { courseName: { $regex: /Go.*Game/i } },
            { thumbnail: uploadRes.secure_url },
            { new: true }
        );
        log("DB RESULT: " + (res ? res.courseName + " -> " + res.thumbnail : "NOT FOUND"));
        
        await mongoose.disconnect();
        log("FINISHED SUCCESSFULLY.");
    } catch (e) {
        log("ERROR: " + e.message + " " + e.stack);
    }
}
run();
