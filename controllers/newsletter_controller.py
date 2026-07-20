"""
Newsletter controller.

HTTP request handlers for the /api/v1/newsletter endpoints. Handlers stay
thin: they delegate data work to services/newsletter_service.py and shape
the response.
"""
from flask import jsonify, request

from services import newsletter_service
from utils.constant import NEWSLETTER_EMAIL_CONTENT
from utils.email import generate_email

# region Newsletter


def create_newsletter():
    """POST /api/v1/newsletter/create
    Subscribes an email address to the newsletter and sends the subscriber
    a welcome email (template in utils/constant.py).
    """
    body = request.get_json(force=True, silent=True) or {}
    data = newsletter_service.create_newsletter(body)

    generate_email(body.get('email'), 'Welcome to GeekSouq Newsletter!', '', NEWSLETTER_EMAIL_CONTENT)

    return jsonify({
        'data': data.to_dict(),
        'message': 'Thank You for Subscribe !',
    })


def get_all_newsletter():
    """GET /api/v1/newsletter/all
    Returns all newsletter subscriptions. Query-string params are passed
    through as an equality filter (e.g. ?subscribe=true).
    """
    data = newsletter_service.get_all_newsletter(request.args.to_dict())

    return jsonify({
        'data': [newsletter.to_dict() for newsletter in data],
        'message': '',
    })


def update_newsletter():
    """PUT /api/v1/newsletter/update
    Updates a subscription (e.g. toggle `subscribe` on/off). Expects the
    record `id` plus the changed fields in the request body.
    Responds 404 if the subscription doesn't exist.
    """
    body = request.get_json(force=True, silent=True) or {}
    data = newsletter_service.update_newsletter(body.get('id'), body)

    return jsonify({
        'data': data.to_dict(),
        'message': 'Newsletter updated successfully',
    })


def delete_newsletter(newsletter_id):
    """DELETE /api/v1/newsletter/delete/:id
    Deletes a subscription by id. Responds 404 if it doesn't exist.
    """
    data = newsletter_service.delete_newsletter(newsletter_id)

    return jsonify({
        'data': data,
        'message': 'Newsletter deleted successfully',
    })

# endregion
