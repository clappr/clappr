var gulp = require('gulp');
var s3 = require('s3');
var fs = require('fs');
var args = require('yargs').argv;
var exec = require('child_process').exec;

gulp.task('upload', ['release'], function(b) {
  var tag = args.tag || undefined;
//  upload('./dist/', 'latest/', true);
  if (tag) {
    upload('./dist/', tag + '/', true);
  }
  return;
});

var upload = function(localDir, prefix, deleteRemoved) {
  var awsOptions = JSON.parse(fs.readFileSync('./aws.json'));
  var client = s3.createClient({s3Options: awsOptions});
  var params = {localDir: localDir, deleteRemoved: !!deleteRemoved, s3Params: {Bucket: "cdn.clappr.io", Prefix: prefix}};
  var uploader = client.uploadDir(params);
  uploader.on('error', function(err) { console.error("unable to sync:", err.stack); });
  uploader.on('end', function() { console.log("done uploading for " + prefix); });
}
