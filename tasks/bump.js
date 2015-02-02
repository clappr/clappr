var gulp = require('gulp');
var args = require('yargs').argv;
var git = require('gulp-git');
var run = require('gulp-run');
var bump = require('gulp-bump');
var nodemailer = require('nodemailer');
var runSequence = require('run-sequence').use(gulp);
var version = require("../package.json").version;

gulp.task('increase-version', function() {
  gulp.src('./package.json')
    .pipe(bump({version: args.tag}))
    .pipe(gulp.dest('./'))
});

gulp.task('git-commit', function() {
  gulp.src('.')
    .pipe(git.add())
    .pipe(git.commit("bump to " + args.tag))
});

gulp.task('git-tag', ['git-commit'], function() {
  git.tag(args.tag, "bump to " + args.tag, function(err) {
    if (err) throw err;
  })
});

gulp.task('git-push', ['git-tag'], function(cb) {
  git.push('origin', 'master', {args: " --tags"}, function (err) {
    if (err) throw err;
    cb();
  });
});

gulp.task('npm-publish', function() {
  run('npm publish --tag=' + args.tag).exec()
})

gulp.task('sendmail', function() {
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
})

gulp.task('bump', function() {
  runSequence('increase-version', ['build', 'release'], 'git-push', 'npm-publish', 'upload', 'sendmail')
});
