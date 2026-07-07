/**
 * Central environment configuration.
 *
 * Loads variables from the `.env` file (see `example.env` for the template)
 * and exposes them as a single object so the rest of the codebase never
 * reads `process.env` directly.
 */
require('dotenv').config();


module.exports = {
    // database connection (PostgreSQL by default)
    dbName: process.env.DB_NAME,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbHost: process.env.DB_HOST,
    dbPort: process.env.DB_PORT || 5432,

    // normalized runtime environment: 'development' | 'test' | 'production'
    // (trimmed + lowercased so values like 'Production' still match checks)
    env: (process.env.NODE_ENV || 'development').trim().toLowerCase(),

    dialect: process.env.DB_DIALECT || 'postgres',
    port: process.env.PORT || 5000,

    // SMTP settings used by utils/email.js
    emailHost: process.env.EMAIL_HOST,
    emailPort: process.env.EMAIL_PORT || 587,
    emailUsername: process.env.EMAIL_USERNAME,
    emailPassword: process.env.EMAIL_PASSWORD,
    EMAIL_SEND: process.env.EMAIL_SEND,
    EMAIL_SEND_PASSWORD: process.env.EMAIL_SEND_PASSWORD,

    // base URL used to build links inside outgoing emails
    urlEmail: process.env.URL_EMAIL

};
