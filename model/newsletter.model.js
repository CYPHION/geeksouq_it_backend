/**
 * Newsletter model — table `Newsletters`.
 *
 * One row per newsletter subscriber. Unsubscribing is done by flipping
 * `subscribe` to false (the row is kept), so the history is preserved.
 * Sequelize adds `id`, `createdAt` and `updatedAt` automatically.
 */
const { DataTypes } = require("sequelize");
const db = require("../config/db");

const Newsletter = db.define("Newsletter", {
    // subscriber's email address (validated)
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
    // current subscription state — false means unsubscribed
    subscribe: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },

});

module.exports = Newsletter;
