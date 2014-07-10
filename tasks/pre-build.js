var gulp = require('gulp');
var exec = require('child_process').exec;

gulp.task('pre-build', ['sass', 'copy-html', 'copy-css'], function() {
  exec('node bin/hook.js', noop);
});
