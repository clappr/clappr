var path = require('path');
var webpack = require('webpack');
var Clean = require('clean-webpack-plugin');

var webpackConfig = require("./webpack-base-config");
webpackConfig.entry = path.resolve(__dirname, 'src/main.js');

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
  publicPath: '<%=baseUrl%>/',
  filename: 'clappr.js',
  library: 'Clappr',
  libraryTarget: 'umd',
};

module.exports = webpackConfig;
