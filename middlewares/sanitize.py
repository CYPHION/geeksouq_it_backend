"""
Request sanitization middleware (xss-clean equivalent).

Strips HTML/script markup from incoming JSON request bodies before they
reach any controller, the same defense-in-depth purpose `xss-clean` served
in the Express app. Query-string params aren't sanitized here since they're
only ever used as exact-match database filters in this app (never rendered
as HTML) — unlike body fields such as `message`/`formData`, which do end up
inside outgoing emails.
"""
import bleach


def _sanitize_value(value):
    if isinstance(value, str):
        return bleach.clean(value, tags=[], attributes={}, strip=True)
    if isinstance(value, dict):
        return {key: _sanitize_value(val) for key, val in value.items()}
    if isinstance(value, list):
        return [_sanitize_value(item) for item in value]
    return value


def init_sanitizer(app):
    @app.before_request
    def sanitize_json_body():
        from flask import request

        # silent=True: skip non-JSON bodies (e.g. multipart file uploads)
        # instead of raising a 400 before the real handler even runs
        data = request.get_json(silent=True)
        if isinstance(data, dict):
            # mutate the dict Flask already cached, so every later
            # request.get_json() call in this request sees the sanitized copy
            data.update(_sanitize_value(data))
