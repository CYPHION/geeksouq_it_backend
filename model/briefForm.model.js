/**
 * BriefForm model — table `BriefForms`.
 *
 * One row per project brief submitted from the website. The questionnaire
 * answers are dynamic (they differ per brief type), so they are stored as a
 * JSON string in `formData` and transparently (de)serialized by the
 * getter/setter below — callers always work with a plain object.
 * Sequelize adds `id`, `createdAt` and `updatedAt` automatically.
 */
const { DataTypes } = require("sequelize");
const db = require("../config/db");

const BriefForm = db.define("BriefForm", {
    // which brief questionnaire was filled, e.g. "logo-design"
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // submitter's display name
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // submitter's contact email
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        // validate: {
        //     isEmail: {
        //         args: true,
        //         msg: 'Please enter a valid email address.',
        //     }
        // }
    },
    // questionnaire answers as an object — stored as JSON text in the DB
    formData: {
        type: DataTypes.TEXT,
        get: function () {
            // parse the stored JSON string back into an object on read
            return JSON.parse(this.getDataValue('formData'));
        },
        set: function (value) {
            // serialize the object to a JSON string on write
            this.setDataValue('formData', JSON.stringify(value));
        },
        allowNull: false,
    },
    // stored file name of the generated form document (see /api/v1/upload)
    formImage: {
        type: DataTypes.STRING
    },
    // stored file name of an image the user optionally attached
    userImage: {
        type: DataTypes.STRING
    }
});

module.exports = BriefForm;
