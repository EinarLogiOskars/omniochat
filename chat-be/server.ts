import { config } from 'dotenv';
import http from 'http';
import app from './src/app';

config();
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
});

const shutdown = (signal: NodeJS.Signals) => {
    console.log(`Received ${signal}, shutting down...`);
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000).unref();
}

['SIGINT', 'SIGTERM'].forEach(sig => process.on(sig, shutdown));
