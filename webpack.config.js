var path = require('path');
var webpack = require('webpack');
var Clean = require('clean-webpack-plugin');

var plugins = [
  new webpack.DefinePlugin({
    VERSION: JSON.stringify(require('./package.json').version)
  })
];
if (process.env.npm_lifecycle_event === 'release') {
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {warnings: false},
    output: {comments: false}
  }));
} else {
  plugins.push(new Clean(['dist']));
}

module.exports = {
  entry: path.resolve(__dirname, 'src/main.js'),
  plugins: plugins,
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
      },
      {
        test: /\.scss$/,
        loaders: ['css', 'sass?includePaths[]='
            + path.resolve(__dirname, './node_modules/compass-mixins/lib')
            + '&includePaths[]='
            + path.resolve(__dirname, './src/base/scss')
        ],
        include: path.resolve(__dirname, 'src'),
      },
       {
           test: /\.(png|woff|eot|ttf|swf)/, loader: 'url-loader?limit=1'
       },
       {
           test: /\.svg/, loader: 'file-loader'
       },
       {
           test: /\.html/, loader: 'html?minimize=false'
       }
    ],
  },
  resolve: {
    extensions: ['', '.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '<%=baseUrl%>/',
    filename: 'clappr.js',
    library: 'Clappr',
    libraryTarget: 'umd',
  },
};
