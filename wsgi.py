"""
Generic WSGI entry point.

For shared/VPS hosts that run the app through gunicorn or uWSGI instead of
Passenger, e.g.:
    gunicorn wsgi:application
    uwsgi --module wsgi:application

(cPanel-style "Setup Python App" hosting uses passenger_wsgi.py instead —
see README.md.)
"""
from app import create_app

application = create_app()
