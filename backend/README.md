# MERN Task Manager Backend

## Features
- User registration/login (JWT)
- Role-based access (admin/user)
- CRUD for tasks (with file upload, PDF only)
- Only admins can assign tasks to any user; users can assign to themselves
- Tasks visible only to assigned user (except admin)
- MongoDB, Express, Mongoose, Multer, JWT
- Docker support
- Basic tests (Jest, Supertest)

## Setup
1. Clone repo and `cd backend`
2. Copy `.env.example` to `.env` and fill in values
3. Install dependencies:
   ```
   npm install
   ```
4. Start MongoDB locally or use MongoDB Atlas
5. Run dev server:
   ```
   npm run dev
   ```

## Docker
```
docker build -t mern-task-manager-backend .
docker run -p 5000:5000 --env-file .env mern-task-manager-backend
```

## Scripts
- `npm run dev` – start with nodemon
- `npm start` – start normally
- `npm test` – run tests
- `node scripts/seedTasks.js` – seed sample tasks
- `node scripts/getUserId.js` – list user IDs
- `node scripts/checkDatabase.js` – check DB connection

## API Endpoints
- `POST /api/auth/register` – Register
- `POST /api/auth/login` – Login
- `GET /api/auth/me` – Get current user
- `GET /api/users` – List users (admin only)
- `GET /api/tasks` – List tasks
- `POST /api/tasks` – Create task (PDF upload)
- `PUT /api/tasks/:id` – Update task
- `DELETE /api/tasks/:id` – Delete task
- `GET /api/tasks/stats` – Task stats

## File Uploads
- Attachments (PDFs) are stored in `/uploads`.

## Testing
- Requires running MongoDB and a valid `.env`.
- Run: `npm test`
