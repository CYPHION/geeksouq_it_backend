module.exports = {
  apps: [
    {
      name: "backend-api",
      script: "./index.js",
      instances: 1,
      autorestart: true,
      watch: false,
    }
  ]
};