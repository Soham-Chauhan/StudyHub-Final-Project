const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config({ path: './Server/.env' });

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        const instructors = await User.find({ accountType: "Instructor" });
        console.log("Found", instructors.length, "instructors.");
        instructors.forEach(i => console.log("- ", i.email));
        mongoose.connection.close();
    } catch (error) {
        console.error(error);
    }
};
check();
