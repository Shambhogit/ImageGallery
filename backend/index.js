import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import imagesRouter from './routes/images.route.js';
import authRouter from './routes/auth.route.js';

import { getDbConnection } from './utils/dbConnection.js';

dotenv.config();

getDbConnection();

const PORT = process.env.PORT;
const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRouter)
app.use('/api/images', imagesRouter);

app.listen(PORT, () => {
    console.log(`Backend is listening on http://localhost:${PORT}`);
})