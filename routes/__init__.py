"""
API v1 root blueprint.

Aggregates every feature blueprint under its base path. Registered at
/api/v1 in app.py, so e.g. form routes are reachable at /api/v1/form/...
"""
from flask import Blueprint

from routes.form_routes import form_bp
from routes.newsletter_routes import newsletter_bp
from routes.brief_form_routes import brief_form_bp
from routes.upload_routes import upload_bp

api_v1 = Blueprint('api_v1', __name__)

api_v1.register_blueprint(form_bp, url_prefix='/form')
api_v1.register_blueprint(newsletter_bp, url_prefix='/newsletter')
api_v1.register_blueprint(brief_form_bp, url_prefix='/brief-form')
api_v1.register_blueprint(upload_bp, url_prefix='/upload')
