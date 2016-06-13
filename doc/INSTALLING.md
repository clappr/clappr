### Installing for production
The project is on npm at https://www.npmjs.com/package/clappr

`npm install clappr --save-dev`

You should specify the base url for where the assets are located using the `baseUrl` option:
```javascript
  var player = new Clappr.Player({
  	source: "http://your.video/here.mp4",
	baseUrl: "http://example.com/assets/clappr"
  });
```
In the above case clappr will expect all of the [assets (in the dist folder)](https://github.com/clappr/clappr/tree/master/dist) to be accessible at "http://example.com/assets/clappr".
You need to arrange for the assets to be located at `baseUrl` during your build process.

#### Installing for [webpack](https://webpack.github.io/)
By default webpack will look at the `main` field in `package.json` and use the built version of the project. If this is all you want there is nothing else for you to do.

If you would like to build the project yourself into your project during your build process then add the following to your webpack config:
```javascript
resolve: {
    alias: { Clappr: 'clappr/src/main.js' },
    root: [path.resolve(__dirname, 'node_modules/clappr/src')],
    extensions: ['', '.js'],
}
```

#### Installing for [browserify](http://browserify.org/)
Browserify will look at the `main` field in `package.json` and use the built verison of the project.

### Installing for development

Then enter the project directory and install the dependencies:

`npm install`

Make your changes and run the tests:

`npm test`

Build your own version:

`npm run build`

Check the result on `dist/` folder.

Starting a local server:

`npm run start`

This command will start a HTTP Server on port 8080, you can check a sample page with Clappr on http://localhost:8080/webpack-dev-server/
