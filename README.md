# Pastebin-Lite

Pastebin-Lite is a simple backend application that allows users to create text pastes and share a link to view them.
Each paste can optionally expire after a certain time (TTL) or after a limited number of views.

This project was built as part of a take-home assignment and mainly focuses on backend logic, APIs, and persistence.
---
## Features

- Create a paste with text content
- Generate a shareable URL
- View a paste via API or browser
- Optional time-based expiry (TTL)
- Optional view-count limit
- Paste becomes unavailable once limits are exceeded
- Safe HTML rendering (no script execution)
- Deterministic time support for automated tests

---

## Tech Stack

- Node.js
- Express.js
- Redis (Upstash)
- ioredis
- NanoID
- dotenv

---

## Persistence Layer

Redis is used as the persistence layer.
Paste data is stored in Redis and TTL is handled using Redis key expiration.

---

## API Endpoints

### Health Check
GET /api/healthz

### Create Paste
POST /api/pastes

Request body:
{
  "content": "Hello world",
  "ttl_seconds": 60,
  "max_views": 5
}

### Fetch Paste (API)
GET /api/pastes/:id

### View Paste (HTML)
GET /p/:id

---

## Installation & Run Locally

### 1. Clone the repository
git clone https://github.com/malleshmudigiri/Pastebin-Lite.git

### 2. Install dependencies
npm install

### 3. Create `.env` file
PORT=3000
REDIS_URL=rediss://default:AVi_AAIncDI4YjllMDhhNWJhMGQ0YTU5OWQ0YzU4YWM3OTgxMDk5OHAyMjI3MTk@arriving-grubworm-22719.upstash.io:6379
TEST_MODE=1


### 4. Start the server
npm start

Server runs at:
http://localhost:3000

---

## Testing

APIs can be tested using:
- Postman


Example:
curl http://localhost:3000/api/healthz




