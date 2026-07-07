/**
 * Contact form controller.
 *
 * HTTP request handlers for the /api/v1/form endpoints. Handlers stay thin:
 * they read the request, delegate the data work to services/form.service.js,
 * and shape the response. Every handler is wrapped in asyncHandler so thrown
 * errors reach the global error handler middleware.
 */
const asyncHandler = require("../utils/asyncHandler");
const { formServices } = require('../services');
const { generateEmail } = require("../utils/email");

// #region Form

/**
 * POST /api/v1/form/create
 * Saves a form submission and emails a notification to the GeekSouq inbox.
 * The email subject/layout depends on the submission kind:
 * - `scheduleDate` present → "Schedule Selected"
 * - `isChat` true          → plain "Message" from the site chat
 * - otherwise              → "Package Selected"
 */
exports.createform = asyncHandler(async (req, res) => {

    const { name, email, phoneNo, message, scheduleDate, isChat } = req.body

    const data = await formServices.createForm(req.body)

    let htmlContetn
    let subject = req.body.scheduleDate ? "Schedule Selected" : !isChat ? "Package Selected" : "Message"

    if (req.body.scheduleDate) {
        htmlContetn = `<div style="background-color: #f0f0f0; font-family: Arial, sans-serif; line-height: 1.6; padding:1rem;">
        <div  style="width: 300px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
       <div  style="text-align: center; margin-bottom: 20px;">
         <h2>Schedule</h2>
       </div>
       <div  style="margin-bottom: 20px;">
         <p><span style="font-weight: bold;">Name:</span><span  style="margin-left: 10px;">${name}</span></p>
         <p><span style="font-weight: bold;">Email:</span><span  style="margin-left: 10px;">${email}</span></p>
         <p><span style="font-weight: bold;">Phone No:</span><span  style="margin-left: 10px;">${phoneNo}</span></p>
         <p><span style="font-weight: bold;">Schedule Date:</span><span  style="margin-left: 10px;">${scheduleDate}</span></p>
         <p><span style="font-weight: bold;">Message:</span><span  style="margin-left: 10px; word-wrap: break-word;">${message}</span></p>
       </div>
     </div>
       
     </div>`
    } else {
        htmlContetn = `<div style="background-color: #f0f0f0; font-family: Arial, sans-serif; line-height: 1.6; padding:1rem;">
        <div  style="width: 300px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
       <div  style="text-align: center; margin-bottom: 20px;">
         <h2>${isChat ? "Message from Client" : "Package"} </h2>
       </div>
       <div  style="margin-bottom: 20px;">
       <p><span style="font-weight: bold;">Name:</span><span  style="margin-left: 10px;">${name}</span></p>
       <p><span style="font-weight: bold;">Email:</span><span  style="margin-left: 10px;">${email}</span></p>
       ${!isChat ? `<p><span style="font-weight: bold;">Phone No:</span><span  style="margin-left: 10px;">${phoneNo}</span></p>` : ""}
       <p><span style="font-weight: bold;">${!isChat ? "Selected Package" : "Message"}:</span><span  style="margin-left: 10px; word-wrap: break-word;">${message}</span></p>
       
       </div>
     </div>
       
     </div>`
    }

    await generateEmail('contactus@geeksouq.com', subject, htmlContetn)

    return res.send({
        data,
        message: 'Form created successfully',
    });
})

/**
 * GET /api/v1/form/all
 * Returns all form submissions. Query-string params are passed through
 * as a Sequelize `where` filter (e.g. ?email=a@b.com).
 */
exports.getAllform = asyncHandler(async (req, res) => {
    const data = await formServices.getAllForm(req.query)

    return res.send({
        data,
        message: '',
    });
});


/**
 * PUT /api/v1/form/update
 * Updates an existing form. Expects the record `id` plus the changed
 * fields in the request body. Responds 404 if the form doesn't exist.
 */
exports.updateform = asyncHandler(async (req, res, next) => {
    const data = await formServices.updateForm(req.body.id, req.body)

    return res.send({
        data,
        message: 'Form updated successfully',
    });
})

/**
 * DELETE /api/v1/form/delete/:id
 * Deletes a form by id. Responds 404 if the form doesn't exist.
 */
exports.deleteform = asyncHandler(async (req, res, next) => {
    const data = await formServices.deleteForm(req.params.id)

    return res.send({
        data,
        message: 'Form deleted successfully',
    });
})

// #endregion