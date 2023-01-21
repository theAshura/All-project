/* eslint-disable import/no-unresolved */
/* eslint-disable global-require */
process.env.NODE_ENV = process.env.NODE_ENV || process.argv[2] || 'production';

if (['local', 'test'].indexOf(process.env.NODE_ENV) === -1) {
  require('elastic-apm-node').start({
    serviceName: `svm-admin-webapp`,
    environment: process.env.NODE_ENV,
  });
}

// eslint-disable-next-line no-multi-assign
exports = module.exports = require('./app');
