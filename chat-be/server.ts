import express, { Request, Response } from 'express';
import { config } from 'dotenv';
import { Ollama } from 'ollama';
import cors from "cors";

config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}))


const OLLAMA_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434/';
console.log(process.env.OLLAMA_BASE_URL);
const ollama = new Ollama({
    host: OLLAMA_URL,
});

app.get('/api/ps', async (req: Request, res: Response) => {
    try {
        const models = await ollama.ps();
        res.json(models);
    } catch (err) {
        console.error("Error listing active models:", err);
        res.status(500).json({ error: "Failed to list active models"});
    }
});

app.get('/api/list', async (req: Request, res: Response) => {
    try {
        const models = await ollama.list();
        res.json(models);
    } catch (err) {
        console.error("Error listing models:" , err);
        res.status(500).json({ error: "Failed to list models"});
    }
});

app.post('/api/pull', async (req: Request, res: Response) => {
    const model = req.body;
    try { 
        const resp = await ollama.pull(model);
        res.json(resp);
    } catch (err) {
        console.error("Error pulling model", err);
        res.status(500).json({ error: "Failed to pull model"});
    }
});

app.delete('/api/delete', async (req: Request, res: Response) => {
    const model = req.body;
    try {
        const resp = await ollama.delete(model);
        res.json(resp);
    } catch (err) {
        console.error("Failed to delete model", err);
        res.status(500).json({ error: "Failed to delete model"});
    }
})

app.post('/api/chat', async (req: Request, res: Response) => {
    const { model, messages, stream = false, options } = req.body;

    if (!model || !messages) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
        if (stream) {
            res.writeHead(200, {
                'content-type': 'text/event-stream',
                'cache-control': 'no-cache',
                'connection': 'keep-alive'
            });

            const chatResponse = await ollama.chat({
                model,
                messages,
                stream: true,
                options,
            });

            for await (const chunk of chatResponse) {
                res.write(`data: ${JSON.stringify(chunk)}\n\n`);
            }
            res.end();
        } else {
            const response = await ollama.chat({
                model,
                messages
            });
            res.json({ response: response.message.content });
        }
    } catch (error) {
        console.error("Error during chat: ", error);
        res.status(500).json({ error: 'Chat request failed' });
    }
});

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, express!');
});

app.listen(PORT);
