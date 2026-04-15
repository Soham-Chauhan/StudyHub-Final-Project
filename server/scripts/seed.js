const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
const Course = require('../models/Course');
const Section = require('../models/Section');
const SubSection = require('../models/SubSection');
require('dotenv').config({ path: '../.env' });

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to DB");

        const courses = await Course.find({});
        console.log(`Found ${courses.length} courses to populate.`);

        for (const course of courses) {
            console.log(`Populating course: ${course.courseName}`);

            // Clear existing sections first to avoid duplicates/confusion
            if (course.courseContent.length > 0) {
                for (const sectionId of course.courseContent) {
                    const section = await Section.findById(sectionId);
                    if (section) {
                        await SubSection.deleteMany({ _id: { $in: section.subSection } });
                        await Section.findByIdAndDelete(sectionId);
                    }
                }
                course.courseContent = [];
            }

            // 1. Create Section 1: Foundations
            const section1 = await Section.create({ sectionName: "Foundations & Overview" });
            
            // 2. Add SubSections to Section 1
            const sub1 = await SubSection.create({
                title: "Introduction to the Syllabus",
                description: `What we will cover in ${course.courseName}.`,
                timeDuration: "05:00",
                videoUrl: "https://res.cloudinary.com/dwed2xhap/video/upload/v1695280962/myData/sample_video_1.mp4"
            });
            
            const sub2 = await SubSection.create({
                title: "Required Reading & Setup",
                description: "Getting ready for the deep dive.",
                timeDuration: "10:30",
                videoUrl: "https://res.cloudinary.com/dwed2xhap/video/upload/v1695280962/myData/sample_video_2.mp4"
            });

            section1.subSection.push(sub1._id, sub2._id);
            await section1.save();

            // 3. Create Section 2: Core Concepts
            const section2 = await Section.create({ sectionName: "Core Modules & Practical Application" });
            
            const sub3 = await SubSection.create({
                title: "Main Conceptual Framework",
                description: "Deep dive into the core themes and technology.",
                timeDuration: "25:45",
                videoUrl: "https://res.cloudinary.com/dwed2xhap/video/upload/v1695280962/myData/sample_video_1.mp4"
            });

            const sub4 = await SubSection.create({
                title: "Hands-on Workshop",
                description: "Final practical exercise and mini-project.",
                timeDuration: "40:00",
                videoUrl: "https://res.cloudinary.com/dwed2xhap/video/upload/v1695280962/myData/sample_video_2.mp4"
            });

            section2.subSection.push(sub3._id, sub4._id);
            await section2.save();

            // 4. Update Course with Sections
            course.courseContent.push(section1._id, section2._id);
            await course.save();

            console.log(`- Successfully updated ${course.courseName} with 2 sections and 4 lectures.`);
        }

        console.log("Course content population complete!");
        mongoose.disconnect();
    } catch (error) {
        console.error("Seeding error:", error);
        process.exit(1);
    }
};

seed();
