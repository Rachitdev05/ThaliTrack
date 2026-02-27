import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false }, // False until OTP verified
    otp: { type: String },
    otpExpires: { type: Date },
    // We can store weight/water goals here later
    settings: {
        calorieGoal: { type: Number, default: 2000 },
        budgetLimit: { type: Number, default: 500 }
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;