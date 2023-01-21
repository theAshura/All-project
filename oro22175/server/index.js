process.env.NODE_ENV = process.env.NODE_ENV || process.argv[2] || "staging";
exports = module.exports = require("./app");
