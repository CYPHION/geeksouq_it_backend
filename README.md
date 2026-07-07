# GeekSouq Backend

A REST API backend built with **Node.js**, **Express**, and **Sequelize** (PostgreSQL) that powers the GeekSouq website. It handles contact form submissions, newsletter subscriptions, project brief forms (with email notifications), and file uploads.

## About the Project

This service exposes APIs for:

- **Contact Forms** — create, read, update, and delete contact form submissions.
- **Newsletter** — manage newsletter email subscriptions.
- **Brief Forms** — collect project brief submissions and send email notifications via Nodemailer.
- **File Uploads** — upload files (via Multer) and serve them back from the `uploads/` directory.

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
│   └── db.js                   # Sequelize database connection
├── routes/
│   ├── index.js                # Root router — mounts all feature routes
│   ├── form.routes.js          # /form endpoints
│   ├── newsletter.routes.js    # /newsletter endpoints
│   ├── briefForm.routes.js     # /brief-form endpoints
│   └── upload.routes.js        # /upload endpoints
├── controller/
│   ├── form.controller.js      # Contact form request handlers
│   ├── newsletter.controller.js# Newsletter request handlers
│   ├── briefForm.controller.js # Brief form request handlers
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

## API Endpoints

Base URL: `http://localhost:5000`

### Contact Form — `/form`

| Method | Endpoint            | Description                  |
| ------ | ------------------- | ---------------------------- |
| GET    | `/form/all`         | Get all form submissions     |
| POST   | `/form/create`      | Create a form submission     |
| PUT    | `/form/update`      | Update a form submission     |
| DELETE | `/form/delete/:id`  | Delete a form submission     |

### Newsletter — `/newsletter`

| Method | Endpoint                  | Description                 |
| ------ | ------------------------- | --------------------------- |
| GET    | `/newsletter/all`         | Get all subscriptions       |
| POST   | `/newsletter/create`      | Create a subscription       |
| PUT    | `/newsletter/update`      | Update a subscription       |
| DELETE | `/newsletter/delete/:id`  | Delete a subscription       |

### Brief Form — `/brief-form`

| Method | Endpoint                  | Description                        |
| ------ | ------------------------- | ---------------------------------- |
| GET    | `/brief-form/all`         | Get all brief form submissions     |
| POST   | `/brief-form/create`      | Create a brief form submission     |
| DELETE | `/brief-form/delete/:id`  | Delete a brief form submission     |

### File Upload — `/upload`

| Method | Endpoint          | Description                                   |
| ------ | ----------------- | --------------------------------------------- |
| POST   | `/upload/single`  | Upload a single file (form field: `file`)     |
| GET    | `/upload/:name`   | Retrieve an uploaded file by name             |

Uploaded files are also served statically at `/uploads/<filename>`.

## Author

**Jawad Ali**
