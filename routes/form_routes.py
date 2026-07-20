"""
Contact form routes — mounted at /api/v1/form.

CRUD endpoints for contact/package/schedule form submissions.
"""
from flask import Blueprint

from controllers import form_controller

form_bp = Blueprint('form', __name__)


@form_bp.route('/all', methods=['GET'])
def get_all_form():
    """Get all forms
    ---
    tags:
      - Form
    parameters:
      - in: query
        name: email
        type: string
        required: false
        description: Filter forms by email
    responses:
      200:
        description: List of forms
        schema:
          type: object
          properties:
            data:
              type: array
              items:
                $ref: '#/definitions/Form'
            message:
              type: string
              example: ''
    """
    return form_controller.get_all_form()


@form_bp.route('/create', methods=['POST'])
def create_form():
    """Create a form (sends a notification email)
    ---
    tags:
      - Form
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required: [name, email]
          properties:
            name:
              type: string
              example: John Doe
            email:
              type: string
              example: john@example.com
            phoneNo:
              type: string
              example: '+1234567890'
            message:
              type: string
              example: I am interested in the premium package.
            scheduleDate:
              type: string
              example: '2026-07-15'
            isChat:
              type: boolean
              example: false
    responses:
      200:
        description: Form created successfully
        schema:
          type: object
          properties:
            data:
              $ref: '#/definitions/Form'
            message:
              type: string
              example: Form created successfully
    """
    return form_controller.create_form()


@form_bp.route('/update', methods=['PUT'])
def update_form():
    """Update a form
    ---
    tags:
      - Form
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required: [id]
          properties:
            id:
              type: integer
              example: 1
            name:
              type: string
            email:
              type: string
            phoneNo:
              type: string
            message:
              type: string
            scheduleDate:
              type: string
    responses:
      200:
        description: Form updated successfully
        schema:
          type: object
          properties:
            data:
              $ref: '#/definitions/Form'
            message:
              type: string
              example: Form updated successfully
      404:
        description: Form not found
        schema:
          $ref: '#/definitions/Error'
    """
    return form_controller.update_form()


@form_bp.route('/delete/<int:form_id>', methods=['DELETE'])
def delete_form(form_id):
    """Delete a form
    ---
    tags:
      - Form
    parameters:
      - in: path
        name: form_id
        required: true
        type: integer
        description: Form id
    responses:
      200:
        description: Form deleted successfully
      404:
        description: Form not found
        schema:
          $ref: '#/definitions/Error'
    """
    return form_controller.delete_form(form_id)
