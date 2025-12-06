# Omniochat Monorepo

Full-stack, neobrutalist chat experience for local LLMs. This repo contains:
- `chat-ui/` – Next.js 16 + React 19 front-end with shadcn UI, chat streaming, sidebar chat management, and localStorage persistence.
- `chat-be/` – Express + Ollama backend that proxies chat/list requests (SSE streaming supported).
- `docker-compose.yml` – Optional Postgres + Ollama + backend + webapp stack.

## Stack
- UI: Next.js 16 (App Router), React 19, Tailwind 4, shadcn/Radix, react-markdown. See [`chat-ui/README.md`](chat-ui/README.md) for UI details.
- Backend: Express 5, `ollama` SDK, TypeScript.
- Infra (optional): Docker Compose with Postgres 17 and Ollama.
    - Backend details: [`chat-be/README.md`](chat-be/README.md).

## Quick Start (Docker Compose)
Requires Docker and (optionally) NVIDIA toolkit if you want GPU for Ollama.
```bash
docker-compose up --build
```
Services:
- `webapp` → http://localhost:3000
- `backend` → internal, used by webapp
- `ollama` → exposed on 11434
- `db` → Postgres (not yet used by the app, placeholder)

Persisted volumes: `postgres_data`, `ollama_data`.

### Local dev override
A gitignored `docker-compose.override.yml` can point services at the lightweight `Dockerfile.dev` images, mount code + `node_modules` for hot reload, and expose the backend on `3001` so the browser can hit it directly. Use that locally instead of the prod-style images.

## Running Locally (Docker + optional host Ollama)

If you want to run the app locally in Docker with Docker compose for a dev environment, add a `docker-compose.override.yml` (gitignored) file like the example below. Optionally if you prefer to run Ollama on the host (faster, especially on Apple silicon), then uncomment the OLLAMA_BASE_URL line, and make sure the server.ts file points to it.

```yaml
# docker-compose.override.yml
services:
    backend:
        build:
            context: ./chat-be
            dockerfile: Dockerfile.dev
    ports:
        - "3001:3000"
    environment:
#        OLLAMA_BASE_URL: "http://host.docker.internal:11434"
    volumes:
        - ./chat-be:/app
        - /app/node_modules

    webapp:
        build:
            context: ./chat-ui
            dockerfile: Dockerfile.dev
     environment:
        BASE_API_URL: "http://localhost:3001"
    volumes:
        - ./chat-ui:/app
        - /app/node_modules
```

Then:
```bash
docker-compose up --build
```

Model management: use the backend endpoints with Postman/curl to pull/delete models. Browse models at https://ollama.com/library and call:
- `POST /api/pull` with body `{ "model": "<name>" }`
- `DELETE /api/delete` with body `{ "model": "<name>" }`
- `GET /api/list` to see what’s available

## Running Locally (without Docker)

### Backend (chat-be)
```bash
cd chat-be
npm install    # or pnpm/yarn
npm run dev    # nodemon server.ts (default port 3000)
```
Env:
- `PORT` (default 3000)
- `OLLAMA_BASE_URL` (default `http://localhost:11434/` recommended; you can set to `http://host.docker.internal:11434/` to use host Ollama while running in Docker)

> Note: `host.docker.internal` works on macOS by default; on Linux/Windows you may need to add an entry or use the host IP. In deployment, point `OLLAMA_BASE_URL` at your deployed Ollama endpoint.

Endpoints:
- `GET /api/list` – list available models
- `GET /api/ps` – list running models
- `POST /api/pull` – pull model (body: model descriptor)
- `DELETE /api/delete` – delete model (body: model descriptor)
- `POST /api/chat` – chat; supports `stream: true` for SSE (`data: {...}` lines)

### Frontend (chat-ui)
```bash
cd chat-ui
pnpm install   # or npm/yarn
pnpm dev       # http://localhost:3000
```
Env:
- `BASE_API_URL` (default `http://localhost:3001`) – URL of the backend.

Features:
- Model picker (from `/api/list`)
- Streaming chat UI with auto-scroll (only when at bottom)
- Sidebar chat list: new, rename, delete
- Chats persisted to `localStorage` and sorted by last updated
- Mobile-friendly sidebar trigger

## Project Layout
- `chat-ui/app` – layout/pages
- `chat-ui/components` – UI pieces (sidebar, chat bubble, dialogs)
- `chat-ui/context` – chat selection and stored chats providers
- `chat-ui/hooks` – models, chat stream parser, stored chats, mobile detection
- `chat-be/server.ts` – Express + Ollama routes
- `docker-compose.yml` – optional full stack

## Notes
- New chats are created on first user message in the UI.
- LocalStorage is the persistence layer for chats today.
- The SSE stream parser expects `data: { ... }` lines; malformed chunks are skipped.
