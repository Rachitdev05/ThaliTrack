import mongoose from 'mongoose';

const foodSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, // <--- NEW
    name: {
        type: String,
        required: [true, "Please add a food name"], // User MUST type a name
        trim: true
    },
    calories: {
        type: Number,
        required: [true, "Please add calories"]
    },
    protein: {
        type: Number,
        required: true
    },
    carbs: {
        type: Number,
        required: true
    },
    fat: {
        type: Number,
        required: true
    },
    portionSize: {
        type: String,
        required: true,
        default: "1 katori" // Default to Indian standard
    },
    approxCost: {
        type: Number, // This is your UNIQUE budget feature
        required: true
    },
    category: {
        type: String,
        enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'], // Only these allowed
        required: true
    }
}, {
    timestamps: true // Automatically adds 'createdAt' and 'updatedAt' times
});

const Food = mongoose.model('Food', foodSchema);

export default Food;