# Task Management API (Node.js + Express + TypeScript + MongoDB)

This project is a backend Task Management API built for the Chaintech Network Node.js internship practical.

It supports:

- User signup and login with JWT authentication
- Create, read, update, complete, and delete tasks
- Task categories
- Due dates
- MongoDB persistence
- Request validation with Zod

## Tech Stack

- Node.js
- Express
- TypeScript
- MongoDB + Mongoose
- Zod (validation)
- JWT + bcrypt (auth/security)

## Project Structure

```
src/
	config/
		dbConnect.ts
	controllers/
		auth.controller.ts
		task.controller.ts
	middlewares/
		auth.middleware.ts
	models/
		user.model.ts
		task.model.ts
		category.model.ts
	routes/
		auth.router.ts
		task.router.ts
	schemas/
		auth.schema.ts
		task.schema.ts
	types/
		types.express.d.ts
	index.ts
```

## Features Implemented

### 1) Authentication

- `POST /api/v1/auth/signup` to create a user
- `POST /api/v1/auth/login` to authenticate and receive JWT token
- Passwords are hashed using bcrypt
- Protected routes use `Authorization: Bearer <token>`

### 2) Task Management

- `POST /api/v1/createTask` create task
- `GET /api/v1/getTasks` list all tasks for logged-in user
- `POST /api/v1/setComplete/:taskId` mark task complete
- `POST /api/v1/updateTask/:taskId` edit task fields
- `DELETE /api/v1/task/:taskId` delete task

### 3) Category Management (Bonus)

- `POST /api/v1/createCategory` create category per user
- Categories are unique per user (`categoryName + createdBy` unique index)

### 4) Due Dates (Bonus)

- `dueDate` is supported during task create/update

## Validation Rules

Validation is handled using Zod schemas.

- Auth:
  - `username` is required
  - `password` minimum length is 6
- Task create:
  - `title` is required and non-empty
  - `categoryName` is required
  - `dueDate` is required and must be a valid date
- Task complete:
  - Cannot mark already-completed task as complete again
- Task delete/update:
  - Requires valid `taskId`

## Error Handling

The API returns meaningful JSON responses with `success: false` and a descriptive `message` for:

- Validation failures
- Unauthorized access
- Missing resources (user/task/category)
- Server-side errors

## Environment Variables

Create a `.env` file in project root:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=4000
FRONTEND_URL=http://localhost:5173
```

## Installation and Run

1. Install dependencies:

```bash
npm install
```

2. Build TypeScript:

```bash
npm run build
```

3. Start server:

```bash
npm run start
```

4. Dev command (build + start):

```bash
npm run dev
```

Server default URL:

```
http://localhost:3000
```

## API Quick Reference

### Auth

#### Signup

- Method: `POST`
- URL: `/api/v1/auth/signup`
- Body:

```json
{
  "username": "john",
  "password": "123456"
}
```

#### Login

- Method: `POST`
- URL: `/api/v1/auth/login`
- Body:

```json
{
  "username": "john",
  "password": "123456"
}
```

Response includes JWT token.

### Protected Task Routes

Add header in all protected requests:

```
Authorization: Bearer <token>
```

#### Create Category

- Method: `POST`
- URL: `/api/v1/createCategory`
- Body:

```json
{
  "categoryName": "Work"
}
```

#### Create Task

- Method: `POST`
- URL: `/api/v1/createTask`
- Body:

```json
{
  "title": "Prepare interview notes",
  "description": "Finish Node.js internship task summary",
  "categoryName": "Work",
  "dueDate": "2026-04-10"
}
```

#### Get Tasks

- Method: `GET`
- URL: `/api/v1/getTasks`

#### Mark Task Complete

- Method: `POST`
- URL: `/api/v1/setComplete/:taskId`

#### Update Task

- Method: `POST`
- URL: `/api/v1/updateTask/:taskId`
- Body (all fields optional):

```json
{
  "title": "Updated title",
  "description": "Updated description",
  "dueDate": "2026-04-11",
  "categoryId": "660000000000000000000000",
  "isCompleted": true
}
```

#### Delete Task

- Method: `DELETE`
- URL: `/api/v1/task/:taskId`

## Key Design Decisions

- TypeScript for maintainability and safer refactoring
- Mongoose models separated by domain (`User`, `Task`, `Category`)
- Controller-service style organization via separate controllers/routes/schemas
- JWT auth middleware adds `userId` to request via custom Express type declaration
- User-isolated data access: task/category operations are scoped by authenticated `userId`

## Requirement Checklist Mapping

### Core Requirements

- Create task with title and description: Implemented
- View all tasks: Implemented
- Mark task complete: Implemented
- Edit task: Implemented
- Delete task: Implemented
- Database persistence with MongoDB: Implemented
- Validation for non-empty title: Implemented
- Prevent duplicate completion: Implemented
- Graceful error messages: Implemented

### Bonus

- Due dates: Implemented
- Categories: Implemented
- Unit tests: Not implemented

## Submission Notes

This repository contains:

- Source code for the internship practical
- Clear API documentation in this README
- Build/run instructions and environment setup

If required, I can also add:

- Postman collection
- Deployment link
- Unit tests with Jest + Supertest
