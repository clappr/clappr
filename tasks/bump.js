var gulp = require('gulp');
var args = require('yargs').argv;
var git = require('gulp-git');
var run = require('gulp-run');
var bump = require('gulp-bump');
var nodemailer = require('nodemailer');
var gulpSync = require('gulp-sync')(gulp);
var gcallback = require('gulp-callback');
var version = require("../package.json").version;

gulp.task('increase-version', function(cb) {
  gulp.src('./package.json')
    .pipe(bump({version: args.tag}))
    .pipe(gulp.dest('./'))
    .pipe(gcallback(cb))
});

gulp.task('git-commit', function(cb) {
  gulp.src('.')
    .pipe(git.add())
    .pipe(git.commit("bump to " + args.tag))
    .pipe(gcallback(cb))
});

gulp.task('git-tag', function(cb) {
  git.tag(args.tag, "bump to " + args.tag, function(err) {
    if (err) throw err;
    cb();
  })
});

gulp.task('git-push', function(cb) {
  git.push('origin', 'master', {args: " --tags"}, function (err) {
    if (err) throw err;
    cb();
  });
});

gulp.task('npm-publish', function() {
  return run('npm publish --tag=' + args.tag).exec()
})

gulp.task('sendmail', function(cb) {
  git.exec({args : "log --pretty='format:%h %s (%an)' " + version + "..master"}, function (err, stdout) {
    if (err) throw err;
    var transporter = nodemailer.createTransport();
    transporter.sendMail({
      from: 'butler@clappr.io',
      to: 'videos5@corp.globo.com',
      subject: '[clappr] new version released: ' + args.tag,
      text: 'Clappr developers bumped a new version: ' + args.tag + '\n\nCHANGELOG:\n\n' + stdout +
            '\n\nwith love,' +
            '\nYour happy butler.'
    })
  });
  cb();
})

gulp.task('bump', gulpSync.sync(['increase-version', 'build', 'release', 'git-commit', 'git-tag', 'git-push', 'npm-publish', 'sendmail', 'upload']))
