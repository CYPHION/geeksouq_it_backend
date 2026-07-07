const { DataTypes } = require("sequelize");
const db = require("../config/db");

const Newsletter = db.define("Newsletter", {
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
    subscribe: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },

});

module.exports = Newsletter;
