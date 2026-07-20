"""
Newsletter service.

Business logic and database access for newsletter subscriptions.
Controllers call these functions; all database work goes through the
`Newsletter` SQLAlchemy model so no SQL lives in the controllers.
"""
from config.db import db
from models.newsletter_model import Newsletter
from utils.error_response import ErrorResponse
from utils.function import is_valid_email, modifying_payload


def get_all_newsletter(filter_params: dict = None):
    """Returns all subscriptions matching the given filter.

    :param filter_params: equality filters (usually request.args); stringified
        arrays in values are parsed first via modifying_payload and turned
        into an `IN` filter.
    """
    filter_params = modifying_payload(filter_params or {})

    query = Newsletter.query
    for key, value in filter_params.items():
        column = getattr(Newsletter, key, None)
        if column is None:
            continue
        query = query.filter(column.in_(value)) if isinstance(value, list) else query.filter(column == value)

    return query.all()


def get_newsletter_by_id(newsletter_id: int):
    return Newsletter.query.get(newsletter_id)


def create_newsletter(obj: dict) -> Newsletter:
    # mirrors the Sequelize `isEmail` validator that used to run on this field
    if not is_valid_email(obj.get('email')):
        raise ErrorResponse('Please enter a valid email address.', 400)

    newsletter = Newsletter(
        email=obj.get('email'),
        subscribe=obj.get('subscribe', True),
    )
    db.session.add(newsletter)
    db.session.commit()
    return newsletter


def update_newsletter(newsletter_id: int, body: dict) -> Newsletter:
    newsletter = Newsletter.query.get(newsletter_id)

    if not newsletter:
        raise ErrorResponse('Newsletter not found', 404)

    if 'email' in body and not is_valid_email(body['email']):
        raise ErrorResponse('Please enter a valid email address.', 400)

    if 'email' in body:
        newsletter.email = body['email']
    if 'subscribe' in body:
        newsletter.subscribe = body['subscribe']

    db.session.commit()
    return newsletter


def delete_newsletter(newsletter_id: int) -> dict:
    newsletter = Newsletter.query.get(newsletter_id)

    if not newsletter:
        raise ErrorResponse('Newsletter not found', 404)

    # snapshot before commit: SQLAlchemy expires an instance's attributes on
    # commit, and re-fetching them for a now-deleted row would raise
    # ObjectDeletedError, so the dict is taken first.
    deleted = newsletter.to_dict()
    db.session.delete(newsletter)
    db.session.commit()
    return deleted
