var gulp   = require('gulp');
var uglify = require('gulp-uglify');
var mocha = require('gulp-mocha');
var rename = require('gulp-rename');
var browserify = require('gulp-browserify');

var paths = {
  files: ['src/**/*.js'],
  main: ['src/main.js'],
  tests: ['test/**/*.js'],
  dist: 'dist'
};

var distFile = 'api.min.js';

var namespace = 'WP3';

gulp.task('default', ['build']);

gulp.task('build', function() {
  gulp.src(paths.main)
    .pipe(browserify({standalone: namespace}))
    .pipe(rename(distFile))
    .pipe(gulp.dest('dist/'));
});

gulp.task('dist', function() {
  gulp.src(paths.main)
    .pipe(browserify({standalone: namespace}))
    .pipe(uglify())
    .pipe(rename(distFile))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('test', function() {
  gulp.src(paths.tests)
    .pipe(mocha({reporter: 'nyan'}))
    .on('error', function(){});
});

gulp.task('watch', function() {
  gulp.watch(paths.files, function() {
    gulp.run('build');
  });
});
