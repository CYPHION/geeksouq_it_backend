"""
File controller.

HTTP request handlers for the /api/v1/upload endpoints. Mirrors the
multer-based Node middleware: files are written straight to disk in the
uploads/ directory under a timestamp-based name (so names never collide),
and the stored name is returned to the client to reference the file later
(e.g. brief form images).
"""
import os
import time

from flask import jsonify, request, send_file
from werkzeug.utils import secure_filename

from utils.directory import UPLOAD_DIRECTORY
from utils.error_response import ErrorResponse
from utils.function import get_image_path


def upload_single():
    """POST /api/v1/upload/single
    Saves the uploaded file (multipart form field `file`) to uploads/ under
    a new timestamp-based name and responds with that stored name.
    """
    file = request.files.get('file')

    if file is None or file.filename == '':
        raise ErrorResponse('No file uploaded', 400)

    # keep the original extension (robust to names with multiple dots,
    # unlike the original Node middleware's `originalname.split('.')[1]`,
    # which broke on filenames like "my.photo.png")
    original_name = secure_filename(file.filename)
    _, extension = os.path.splitext(original_name)
    stored_name = f"{int(time.time() * 1000)}{extension}"

    os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)
    file.save(os.path.join(UPLOAD_DIRECTORY, stored_name))

    return jsonify({
        'data': stored_name,
        'message': 'file uploaded successfully',
    })


def get_file(name):
    """GET /api/v1/upload/:name
    Streams a previously uploaded file from the uploads/ directory by its
    stored name. Responds 404 if no such file exists on disk.
    """
    image_path = get_image_path(secure_filename(name))

    if os.path.exists(image_path):
        return send_file(image_path)

    return 'Image not found', 404
