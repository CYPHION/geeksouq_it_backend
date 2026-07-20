"""
Central environment configuration.

Loads variables from the `.env` file (see `.env.example` for the template)
and exposes them as a single `Config` object so the rest of the codebase
never reads `os.environ` directly.
"""
import os
from dotenv import load_dotenv

load_dotenv()


def _clean_env(value: str) -> str:
    # normalized runtime environment: 'development' | 'test' | 'production'
    # (trimmed + lowercased so values like 'Production' still match checks)
    return (value or 'development').strip().lower()


# app metadata (equivalent of the name/version/description read from
# package.json in the original Node app) — single source of truth, used by
# the health/info endpoint and the Swagger spec.
APP_NAME = 'geeksouq-backend'
APP_VERSION = '1.0.0'
APP_DESCRIPTION = 'geeksouq backend'


class Config:
    # database connection (MySQL by default on shared hosting; Postgres also supported)
    DB_NAME = os.environ.get('DB_NAME')
    DB_USER = os.environ.get('DB_USER')
    DB_PASSWORD = os.environ.get('DB_PASSWORD')
    DB_HOST = os.environ.get('DB_HOST', 'localhost')
    DB_PORT = os.environ.get('DB_PORT')

    # 'mysql' | 'postgres' — selects the SQLAlchemy driver in config/db.py
    DB_DIALECT = os.environ.get('DB_DIALECT', 'mysql')

    ENV = _clean_env(os.environ.get('FLASK_ENV') or os.environ.get('NODE_ENV'))
    PORT = int(os.environ.get('PORT', 5000))

    # SMTP settings used by utils/email.py
    EMAIL_HOST = os.environ.get('EMAIL_HOST')
    EMAIL_PORT = int(os.environ.get('EMAIL_PORT', 587))
    EMAIL_USERNAME = os.environ.get('EMAIL_USERNAME')
    EMAIL_PASSWORD = os.environ.get('EMAIL_PASSWORD')

    # base URL used to build links inside outgoing emails
    URL_EMAIL = os.environ.get('URL_EMAIL')

    # max accepted request/upload size (bytes) — mirrors the 50mb body limit
    # and the (broken, no-op) 100mb multer limit from the original Node app
    MAX_CONTENT_LENGTH = int(os.environ.get('MAX_CONTENT_LENGTH', 100 * 1024 * 1024))


config = Config()
