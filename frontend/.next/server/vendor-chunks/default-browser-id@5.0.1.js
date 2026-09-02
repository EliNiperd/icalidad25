"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/default-browser-id@5.0.1";
exports.ids = ["vendor-chunks/default-browser-id@5.0.1"];
exports.modules = {

/***/ "(rsc)/./node_modules/.pnpm/default-browser-id@5.0.1/node_modules/default-browser-id/index.js":
/*!**********************************************************************************************!*\
  !*** ./node_modules/.pnpm/default-browser-id@5.0.1/node_modules/default-browser-id/index.js ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ defaultBrowserId)\n/* harmony export */ });\n/* harmony import */ var node_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node:util */ \"node:util\");\n/* harmony import */ var node_process__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! node:process */ \"node:process\");\n/* harmony import */ var node_child_process__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! node:child_process */ \"node:child_process\");\n\n\n\n\nconst execFileAsync = (0,node_util__WEBPACK_IMPORTED_MODULE_0__.promisify)(node_child_process__WEBPACK_IMPORTED_MODULE_2__.execFile);\n\nasync function defaultBrowserId() {\n\tif (node_process__WEBPACK_IMPORTED_MODULE_1__.platform !== 'darwin') {\n\t\tthrow new Error('macOS only');\n\t}\n\n\tconst {stdout} = await execFileAsync('defaults', ['read', 'com.apple.LaunchServices/com.apple.launchservices.secure', 'LSHandlers']);\n\n\t// `(?!-)` is to prevent matching `LSHandlerRoleAll = \"-\";`.\n\tconst match = /LSHandlerRoleAll = \"(?!-)(?<id>[^\"]+?)\";\\s+?LSHandlerURLScheme = (?:http|https);/.exec(stdout);\n\n\tconst browserId = match?.groups.id ?? 'com.apple.Safari';\n\n\t// Correct the case for Safari's bundle identifier\n\tif (browserId === 'com.apple.safari') {\n\t\treturn 'com.apple.Safari';\n\t}\n\n\treturn browserId;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvLnBucG0vZGVmYXVsdC1icm93c2VyLWlkQDUuMC4xL25vZGVfbW9kdWxlcy9kZWZhdWx0LWJyb3dzZXItaWQvaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFvQztBQUNEO0FBQ1M7O0FBRTVDLHNCQUFzQixvREFBUyxDQUFDLHdEQUFROztBQUV6QjtBQUNmLEtBQUssa0RBQWdCO0FBQ3JCO0FBQ0E7O0FBRUEsUUFBUSxRQUFROztBQUVoQiwyREFBMkQ7QUFDM0Qsd0RBQXdELHdDQUF3Qzs7QUFFaEc7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2ljYWxpZGFkMjUvLi9ub2RlX21vZHVsZXMvLnBucG0vZGVmYXVsdC1icm93c2VyLWlkQDUuMC4xL25vZGVfbW9kdWxlcy9kZWZhdWx0LWJyb3dzZXItaWQvaW5kZXguanM/MmNhZiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge3Byb21pc2lmeX0gZnJvbSAnbm9kZTp1dGlsJztcbmltcG9ydCBwcm9jZXNzIGZyb20gJ25vZGU6cHJvY2Vzcyc7XG5pbXBvcnQge2V4ZWNGaWxlfSBmcm9tICdub2RlOmNoaWxkX3Byb2Nlc3MnO1xuXG5jb25zdCBleGVjRmlsZUFzeW5jID0gcHJvbWlzaWZ5KGV4ZWNGaWxlKTtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gZGVmYXVsdEJyb3dzZXJJZCgpIHtcblx0aWYgKHByb2Nlc3MucGxhdGZvcm0gIT09ICdkYXJ3aW4nKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdtYWNPUyBvbmx5Jyk7XG5cdH1cblxuXHRjb25zdCB7c3Rkb3V0fSA9IGF3YWl0IGV4ZWNGaWxlQXN5bmMoJ2RlZmF1bHRzJywgWydyZWFkJywgJ2NvbS5hcHBsZS5MYXVuY2hTZXJ2aWNlcy9jb20uYXBwbGUubGF1bmNoc2VydmljZXMuc2VjdXJlJywgJ0xTSGFuZGxlcnMnXSk7XG5cblx0Ly8gYCg/IS0pYCBpcyB0byBwcmV2ZW50IG1hdGNoaW5nIGBMU0hhbmRsZXJSb2xlQWxsID0gXCItXCI7YC5cblx0Y29uc3QgbWF0Y2ggPSAvTFNIYW5kbGVyUm9sZUFsbCA9IFwiKD8hLSkoPzxpZD5bXlwiXSs/KVwiO1xccys/TFNIYW5kbGVyVVJMU2NoZW1lID0gKD86aHR0cHxodHRwcyk7Ly5leGVjKHN0ZG91dCk7XG5cblx0Y29uc3QgYnJvd3NlcklkID0gbWF0Y2g/Lmdyb3Vwcy5pZCA/PyAnY29tLmFwcGxlLlNhZmFyaSc7XG5cblx0Ly8gQ29ycmVjdCB0aGUgY2FzZSBmb3IgU2FmYXJpJ3MgYnVuZGxlIGlkZW50aWZpZXJcblx0aWYgKGJyb3dzZXJJZCA9PT0gJ2NvbS5hcHBsZS5zYWZhcmknKSB7XG5cdFx0cmV0dXJuICdjb20uYXBwbGUuU2FmYXJpJztcblx0fVxuXG5cdHJldHVybiBicm93c2VySWQ7XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/.pnpm/default-browser-id@5.0.1/node_modules/default-browser-id/index.js\n");

/***/ })

};
;