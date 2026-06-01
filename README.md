# ⚛️ Quantum

![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![Express](https://img.shields.io/badge/Express-5.x-lightgrey)
![React](https://img.shields.io/badge/React-19.x-blue)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![License](https://img.shields.io/badge/License-Proprietary-red)
![bcrypt](https://img.shields.io/badge/Security-bcrypt-red)
![Vite](https://img.shields.io/badge/Vite-6.x-yellow)
![Morgan](https://img.shields.io/badge/Morgan-Logger-lightgrey)
![CORS](https://img.shields.io/badge/CORS-Enabled-blue)
![dotenv](https://img.shields.io/badge/dotenv-Config-yellow)
![Postman](https://img.shields.io/badge/Postman-Testing-orange)

Quantum is a modern, full-stack MERN project management application built for individuals and small teams. It features secure JWT-based authentication, ownership-based authorization, and a RESTful API for managing projects and tasks — deployed and production-ready

## Tech Stack

**Frontend**

- [React 19](https://react.dev/) — UI library
- [TypeScript](https://www.typescriptlang.org/) — typed JavaScript
- [Vite](https://vitejs.dev/) — build tool and dev server
- [React Router](https://reactrouter.com/) — client-side routing
- [Axios](https://axios-http.com/) — HTTP client for API requests
- [Tailwind CSS](https://tailwindcss.com/) — utility-first styling
- [Framer Motion](https://www.framer.com/motion/) — animations
- [@dnd-kit](https://dndkit.com/) — drag-and-drop task board

**Backend**

- [Node.js](https://nodejs.org/) — runtime environment
- [Express 5](https://expressjs.com/) — web framework
- [MongoDB](https://www.mongodb.com/) — NoSQL database
- [Mongoose](https://mongoosejs.com/) — MongoDB object modeling
- [dotenv](https://github.com/motdotla/dotenv) — environment variable management
- [cors](https://github.com/expressjs/cors) — cross-origin resource sharing
- [JSON Web Tokens](https://jwt.io/) — authentication
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) — password hashing
- [morgan](https://github.com/expressjs/morgan) — HTTP request logger
- [nodemon](https://nodemon.io/) — development server with auto-restart

## Project Structure

```
quantum/
├── client/                            ← React 19 + Vite + TypeScript
   ├── public/
   │   └── favicon.svg                 ← custom atom favicon
   └── src/
       ├── components/
       │   ├── animations/
       │   │   ├── QuantumLogo.tsx     ← animated SVG atom logo
       │   │   └── TaskCompleteAnimation.tsx
       │   ├── modals/
       │   │   ├── CreateProjectModal.tsx
       │   │   ├── EditProjectModal.tsx
       │   │   ├── CreateTaskModal.tsx
       │   │   ├── EditTaskModal.tsx
       │   │   └── InviteModal.tsx
       │   ├── EmptyState.tsx
       │   ├── ErrorMessage.tsx
       │   ├── LoadingSpinner.tsx
       │   ├── Navbar.tsx
       │   ├── ProjectCard.tsx
       │   ├── ProtectedRoute.tsx
       │   ├── TaskBoard.tsx
       │   ├── TaskCard.tsx
       │   ├── TaskColumn.tsx
       │   └── ThemeSwitcher.tsx
       ├── context/
       │   └── AuthContext.tsx
       ├── hooks/
       │   ├── useAuth.ts
       │   ├── useProjects.ts
       │   ├── useTasks.ts
       │   └── useTheme.ts
       ├── pages/
       │   ├── DashboardPage.tsx
       │   ├── LoginPage.tsx
       │   ├── ProjectDetailPage.tsx
       │   └── RegisterPage.tsx
       ├── services/
       │   └── api.ts
       ├── types/
       │   └── index.ts
       ├── App.tsx
       └── main.tsx
├── server/
│   ├── config/
│   │   └── connection.js      ← MongoDB Atlas connection
│   ├── middleware/
│   │   └── auth.js            ← JWT verification and user attachment
│   ├── models/
│   │   ├── User.js            ← user schema with bcrypt pre-save hook
│   │   ├── Project.js         ← project schema with owner and members
│   │   └── Task.js            ← task schema with project and owner refs
│   ├── routes/
│   │   ├── authRoutes.js      ← register and login endpoints
│   │   ├── projectRoutes.js   ← full CRUD + invite collaborator
│   │   └── taskRoutes.js      ← full CRUD with nested routing
│   ├── .env.example
│   ├── package.json
│   ├── requests.http          ← REST Client API test requests
│   └── server.js              ← Express entry point, middleware, routes
├── LICENSE
├── .gitignore
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20 or higher
- [MongoDB Atlas](https://www.mongodb.com/atlas) account
- [Git](https://git-scm.com/)

### Local Setup

**1. Clone the repository**

```bash
git clone https://github.com/zstem001hz-droid/quantum.git
cd quantum
```

**2. Install server dependencies**

```bash
cd server && npm install
```

**3. Create your environment file**

```bash
cp .env.example .env
```

**4. Populate `server/.env` with your values** — see [Environment Variables](#environment-variables) below

**5. Start the development server**

```bash
npm run dev
```

Server runs at `http://localhost:3001`

Confirm connection:

```bash
curl http://localhost:3001/api/health
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

### Projects

| Method   | Endpoint                   | Description                         | Auth Required |
| -------- | -------------------------- | ----------------------------------- | ------------- |
| `GET`    | `/api/projects`            | Get all projects for logged-in user | Yes           |
| `GET`    | `/api/projects/:id`        | Get single project by ID            | Yes           |
| `POST`   | `/api/projects`            | Create new project                  | Yes           |
| `PUT`    | `/api/projects/:id`        | Update project by ID                | Yes           |
| `PUT`    | `/api/projects/:id/invite` | Invite a collaborator by email      | Yes           |
| `DELETE` | `/api/projects/:id`        | Delete project by ID                | Yes           |

### Tasks

| Method   | Endpoint                             | Description                 | Auth Required |
| -------- | ------------------------------------ | --------------------------- | ------------- |
| `GET`    | `/api/projects/:projectId/tasks`     | Get all tasks for a project | Yes           |
| `GET`    | `/api/projects/:projectId/tasks/:id` | Get single task by ID       | Yes           |
| `POST`   | `/api/projects/:projectId/tasks`     | Create new task             | Yes           |
| `PUT`    | `/api/projects/:projectId/tasks/:id` | Update task by ID           | Yes           |
| `DELETE` | `/api/projects/:projectId/tasks/:id` | Delete task by ID           | Yes           |

## Authentication Flow

1. User registers via `POST /api/auth/register` — password is hashed by bcrypt pre-save hook before storing
2. User logs in via `POST /api/auth/login` — bcrypt compares entered password against stored hash
3. On success, server returns a signed JWT containing the user's ID
4. Client stores the JWT and sends it in the `Authorization` header on every protected request: `Bearer <token>`
5. Auth middleware verifies the token signature, decodes the user ID, and attaches the user to `req.user`
6. If the token is missing, invalid, or expired — the request is rejected with a 401

## Authorization Flow

1. Every protected route runs the `protect` middleware first — no route logic executes without a valid JWT
2. The protect middleware decodes the token and attaches the user to `req.user`
3. For project routes — the logged-in user's ID is compared against the project's `owner` field
4. If the IDs don't match — the request is rejected with `403 Forbidden`
5. For task routes — authorization runs at the project level first, not the task level
6. A user's access to tasks is determined entirely by whether they own the parent project
7. The `owner` field is always set server-side — the client never sends it

## Task Authorization Chain

When any task operation is requested, the following chain runs in order:

1. JWT verified by `protect` middleware — user identity confirmed
2. Parent project located by `projectId` from the URL
3. Project existence verified — `404` if not found
4. Project ownership verified — `403` if requester is not the owner
5. Task located by `id` from the URL (for single task operations)
6. Task existence verified — `404` if not found
7. Operation executes — create, read, update, or delete

## Data Model Relationships

- A **User** owns many **Projects** — `Project.owner` references `User._id`
- A **Project** contains many **Tasks** — `Task.project` references `Project._id`
- A **Task** is created by a **User** — `Task.owner` references `User._id`
- A **Project** can have many **Members** — `Project.members` is an array of `User._id` references (collaboration stretch goal)

All relationships use Mongoose `ref` and MongoDB ObjectId references, enabling `.populate()` queries to fetch related documents in a single call.

## Error Responses

All errors return a consistent JSON shape:

```json
{
  "message": "Description of the error"
}
```

| Status Code | Meaning               | Example Trigger                              |
| ----------- | --------------------- | -------------------------------------------- |
| `400`       | Bad Request           | Email already registered                     |
| `401`       | Unauthorized          | Missing or invalid JWT                       |
| `403`       | Forbidden             | Attempting to modify another user's resource |
| `404`       | Not Found             | Project or task ID does not exist            |
| `500`       | Internal Server Error | Database connection failure                  |

## Roadmap

### Core Features

- [x] User registration and login with JWT authentication
- [x] Full project CRUD with ownership-based authorization
- [x] Full task CRUD with nested routing and parent project authorization
- [ ] Kanban-style task board with To Do / In Progress / Complete columns
- [ ] Responsive design — mobile, tablet, and desktop
- [ ] Deployed on Render — backend Web Service and frontend Static Site

### Stretch Goals

- [x] Collaborator invitations — project owners can invite registered users
- [x] Collaborator permissions — invited users can view and update tasks
- [ ] Drag-and-drop task management between Kanban columns

### Future Features

- [ ] Admin role — platform management and user moderation
- [ ] Real-time updates — WebSocket integration for live task changes
- [ ] Email notifications — task assignments and project activity
- [ ] Refresh token rotation — enhanced JWT security

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

### MongoDB Compass

Database state is verified visually using [MongoDB Compass](https://www.mongodb.com/products/compass). Used to confirm documents are created, updated, and deleted correctly during API testing, and to verify relationship fields such as `owner` and `members` arrays.

### Postman

API endpoints are organized in a dedicated Postman workspace. The collection is structured by resource — Auth, Projects, and Tasks. A Postman environment manages the base URL and JWT token automatically between requests.

## References

**Core Stack — Backend**

- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Mongoose — Arrays](https://mongoosejs.com/docs/schematypes.html#arrays)
- [Mongoose — Document.save()](<https://mongoosejs.com/docs/api/document.html#Document.prototype.save()>)
- [Express 5 Documentation](https://expressjs.com/)
- [JSON Web Tokens — jwt.io](https://jwt.io/)
- [MDN — Array.prototype.some()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)

**Core Stack — Frontend**

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [TypeScript Compiler Options](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
- [Vite Documentation](https://vitejs.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [@dnd-kit Documentation](https://dndkit.com/)

**Standards**

- [MDN — HTTP Response Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

**Development Tools**

- [REST Client — VS Code Extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)
- [Morgan — HTTP Request Logger](https://github.com/expressjs/morgan)
- [Chrome DevTools Documentation](https://developer.chrome.com/docs/devtools/)
- [ExplainShell — Unix Command Reference](https://explainshell.com/)
- [Postman Documentation](https://learning.postman.com/docs/getting-started/overview/)
- [MongoDB Compass](https://www.mongodb.com/products/compass)
- [Vite Plugin React — react-refresh/only-export-components](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react)
- [Kent C. Dodds — How to use React Context effectively](https://kentcdodds.com/blog/how-to-use-react-context-effectively)
- [ESLint — Disabling Rules with Comments](https://eslint.org/docs/latest/use/configure/rules#using-configuration-comments)

**Deployment**

- [Render Documentation](https://render.com/docs)
- [Render — Deploying a Node.js App](https://render.com/docs/node-express)
- [Render — Static Site Deployment](https://render.com/docs/static-sites)

## License

Copyright © 2026 Zac White. All Rights Reserved.

> 🚧 Work in progress
