module.exports = {
  apps: [
    {
      name: 'svm-admin-webapp-production',
      script: './server/index.js',
      ignore_watch: ['node_modules'],
      instances: 1,
      autorestart: true,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
