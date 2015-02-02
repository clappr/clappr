var gulp = require('gulp');
var args = require('yargs').argv;
var git = require('gulp-git');
var run = require('gulp-run');
var bump = require('gulp-bump');
var nodemailer = require('nodemailer');
var runSequence = require('run-sequence').use(gulp);
var version = require("../package.json").version;

gulp.task('increase-version', function(cb) {
  console.log("1");
  return gulp.src('./package.json')
    .pipe(bump({version: args.tag}))
    .pipe(gulp.dest('./'))
});

gulp.task('git-commit',['build', 'release'], function() {
  console.log("2");
  return gulp.src('.')
    .pipe(git.add())
    .pipe(git.commit("bump to " + args.tag))
});

gulp.task('git-tag', ['git-commit'], function(cb) {
  console.log("3");
  git.tag(args.tag, "bump to " + args.tag, function(err) {
    if (err) throw err;
    cb();
  })
});

gulp.task('git-push', ['git-tag'], function(cb) {
  console.log("4");
  git.push('origin', 'master', {args: " --tags"}, function (err) {
    if (err) throw err;
    cb();
  });
});

gulp.task('npm-publish', function() {
  console.log("5");
//  return run('npm publish --tag=' + args.tag).exec()
})

gulp.task('sendmail', function(cb) {
  console.log("6");
  git.exec({args : "log --pretty='format:%h %s (%an)' " + version + "..master"}, function (err, stdout) {
    if (err) throw err;
    var transporter = nodemailer.createTransport();
    transporter.sendMail({
      from: 'butler@clappr.io',
      to: 'email@flavioribeiro.com',
      subject: '[clappr] new version released: ' + args.tag,
      text: 'Clappr developers bumped a new version: ' + args.tag + '\n\nCHANGELOG:\n\n' + stdout +
            '\n\nwith love,' +
            '\nYour happy butler.'
    })
  });
  cb();
})

gulp.task('bump', function() {
  runSequence('increase-version', 'git-push', 'npm-publish', 'sendmail', 'upload')
});
