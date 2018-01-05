const path = require('path')
const webpack = require('webpack')
const CleanPlugin = require('clean-webpack-plugin')

const webpackConfig = require('./webpack-base-config')
const voidModulePath = path.resolve('./src/base/void');

const minimize = !!process.env.MINIMIZE;
const forceInlineDebug = !!process.env.CLAPPR_INLINE_DEBUG
const plainHtml5Only = !!process.env.CLAPPR_PLAIN_HTML5_ONLY;
const devServer = (process.env.npm_lifecycle_event === 'start');

let distroFlavor;

webpackConfig.entry = path.resolve(__dirname, 'src/main.js')

if (minimize) {

  console.log('NOTE: Enabled minifying bundle (uglify)')

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
  // Cleans up whole dist folder before building
  webpackConfig.plugins.push(new CleanPlugin(['dist'], {verbose: true}))
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

if (forceInlineDebug) {
  console.log('NOTE: Enabling inline source-maps - this may not be suitable for production usage')
  webpackConfig.devtool = 'inline-source-map'
}

console.log('\n')

const filename =
  `clappr${ distroFlavor ? '.' + distroFlavor : '' }${ forceInlineDebug ? '.debug' : '' }${ minimize ? '.min' : '' }.js`

webpackConfig.output = {
  path: path.resolve(__dirname, 'dist'),
  filename,
  library: 'Clappr',
  libraryTarget: 'umd'
}

module.exports = webpackConfig
