var gulp = require('gulp');
var util = require('gulp-util');
var livereload = require('gulp-livereload');

gulp.task('watch', function() {
  var reloadServer = livereload();

  var js = gulp.watch('./src/**/*.js');
  js.on('change', function(event) {
    gulp.start('compile-js', function() {
      reloadServer.changed(event.path);
    });
  });

  var assets = gulp.watch('./src/**/*.{html,scss,css}');
  assets.on('change', function(event) {
    gulp.start(['sass', 'copy-html', 'copy-css'], function() {
      reloadServer.changed(event.path);
    });
  });

  util.log(util.colors.bgGreen('Watching for changes...'));
});
