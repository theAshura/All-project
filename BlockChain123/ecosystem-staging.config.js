module.exports = {
  apps: [
    {
      name: 'du2-renting-fe-staging',
      script: './server/index.js',
      ignore_watch: ['node_modules'],
      instances: 1,
      env: {
        NODE_ENV: 'staging',
      },
    },
  ],
};
