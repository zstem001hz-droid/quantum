# ⚛️ Quantum

![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![Express](https://img.shields.io/badge/Express-5.x-lightgrey)
![React](https://img.shields.io/badge/React-19.x-blue)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![License](https://img.shields.io/badge/License-ISC-blue)
![bcrypt](https://img.shields.io/badge/Security-bcrypt-red)
![Vite](https://img.shields.io/badge/Vite-6.x-yellow)
![Morgan](https://img.shields.io/badge/Morgan-Logger-lightgrey)
![CORS](https://img.shields.io/badge/CORS-Enabled-blue)
![dotenv](https://img.shields.io/badge/dotenv-Config-yellow)

Quantum is a modern, full-stack MERN project management application built for individuals and small teams. It features secure JWT-based authentication, ownership-based authorization, and a RESTful API for managing projects and tasks — deployed and production-ready

## Tech Stack

**Backend**

- [Node.js](https://nodejs.org/) — runtime environment
- [Express 5](https://expressjs.com/) — web framework
- [MongoDB](https://www.mongodb.com/) — NoSQL database
- [Mongoose](https://mongoosejs.com/) — MongoDB object modeling
- [JSON Web Tokens](https://jwt.io/) — authentication
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) — password hashing
- [morgan](https://github.com/expressjs/morgan) — HTTP request logger
- [dotenv](https://github.com/motdotla/dotenv) — environment variable management
- [cors](https://github.com/expressjs/cors) — cross-origin resource sharing

## Project Structure

```
quantum/
├── client/                    ← React/Vite
└── server/
    ├── config/
    │   └── connection.js      ← MongoDB connection
    ├── middleware/
    │   └── auth.js            ← JWT verification middleware
    ├── models/
    │   ├── User.js
    │   ├── Project.js
    │   └── Task.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── projectRoutes.js
    │   └── taskRoutes.js
    ├── .env.example
    ├── package.json
    ├── requests.http
    └── server.js
```

## Environment Variables

Create a `.env` file inside `server/` using `.env.example` as a template:

| Variable        | Description                                                     |
| --------------- | --------------------------------------------------------------- |
| `MONGO_URI`     | MongoDB Atlas connection string                                 |
| `JWT_SECRET`    | Secret key for signing and verifying JWTs                       |
| `PORT`          | Server port (default: `3001`)                                   |
| `CLIENT_ORIGIN` | Frontend URL allowed by CORS (default: `http://localhost:5173`) |

## API Endpoints

### Auth

| Method | Endpoint             | Description           | Auth Required |
| ------ | -------------------- | --------------------- | ------------- |
| `POST` | `/api/auth/register` | Register a new user   | No            |
| `POST` | `/api/auth/login`    | Login and receive JWT | No            |

## Task Status Values

| Status        | Description                      |
| ------------- | -------------------------------- |
| `To Do`       | Task has not been started        |
| `In Progress` | Task is actively being worked on |
| `Complete`    | Task has been finished           |

## Authentication Flow

1. User registers via `POST /api/auth/register` — password is hashed by bcrypt pre-save hook before storing
2. User logs in via `POST /api/auth/login` — bcrypt compares entered password against stored hash
3. On success, server returns a signed JWT containing the user's ID
4. Client stores the JWT and sends it in the `Authorization` header on every protected request: `Bearer <token>`
5. Auth middleware verifies the token signature, decodes the user ID, and attaches the user to `req.user`
6. If the token is missing, invalid, or expired — the request is rejected with a 401

## Security Features

- Passwords hashed with bcrypt (cost factor 10) via pre-save hook — plain text never touches the database
- Password field excluded from all queries by default (`select: false`)
- JWT tokens expire after 30 days
- Generic error messages on failed login — does not reveal whether email or password was incorrect
- CORS restricted to `CLIENT_ORIGIN` — blocks requests from unauthorized origins

## Testing & Development Tools

### REST Client (VS Code)

API endpoints are tested using the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) VS Code extension. Test requests are documented in `server/requests.http`.
All test requests are version-controlled alongside the codebase in `server/requests.http`.

### Morgan

HTTP request logging is handled by [morgan](https://github.com/expressjs/morgan) middleware. Every incoming request is logged to the terminal in `dev` format:

```
POST /api/auth/register 201 45ms
GET /api/projects 401 3ms
```

### Postman

API endpoints are organized in a dedicated Postman workspace. The collection is structured by resource — Auth, Projects, and Tasks. A Postman environment manages the base URL and JWT token automatically between requests.

## References

**Core Stack**

- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Express 5 Documentation](https://expressjs.com/)
- [JSON Web Tokens — jwt.io](https://jwt.io/)

**Standards**

- [MDN — HTTP Response Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

**Development Tools**

- [MongoDB Compass](https://www.mongodb.com/products/compass)
- [REST Client — VS Code Extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)
- [Morgan — HTTP Request Logger](https://github.com/expressjs/morgan)
- [Chrome DevTools Documentation](https://developer.chrome.com/docs/devtools/)
- [ExplainShell — Unix Command Reference](https://explainshell.com/)
- [Postman Documentation](https://learning.postman.com/docs/getting-started/overview/)

**Deployment**

- [Render Documentation](https://render.com/docs)
- [Render — Deploying a Node.js App](https://render.com/docs/node-express)
- [Render — Static Site Deployment](https://render.com/docs/static-sites)

> 🚧 Work in progress
