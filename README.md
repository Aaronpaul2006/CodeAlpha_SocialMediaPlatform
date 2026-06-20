# Mini Social Media App — CodeAlpha Full Stack Internship (Task 2)

A mini social media platform with user profiles, posts, comments, likes, and a follow system.

## Stack
- **Frontend:** React (Vite) + React Router
- **Backend:** Node.js + Express
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT + bcrypt

## Folder Structure
```
social-app/
  server/   -> Express API
  client/   -> React frontend (Vite)
```

## Setup

### 1. Backend
```bash
cd server
npm install
cp .env.example .env
# Edit .env: set MONGO_URI (local MongoDB or MongoDB Atlas) and a random JWT_SECRET
npm run dev
```
Server runs on `http://localhost:5000`.

You need MongoDB running locally, OR use a free MongoDB Atlas cluster and paste its connection string into `MONGO_URI`.

### 2. Frontend
```bash
cd client
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.

## Features Implemented
- User registration & login (JWT-based auth)
- Profile page with bio editing
- Create posts (text + optional image URL)
- Like / unlike posts
- Comment on posts
- Follow / unfollow users
- Feed showing posts from followed users (and your own)

## API Overview

| Method | Route | Description | Auth |
|---|---|---|---|
| POST | /api/auth/register | Register new user | No |
| POST | /api/auth/login | Login | No |
| GET | /api/users/:id | Get user profile + their posts | No |
| PUT | /api/users/me | Update own profile | Yes |
| PUT | /api/users/:id/follow | Follow/unfollow a user | Yes |
| POST | /api/posts | Create a post | Yes |
| GET | /api/posts/feed | Get feed (followed users + self) | Yes |
| GET | /api/posts/:id | Get single post | No |
| PUT | /api/posts/:id/like | Like/unlike a post | Yes |
| DELETE | /api/posts/:id | Delete own post | Yes |
| POST | /api/comments/:postId | Add comment to a post | Yes |
| GET | /api/comments/:postId | Get comments for a post | No |
| DELETE | /api/comments/:id | Delete own comment | Yes |

## Next Steps / Possible Improvements
- Image upload via Multer instead of pasting URLs
- Real-time notifications with Socket.io
- Pagination/infinite scroll on feed
- Search for users
- Deploy backend (Render/Railway) and frontend (Vercel/Netlify)

