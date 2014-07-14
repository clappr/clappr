var gulp  = require('gulp');
var path  = require('path');
var karma = require('karma').server;

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


