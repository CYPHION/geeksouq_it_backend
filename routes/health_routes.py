"""
System routes — mounted at the app root (unversioned).

GET /        -> backend info (name, version, environment, useful links)
GET /health  -> server + database health check (for uptime monitors / load balancers)
"""
from flask import Blueprint

from controllers import health_controller

health_bp = Blueprint('health', __name__)


@health_bp.route('/', methods=['GET'])
def get_info():
    """Backend info
    ---
    tags:
      - System
    responses:
      200:
        description: Basic information about the backend
        schema:
          type: object
          properties:
            name:
              type: string
              example: geeksouq-backend
            version:
              type: string
              example: 1.0.0
            description:
              type: string
              example: geeksouq backend
            environment:
              type: string
              example: development
            apiBaseUrl:
              type: string
              example: /api/v1
            health:
              type: string
              example: /health
            docs:
              type: string
              example: /api-docs
    """
    return health_controller.get_info()


@health_bp.route('/health', methods=['GET'])
def get_health():
    """Server and database health
    ---
    tags:
      - System
    responses:
      200:
        description: Server and database are healthy
        schema:
          type: object
          properties:
            status:
              type: string
              example: ok
            server:
              type: string
              example: up
            database:
              type: string
              example: up
            uptime:
              type: number
              description: Server uptime in seconds
              example: 123.45
            timestamp:
              type: string
      503:
        description: Database is down
        schema:
          type: object
          properties:
            status:
              type: string
              example: degraded
            server:
              type: string
              example: up
            database:
              type: string
              example: down
            uptime:
              type: number
              example: 123.45
            timestamp:
              type: string
    """
    return health_controller.get_health()
