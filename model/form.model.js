/**
 * Form model — table `Forms`.
 *
 * One row per contact form submission from the website. A single table
 * backs three kinds of submissions (see form.controller.js):
 * package selection, schedule request (has `scheduleDate`), and chat message.
 * Sequelize adds `id`, `createdAt` and `updatedAt` automatically.
 */
const { DataTypes } = require("sequelize");
const db = require("../config/db");

const Form = db.define("Form", {
    // submitter's display name
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // submitter's contact email (validated)
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: {
                args: true,
                msg: 'Please enter a valid email address.',
            }
        }
    },
    // optional phone number (not collected for chat messages)
    phoneNo: {
        type: DataTypes.STRING,
    },
    // free text: the chat message or the selected package name
    message: {
        type: DataTypes.TEXT,
    },
    // requested call/meeting date — only set for schedule submissions
    scheduleDate: { type: DataTypes.DATEONLY }
});

module.exports = Form;
