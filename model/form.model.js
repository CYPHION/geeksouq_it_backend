const { DataTypes } = require("sequelize");
const db = require("../config/db");

const Form = db.define("Form", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
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
    phoneNo: {
        type: DataTypes.STRING,
    },
    message: {
        type: DataTypes.TEXT,
    },
    scheduleDate: { type: DataTypes.DATEONLY }
});

module.exports = Form;
