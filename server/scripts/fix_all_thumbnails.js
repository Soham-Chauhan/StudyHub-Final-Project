const mongoose = require('mongoose');
const Course = require('../models/Course');
require('dotenv').config({ path: '../.env' });

const fixAllThumbnails = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to DB");

        const imageMapping = {
            'react': '1633356122544-f134324a6cee',
            'python': '1526374965328-7f61d4dc18c5',
            'machine learning': '1555255707-c0796c88bc21',
            'cyber security': '1550751827-4bd374c3f58b',
            'cybersecurity': '1550751827-4bd374c3f58b',
            'data science': '1551288049-bbda3865c871',
            'devops': '1451187580459-43490279c0fa',
            'cloud': '1451187580459-43490279c0fa',
            'android': '1607252689355-113d8a3098ad',
            'mobile': '1512941937669-90a1b58e7e9c',
            'figma': '1586717791821-3f44a563cc4c',
            'ui/ux': '1586717791821-3f44a563cc4c',
            'design': '1586717791821-3f44a563cc4c',
            'web': '1547658719-da2b811691ee',
            'html': '1542831371-329b27af9759',
            'css': '1507721994668-2623288d8021',
            'javascript': '1579468116648-897c9b2d87a4',
            'mern': '1547658719-da2b811691ee',
            'game': '1552824702-869279093e09',
            'unity': '1552824702-869279093e09'
        };

        const courses = await Course.find({});
        console.log(`Verifying thumbnails for ALL ${courses.length} courses...`);

        for (let i = 0; i < courses.length; i++) {
            const course = courses[i];
            const courseNameLower = course.courseName.toLowerCase();
            
            let photoId = '1516321318423-f06f85e504b3'; // Default high-quality tech image
            
            for (const [key, id] of Object.entries(imageMapping)) {
                if (courseNameLower.includes(key)) {
                    photoId = id;
                    break;
                }
            }

            const thumbUrl = `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&q=80&w=800`;
            
            // Check if thumbnail was missing or should be replaced
            course.thumbnail = thumbUrl;
            await course.save();
            console.log(`[OK] ${course.courseName} -> Updated with ID: ${photoId}`);
        }

        console.log("Database update finalized.");
        mongoose.disconnect();
    } catch (error) {
        console.error("Update error:", error);
    }
};

fixAllThumbnails();
