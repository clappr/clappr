var gulp = require('gulp');
var util = require('gulp-util');
var livereload = require('gulp-livereload');

gulp.task('watch', ['build'], function() {
  livereload.listen();

  var js = gulp.watch('./src/**/*.js');
  js.on('change', function(event) {
    gulp.start('compile-js', function() {
      livereload.changed(event.path);
    });
  });

  var assets = gulp.watch('./src/**/*.{html,scss,css}');
  assets.on('change', function(event) {
    gulp.start(['build'], function() {
      livereload.changed(event.path);
    });
  });

  util.log(util.colors.bgGreen('Watching for changes...'));
});
