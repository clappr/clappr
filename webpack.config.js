var path = require('path');
var webpack = require('webpack');
var Clean = require('clean-webpack-plugin');

var webpackConfig = require("./webpack-base-config");
webpackConfig.entry = [
  path.resolve(__dirname, 'src/bootstrap.js'),
  // This will get exported.
  path.resolve(__dirname, 'src/main.js')
];

if (process.env.npm_lifecycle_event === 'release') {
  webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {warnings: false},
    output: {comments: false}
  }));
} else {
  webpackConfig.plugins.push(new Clean(['dist'], {verbose: false}));
}

webpackConfig.output = {
  path: path.resolve(__dirname, 'dist'),
  // https://webpack.github.io/docs/configuration.html#output-publicpath
  // assume that assets are in the same directory that the build script is loaded from
  // i.e if "http://example.com/assets/clappr.js", then "http://example.com/assets/someicon.svg"
  // This can be overriden at runtime. Look at src/bootstrap.js
  publicPath: '',
  filename: 'clappr.js',
  library: 'Clappr',
  libraryTarget: 'umd',
};

module.exports = webpackConfig;
