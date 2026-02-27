import Food from '../models/foodModel.js';

// @desc    Get foods (Single Date OR Date Range)
// @route   GET /api/foods?date=YYYY-MM-DD
// @route   GET /api/foods?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
export const getFoods = async (req, res) => {
    try {
        let query = {};

        // OPTION 1: Date Range (For Weekly Trends)
        if (req.query.startDate && req.query.endDate) {
            const start = new Date(req.query.startDate);
            start.setHours(0, 0, 0, 0); // Start of first day

            const end = new Date(req.query.endDate);
            end.setHours(23, 59, 59, 999); // End of last day

            query = {
                createdAt: {
                    $gte: start,
                    $lte: end
                }
            };
        } 
        // OPTION 2: Single Date (For Daily Diary)
        else if (req.query.date) {
            const selectedDate = new Date(req.query.date);
            const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
            const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));

            query = {
                createdAt: {
                    $gte: startOfDay,
                    $lte: endOfDay
                }
            };
        }

        const foods = await Food.find({ user: req.user.id }).sort({ createdAt: 1 }); // Sort Oldest to Newest for charts
        res.json(foods);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a new food item
// @route   POST /api/foods
// @access  Public

export const createFood = async (req, res) => {
    try {
        const {name , calories , protein, carbs, fat, portionSize, approxCost, category} = req.body;

        //create a new food item in memory
        const food = new Food({
            name,
            calories,
            protein,
            carbs,
            fat,
            portionSize,
            approxCost,
            category
        })

        //Save it to Database
        const createFood = await Food.create({ ...req.body, user: req.user.id });
        res.status(201).json(createFood)
    } catch (error) {
         res.status(400).json({ message: error.message });
    }
}
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



