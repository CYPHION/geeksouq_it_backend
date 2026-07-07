require('dotenv').config();


module.exports = {
    dbName: process.env.DB_NAME,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbHost: process.env.DB_HOST,
    dbPort: process.env.DB_PORT || 5432,
    env: process.env.NODE_ENV,
    dialect: process.env.DB_DIALECT || 'postgres',
    port: process.env.PORT || 5000,
    emailHost: process.env.EMAIL_HOST,
    emailPort: process.env.EMAIL_PORT || 587,
    emailUsername: process.env.EMAIL_USERNAME,
    emailPassword: process.env.EMAIL_PASSWORD,
    EMAIL_SEND: process.env.EMAIL_SEND,
    EMAIL_SEND_PASSWORD: process.env.EMAIL_SEND_PASSWORD,
    urlEmail: process.env.URL_EMAIL

};
