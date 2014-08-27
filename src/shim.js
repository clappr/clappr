module.exports = process.argv[2] === 'release' ? {
  "jquery": { exports: "global:$" },
  "underscore": { exports: "global:_" },
} : {};
