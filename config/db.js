/**
 * Sequelize database connection.
 *
 * Creates a single shared Sequelize instance from the values in config.js.
 * Models import this instance to define their tables, and index.js calls
 * `db.sync()` on startup to create/update the tables automatically.
 */
const { Sequelize } = require('sequelize');
const { dbName, dbUser, dbPassword, dbHost, dbPort, dialect } = require('./config');

const db = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect, // e.g. postgres, mysql
    logging: false, // set to true to log SQL queries (useful for debugging)
});


module.exports = db;
