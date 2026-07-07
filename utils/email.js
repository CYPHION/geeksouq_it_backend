/**
 * Email sending utility.
 *
 * Sends transactional emails (form notifications, newsletter welcome mails)
 * over SMTP using the EMAIL_* settings from config.js.
 */
var nodemailer = require('nodemailer');
const ErrorResponse = require('../utils/errorResponse');
const { emailHost, emailPort, emailUsername, emailPassword } = require('../config/config');

/**
 * Sends an email via the configured SMTP account.
 *
 * @param {string|false} [email=false] - Recipient address; pass `false` to
 *   send to the SMTP account itself (used for internal team notifications).
 * @param {string} subject - Email subject line.
 * @param {string} [text=""] - Plain-text fallback body.
 * @param {string} html - HTML body.
 * @returns {Promise<boolean>} always resolves true — send failures are
 *   logged but never thrown, so an email outage can't fail the API request.
 */
exports.generateEmail = async (email = false, subject, text = "", html) => {
    try {

        const transporter = nodemailer.createTransport({
            host: emailHost,
            port: emailPort,
            auth: {
                user: emailUsername,
                pass: emailPassword
            },
            secure: false,
            tls: {
                rejectUnauthorized: false,
                minVersion: "TLSv1.2"
            }
        });

        const mailOptions = {
            from: emailUsername,
            to: email ? email : emailUsername,
            subject,
            text: text,
            html: html,
        };
        const send = await transporter.sendMail(mailOptions);


        transporter.verify(function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log("Server is ready to take our messages");
            }
        });

        return true;
    } catch (err) {
        new ErrorResponse("Error in generating email", 400)
        console.log("err in generate email: ", err);
        return true;
    }
}

// this.generateEmail('newgen@mailinator.com', 'MARCH', 'details')

// this.generateEmail('jahakiy676@wikfee.com', 'this is the testing email', `<h1>hello</h1>`)
// this.generateEmail('shayanmustafa11@gmail.com', 'this is the testing email', `<h1>hello</h1>`)