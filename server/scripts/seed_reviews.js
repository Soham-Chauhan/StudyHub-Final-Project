const mongoose = require('mongoose');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Course = require('../models/Course');
const RatingAndReview = require('../models/RatingAndReview');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '../.env' });

const seedReviews = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to DB");

        // 1. Find or create a student user
        let student = await User.findOne({ email: "student@studyhub.com" });
        if (!student) {
            const hashedPassword = await bcrypt.hash("123456", 10);
            const profile = await Profile.create({
                gender: "Female",
                dateOfBirth: "2000-01-01",
                about: "I am a passionate learner.",
                contactNumber: "1234567890"
            });
            student = await User.create({
                firstName: "Anjana",
                lastName: "Learner",
                email: "student@studyhub.com",
                password: hashedPassword,
                accountType: "Student",
                additionalDetails: profile._id,
                image: `https://api.dicebear.com/7.x/initials/svg?seed=Anjana%20Learner`,
                approved: true
            });
            console.log("Student user created.");
        }

        const sampleReviews = [
            { rating: 5, text: "Excellent course! The content is clear and very practical." },
            { rating: 4, text: "The instructor is very knowledgeable. Highly recommended!" },
            { rating: 5, text: "Perfect for beginners. I learned so much in a short time!" },
            { rating: 4, text: "Great examples and the pace of the course is just right." },
            { rating: 5, text: "Truly mastered the subject after this. Best course on StudyHub!" }
        ];

        const courses = await Course.find();
        console.log(`Seeding reviews for ${courses.length} courses...`);

        for (const course of courses) {
            // Find 2-3 random reviews
            const count = Math.floor(Math.random() * 2) + 2; // 2 to 3 reviews
            const courseReviews = [];

            for (let i = 0; i < count; i++) {
                const randomReview = sampleReviews[Math.floor(Math.random() * sampleReviews.length)];
                
                const reviewObj = await RatingAndReview.create({
                    user: student._id,
                    rating: randomReview.rating,
                    review: randomReview.text,
                    course: course._id
                });
                courseReviews.push(reviewObj._id);
            }

            // Update course with review IDs
            course.ratingAndReviews = courseReviews;
            // Also add student to enrolled students so they can "legitimately" review if needed
            if (!course.studentsEnrolled.includes(student._id)) {
                course.studentsEnrolled.push(student._id);
            }
            await course.save();
            console.log(`  - Seeded ${count} reviews for: ${course.courseName}`);
        }

        console.log("Review seeding completed!");
        mongoose.disconnect();
    } catch (error) {
        console.error("Seeding error:", error);
    }
};

seedReviews();
