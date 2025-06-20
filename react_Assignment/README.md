# MERN Task Manager Frontend

## Features
- User registration/login (JWT)
- Role-based dashboard (admin/user)
- CRUD for tasks (with PDF upload)
- Admins can assign tasks to any user; users to themselves
- Task statistics, search, filter, sort
- Responsive UI (Tailwind CSS)
- Redux Toolkit, Axios, React Router

## Setup
1. `cd react_Assignment`
2. Install dependencies:
   ```
   npm install
   ```
3. Create `.env` and set `VITE_API_BASE_URL` to your backend (e.g. `http://localhost:5000/api`)
4. Start dev server:
   ```
   npm run dev
   ```

## Folder Structure
- `src/assets/images/` – images
- `src/components/` – reusable components
- `src/pages/` – page components
- `src/redux/` – Redux slices and store
- `src/routes/` – route guards
- `src/services/` – API logic

## Connect to Backend
- Make sure backend is running and CORS is enabled.
- Set `VITE_API_BASE_URL` in `.env` to match backend API URL. 