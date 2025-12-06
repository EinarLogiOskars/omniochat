# Omniochat Backend (chat-be)

Express + Ollama proxy used by the UI.

## Prereqs
- Node 18+
- Ollama running (default `http://localhost:11434/` or `http://host.docker.internal:11434/` when using Docker on macOS)
- (Optional) Docker/Compose

## Env
- `PORT` (default 3000)
- `OLLAMA_BASE_URL` (default `http://localhost:11434/` for local/non-Docker runs; **must override** in Docker/production to point at the Ollama host or service)

## Run
```bash
npm install
npm run dev   # nodemon server.ts on :3000
```

## Endpoints
- `GET /api/list` — list models
- `GET /api/ps` — running models
- `POST /api/pull` — pull model (body: model descriptor)
- `DELETE /api/delete` — delete model (body: model descriptor)
- `POST /api/chat` — chat; supports `stream: true` for SSE

## Docker
Used by `docker-compose.yml`; you can override `OLLAMA_BASE_URL` to point at host Ollama if needed.

## Planned
- Persist chat history/memory in Postgres
- Web search augmentation
- RAG (embeddings/vector store)
- Auth/rate limiting
