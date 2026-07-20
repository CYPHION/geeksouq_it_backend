"""
BriefForm model — table `BriefForms`.

One row per project brief submitted from the website. The questionnaire
answers are dynamic (they differ per brief type), so they are stored as a
JSON string in `formData` and transparently (de)serialized by the
form_data property below — callers always work with a plain dict.

Column names are kept identical to the original Sequelize model so this
drops into a database that already has data created by the Node app.
"""
import json
from datetime import datetime

from config.db import db


class BriefForm(db.Model):
    __tablename__ = 'BriefForms'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # which brief questionnaire was filled, e.g. "logo-design"
    type = db.Column('type', db.String(255), nullable=False)
    # submitter's display name
    username = db.Column('username', db.String(255), nullable=False)
    # submitter's contact email
    email = db.Column('email', db.String(255), nullable=False)
    # questionnaire answers, stored as JSON text — use the `form_data`
    # property below to read/write it as a dict
    _form_data = db.Column('formData', db.Text, nullable=False)
    # stored file name of the generated form document (see /api/v1/upload)
    form_image = db.Column('formImage', db.String(255), nullable=True)
    # stored file name of an image the user optionally attached
    user_image = db.Column('userImage', db.String(255), nullable=True)
    created_at = db.Column('createdAt', db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(
        'updatedAt', db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    @property
    def form_data(self):
        # parse the stored JSON string back into a dict on read
        return json.loads(self._form_data) if self._form_data else None

    @form_data.setter
    def form_data(self, value):
        # serialize the dict to a JSON string on write
        self._form_data = json.dumps(value)

    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'type': self.type,
            'username': self.username,
            'email': self.email,
            'formData': self.form_data,
            'formImage': self.form_image,
            'userImage': self.user_image,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None,
        }
