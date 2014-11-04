module.exports = process.argv[2] === 'release' ? {
  "jquery": { exports: "node_modules/jquery/dist/jquery.min.js" },
  "underscore": { exports: "global:_" },
} : {};
