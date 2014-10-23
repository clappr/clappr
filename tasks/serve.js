var gulp = require('gulp');
var util = require('gulp-util');
var express = require('express');

require('express-alias');

gulp.task('serve', ['watch'], function() {
  express()
    .use(express.static('./public'))
    .use(express.static('./dist'))
    .alias('/latest/clappr.min.js', '/clappr.js', 301)
    .listen(3000);
});
