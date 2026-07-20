"""
Shared helper functions.
"""
import os
import re

from utils.directory import UPLOAD_DIRECTORY

# simple, permissive email format check — equivalent to the Sequelize
# `validate: { isEmail: true }` used on the Form/Newsletter models
_EMAIL_RE = re.compile(r'^[^@\s]+@[^@\s]+\.[^@\s]+$')


def is_valid_email(email) -> bool:
    return isinstance(email, str) and bool(_EMAIL_RE.match(email))


def modifying_payload(params: dict) -> dict:
    """Prepares a query-string dict for use as a SQLAlchemy `filter_by`/filter
    mapping. Query params always arrive as strings, so any value that looks
    like a JSON array (contains '[') is parsed back into a real list — e.g.
    ?id=[1,2] becomes {'id': [1, 2]}, usable with an `IN` filter.
    """
    import json

    new_obj = {}
    for key, value in params.items():
        if isinstance(value, str) and '[' in value:
            new_obj[key] = json.loads(value)
        else:
            new_obj[key] = value
    return new_obj


def get_image_path(image: str) -> str:
    """Resolves the on-disk path of an uploaded file from its stored name."""
    return os.path.join(UPLOAD_DIRECTORY, image)
