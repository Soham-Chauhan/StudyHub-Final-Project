const mongoose = require('mongoose');
const Course = require('../models/Course');
require('dotenv').config({ path: '../.env' });

const fixInstructions = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to DB");

        const courses = await Course.find({});
        console.log(`Fixing instructions for ${courses.length} courses...`);

        for (const course of courses) {
            let currentInstructions = course.instructions;
            
            // If instructions is missing or not a JSON array string, fix it
            try {
                if (!currentInstructions) {
                    course.instructions = JSON.stringify(["Full lifetime access", "Access on mobile and TV", "Certificate of completion", "Exercises and Quizzes"]);
                } else {
                    // Test if it's already a JSON array
                    const parsed = JSON.parse(currentInstructions);
                    if (!Array.isArray(parsed)) {
                        course.instructions = JSON.stringify([currentInstructions]);
                    }
                }
            } catch (e) {
                // If parsing fails, it's likely a plain string or undefined
                if (currentInstructions) {
                    course.instructions = JSON.stringify([currentInstructions]);
                } else {
                    course.instructions = JSON.stringify(["Hands-on training", "Expert mentorship", "Practical projects"]);
                }
            }
            
            await course.save();
        }

        console.log("Instructions fixed!");
        mongoose.disconnect();
    } catch (error) {
        console.error("Fix error:", error);
    }
};

fixInstructions();
