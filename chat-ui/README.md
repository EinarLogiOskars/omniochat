# Omniochat UI

Neobrutalist chat client for driving a local LLM. Pick a model, stream replies, and manage chats (new, rename, delete) with everything persisted to localStorage.

## Features
- Model picker (fetched from backend `/api/list`)
- Streaming chat with auto-scroll when you are at the bottom
- Sidebar chat list with new/rename/delete actions
- Chats persisted to `localStorage` and sorted by last updated
- Mobile-friendly layout with collapsible sidebar

## Prerequisites
- Node.js 18+ (Next.js 16 / React 19)
- Backend API reachable at `BASE_API_URL` (defaults to `http://localhost:3001`) with:
  - `GET /api/list` → `{ models: [{ name: string, ... }] }`
  - `POST /api/chat` → SSE-style stream of assistant messages

## Setup
```bash
pnpm install   # or npm install / yarn install
```

Create `.env.local` if your backend is not on `http://localhost:3001`:
```
BASE_API_URL=http://localhost:3001
```

## Run
```bash
pnpm dev       # http://localhost:3000
pnpm build
pnpm start
```

## Project Structure
- `app/` – layout and pages
- `components/` – UI pieces (sidebar, chat bubble, dialogs)
- `context/` – chat selection and stored-chats providers
- `hooks/` – models, stored chats, chat streaming, mobile detection
- `lib/api/` – fetch helpers for chat/models
- `types/` – shared TypeScript types

## Notes
- New chats are created on the first user message.
- Delete/Rename operate on local storage; update selection after delete as needed.
- Streaming parser handles SSE `data:` lines; see `hooks/useChatStream.ts`.
