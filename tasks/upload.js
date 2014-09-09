var gulp = require('gulp');
var s3 = require('s3');
var fs = require('fs');

gulp.task('upload', ['release'], function(b) {
  var awsOptions = JSON.parse(fs.readFileSync('./aws.json'));
  var client = s3.createClient({s3Options: awsOptions});
  var params = {localDir: "./dist/", deleteRemoved: true, s3Params: {Bucket: "cdn.clappr.io", Prefix: "latest/"}};
  var uploader = client.uploadDir(params);
  uploader.on('error', function(err) { console.error("unable to sync:", err.stack); });
  uploader.on('end', function() { console.log("done uploading"); });
});
