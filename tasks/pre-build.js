var gulp = require('gulp');
var exec = require('child_process').exec;

gulp.task('pre-build', ['sass', 'copy-html', 'copy-css'], function(done) {
  exec('node bin/hook.js', done);
});
