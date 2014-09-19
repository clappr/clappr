var gulp = require('gulp');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');

var files = {
  css: 'src/**/*.css',
  scss: 'src/**/*.scss',
  html: 'src/**/*.html'
};

gulp.task('sass', function () {
    return gulp.src(files.scss)
        .pipe(sass({
          includePaths: ['node_modules/compass-mixins/lib', 'src/base/scss']
        }))
        .pipe(minifyCSS())
        .pipe(gulp.dest("build"));
});

gulp.task("copy-css", function() {
  return gulp.src(files.css)
    .pipe(minifyCSS())
    .pipe(gulp.dest('build'));
});

gulp.task("copy-html", function() {
  return gulp.src(files.html)
    .pipe(gulp.dest('build'));
});
