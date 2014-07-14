var gulp   = require('gulp');
var uglify = require('gulp-uglify');
var utils = require('gulp-util');
var rename = require('gulp-rename');
var browserify = require('browserify');
var path = require('path');
var express = require('express');
var karma = require('karma').server;
var streamify = require('gulp-streamify')
var source = require('vinyl-source-stream');

var server = express();
server.use(express.static('./dist'));
server.use(express.static('./test'));

var paths = {
  files: ['src/**/*.js', 'src/**/*.css', 'src/**/*.html', 'src/**/*.scss'],
  main: ['src/main.js'],
  tests: ['test/**/*.js'],
  dest: 'dist'
};

var port = 3000;

var distFile = 'player.js';
var distTestFile = 'tests_bundle.js';

require('./tasks/assets');
require('./tasks/pre-build');
require('./tasks/common');
require('./tasks/build');
require('./tasks/no-jquery-build');
require('./tasks/watch');
require('./tasks/serve');

gulp.task('test', function(done) {
  karma.start({configFile: path.resolve('karma.conf.js')}, done);
});


