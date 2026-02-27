import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js'; // <--- 1. IMPORT THE CONNECTION
import foodRoutes from './routes/foodRoutes.js'; // <--- 1. IMPORT ROUTES
import authRoutes from './routes/authRoutes.js'; // Import



dotenv.config();

// 2. CONNECT TO DATABASE
connectDB(); // <--- This executes the connection logic we just wrote

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/foods', foodRoutes); // <--- USE ROUTES
app.use('/api/auth', authRoutes); // <--- Add this line

app.get('/', (req, res) => {
    res.send('API is running... ThaliTrack is live!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});