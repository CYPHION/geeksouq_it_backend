"""
Application entry point / app factory.

Sets up the Flask app: global middleware (JSON body limits, request
sanitization, security headers, CORS, rate limiting), Swagger docs
(non-production only), blueprint mounting, error handling — then creates
any missing database tables and returns the app.

Run directly (`python app.py`) for local development. For shared hosting,
`passenger_wsgi.py` / `wsgi.py` import `create_app()` instead (see README).
"""
from flask import Flask, send_from_directory
from flask_cors import CORS
from flasgger import Swagger
from werkzeug.middleware.proxy_fix import ProxyFix

from config.config import config
from config.db import init_db
from config.swagger import swagger_template, swagger_config
from middlewares.error import register_error_handlers
from middlewares.rate_limiter import init_rate_limiter
from middlewares.sanitize import init_sanitizer
from utils.constant import Env
from routes.health_routes import health_bp
from routes import api_v1


def create_app():
    app = Flask(__name__)

    # trust only the first proxy hop (reverse proxy / load balancer) so
    # clients cannot spoof their IP via X-Forwarded-For to bypass rate limiting
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1)

    # large limit to allow big form/brief-form payloads, mirrors the 50mb
    # body limit in the original (and replaces the original's 100mb multer
    # limit, which was passed as a bare number and silently had no effect)
    app.config['MAX_CONTENT_LENGTH'] = config.MAX_CONTENT_LENGTH

    init_db(app)

    # sanitize request data
    init_sanitizer(app)

    # set security HTTP headers (helmet equivalent) — a full CSP is
    # intentionally left out since it would also apply to /api-docs and
    # could block Swagger UI's own inline assets
    @app.after_request
    def set_security_headers(response):
        response.headers.setdefault('X-Content-Type-Options', 'nosniff')
        response.headers.setdefault('X-Frame-Options', 'SAMEORIGIN')
        response.headers.setdefault('X-XSS-Protection', '0')
        response.headers.setdefault('Referrer-Policy', 'no-referrer')
        response.headers.setdefault('X-DNS-Prefetch-Control', 'off')
        response.headers.setdefault('Cross-Origin-Opener-Policy', 'same-origin')
        return response

    # enable cors
    CORS(app)

    # limit repeated requests app-wide (production only)
    init_rate_limiter(app, config.ENV)

    # swagger api docs (disabled in production)
    if config.ENV != Env.PRODUCTION:
        Swagger(app, template=swagger_template, config=swagger_config)

    # serve uploaded files statically, e.g. GET /uploads/<filename>
    @app.route('/uploads/<path:filename>')
    def uploaded_file(filename):
        return send_from_directory('uploads', filename)

    # system routes (backend info + health check) — unversioned
    app.register_blueprint(health_bp)

    # feature API routes — versioned under /api/v1
    app.register_blueprint(api_v1, url_prefix='/api/v1')

    # handle errors (including the 404 fallback for any unknown request)
    register_error_handlers(app)

    return app


if __name__ == '__main__':
    # create_app() calls init_db(), which creates any missing tables before
    # we get here — equivalent to the original awaiting db.sync() before
    # starting the server.
    application = create_app()
    print('Database synced successfully')
    print(f'Listening to port {config.PORT}')
    application.run(host='0.0.0.0', port=config.PORT, debug=(config.ENV == Env.DEVELOPMENT))
