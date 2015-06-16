var gulp = require('gulp');
var babelify = require('babelify');
var rename = require('gulp-rename');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var versionify = require("browserify-versionify");
var version = require('../package.json').version;

module.exports.js = 'src/**/*.js';

module.exports.browserify = function(options) {
  options || (options = {})
  return browserify(options)
    .transform(babelify)
    .transform(versionify)
    .require('./src/main.js', { expose: 'clappr', entry: true })
    .require('./src/base/kibo', { expose: 'kibo' })
    .require('./src/base/template', { expose: 'template' })
    .require('./src/base/events', { expose: 'events' })
    .require('./src/base/ui_object', { expose: 'ui_object' })
    .require('./src/base/base_object', { expose: 'base_object' })
    .require('./src/base/ui_container_plugin', { expose: 'ui_container_plugin' })
    .require('./src/base/container_plugin', { expose: 'container_plugin' })
    .require('./src/base/core_plugin', { expose: 'core_plugin' })
    .require('./src/base/ui_core_plugin', { expose: 'ui_core_plugin' })
    .require('./src/base/playback', { expose: 'playback' })
    .require('./src/components/browser', { expose: 'browser' })
    .require('./src/components/media_control', { expose: 'media_control' })
    .require('./src/components/player_info', { expose: 'player_info' })
    .require('./src/components/mediator', { expose: 'mediator' })
    .require('./src/components/container', { expose: 'container' })
    .require('./src/components/core', { expose: 'core' })
    .require('./src/playbacks/flash', { expose: 'flash' })
    .require('./src/playbacks/hls', { expose: 'hls' })
    .require('./src/playbacks/html5_audio', { expose: 'html5_audio' })
    .require('./src/playbacks/html5_video', { expose: 'html5_video' })
    .require('./src/playbacks/html_img', { expose: 'html_img' })
    .require('./src/plugins/poster', { expose: 'poster' })
    .require('./src/base/template', { expose: 'template' })
    .require('clappr-zepto', { expose: 'zepto' })
};

gulp.task('compile-js', function() {
  return module.exports.browserify()
  .bundle()
  .pipe(source('clappr.js'))
  .pipe(rename('clappr.js'))
  .pipe(gulp.dest('./dist'))
});
