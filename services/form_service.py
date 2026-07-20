"""
Contact form service.

Business logic and database access for contact form submissions.
Controllers call these functions; all database work goes through the
`Form` SQLAlchemy model so no SQL lives in the controllers.
"""
from datetime import date

from config.db import db
from models.form_model import Form
from utils.error_response import ErrorResponse
from utils.function import is_valid_email, modifying_payload

# maps the camelCase field names used in the API (and stored as the actual
# DB column names) to this model's snake_case Python attribute names
_FILTER_FIELDS = {
    'id': 'id',
    'name': 'name',
    'email': 'email',
    'phoneNo': 'phone_no',
    'message': 'message',
    'scheduleDate': 'schedule_date',
}


def get_all_form(filter_params: dict = None):
    """Returns all forms matching the given filter.

    :param filter_params: equality filters (usually request.args, e.g.
        ?email=a@b.com or ?phoneNo=...); stringified arrays in values are
        parsed first via modifying_payload and turned into an `IN` filter.
    """
    filter_params = modifying_payload(filter_params or {})

    query = Form.query
    for key, value in filter_params.items():
        attr = _FILTER_FIELDS.get(key)
        if attr is None:
            continue
        column = getattr(Form, attr)
        query = query.filter(column.in_(value)) if isinstance(value, list) else query.filter(column == value)

    return query.all()


def get_form_by_id(form_id: int):
    return Form.query.get(form_id)


def _parse_schedule_date(value):
    """Converts an incoming 'YYYY-MM-DD' string to a Python `date`.

    Sequelize's DATEONLY type coerced date strings automatically; SQLAlchemy
    does not, and passes the raw string straight to the DB driver, which
    some drivers (e.g. SQLite, used for local dev) reject outright.
    """
    if not value:
        return None
    if isinstance(value, date):
        return value
    try:
        return date.fromisoformat(str(value)[:10])
    except ValueError:
        raise ErrorResponse('scheduleDate must be a valid date (YYYY-MM-DD).', 400)


def create_form(obj: dict) -> Form:
    # mirrors the Sequelize `isEmail` validator that used to run on this field
    if not is_valid_email(obj.get('email')):
        raise ErrorResponse('Please enter a valid email address.', 400)

    form = Form(
        name=obj.get('name'),
        email=obj.get('email'),
        phone_no=obj.get('phoneNo'),
        message=obj.get('message'),
        schedule_date=_parse_schedule_date(obj.get('scheduleDate')),
    )
    db.session.add(form)
    db.session.commit()
    return form


def update_form(form_id: int, body: dict) -> Form:
    form = Form.query.get(form_id)

    if not form:
        raise ErrorResponse('Form not found', 404)

    if 'email' in body and not is_valid_email(body['email']):
        raise ErrorResponse('Please enter a valid email address.', 400)

    for field, attr in (('name', 'name'), ('email', 'email'), ('phoneNo', 'phone_no'), ('message', 'message')):
        if field in body:
            setattr(form, attr, body[field])

    if 'scheduleDate' in body:
        form.schedule_date = _parse_schedule_date(body['scheduleDate'])

    db.session.commit()
    return form


def delete_form(form_id: int) -> dict:
    form = Form.query.get(form_id)

    if not form:
        raise ErrorResponse('Form not found', 404)

    # snapshot before commit: SQLAlchemy expires an instance's attributes on
    # commit, and re-fetching them for a now-deleted row would raise
    # ObjectDeletedError, so the dict is taken first.
    deleted = form.to_dict()
    db.session.delete(form)
    db.session.commit()
    return deleted
