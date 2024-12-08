import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router as chatRouter } from './routes/chat.js';
import { errorHandler } from './middleware/error.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/chat', chatRouter);

// Error handling
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});