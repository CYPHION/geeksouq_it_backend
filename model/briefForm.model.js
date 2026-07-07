const { DataTypes } = require("sequelize");
const db = require("../config/db");

const BriefForm = db.define("BriefForm", {
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
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
    formData: {
        type: DataTypes.TEXT,
        get: function () {
            return JSON.parse(this.getDataValue('formData')); // Changed 'value' to 'formData'
        },
        set: function (value) {
            this.setDataValue('formData', JSON.stringify(value)); // Changed 'value' to 'formData'
        },
        allowNull: false,
    },
    formImage: {
        type: DataTypes.STRING
    },
    userImage: {
        type: DataTypes.STRING
    }
});

module.exports = BriefForm;
