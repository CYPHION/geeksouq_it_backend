const BriefForm = require('../model/briefForm.model');
const config = require('../config/config');
const { generateEmail } = require('../utils/email');

exports.getForms = async () => {
    return await BriefForm.findAll()
}



exports.createForm = async (data) => {
    try {
        // Create the form
        const createdForm = await BriefForm.create(data);

        // Send email notification
        const emailSubject = 'New Form Submission';
        const emailText = 'A new form has been submitted.';
        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Response Received from User</title>
        <style>
        body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    margin: 0;
                    padding: 0;
                    background-color: #f5f5f5;
                }
                h1 {
                    font-size: 24px;
                    color: #333;
                }
                p {
                    font-size: 16px;
                    color: #666;
                }
                a {
                    color: #007bff;
                    text-decoration: none;
                }
                .pdf-link{
                    color: #007bff;
                    text-decoration: none;
                    font-size:20px;
                    font-weight:700;
                }
                .userImg-link{
                    color: #007bff;
                    text-decoration: none;
                    font-size:20px;
                    font-weight:700;
                }
                a:hover {
                    text-decoration: underline;
                }
                </style>
                </head>
                <body>
            <h1 style="color: #007bff;">Response Received from ${createdForm.dataValues.username} (${createdForm.dataValues.type} Form)</h1>
            <p>Hello GeekSouq Team,</p>
            
            <p>We are writing to inform you that we have received a response from ${createdForm.dataValues.username}.</p>
            
            <p>You can contact the user on the following email address:</p>
            <p><strong>User's Email:</strong> ${createdForm.dataValues.email}</p>
            
            <p>Here is a link to the first resource:</p>
            <a href="${config.urlEmail}/uploads/${createdForm.dataValues.formImage}" class="pdf-link">User Form</a>
            
            ${createdForm.dataValues.userImage ? `
            <p>Since the user has provided an image, here is a link to the second resource:</p>
            <a href="${config.urlEmail}/uploads/${createdForm.dataValues.userImage}" class="userImg-link">User Provided Image</a>
            ` : ''}
            
            <p>Thank you,</p>
            <p>GeekSouq Team</p>
            </body>
            </html>
            `;


        // "process.envurlEmail/createdForm.dataValues.formImage"


        await generateEmail(false, emailSubject, emailText, html);

        return createdForm;
    } catch (error) {
        console.error('Error creating form:', error);
    }

};

exports.deleteForms = async (id) => {
    const form = await BriefForm.findByPk(id)
    return await form.destroy()
}