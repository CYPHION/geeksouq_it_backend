"""
Service layer package.

Re-exports every service module so consumers can import from one place:
    from services import form_service
"""
from services import form_service, newsletter_service, brief_form_service  # noqa: F401
