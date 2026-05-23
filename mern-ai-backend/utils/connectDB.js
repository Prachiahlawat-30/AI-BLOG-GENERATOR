const mongoose = require('mongoose');
// PASSWORD: yVpOiwRkmh1n4PeA
//UserNmae : chaudharyprachi945_db_user

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb+srv://chaudharyprachi945_db_user:yVpOiwRkmh1n4PeA@mern-ai.unstkad.mongodb.net/?appName=MERN-AI')
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

module.exports = connectDB;