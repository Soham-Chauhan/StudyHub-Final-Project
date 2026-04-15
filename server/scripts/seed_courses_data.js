const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
const Course = require('../models/Course');
const Section = require('../models/Section');
const SubSection = require('../models/SubSection');
const Profile = require('../models/Profile');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '../.env' });

const seedCourses = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to DB");

        // 1. Fetch Categories
        const categories = await Category.find({});
        console.log(`Found ${categories.length} categories.`);
        
        if (categories.length === 0) {
            console.log("No categories found. Creating some...");
            const cats = ['Web Development', 'Android Development', 'Python', 'AI/ML', 'Cloud Computing'];
            for (const catName of cats) {
                await Category.create({ name: catName, description: `Explore courses in ${catName}` });
            }
            console.log("Categories created.");
        }

        const instructorsData = [
            { firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com', password: 'password123', accountType: 'Instructor' },
            { firstName: 'John', lastName: 'Smith', email: 'john.smith@example.com', password: 'password123', accountType: 'Instructor' },
            { firstName: 'Babbar', lastName: 'Love', email: 'love.babbar@example.com', password: 'password123', accountType: 'Instructor' }
        ];

        const instructorIds = [];
        for (const iData of instructorsData) {
            let instructor = await User.findOne({ email: iData.email });
            if (!instructor) {
                const hashedPassword = await bcrypt.hash(iData.password, 10);
                
                // Create profile first
                const profile = await Profile.create({
                    gender: null,
                    dateOfBirth: null,
                    about: `I am ${iData.firstName}, a professional instructor.`,
                    contactNumber: null
                });

                instructor = await User.create({ 
                    ...iData, 
                    password: hashedPassword,
                    additionalDetails: profile._id,
                    image: `https://api.dicebear.com/5.x/initials/svg?seed=${iData.firstName} ${iData.lastName}`
                });
                console.log(`Instructor created: ${iData.firstName}`);
            }
            instructorIds.push(instructor._id);
        }

        const sampleCourses = [
            { name: "Full-Stack Web Boot Camp", instructorIdx: 0 },
            { name: "Advanced React Mastery", instructorIdx: 1 },
            { name: "Practical Python for Beginners", instructorIdx: 0 },
            { name: "Machine Learning Concepts with Python", instructorIdx: 1 },
            { name: "Building Scalable Android Apps", instructorIdx: 0 },
            { name: "Cloud Infrastructure Specialist", instructorIdx: 1 },
            { name: "Go Programming Expert Level", instructorIdx: 0 },
            { name: "Strategic Cybersecurity Overview", instructorIdx: 1 }
        ];

        const allCategories = await Category.find({});
        for (let i = 0; i < allCategories.length; i++) {
            const category = allCategories[i];
            
            // Add at least 2 courses per category
            for (let j = 0; j < 2; j++) {
                const courseInfo = sampleCourses[(i * 2 + j) % sampleCourses.length];
                const instructorId = instructorIds[courseInfo.instructorIdx];
                
                const existingCourse = await Course.findOne({ courseName: `${courseInfo.name} - ${category.name}` });
                if (existingCourse) continue;

                const newCourse = await Course.create({
                    courseName: `${courseInfo.name} - ${category.name}`,
                    description: `This is a comprehensive course on ${courseInfo.name} within the ${category.name} track.`,
                    instructor: instructorId,
                    whatWillYouLearn: "You will learn core concepts, practical skills, and advance techniques used by professionals.",
                    price: (Math.floor(Math.random() * 50) + 10) * 100, // Price between 1000 and 6000
                    thumbnail: `https://picsum.photos/seed/${category.name}${j}/800/450`,
                    category: category._id,
                    status: 'Published',
                    createdAt: Date.now()
                });

                // Update category with this course
                category.course.push(newCourse._id);
                await category.save();

                // Update instructor with this course
                await User.findByIdAndUpdate(instructorId, { $push: { courses: newCourse._id } });

                console.log(`- Course created: ${newCourse.courseName}`);
            }
        }

        console.log("Seeding complete! Now run seed.js to add sections to these courses.");
        mongoose.disconnect();
    } catch (error) {
        console.error("Seeding error:", error);
    }
};

seedCourses();
