"""
Brief form service.

Business logic and database access for project brief submissions.
Creating a brief form also emails the GeekSouq team a notification with
links to the files the user uploaded.
"""
from config.config import config
from config.db import db
from models.brief_form_model import BriefForm
from utils.email import generate_email
from utils.error_response import ErrorResponse


def get_forms():
    """Returns all brief form submissions."""
    return BriefForm.query.all()


def create_form(data: dict):
    """Creates a brief form record, then emails the team a notification
    containing the submitter's details and links (built from config.URL_EMAIL)
    to the uploaded form/user images.

    Mirrors the original Node behavior: a failure (in the DB write or the
    email send) is only logged, not raised, so it never surfaces to the
    client as an error response.
    """
    try:
        brief_form = BriefForm(
            type=data.get('type'),
            username=data.get('username'),
            email=data.get('email'),
            form_image=data.get('formImage'),
            user_image=data.get('userImage'),
        )
        brief_form.form_data = data.get('formData')

        db.session.add(brief_form)
        db.session.commit()

        email_subject = 'New Form Submission'
        email_text = 'A new form has been submitted.'
        html = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Response Received from User</title>
        <style>
        body {{
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    margin: 0;
                    padding: 0;
                    background-color: #f5f5f5;
                }}
                h1 {{
                    font-size: 24px;
                    color: #333;
                }}
                p {{
                    font-size: 16px;
                    color: #666;
                }}
                a {{
                    color: #007bff;
                    text-decoration: none;
                }}
                .pdf-link{{
                    color: #007bff;
                    text-decoration: none;
                    font-size:20px;
                    font-weight:700;
                }}
                .userImg-link{{
                    color: #007bff;
                    text-decoration: none;
                    font-size:20px;
                    font-weight:700;
                }}
                a:hover {{
                    text-decoration: underline;
                }}
                </style>
                </head>
                <body>
            <h1 style="color: #007bff;">Response Received from {brief_form.username} ({brief_form.type} Form)</h1>
            <p>Hello GeekSouq Team,</p>

            <p>We are writing to inform you that we have received a response from {brief_form.username}.</p>

            <p>You can contact the user on the following email address:</p>
            <p><strong>User's Email:</strong> {brief_form.email}</p>

            <p>Here is a link to the first resource:</p>
            <a href="{config.URL_EMAIL}/uploads/{brief_form.form_image}" class="pdf-link">User Form</a>

            {f'''
            <p>Since the user has provided an image, here is a link to the second resource:</p>
            <a href="{config.URL_EMAIL}/uploads/{brief_form.user_image}" class="userImg-link">User Provided Image</a>
            ''' if brief_form.user_image else ''}

            <p>Thank you,</p>
            <p>GeekSouq Team</p>
            </body>
            </html>
            """

        generate_email(False, email_subject, email_text, html)

        return brief_form
    except Exception as error:
        db.session.rollback()
        print('Error creating form:', error)
        return None


def delete_forms(form_id: int) -> dict:
    """Deletes a brief form submission by id.

    The original Node service (`form.destroy()` called straight off a
    possibly-null `findByPk` result) had no not-found guard, so deleting a
    missing id crashed with an unhandled TypeError that the error handler
    turned into a generic 500. This port adds the same 404 guard the
    sibling Form/Newsletter services already have, for consistency.
    """
    form = BriefForm.query.get(form_id)

    if not form:
        raise ErrorResponse('Brief form not found', 404)

    # snapshot before commit: SQLAlchemy expires an instance's attributes on
    # commit, and re-fetching them for a now-deleted row would raise
    # ObjectDeletedError, so the dict is taken first.
    deleted = form.to_dict()
    db.session.delete(form)
    db.session.commit()
    return deleted
