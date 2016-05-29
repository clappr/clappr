// This allows the user to change the assets public path at runtime by setting
// window.CLAPPR_ASSETS_BASE_URL to the value they want.
// https://webpack.github.io/docs/configuration.html#output-publicpath
if (typeof(window) !== "undefined" && typeof(window.CLAPPR_ASSETS_BASE_URL) === "string") {
	__webpack_public_path__ = window.CLAPPR_ASSETS_BASE_URL;
}