var s3 = require('s3');
var fs = require('fs');
var args = require('yargs').argv;
var exec = require('child_process').exec;

var upload = function(localDir, prefix, deleteRemoved, cb) {
  var awsOptions = JSON.parse(fs.readFileSync('./aws.json'));
  var client = s3.createClient({s3Options: awsOptions});
  var params = {localDir: localDir, deleteRemoved: !!deleteRemoved, s3Params: {Bucket: "cdn.clappr.io", Prefix: prefix}};
  var uploader = client.uploadDir(params);
  uploader.on('error', function(err) { console.error("unable to sync:", err.stack); });
  uploader.on('end', function() { console.log("done uploading for " + prefix); });
}

var tag = args.tag || undefined;
if (tag) {
  upload('./dist/', tag + '/', true);
} else {
  console.warn('no tag supplied for uploading');
}
