const express = require('express');
const path = require('path');
const router = express.Router();

// example: https://github.com/jsphkhan/cache-control-caching-example/blob/master/server.js
const options = {
  etag: true,
  lastModified: false,
  cacheControl: true,
  setHeaders: (res, path) => {
    if (
      ['text/html', 'application/json'].indexOf(
        express.static.mime.lookup(path),
      ) > -1
    ) {
      // Custom Cache-Control for HTML files
      return res.setHeader('Cache-Control', 'no-store');
    }
    return res.setHeader('Cache-Control', 'public, max-age=604800');
  },
};

router.use(
  '/audit-inspection-workspace/analytic-report',
  express.static(path.join(__dirname, '../public'), options),
);
router.use('/', express.static(path.join(__dirname, '../../build'), options));
router.use('/*', express.static(path.join(__dirname, '../../build'), options));

module.exports = router;
