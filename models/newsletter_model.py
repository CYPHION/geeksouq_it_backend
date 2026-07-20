"""
Newsletter model — table `Newsletters`.

One row per newsletter subscriber. Unsubscribing is done by flipping
`subscribe` to False (the row is kept), so the history is preserved.

Column names are kept identical to the original Sequelize model so this
drops into a database that already has data created by the Node app.
"""
from datetime import datetime

from config.db import db


class Newsletter(db.Model):
    __tablename__ = 'Newsletters'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # subscriber's email address (validated in the service layer)
    email = db.Column('email', db.String(255), nullable=False)
    # current subscription state — False means unsubscribed
    subscribe = db.Column('subscribe', db.Boolean, nullable=False, default=True)
    created_at = db.Column('createdAt', db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(
        'updatedAt', db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'email': self.email,
            'subscribe': self.subscribe,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None,
        }
