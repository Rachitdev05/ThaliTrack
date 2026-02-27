import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // 1. Attempt to connect
        // We use 'await' because connecting to a cloud server takes time (milliseconds)
        // We don't want the code to move forward until this is done.
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Connected..........: ${conn.connection.host}`);
    } catch (error) {
        // 2. Handle Errors
        // If the password is wrong or internet is down, this runs.
        console.error(`Error: ${error.message}`);
        process.exit(1); // Stop the server immediately. No DB = No App.
    }
};

export default connectDB;