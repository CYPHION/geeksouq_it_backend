"""
Entry point for cPanel / Phusion Passenger shared hosting.

Most shared hosts that offer Python (cPanel's "Setup Python App", Plesk,
etc.) run the app through Passenger, which looks for exactly this file at
the application root and expects it to expose a WSGI callable named
`application`. Nothing else needs to be configured beyond installing
requirements.txt into the virtualenv the host creates for you — see
README.md for the full walkthrough.
"""
from app import create_app

application = create_app()
