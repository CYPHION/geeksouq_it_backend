"""
Brief form routes — mounted at /api/v1/brief-form.

Endpoints for project brief submissions (dynamic questionnaire data stored
as JSON, with optional uploaded images).
"""
from flask import Blueprint

from controllers import brief_form_controller

brief_form_bp = Blueprint('brief_form', __name__)


@brief_form_bp.route('/all', methods=['GET'])
def get_brief_form():
    """Get all brief forms
    ---
    tags:
      - BriefForm
    responses:
      200:
        description: List of brief forms
        schema:
          type: object
          properties:
            data:
              type: array
              items:
                $ref: '#/definitions/BriefForm'
    """
    return brief_form_controller.get_brief_form()


@brief_form_bp.route('/create', methods=['POST'])
def create_brief_form():
    """Submit a brief form
    ---
    tags:
      - BriefForm
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required: [type, username, email, formData]
          properties:
            type:
              type: string
              example: logo-design
            username:
              type: string
              example: johndoe
            email:
              type: string
              example: john@example.com
            formData:
              type: object
              example: { question1: answer1 }
            formImage:
              type: string
              example: file-123456.png
            userImage:
              type: string
              example: file-654321.png
    responses:
      200:
        description: Form submitted
        schema:
          type: object
          properties:
            data:
              $ref: '#/definitions/BriefForm'
            message:
              type: string
              example: Form Submitted
    """
    return brief_form_controller.create_brief_form()


@brief_form_bp.route('/delete/<int:form_id>', methods=['DELETE'])
def delete_brief_form(form_id):
    """Delete a brief form
    ---
    tags:
      - BriefForm
    parameters:
      - in: path
        name: form_id
        required: true
        type: integer
        description: Brief form id
    responses:
      200:
        description: Form deleted
        schema:
          type: object
          properties:
            message:
              type: string
              example: Form Delete Submitted
    """
    return brief_form_controller.delete_brief_form(form_id)
