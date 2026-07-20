"""
File upload routes — mounted at /api/v1/upload.

Uploading is multipart/form-data, field name `file`; files are stored on
disk in the uploads/ directory.
"""
from flask import Blueprint

from controllers import file_controller

upload_bp = Blueprint('upload', __name__)


@upload_bp.route('/single', methods=['POST'])
def upload_single():
    """Upload a single file
    ---
    tags:
      - Upload
    consumes:
      - multipart/form-data
    parameters:
      - in: formData
        name: file
        type: file
        required: true
    responses:
      200:
        description: File uploaded successfully
        schema:
          type: object
          properties:
            data:
              type: string
              description: Stored file name
              example: file-123456.png
            message:
              type: string
              example: file uploaded successfully
    """
    return file_controller.upload_single()


@upload_bp.route('/<name>', methods=['GET'])
def get_file(name):
    """Get an uploaded file by name
    ---
    tags:
      - Upload
    parameters:
      - in: path
        name: name
        required: true
        type: string
        description: File name returned by the upload endpoint
    responses:
      200:
        description: The file
      404:
        description: Image not found
    """
    return file_controller.get_file(name)
