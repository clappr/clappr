var gulp = require('gulp');

require('./tasks/assets');
require('./tasks/pre-build');
require('./tasks/common');
require('./tasks/build');
require('./tasks/release');
require('./tasks/watch');
require('./tasks/serve');

gulp.task('default', ['build', 'watch']);

