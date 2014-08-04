var args = require('yargs').argv;
var config = args.env === 'prod' ? {
  "jquery": { exports: "global:$" },
  "underscore": { exports: "global:_" },
} : {};

module.exports = config;
