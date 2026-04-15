const mongoose = require('mongoose');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Course = require('../models/Course');
const RatingAndReview = require('../models/RatingAndReview');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '../.env' });

const seedDiverseReviews = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to DB");

        const studentData = [
            { first: "Aayush", last: "Sharma", email: "aayush@studyhub.com" },
            { first: "Priya", last: "Patel", email: "priya@studyhub.com" },
            { first: "Rahul", last: "Singh", email: "rahul@studyhub.com" },
            { first: "Sneha", last: "Reddy", email: "sneha@studyhub.com" },
            { first: "Vikram", last: "Gupta", email: "vikram@studyhub.com" }
        ];

        const students = [];
        const hashedPassword = await bcrypt.hash("123456", 10);

        for (const data of studentData) {
            let student = await User.findOne({ email: data.email });
            const profile = await Profile.create({ about: `I am ${data.first}, a passionate learner.` });
            const avatarSeed = `${data.first}${data.last}`;
            
            if (!student) {
                student = await User.create({
                    firstName: data.first,
                    lastName: data.last,
                    email: data.email,
                    password: hashedPassword,
                    accountType: "Student",
                    additionalDetails: profile._id,
                    image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`,
                    approved: true
                });
                console.log(`Student created with Avatar: ${data.first} ${data.last}`);
            } else {
                student.image = `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`;
                await student.save();
                console.log(`Updated Avatar for: ${data.first} ${data.last}`);
            }
            students.push(student);
        }

        const reviewPool = [
            { rating: 5, text: "Absolutely loved it! The instructor explains complex bits so simply." },
            { rating: 4, text: "Very informative. The projects are actually useful for a portfolio." },
            { rating: 5, text: "High quality content. Better than many expensive bootcamps!" },
            { rating: 3, text: "Good material, but I wish there were more quizzes." },
            { rating: 5, text: "A life-changing course for me. Thank you, StudyHub!" },
            { rating: 4, text: "Solid foundations. I feel much more confident now." }
        ];

        const courses = await Course.find();
        console.log(`Seeding diverse reviews for ${courses.length} courses...`);

        // Clear existing reviews to avoid duplicates or overcrowding
        await RatingAndReview.deleteMany({});
        
        for (const course of courses) {
            const courseReviews = [];
            course.studentsEnrolled = [];

            // Define mandatory ratings to ensure a mix
            const mandatoryRatings = [3, 4, 5];
            
            for (const ratingValue of mandatoryRatings) {
                const student = students[Math.floor(Math.random() * students.length)];
                // Filter pool for the specific rating
                const suitableReviews = reviewPool.filter(r => r.rating === ratingValue);
                const reviewData = suitableReviews[Math.floor(Math.random() * suitableReviews.length)];

                const reviewObj = await RatingAndReview.create({
                    user: student._id,
                    rating: reviewData.rating,
                    review: reviewData.text,
                    course: course._id
                });
                courseReviews.push(reviewObj._id);
                
                // Enroll student in course (Course model)
                if (!course.studentsEnrolled.includes(student._id)) {
                    course.studentsEnrolled.push(student._id);
                }

                // Push course to student (User model)
                if (!student.courses.includes(course._id)) {
                    student.courses.push(course._id);
                    await student.save();
                }
            }

            course.ratingAndReviews = courseReviews;
            await course.save();
            console.log(`  - Seeded 3 diverse reviews (3,4,5 mixed) for: ${course.courseName}`);
        }

        console.log("Diverse review seeding complete!");
        mongoose.disconnect();
    } catch (error) {
        console.error("Seeding error:", error);
    }
};

seedDiverseReviews();
