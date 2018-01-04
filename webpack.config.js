const path = require('path')
const webpack = require('webpack')
const CleanPlugin = require('clean-webpack-plugin')

const webpackConfig = require('./webpack-base-config')
const voidModulePath = path.resolve('./src/base/void');

const minimize = !!process.env.MINIMIZE;
const plainHtml5Only = !!process.env.CLAPPR_PLAIN_HTML5_ONLY;
const devServer = (process.env.npm_lifecycle_event === 'start');

let distroFlavor;

webpackConfig.entry = path.resolve(__dirname, 'src/main.js')

if (minimize) {

  webpackConfig.plugins.push(new webpack.LoaderOptionsPlugin({ minimize, debug: !minimize }))
  webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    },
    mangle: true,
    sourceMap: true,
    comments: false,
    output: {comments: false}
  }))

} else if (!devServer) {
  webpackConfig.plugins.push(new CleanPlugin(['dist'], {verbose: false}))
}

if (plainHtml5Only) {
    console.log('NOTE: Building only with plain HTML5 playback plugins, but will result in smaller build size');

    distroFlavor = 'plainhtml5';

    webpackConfig.plugins.push(
        new webpack.NormalModuleReplacementPlugin(/playbacks\/flash/, voidModulePath),
        new webpack.NormalModuleReplacementPlugin(/playbacks\/base_flash_playback/, voidModulePath),
        new webpack.NormalModuleReplacementPlugin(/playbacks\/flashls/, voidModulePath),
        new webpack.NormalModuleReplacementPlugin(/playbacks\/hls/, voidModulePath)
    );
}

webpackConfig.output = {
  path: path.resolve(__dirname, 'dist'),
  filename: `clappr${ distroFlavor ? '.' + distroFlavor : '' }${ minimize ? '.min' : '' }.js`,
  library: 'Clappr',
  libraryTarget: 'umd'
}

module.exports = webpackConfig
