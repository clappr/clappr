var args = require('yargs').argv;
['prod', 'production'].indexOf(args.env) !== -1 ? {
  "jquery": "global:$",
  "underscore": "global:_"
} : {};
