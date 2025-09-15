import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import imagesRouter from './routes/images.route.js';
dotenv.config();


const PORT = process.env.PORT;
const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/images', imagesRouter);

app.listen(PORT, () => {
    console.log(`Backend is listening on http://localhost:${PORT}`);
})