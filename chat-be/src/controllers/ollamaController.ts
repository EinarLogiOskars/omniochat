import { Request, Response } from 'express';
import * as svc from '../services/ollamaService';

export const chat = async (req: Request, res: Response) => {
    const { id, model, messages, stream = false, options } = req.body;
    if (!model || !messages) return res.status(400).json({ error: 'Missing required parameters'});

    try {
        if (stream) {
            res.writeHead(200, {
                'content-type': 'text/event-stream',
                'cache-control': 'no-cache',
                'connection': 'keep-alive'
            });

            const chatResponse = await svc.chatStream(id, {
                model,
                messages,
                stream: true,
                options
            });

            try {
                for await (const chunk of chatResponse) {
                    res.write(`data: ${JSON.stringify(chunk)}\n\n`);
                }
            } catch (err: any) {
                if (err?.name !== 'AbortError') throw err;
            } finally {
                res.end();
            }

        } else {
            const response = await svc.chatOnce({
                model,
                messages,
                stream: false,
                options
            });

            res.json({ response: response.message.content })
        }
    } catch (err) {
        console.error('Error during chat: ', err);
        res.status(500).json({ error: 'Chat request failed' });
    }
}

export const abort = async (req: Request, res: Response) => {
    const { id } = req.body || {};
    if (typeof id !== 'string' || !id) {
        return res.status(400).json({ error: 'Missing or invalid id'});
    }

    try {
        const found = svc.abortStream(id);
        return found ? res.status(204).end() : res.status(404).json({ error: 'Stream not found' });
    } catch (err) {
        console.error('Error aborting chat', err);
        res.status(500).json({ error: 'Failed to abort chat' });
    }
}

export const list = async (_req: Request, res: Response) => {
    try {
        res.json(await svc.listModels());
    } catch (err) {
        console.error('Error listing models: ', err);
        res.status(500).json({ error: 'Failed to list models' });
    }
}

export const ps = async (_req: Request, res: Response) => {
    try {
        res.json(await svc.listActive());
    } catch (err) {
        console.error('Error listing active models: ', err);
        res.status(500).json({ error: 'Failed to list active models' });
    }
}

export const pull = async (req: Request, res: Response) => {
    const model = req.body;
    if (!model) return res.status(400).json({ error: 'Model name missing' });
    try {
        res.json(await svc.pullModel(model));
    } catch (err) {
        console.error('Error pulling model: ', err);
        res.status(500).json({ error: 'Failed to pull model' });
    }
}

export const del = async (req: Request, res: Response) => {
    const model = req.body;
    if (!model) return res.status(400).json({ error: 'Model name missing' });
    try {
        res.json(await svc.deleteModel(model));
    } catch (err) {
        console.error('Error deleting model: ', err);
        res.status(500).json({ error: 'Failed to delete model' });
    }
}

