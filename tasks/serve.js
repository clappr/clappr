var gulp = require('gulp');
var util = require('gulp-util');
var express = require('express');

gulp.task('serve', ['watch'], function() {
  express()
    .use(express.static('./public'))
    .listen(3000);
});

