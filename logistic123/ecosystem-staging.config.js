module.exports = {
  apps: [
    {
      name: 'svm-admin-webapp-staging',
      script: './server/index.js',
      ignore_watch: ['node_modules'],
      instances: 1,
      autorestart: true,
      env: {
        NODE_ENV: 'staging',
      },
    },
  ],
};
