"""
Global error handling middleware.

`register_error_handlers` is called once from app.py, so every exception
raised anywhere in a view — including ones raised inside controllers/services
— ends up here and is turned into a consistent JSON response:
  { code, message, stack? }   (stack only in development)

Note: the original Node error handler had a `config.env === 'production' &&
!err.isOperational` branch meant to hide internal error messages in
production, but `isOperational` was never actually set on any error class in
that codebase, so the branch was dead weight (its effect was always
immediately overridden by the `instanceof ErrorResponse` branch further
down). This port skips reproducing that no-op check.
"""
import traceback

from flask import jsonify, request
from sqlalchemy.exc import IntegrityError
from werkzeug.exceptions import HTTPException

from config.config import config
from config.db import db
from utils.constant import Env
from utils.error_response import ErrorResponse


def _integrity_error_message(err: IntegrityError) -> str:
    """Classifies a SQLAlchemy IntegrityError the same way the Node handler
    classified Sequelize's UniqueConstraintError / ForeignKeyConstraintError,
    inspecting the underlying DB-API error since SQLAlchemy doesn't expose
    dedicated exception subclasses for these the way Sequelize does."""
    orig = str(getattr(err, 'orig', err)).lower()
    pgcode = getattr(getattr(err, 'orig', None), 'pgcode', None)

    is_unique = pgcode == '23505' or 'duplicate' in orig or 'unique constraint' in orig
    is_fk = pgcode == '23503' or 'foreign key' in orig

    if is_unique:
        return 'Duplicate entry found.'

    if is_fk:
        endpoint = request.path or ''
        if 'create' in endpoint or 'register' in endpoint:
            return 'Cannot create record due to wrong data provided.'
        return 'Cannot delete record due to a dependent data'

    return 'Internal Server Error'


def register_error_handlers(app):
    @app.errorhandler(ErrorResponse)
    def handle_error_response(err):
        return _respond(err.status_code, err.message, err)

    @app.errorhandler(IntegrityError)
    def handle_integrity_error(err):
        # a failed commit leaves the session unusable until it's rolled back
        db.session.rollback()
        return _respond(400, _integrity_error_message(err), err)

    @app.errorhandler(404)
    def handle_not_found(err):
        # matches the original's explicit catch-all: next(new ErrorResponse('Not found', 404))
        return _respond(404, 'Not found', err)

    @app.errorhandler(HTTPException)
    def handle_http_exception(err):
        # any other Flask/Werkzeug error (405 for a wrong method, 413 for a
        # too-large upload, etc.) — reshaped into the same { code, message }
        # envelope as every other error response.
        return _respond(err.code, err.description, err)

    @app.errorhandler(Exception)
    def handle_generic_exception(err):
        # defensive: an unexpected error mid-request may leave a pending,
        # now-invalid transaction on the session
        db.session.rollback()
        return _respond(500, 'Internal Server Error', err)


def _respond(status_code, message, err):
    response = {
        'code': status_code,
        'message': message,
    }

    if config.ENV == Env.DEVELOPMENT:
        response['stack'] = traceback.format_exc()

    return jsonify(response), status_code
