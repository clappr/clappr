var path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'src/main.js'),
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
           test: /\.(png|woff|eot|ttf)/, loader: 'url-loader?limit=100000'
       },
       {
           test: /\.svg/, loader: 'file-loader'
       }
    ],
  },
  resolve: {
    extensions: ['', '.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'clappr.js'
  },
};
