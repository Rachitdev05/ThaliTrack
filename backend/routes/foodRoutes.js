import express from 'express';
import { getFoods, createFood ,deleteFood} from '../controllers/foodController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();


// The '/' here actually means '/api/foods' (we will define that in server.js)

router.route('/')
     .get(protect,getFoods)  // GET request triggers getFoods
     .post(protect, createFood); // POST request triggers createFood

     // NEW ROUTE for deleting specific items
     router.route('/:id').delete(protect,deleteFood);

export default router;