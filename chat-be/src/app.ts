import express from 'express';
import cors from 'cors';
import ollamaRoutes from './routes/ollama';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type"]
}));
app.use('/api', ollamaRoutes);
export default app;