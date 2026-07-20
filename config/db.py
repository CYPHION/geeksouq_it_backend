"""
SQLAlchemy database connection.

Creates a single shared `SQLAlchemy` instance from the values in config.py.
Models import `db` from here to define their tables, and app.py calls
`db.create_all()` on startup to create any missing tables automatically
(mirrors the original Sequelize `db.sync()`).

Supports either MySQL (the common case on shared hosting, via PyMySQL — a
pure-Python driver that needs no compiler) or PostgreSQL (via psycopg2),
selected by `DB_DIALECT`.
"""
from flask_sqlalchemy import SQLAlchemy

from config.config import config

db = SQLAlchemy()


def build_database_uri() -> str:
    dialect = (config.DB_DIALECT or 'mysql').strip().lower()

    # sqlite is not meant for shared-hosting production use — it's a
    # zero-setup fallback for local development/testing when no MySQL/
    # Postgres server is at hand. e.g. DB_DIALECT=sqlite, DB_NAME=dev.db
    if dialect == 'sqlite':
        return f"sqlite:///{config.DB_NAME or 'dev.db'}"

    if dialect in ('postgres', 'postgresql'):
        driver = 'postgresql+psycopg2'
        default_port = 5432
    else:
        driver = 'mysql+pymysql'
        default_port = 3306

    port = config.DB_PORT or default_port

    return (
        f"{driver}://{config.DB_USER}:{config.DB_PASSWORD}"
        f"@{config.DB_HOST}:{port}/{config.DB_NAME}"
    )


def init_db(app):
    """Binds the shared `db` instance to the Flask app and creates any
    tables that don't already exist yet (safe to call every startup)."""
    app.config['SQLALCHEMY_DATABASE_URI'] = build_database_uri()
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    # keep logging off by default, same as `logging: false` on the Sequelize instance;
    # flip via SQLALCHEMY_ECHO=true in the environment to log SQL for debugging
    app.config['SQLALCHEMY_ECHO'] = os_env_bool('SQLALCHEMY_ECHO')

    db.init_app(app)

    with app.app_context():
        # local import so models are registered on `db` before create_all runs
        from models import form_model, newsletter_model, brief_form_model  # noqa: F401
        db.create_all()


def os_env_bool(name: str) -> bool:
    import os
    return (os.environ.get(name, '') or '').strip().lower() in ('1', 'true', 'yes')
