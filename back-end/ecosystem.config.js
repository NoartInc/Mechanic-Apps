module.exports = {
    apps : [{
      name: "mekanik-be",
      script: "npm start",
      env: {
        PORT: 6000,
        NODE_ENV: "development",
      },
      env_production: {
        PORT: 6000,
        NODE_ENV: "production",
      }
    }]
}
