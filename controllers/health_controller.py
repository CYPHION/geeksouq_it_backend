"""
System controller.

Handlers for the unversioned system endpoints: backend info (GET /)
and the health check (GET /health). Registered as view functions from
routes/health_routes.py — Flask dispatches any raised exception straight to
the global error handler (middlewares/error.py), so no asyncHandler-style
wrapper is needed here (unlike the original Express version).
"""
from datetime import datetime, timezone

from flask import jsonify
from sqlalchemy import text

from config.config import config, APP_NAME, APP_VERSION, APP_DESCRIPTION
from config.db import db
from utils.constant import Env

# process start time, used to compute uptime for the health check
_start_time = datetime.now(timezone.utc)


def get_info():
    info = {
        'name': APP_NAME,
        'version': APP_VERSION,
        'description': APP_DESCRIPTION,
        'environment': config.ENV,
        'apiBaseUrl': '/api/v1',
        'health': '/health',
    }

    if config.ENV != Env.PRODUCTION:
        info['docs'] = '/api-docs'

    return jsonify(info)


def get_health():
    database = 'up'

    try:
        db.session.execute(text('SELECT 1'))
    except Exception:
        database = 'down'
        # a failed connection/query can leave the scoped session's
        # transaction in a broken state; without this, Flask-SQLAlchemy's
        # end-of-request teardown (db.session.remove()) can itself raise
        # trying to clean up that broken state — an error that happens
        # *after* this view already returned, outside any @app.errorhandler
        db.session.rollback()

    healthy = database == 'up'
    uptime_seconds = (datetime.now(timezone.utc) - _start_time).total_seconds()

    return jsonify({
        'status': 'ok' if healthy else 'degraded',
        'server': 'up',
        'database': database,
        'uptime': uptime_seconds,
        'timestamp': datetime.now(timezone.utc).isoformat(),
    }), (200 if healthy else 503)
