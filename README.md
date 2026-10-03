# Nexa

Nexa is a full-stack social media application built with React, Node.js, TypeScript, PostgreSQL, Prisma, and Socket.IO.

Users can create posts, connect with friends, interact with content, receive real-time notifications, and chat with other users in real time.

## Features

* 🔐 JWT authentication
* 👤 User profiles
* 📝 Create, edit, and delete posts
* ❤️ Likes and comments
* 👥 Friend requests
* 🔎 User search
* 🔔 Real-time notifications
* 💬 Real-time private chat
* 🖼️ Image uploads with Cloudinary
* 📱 Responsive UI

## Tech Stack

**Frontend**

* React
* TypeScript
* TanStack Router
* TanStack Query
* TanStack Start
* Axios
* Socket.IO Client

**Backend**

* Node.js
* Express
* TypeScript
* Prisma
* PostgreSQL
* Socket.IO
* JWT

**Other**

* Cloudinary
* Render
* Neon PostgreSQL

## Architecture

```text
React / TanStack Start
        │
        │ REST API
        ▼
Node.js / Express
        │
        ├── Prisma
        │     │
        │     ▼
        │  PostgreSQL
        │
        └── Socket.IO
              │
              ▼
        Real-time features
```

## Real-Time Features

Socket.IO is used for real-time:

* Private messaging
* Notifications
* Friend requests
* Friend acceptances
* Post likes
* Post comments

## Project Structure

```text
nexa/
├── backend/
└── frontend/
```

## Getting Started

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Deployment

Nexa is deployed with:

* **Frontend:** Render
* **Backend:** Render
* **Database:** Neon PostgreSQL
* **Image storage:** Cloudinary
