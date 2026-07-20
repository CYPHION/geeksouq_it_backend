"""
Form model — table `Forms`.

One row per contact form submission from the website. A single table backs
three kinds of submissions (see controllers/form_controller.py): package
selection, schedule request (has `schedule_date`), and chat message.

Column names are kept identical to the original Sequelize model (camelCase,
e.g. "phoneNo") so this drops into a database that already has data created
by the Node app, while the Python-side attribute names stay snake_case.
"""
from datetime import datetime

from config.db import db


class Form(db.Model):
    __tablename__ = 'Forms'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # submitter's display name
    name = db.Column('name', db.String(255), nullable=False)
    # submitter's contact email (validated in the service layer)
    email = db.Column('email', db.String(255), nullable=False)
    # optional phone number (not collected for chat messages)
    phone_no = db.Column('phoneNo', db.String(255), nullable=True)
    # free text: the chat message or the selected package name
    message = db.Column('message', db.Text, nullable=True)
    # requested call/meeting date — only set for schedule submissions
    schedule_date = db.Column('scheduleDate', db.Date, nullable=True)
    created_at = db.Column('createdAt', db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(
        'updatedAt', db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phoneNo': self.phone_no,
            'message': self.message,
            'scheduleDate': self.schedule_date.isoformat() if self.schedule_date else None,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None,
        }
