import Food from '../models/foodModel.js';

// @desc    Get foods (Strict Date Filtering)
// @route   GET /api/foods?date=YYYY-MM-DD
export const getFoods = async (req, res) => {
    try {
        // 1. Get the Current User's ID (From the auth middleware)
        // If you haven't added auth yet, remove "user: req.user.id"
        // But based on our progress, you likely need this:
        const userId = req.user ? req.user.id : null; 

        let query = {};
        
        // If using Auth, ensure we only fetch THIS user's food
        if (userId) {
            query.user = userId;
        }

        // 2. Date Filtering Logic
        if (req.query.date) {
            // Create a date object from the string (e.g., "2026-02-28")
            const dateString = req.query.date;
            
            // Construct Start of Day (00:00:00)
            const startOfDay = new Date(dateString);
            startOfDay.setHours(0, 0, 0, 0);

            // Construct End of Day (23:59:59)
            const endOfDay = new Date(dateString);
            endOfDay.setHours(23, 59, 59, 999);

            // Add date filter to the query
            query.createdAt = {
                $gte: startOfDay, // Greater than or equal to 00:00
                $lte: endOfDay    // Less than or equal to 23:59
            };
        }

        // 3. Fetch from Database
        const foods = await Food.find(query).sort({ createdAt: -1 });
        
        res.json(foods);

    } catch (error) {
        console.error("Error in getFoods:", error);
        res.status(500).json({ message: "Server Error fetching foods" });
    }
};

// @desc    Add a new food item
// @route   POST /api/foods
// @access  Private (Requires Token)
export const createFood = async (req, res) => {
    try {
        const { name, calories, protein, carbs, fat, portionSize, approxCost, category } = req.body;

        // Create the food and ATTACH THE USER ID
        const food = await Food.create({
            user: req.user._id, // <--- THIS IS THE CRITICAL LINE!
            name,
            calories,
            protein,
            carbs,
            fat,
            portionSize,
            approxCost,
            category
        });

        res.status(201).json(food);
    } catch (error) {
        // This catches Mongoose validation errors
        res.status(400).json({ message: error.message });
    }
};
    // @desc    Delete a food item
// @route   DELETE /api/foods/:id
// @access  Public
export const deleteFood = async (req, res) => {
    try {
        const food = await Food.findById(req.params.id);

        if (food) {
            await food.deleteOne(); 
            res.json({ message: 'Food removed' });
        } else {
            res.status(404).json({ message: 'Food not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



