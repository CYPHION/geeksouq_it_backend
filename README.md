# GeekSouq Backend

A REST API backend built with **Node.js**, **Express**, and **Sequelize** (PostgreSQL) that powers the GeekSouq website. It handles contact form submissions, newsletter subscriptions, project brief forms (with email notifications), and file uploads.

## About the Project

This service exposes APIs for:

- **Contact Forms** — create, read, update, and delete contact form submissions.
- **Newsletter** — manage newsletter email subscriptions.
- **Brief Forms** — collect project brief submissions and send email notifications via Nodemailer.
- **File Uploads** — upload files (via Multer) and serve them back from the `uploads/` directory.

All API endpoints are versioned under **`/api/v1`**. The service also exposes a backend info route (`/`), a health check (`/health`), and interactive Swagger docs (`/api-docs`, non-production only).

Security is handled with `helmet` (secure HTTP headers), `xss-clean` (request sanitization), `cors`, and `express-rate-limit` (rate limiting on auth endpoints in production).

## Tech Stack

| Category        | Technology                          |
| --------------- | ----------------------------------- |
| Runtime         | Node.js                             |
| Framework       | Express 4                           |
| ORM             | Sequelize 6                         |
| Database        | PostgreSQL (via `pg` / `pg-hstore`) |
| File Uploads    | Multer                              |
| Emails          | Nodemailer                          |
| API Docs        | Swagger UI (`swagger-jsdoc` + `swagger-ui-express`) |
| Dev Server      | Nodemon                             |

## Requirements

- **Node.js**: v18 or higher (LTS recommended — developed on v22.x)
- **npm**: v9 or higher
- **PostgreSQL**: v13 or higher, running locally or accessible remotely

## Project Structure

```
SoftLogicAppBackend/
├── index.js                    # App entry point — Express setup, middleware, DB sync, server start
├── package.json                # Dependencies and scripts
├── example.env                 # Template for required environment variables
├── config/
│   ├── config.js               # Loads and exports environment variables
│   ├── db.js                   # Sequelize database connection
│   └── swagger.js              # Swagger/OpenAPI definition and schemas
├── routes/
│   ├── index.js                # API v1 router — mounts all feature routes
│   ├── health.routes.js        # / (backend info) and /health endpoints
│   ├── form.routes.js          # /api/v1/form endpoints
│   ├── newsletter.routes.js    # /api/v1/newsletter endpoints
│   ├── briefForm.routes.js     # /api/v1/brief-form endpoints
│   └── upload.routes.js        # /api/v1/upload endpoints
├── controller/
│   ├── form.controller.js      # Contact form request handlers
│   ├── newsletter.controller.js# Newsletter request handlers
│   ├── briefForm.controller.js # Brief form request handlers
│   ├── health.controller.js    # Backend info and health check handlers
│   └── file.controller.js      # File upload/download handlers
├── services/
│   ├── index.js                # Service exports
│   ├── form.service.js         # Contact form business logic / DB queries
│   ├── newsletter.service.js   # Newsletter business logic / DB queries
│   └── briefForm.service.js    # Brief form business logic / DB queries
├── model/
│   ├── form.model.js           # Sequelize model — contact forms
│   ├── newsletter.model.js     # Sequelize model — newsletter subscriptions
│   └── briefForm.model.js      # Sequelize model — brief forms
├── middlewares/
│   ├── error.js                # Global error handler
│   ├── rateLimiter.js          # Rate limiter for auth endpoints (production only)
│   └── uploadMiddleware.js     # Multer configuration for file uploads
├── utils/
│   ├── asyncHandler.js         # Async wrapper for route handlers
│   ├── constant.js             # App constants (environments, etc.)
│   ├── directory.js            # Upload directory helpers
│   ├── email.js                # Nodemailer email sender (Outlook/SMTP)
│   ├── errorResponse.js        # Custom error class
│   └── function.js             # Shared helper functions
└── uploads/                    # Uploaded files (served statically at /uploads)
```

### Architecture

The code follows a layered **Routes → Controllers → Services → Models** pattern:

1. **Routes** define the API endpoints and map them to controllers.
2. **Controllers** handle the HTTP request/response cycle.
3. **Services** contain the business logic and database queries.
4. **Models** define the Sequelize schemas mapped to PostgreSQL tables.

On startup, `index.js` syncs the Sequelize models with the database (`db.sync()`) and then starts the server, so tables are created automatically.

## Getting Started

### 1. Clone the repository

```bash
git clone <https://github.com/CYPHION/geeksouq_it_backend>
cd geeksouq_it_backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example env file and fill in your values:

```bash
# Windows (PowerShell)
Copy-Item example.env .env

# macOS / Linux
cp example.env .env
```

| Variable              | Description                                        | Default / Example         |
| --------------------- | -------------------------------------------------- | ------------------------- |
| `NODE_ENV`            | Environment (`development` / `production`)         | `development`             |
| `PORT`                | Port the server listens on                         | `5000`                    |
| `DB_NAME`             | PostgreSQL database name                           | —                         |
| `DB_USER`             | PostgreSQL user                                    | `postgres`                |
| `DB_PASSWORD`         | PostgreSQL password                                | —                         |
| `DB_HOST`             | Database host                                      | `localhost`               |
| `DB_PORT`             | Database port                                      | `5432`                    |
| `DB_DIALECT`          | Sequelize dialect                                  | `postgres`                |
| `EMAIL_HOST`          | SMTP host (Outlook / Microsoft 365)                | `smtp.office365.com`      |
| `EMAIL_PORT`          | SMTP port                                          | `587`                     |
| `EMAIL_USERNAME`      | SMTP account username                              | —                         |
| `EMAIL_PASSWORD`      | SMTP account password                              | —                         |
| `URL_EMAIL`           | Base URL used in email links                       | `https://api.geeksouq.com`|

### 4. Create the database

Make sure PostgreSQL is running and create the database referenced by `DB_NAME`:

```sql
CREATE DATABASE your_db_name;
```

Tables are created/synced automatically on server start.

### 5. Run the project

```bash
npm start
```

This runs `nodemon index.js` — the server starts on the configured port (default **5000**) and restarts automatically on file changes. You should see:

```
Database synced successfully
Listening to port 5000
```

## API Documentation (Swagger)

Interactive API docs (Swagger UI) are available in **development/test only**:

```
http://localhost:5000/api-docs
```

The docs are generated from JSDoc `@swagger` annotations in `routes/*.js` — see `config/swagger.js` for the base OpenAPI definition and reusable schemas.

> **Note:** The Swagger route is only mounted when `NODE_ENV` is not `production`. In production, `/api-docs` returns `404`.

## API Endpoints

Base URL: `http://localhost:5000` — all feature endpoints are versioned under `/api/v1`.

### System Routes (unversioned)

| Method | Endpoint     | Description                                              |
| ------ | ------------ | -------------------------------------------------------- |
| GET    | `/`          | Backend info (name, version, environment, useful links)  |
| GET    | `/health`    | Server and database health check                         |
| GET    | `/api-docs`  | Swagger UI (development/test only)                       |

#### Health Check — `GET /health`

Reports server and database status — suitable for load balancer / uptime monitor probes:

```json
{
  "status": "ok",
  "server": "up",
  "database": "up",
  "uptime": 123.45,
  "timestamp": "2026-07-07T12:00:00.000Z"
}
```

Returns HTTP `200` when healthy, or `503` with `"status": "degraded"` when the database is unreachable.

### Contact Form — `/api/v1/form`

| Method | Endpoint                   | Description                  |
| ------ | -------------------------- | ---------------------------- |
| GET    | `/api/v1/form/all`         | Get all form submissions     |
| POST   | `/api/v1/form/create`      | Create a form submission     |
| PUT    | `/api/v1/form/update`      | Update a form submission     |
| DELETE | `/api/v1/form/delete/:id`  | Delete a form submission     |

### Newsletter — `/api/v1/newsletter`

| Method | Endpoint                         | Description                 |
| ------ | -------------------------------- | --------------------------- |
| GET    | `/api/v1/newsletter/all`         | Get all subscriptions       |
| POST   | `/api/v1/newsletter/create`      | Create a subscription       |
| PUT    | `/api/v1/newsletter/update`      | Update a subscription       |
| DELETE | `/api/v1/newsletter/delete/:id`  | Delete a subscription       |

### Brief Form — `/api/v1/brief-form`

| Method | Endpoint                         | Description                        |
| ------ | -------------------------------- | ---------------------------------- |
| GET    | `/api/v1/brief-form/all`         | Get all brief form submissions     |
| POST   | `/api/v1/brief-form/create`      | Create a brief form submission     |
| DELETE | `/api/v1/brief-form/delete/:id`  | Delete a brief form submission     |

### File Upload — `/api/v1/upload`

| Method | Endpoint                 | Description                                   |
| ------ | ------------------------ | --------------------------------------------- |
| POST   | `/api/v1/upload/single`  | Upload a single file (form field: `file`)     |
| GET    | `/api/v1/upload/:name`   | Retrieve an uploaded file by name             |

Uploaded files are also served statically at `/uploads/<filename>`.

## Author

**Jawad Ali**
