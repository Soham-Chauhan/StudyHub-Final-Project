const mongoose = require('mongoose');
require('dotenv').config({ path: './Server/.env' });

const check = async () => {
    try {
        console.log("Connecting to:", process.env.MONGODB_URL);
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Success!");
        mongoose.disconnect();
    } catch (e) {
        console.error("Error:", e);
    }
};
check();
