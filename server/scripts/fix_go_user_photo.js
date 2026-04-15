const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const Course = require('../models/Course');
require('dotenv').config({ path: '../.env' });

async function fixGoCourse() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to MongoDB...");
        
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET,
        });

        const imagePath = "C:\\Users\\anjan\\.gemini\\antigravity\\brain\\b7119367-ef1f-4411-bc1e-b3417e8f786e\\media__1774441806313.jpg";
        
        console.log("Uploading image to Cloudinary...");
        const uploadResult = await cloudinary.uploader.upload(imagePath, {
            folder: process.env.FOLDER_NAME || "myData",
            resource_type: "auto"
        });
        
        const photoUrl = uploadResult.secure_url;
        console.log(`Cloudinary URL: ${photoUrl}`);

        const courseName = "Go Programming Expert Level - Game Development";
        
        const result = await Course.findOneAndUpdate(
            { courseName: { $regex: /Go.*Game/i } },
            { thumbnail: photoUrl },
            { new: true }
        );
        
        if (result) {
            console.log(`Successfully updated: ${result.courseName}`);
        } else {
            console.log("Course matching 'Go.*Game' NOT FOUND in database.");
        }
        
        mongoose.disconnect();
    } catch (e) {
        console.error(e);
    }
}
fixGoCourse();
