"""
Rate limiting middleware.

`limiter` limits each client IP to 100 requests per 15-minute window (429
Too Many Requests beyond that). It is applied app-wide in app.py, but only
when running in production (see init_rate_limiter). The client IP is
resolved correctly behind a reverse proxy via ProxyFix (see app.py), mirroring
the `trust proxy` setting in the original Express app.
"""
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

from utils.constant import Env

limiter = Limiter(key_func=get_remote_address)


def init_rate_limiter(app, env: str):
    # only enforced in production, matching the original: `if (config.env ===
    # Env.production) { app.use(authLimiter) }`
    is_production = env == Env.PRODUCTION
    app.config['RATELIMIT_ENABLED'] = is_production
    app.config['RATELIMIT_DEFAULT'] = '100 per 15 minutes'
    app.config['RATELIMIT_HEADERS_ENABLED'] = True

    limiter.init_app(app)
