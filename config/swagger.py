"""
Swagger / OpenAPI specification.

Builds the OpenAPI 3 template served at /api-docs (non-production only, see
app.py). The base definition (info, tags, reusable schemas) lives here; the
per-endpoint documentation is written as YAML docstrings inside each route
module (routes/*.py), parsed automatically by flasgger.
"""
from config.config import config, APP_NAME, APP_VERSION, APP_DESCRIPTION

swagger_template = {
    'swagger': '2.0',
    'info': {
        'title': 'GeekSouq Backend API',
        'version': APP_VERSION,
        'description': f'{APP_DESCRIPTION}. API endpoints are versioned under `/api/v1`.',
    },
    'basePath': '/',
    'tags': [
        {'name': 'System', 'description': 'Backend info and health endpoints'},
        {'name': 'Form', 'description': 'Contact / package / schedule form endpoints'},
        {'name': 'Newsletter', 'description': 'Newsletter subscription endpoints'},
        {'name': 'BriefForm', 'description': 'Brief form endpoints'},
        {'name': 'Upload', 'description': 'File upload endpoints'},
    ],
    'definitions': {
        # reusable response schemas, referenced from route docstrings via
        # schema: { $ref: '#/definitions/<Name>' }
        'Form': {
            'type': 'object',
            'properties': {
                'id': {'type': 'integer', 'example': 1},
                'name': {'type': 'string', 'example': 'John Doe'},
                'email': {'type': 'string', 'format': 'email', 'example': 'john@example.com'},
                'phoneNo': {'type': 'string', 'example': '+1234567890'},
                'message': {'type': 'string', 'example': 'I am interested in the premium package.'},
                'scheduleDate': {'type': 'string', 'format': 'date', 'example': '2026-07-15'},
                'createdAt': {'type': 'string', 'format': 'date-time'},
                'updatedAt': {'type': 'string', 'format': 'date-time'},
            },
        },
        'Newsletter': {
            'type': 'object',
            'properties': {
                'id': {'type': 'integer', 'example': 1},
                'email': {'type': 'string', 'format': 'email', 'example': 'john@example.com'},
                'subscribe': {'type': 'boolean', 'example': True},
                'createdAt': {'type': 'string', 'format': 'date-time'},
                'updatedAt': {'type': 'string', 'format': 'date-time'},
            },
        },
        'BriefForm': {
            'type': 'object',
            'properties': {
                'id': {'type': 'integer', 'example': 1},
                'type': {'type': 'string', 'example': 'logo-design'},
                'username': {'type': 'string', 'example': 'johndoe'},
                'email': {'type': 'string', 'format': 'email', 'example': 'john@example.com'},
                'formData': {'type': 'object', 'example': {'question1': 'answer1'}},
                'formImage': {'type': 'string', 'example': 'file-123456.png'},
                'userImage': {'type': 'string', 'example': 'file-654321.png'},
                'createdAt': {'type': 'string', 'format': 'date-time'},
                'updatedAt': {'type': 'string', 'format': 'date-time'},
            },
        },
        'Error': {
            'type': 'object',
            'properties': {
                'code': {'type': 'integer', 'example': 404},
                'message': {'type': 'string', 'example': 'Not found'},
            },
        },
    },
}

# flasgger config: mounts the Swagger UI at /api-docs (matching the Node app)
# instead of its default /apidocs.
swagger_config = {
    'headers': [],
    'specs': [
        {
            'endpoint': 'apispec',
            'route': '/api-docs/apispec.json',
            'rule_filter': lambda rule: True,
            'model_filter': lambda tag: True,
        }
    ],
    'static_url_path': '/flasgger_static',
    'swagger_ui': True,
    'specs_route': '/api-docs/',
}
