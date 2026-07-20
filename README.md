# GeekSouq Backend (Python)

A REST API backend built with **Python**, **Flask**, and **SQLAlchemy** that powers the GeekSouq website. It handles contact form submissions, newsletter subscriptions, project brief forms (with email notifications), and file uploads.

This is a Python port of the original Node.js/Express/Sequelize backend, built specifically to be deployable on **shared hosting** (cPanel-style hosts with a "Setup Python App" feature, running under Phusion Passenger). The original Node app lives on the `master` branch.

## About the Project

This service exposes APIs for:

- **Contact Forms** — create, read, update, and delete contact form submissions.
- **Newsletter** — manage newsletter email subscriptions.
- **Brief Forms** — collect project brief submissions and send email notifications.
- **File Uploads** — upload files and serve them back from the `uploads/` directory.

All API endpoints are versioned under **`/api/v1`**. The service also exposes a backend info route (`/`), a health check (`/health`), and interactive Swagger docs (`/api-docs`, non-production only).

## Tech Stack

| Category        | Technology                                      |
| ---------------- | ------------------------------------------------ |
| Runtime         | Python 3.9+                                       |
| Framework       | Flask 3                                           |
| ORM             | SQLAlchemy 2 / Flask-SQLAlchemy                   |
| Database        | MySQL by default (via PyMySQL) — Postgres or SQLite also supported |
| File Uploads    | Werkzeug (built into Flask)                       |
| Emails          | `smtplib` (standard library)                      |
| API Docs        | Swagger UI (`flasgger`)                           |
| Rate Limiting   | Flask-Limiter                                     |
| WSGI (shared hosting) | Phusion Passenger via `passenger_wsgi.py`   |

## Project Structure

```
SoftLogicAppBackend/
├── app.py                      # App factory — Flask setup, middleware, blueprint mounting
├── passenger_wsgi.py            # Entry point for cPanel/Passenger shared hosting
├── wsgi.py                      # Generic WSGI entry point (gunicorn/uWSGI)
├── requirements.txt              # Core dependencies (MySQL/SQLite-ready)
├── requirements-postgres.txt      # Optional: adds psycopg2-binary for DB_DIALECT=postgres
├── .env.example                 # Template for required environment variables
├── config/
│   ├── config.py                # Loads and exposes environment variables
│   ├── db.py                    # SQLAlchemy engine setup (MySQL/Postgres/SQLite)
│   └── swagger.py                # Swagger/OpenAPI template and schemas
├── routes/
│   ├── __init__.py               # /api/v1 blueprint — mounts all feature blueprints
│   ├── health_routes.py          # / and /health endpoints
│   ├── form_routes.py            # /api/v1/form endpoints
│   ├── newsletter_routes.py      # /api/v1/newsletter endpoints
│   ├── brief_form_routes.py      # /api/v1/brief-form endpoints
│   └── upload_routes.py          # /api/v1/upload endpoints
├── controllers/
│   ├── form_controller.py
│   ├── newsletter_controller.py
│   ├── brief_form_controller.py
│   ├── health_controller.py
│   └── file_controller.py
├── services/
│   ├── form_service.py
│   ├── newsletter_service.py
│   └── brief_form_service.py
├── models/
│   ├── form_model.py             # SQLAlchemy model — table `Forms`
│   ├── newsletter_model.py       # SQLAlchemy model — table `Newsletters`
│   └── brief_form_model.py       # SQLAlchemy model — table `BriefForms`
├── middlewares/
│   ├── error.py                  # Global error handler
│   ├── rate_limiter.py           # Rate limiter (production only)
│   └── sanitize.py               # Request sanitization (xss-clean equivalent)
├── utils/
│   ├── error_response.py         # Custom exception with an HTTP status code
│   ├── email.py                  # SMTP email sender
│   ├── constant.py                # App constants (environments, email templates)
│   ├── directory.py               # Upload directory helpers
│   └── function.py                 # Shared helper functions
└── uploads/                      # Uploaded files (served at /uploads/<filename>)
```

The layered **Routes → Controllers → Services → Models** architecture matches the original Node app 1:1, so anyone familiar with it can navigate this codebase the same way.

On startup, `app.py` creates any missing database tables (`db.create_all()`, the SQLAlchemy analog of the original's `db.sync()`).

## Requirements

- **Python**: 3.9 or higher
- **pip**
- **MySQL** (default) or **PostgreSQL**, running locally or accessible remotely — most shared hosts only offer MySQL/MariaDB

## Local Development

```bash
# 1. Create and activate a virtual environment
python -m venv .venv
.venv\Scripts\activate        # Windows
source .venv/bin/activate     # macOS / Linux

# 2. Install dependencies
pip install -r requirements.txt
# using PostgreSQL instead of MySQL? install this one instead:
# pip install -r requirements-postgres.txt

# 3. Configure environment variables
copy .env.example .env         # Windows
cp .env.example .env           # macOS / Linux
# then fill in DB_*, EMAIL_*, etc.

# 4. Run
python app.py
```

The server starts on the configured port (default **5000**) with the Flask dev server. Tables are created automatically on first run.

> **Tip:** for a zero-setup local database with no MySQL/Postgres server running, set `DB_DIALECT=sqlite` and `DB_NAME=dev.db` in `.env`. Not for production use.

### Environment Variables

| Variable         | Description                                        | Default / Example         |
| ----------------- | --------------------------------------------------- | -------------------------- |
| `FLASK_ENV`       | Environment (`development` / `production`)          | `development`              |
| `PORT`            | Port the dev server listens on                       | `5000`                     |
| `DB_NAME`         | Database name                                        | —                          |
| `DB_USER`         | Database user                                        | —                          |
| `DB_PASSWORD`     | Database password                                    | —                          |
| `DB_HOST`         | Database host                                        | `localhost`                |
| `DB_PORT`         | Database port                                        | `3306` (mysql) / `5432` (postgres) |
| `DB_DIALECT`      | `mysql` / `postgres` / `sqlite`                      | `mysql`                    |
| `EMAIL_HOST`      | SMTP host (Outlook / Microsoft 365)                  | `smtp.office365.com`       |
| `EMAIL_PORT`      | SMTP port                                            | `587`                      |
| `EMAIL_USERNAME`  | SMTP account username                                | —                          |
| `EMAIL_PASSWORD`  | SMTP account password                                | —                          |
| `URL_EMAIL`       | Base URL used in email links                         | `https://api.geeksouq.com` |

## Deploying to Shared Hosting (cPanel / Passenger)

Most shared hosts (Hostinger, Namecheap, A2 Hosting, GoDaddy, etc.) expose a **"Setup Python App"** tool in cPanel, which runs the app under **Phusion Passenger**. Steps:

1. **Upload the code.** Upload this repository (excluding `.venv`, `__pycache__`, `.env`) to your hosting account, e.g. via Git deployment or the cPanel File Manager, into a folder like `geeksouq-backend`.

2. **Create the Python app.** In cPanel, go to **Setup Python App** → **Create Application**:
   - **Python version**: 3.9+ (pick the highest available)
   - **Application root**: the folder you uploaded to (e.g. `geeksouq-backend`)
   - **Application URL**: the (sub)domain/path you want the API on
   - **Application startup file**: `passenger_wsgi.py`
   - **Application Entry point**: `application`

   cPanel creates a dedicated virtualenv and generates a `passenger_wsgi.py` stub — the one already committed in this repo replaces that stub, so nothing further to edit there.

3. **Install dependencies.** cPanel gives you an activation command for the app's virtualenv (shown on the app's page), e.g.:
   ```bash
   source /home/<user>/virtualenv/geeksouq-backend/3.9/bin/activate
   cd /home/<user>/geeksouq-backend
   pip install -r requirements.txt
   # only if using DB_DIALECT=postgres:
   # pip install -r requirements-postgres.txt
   ```
   `requirements.txt` installs cleanly on any host — it only pulls in `PyMySQL`, a pure-Python MySQL driver with no compiler dependency. PostgreSQL support (`psycopg2-binary`) is kept in a separate optional file precisely because it ships prebuilt wheels for specific Python-version/OS combos only and can fail to compile from source; if it fails on your host and you don't need Postgres, simply don't install that file.

4. **Set environment variables.** In the same "Setup Python App" page there's an environment variables section — add every variable from `.env.example` there (this is generally more reliable on shared hosting than relying on a `.env` file, though `python-dotenv` will also pick up a `.env` file placed in the application root if you prefer that). Set `FLASK_ENV=production` and `DB_DIALECT=mysql` with the MySQL database/user you created via cPanel's **MySQL® Databases** tool.

5. **Create the uploads folder.** Make sure `uploads/` exists and is writable by the application (it's committed with a `.gitkeep`, so it should already be there after upload).

6. **Restart the app.** Use the "Restart" button on the Setup Python App page. Tables are created automatically on the first request that touches the database.

7. **Verify.** Visit `https://<your-domain>/health` — you should get `{"status": "ok", ...}`. In production, `/api-docs` is disabled (matching the original app's behavior).

### If your host doesn't use Passenger

Some hosts instead let you run a long-lived process behind a reverse proxy. In that case use `wsgi.py` with gunicorn:

```bash
gunicorn wsgi:application --bind 0.0.0.0:8000 --workers 2
```

## API Endpoints

Base URL: all feature endpoints are versioned under `/api/v1`.

### System Routes (unversioned)

| Method | Endpoint     | Description                                              |
| ------ | ------------ | ---------------------------------------------------------- |
| GET    | `/`          | Backend info (name, version, environment, useful links)    |
| GET    | `/health`    | Server and database health check                            |
| GET    | `/api-docs`  | Swagger UI (development/test only)                          |

### Contact Form — `/api/v1/form`

| Method | Endpoint                   | Description                  |
| ------ | -------------------------- | ----------------------------- |
| GET    | `/api/v1/form/all`         | Get all form submissions      |
| POST   | `/api/v1/form/create`      | Create a form submission      |
| PUT    | `/api/v1/form/update`      | Update a form submission      |
| DELETE | `/api/v1/form/delete/:id`  | Delete a form submission      |

### Newsletter — `/api/v1/newsletter`

| Method | Endpoint                         | Description                 |
| ------ | --------------------------------- | ---------------------------- |
| GET    | `/api/v1/newsletter/all`          | Get all subscriptions        |
| POST   | `/api/v1/newsletter/create`       | Create a subscription        |
| PUT    | `/api/v1/newsletter/update`       | Update a subscription        |
| DELETE | `/api/v1/newsletter/delete/:id`   | Delete a subscription        |

### Brief Form — `/api/v1/brief-form`

| Method | Endpoint                         | Description                        |
| ------ | --------------------------------- | ------------------------------------ |
| GET    | `/api/v1/brief-form/all`          | Get all brief form submissions       |
| POST   | `/api/v1/brief-form/create`       | Create a brief form submission       |
| DELETE | `/api/v1/brief-form/delete/:id`   | Delete a brief form submission        |

### File Upload — `/api/v1/upload`

| Method | Endpoint                 | Description                                   |
| ------ | ------------------------- | ----------------------------------------------- |
| POST   | `/api/v1/upload/single`   | Upload a single file (form field: `file`)      |
| GET    | `/api/v1/upload/:name`    | Retrieve an uploaded file by name              |

Uploaded files are also served statically at `/uploads/<filename>`.

## Notes on This Port

A handful of small, deliberate corrections were made while porting (all behavior-preserving or strictly safer than the original):

- **Contact form emails now render as HTML.** The original call site passed the built HTML string as the `text` argument (an arg-count mismatch against the email helper's signature), so it was actually delivered as plain text with visible HTML tags. It's now passed as the actual HTML body.
- **Brief form deletion returns 404 for a missing id** instead of an unhandled crash (the original had no not-found guard here, unlike the Form/Newsletter services).
- **Upload filenames handle multiple dots correctly** (e.g. `my.photo.png`), instead of naively splitting on the first `.`.
- Email/date validation that used to live in Sequelize model validators (`isEmail`, date coercion) is now enforced explicitly in the service layer, since SQLAlchemy doesn't provide the same automatic validators.

Everything else — endpoints, request/response shapes, business rules, table/column names (so it can point at a database the Node app already created) — is preserved as-is.
