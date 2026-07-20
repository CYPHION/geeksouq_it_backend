"""
Newsletter routes — mounted at /api/v1/newsletter.

CRUD endpoints for newsletter email subscriptions.
"""
from flask import Blueprint

from controllers import newsletter_controller

newsletter_bp = Blueprint('newsletter', __name__)


@newsletter_bp.route('/all', methods=['GET'])
def get_all_newsletter():
    """Get all newsletter subscriptions
    ---
    tags:
      - Newsletter
    parameters:
      - in: query
        name: email
        type: string
        required: false
        description: Filter subscriptions by email
    responses:
      200:
        description: List of newsletter subscriptions
        schema:
          type: object
          properties:
            data:
              type: array
              items:
                $ref: '#/definitions/Newsletter'
            message:
              type: string
              example: ''
    """
    return newsletter_controller.get_all_newsletter()


@newsletter_bp.route('/create', methods=['POST'])
def create_newsletter():
    """Subscribe to the newsletter (sends a welcome email)
    ---
    tags:
      - Newsletter
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required: [email]
          properties:
            email:
              type: string
              example: john@example.com
    responses:
      200:
        description: Subscribed successfully
        schema:
          type: object
          properties:
            data:
              $ref: '#/definitions/Newsletter'
            message:
              type: string
              example: Thank You for Subscribe !
    """
    return newsletter_controller.create_newsletter()


@newsletter_bp.route('/update', methods=['PUT'])
def update_newsletter():
    """Update a newsletter subscription
    ---
    tags:
      - Newsletter
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
            email:
              type: string
            subscribe:
              type: boolean
              example: false
    responses:
      200:
        description: Newsletter updated successfully
        schema:
          type: object
          properties:
            data:
              $ref: '#/definitions/Newsletter'
            message:
              type: string
              example: Newsletter updated successfully
      404:
        description: Newsletter not found
        schema:
          $ref: '#/definitions/Error'
    """
    return newsletter_controller.update_newsletter()


@newsletter_bp.route('/delete/<int:newsletter_id>', methods=['DELETE'])
def delete_newsletter(newsletter_id):
    """Delete a newsletter subscription
    ---
    tags:
      - Newsletter
    parameters:
      - in: path
        name: newsletter_id
        required: true
        type: integer
        description: Newsletter id
    responses:
      200:
        description: Newsletter deleted successfully
      404:
        description: Newsletter not found
        schema:
          $ref: '#/definitions/Error'
    """
    return newsletter_controller.delete_newsletter(newsletter_id)
