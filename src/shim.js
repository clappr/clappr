var args = require('yargs').argv;
var config = true ? {
  "jquery": { exports: "global:$" },
  "underscore": { exports: "global:_" },
} : {};

module.exports = config;
