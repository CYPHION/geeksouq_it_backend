"""
Email sending utility.

Sends transactional emails (form notifications, newsletter welcome mails)
over SMTP using the EMAIL_* settings from config.py. Uses the standard
library only (smtplib/email), mirroring the nodemailer setup in the
original app: STARTTLS with a minimum TLS version of 1.2.
"""
import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from config.config import config


def generate_email(email=False, subject='', text='', html='') -> bool:
    """Sends an email via the configured SMTP account.

    :param email: recipient address; pass False/None to send to the SMTP
        account itself (used for internal team notifications).
    :param subject: email subject line.
    :param text: plain-text fallback body.
    :param html: HTML body.
    :return: always True — send failures are logged but never raised, so an
        email outage can't fail the API request.
    """
    try:
        message = MIMEMultipart('alternative')
        message['From'] = config.EMAIL_USERNAME
        message['To'] = email if email else config.EMAIL_USERNAME
        message['Subject'] = subject

        if text:
            message.attach(MIMEText(text, 'plain'))
        if html:
            message.attach(MIMEText(html, 'html'))

        tls_context = ssl.create_default_context()
        tls_context.minimum_version = ssl.TLSVersion.TLSv1_2
        # mirrors `tls: { rejectUnauthorized: false }` in the original —
        # accepts the SMTP host's certificate even if it can't be verified
        tls_context.check_hostname = False
        tls_context.verify_mode = ssl.CERT_NONE

        with smtplib.SMTP(config.EMAIL_HOST, config.EMAIL_PORT) as server:
            server.starttls(context=tls_context)
            server.login(config.EMAIL_USERNAME, config.EMAIL_PASSWORD)
            server.sendmail(config.EMAIL_USERNAME, message['To'], message.as_string())

        print('Email sent successfully')
        return True
    except Exception as err:
        print('err in generate email: ', err)
        return True
