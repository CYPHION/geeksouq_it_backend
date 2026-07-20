"""
Contact form controller.

HTTP request handlers for the /api/v1/form endpoints. Handlers stay thin:
they read the request, delegate the data work to services/form_service.py,
and shape the response.
"""
from flask import jsonify, request

from services import form_service
from utils.email import generate_email

# region Form


def create_form():
    """POST /api/v1/form/create
    Saves a form submission and emails a notification to the GeekSouq inbox.
    The email subject/layout depends on the submission kind:
    - `scheduleDate` present -> "Schedule Selected"
    - `isChat` true          -> plain "Message" from the site chat
    - otherwise              -> "Package Selected"
    """
    body = request.get_json(force=True, silent=True) or {}

    name = body.get('name')
    email = body.get('email')
    phone_no = body.get('phoneNo')
    message = body.get('message')
    schedule_date = body.get('scheduleDate')
    is_chat = body.get('isChat')

    data = form_service.create_form(body)

    subject = 'Schedule Selected' if schedule_date else ('Message' if is_chat else 'Package Selected')

    if schedule_date:
        html_content = f"""<div style="background-color: #f0f0f0; font-family: Arial, sans-serif; line-height: 1.6; padding:1rem;">
        <div  style="width: 300px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
       <div  style="text-align: center; margin-bottom: 20px;">
         <h2>Schedule</h2>
       </div>
       <div  style="margin-bottom: 20px;">
         <p><span style="font-weight: bold;">Name:</span><span  style="margin-left: 10px;">{name}</span></p>
         <p><span style="font-weight: bold;">Email:</span><span  style="margin-left: 10px;">{email}</span></p>
         <p><span style="font-weight: bold;">Phone No:</span><span  style="margin-left: 10px;">{phone_no}</span></p>
         <p><span style="font-weight: bold;">Schedule Date:</span><span  style="margin-left: 10px;">{schedule_date}</span></p>
         <p><span style="font-weight: bold;">Message:</span><span  style="margin-left: 10px; word-wrap: break-word;">{message}</span></p>
       </div>
     </div>

     </div>"""
    else:
        html_content = f"""<div style="background-color: #f0f0f0; font-family: Arial, sans-serif; line-height: 1.6; padding:1rem;">
        <div  style="width: 300px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
       <div  style="text-align: center; margin-bottom: 20px;">
         <h2>{"Message from Client" if is_chat else "Package"} </h2>
       </div>
       <div  style="margin-bottom: 20px;">
       <p><span style="font-weight: bold;">Name:</span><span  style="margin-left: 10px;">{name}</span></p>
       <p><span style="font-weight: bold;">Email:</span><span  style="margin-left: 10px;">{email}</span></p>
       {"" if is_chat else f'<p><span style="font-weight: bold;">Phone No:</span><span  style="margin-left: 10px;">{phone_no}</span></p>'}
       <p><span style="font-weight: bold;">{"Message" if is_chat else "Selected Package"}:</span><span  style="margin-left: 10px; word-wrap: break-word;">{message}</span></p>

       </div>
     </div>

     </div>"""

    # NOTE: the original Node handler called generateEmail(email, subject, htmlContetn) —
    # only 3 args against a (email, subject, text, html) signature, so the built HTML
    # landed in the plain-text `text` param and the email actually sent had no HTML body.
    # That looks like an unintentional bug (the whole point of building `html_content` is
    # to send it as HTML), so this port passes it as `html` instead.
    generate_email('contactus@geeksouq.com', subject, '', html_content)

    return jsonify({
        'data': data.to_dict() if data else None,
        'message': 'Form created successfully',
    })


def get_all_form():
    """GET /api/v1/form/all
    Returns all form submissions. Query-string params are passed through
    as an equality filter (e.g. ?email=a@b.com).
    """
    data = form_service.get_all_form(request.args.to_dict())

    return jsonify({
        'data': [form.to_dict() for form in data],
        'message': '',
    })


def update_form():
    """PUT /api/v1/form/update
    Updates an existing form. Expects the record `id` plus the changed
    fields in the request body. Responds 404 if the form doesn't exist.
    """
    body = request.get_json(force=True, silent=True) or {}
    data = form_service.update_form(body.get('id'), body)

    return jsonify({
        'data': data.to_dict(),
        'message': 'Form updated successfully',
    })


def delete_form(form_id):
    """DELETE /api/v1/form/delete/:id
    Deletes a form by id. Responds 404 if the form doesn't exist.
    """
    data = form_service.delete_form(form_id)

    return jsonify({
        'data': data,
        'message': 'Form deleted successfully',
    })

# endregion
