"""
Brief form controller.

HTTP request handlers for the /api/v1/brief-form endpoints. Handlers stay
thin: they delegate data work (and the notification email) to
services/brief_form_service.py and shape the response.
"""
from flask import jsonify, request

from services import brief_form_service


def get_brief_form():
    """GET /api/v1/brief-form/all
    Returns all brief form submissions.
    """
    data = brief_form_service.get_forms()
    return jsonify({
        'data': [form.to_dict() for form in data],
    })


def create_brief_form():
    """POST /api/v1/brief-form/create
    Saves a brief form submission (questionnaire answers stored as JSON in
    `formData`) and emails a notification with links to any uploaded files.
    """
    body = request.get_json(force=True, silent=True) or {}
    data = brief_form_service.create_form(body)

    return jsonify({
        'data': data.to_dict() if data else None,
        'message': 'Form Submitted',
    })


def delete_brief_form(form_id):
    """DELETE /api/v1/brief-form/delete/:id
    Deletes a brief form submission by id.
    """
    brief_form_service.delete_forms(form_id)
    return jsonify({
        'message': 'Form Delete Submitted'
    })
