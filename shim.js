module.exports = process.argv[2].match(/release|start|test/) ? {
  "jquery": { exports: "node_modules/jquery/dist/jquery.min.js" },
  "underscore": { exports: "global:_" },
} : {};
