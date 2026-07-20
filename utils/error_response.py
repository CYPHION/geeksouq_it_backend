"""
Custom application error.

An Exception subclass that carries an HTTP status code. Raise it anywhere in
a controller/service (e.g. `raise ErrorResponse('Form not found', 404)`) and
the global error handler (middlewares/error.py) will respond with that
status and message.
"""


class ErrorResponse(Exception):
    def __init__(self, message: str, status_code: int = 404):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
