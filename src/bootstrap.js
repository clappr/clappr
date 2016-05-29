// This allows the user to change the assets public path at runtime by setting clapprAssetsBaseUrl
// to the value they want.
// They may do this by setting window.clapprAssetsBaseUrl or they may inject it (e.g. https://github.com/webpack/imports-loader if using webpack)
// https://webpack.github.io/docs/configuration.html#output-publicpath
if (typeof(clapprAssetsBaseUrl) === "string") {
	__webpack_public_path__ = clapprAssetsBaseUrl;
}