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

## Environment Variables

Create a `.env` file inside `server/` using `.env.example` as a template:

| Variable     | Description                               |
| ------------ | ----------------------------------------- |
| `MONGO_URI`  | MongoDB Atlas connection string           |
| `JWT_SECRET` | Secret key for signing and verifying JWTs |
| `PORT`       | Server port (default: `3001`)             |

## References

**Core Stack**
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Express 5 Documentation](https://expressjs.com/)
- [JSON Web Tokens — jwt.io](https://jwt.io/)

**Standards**
- [MDN — HTTP Response Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

**Development Tools**
- [REST Client — VS Code Extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)
- [Morgan — HTTP Request Logger](https://github.com/expressjs/morgan)
- [Chrome DevTools Documentation](https://developer.chrome.com/docs/devtools/)
- [ExplainShell — Unix Command Reference](https://explainshell.com/)
- [shields.io — README Badges](https://shields.io/)

**Deployment**
- [Render Documentation](https://render.com/docs)
- [Render — Deploying a Node.js App](https://render.com/docs/node-express)
- [Render — Static Site Deployment](https://render.com/docs/static-sites)

> 🚧 Work in progress
