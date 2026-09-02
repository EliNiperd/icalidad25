"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/is-inside-container@1.0.0";
exports.ids = ["vendor-chunks/is-inside-container@1.0.0"];
exports.modules = {

/***/ "(rsc)/./node_modules/.pnpm/is-inside-container@1.0.0/node_modules/is-inside-container/index.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/.pnpm/is-inside-container@1.0.0/node_modules/is-inside-container/index.js ***!
  \************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ isInsideContainer)\n/* harmony export */ });\n/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node:fs */ \"node:fs\");\n/* harmony import */ var is_docker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! is-docker */ \"(rsc)/./node_modules/.pnpm/is-docker@3.0.0/node_modules/is-docker/index.js\");\n\n\n\nlet cachedResult;\n\n// Podman detection\nconst hasContainerEnv = () => {\n\ttry {\n\t\tnode_fs__WEBPACK_IMPORTED_MODULE_0__.statSync('/run/.containerenv');\n\t\treturn true;\n\t} catch {\n\t\treturn false;\n\t}\n};\n\nfunction isInsideContainer() {\n\t// TODO: Use `??=` when targeting Node.js 16.\n\tif (cachedResult === undefined) {\n\t\tcachedResult = hasContainerEnv() || (0,is_docker__WEBPACK_IMPORTED_MODULE_1__[\"default\"])();\n\t}\n\n\treturn cachedResult;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvLnBucG0vaXMtaW5zaWRlLWNvbnRhaW5lckAxLjAuMC9ub2RlX21vZHVsZXMvaXMtaW5zaWRlLWNvbnRhaW5lci9pbmRleC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBeUI7QUFDUTs7QUFFakM7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsRUFBRSw2Q0FBVztBQUNiO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFZTtBQUNmO0FBQ0E7QUFDQSxzQ0FBc0MscURBQVE7QUFDOUM7O0FBRUE7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2ljYWxpZGFkMjUvLi9ub2RlX21vZHVsZXMvLnBucG0vaXMtaW5zaWRlLWNvbnRhaW5lckAxLjAuMC9ub2RlX21vZHVsZXMvaXMtaW5zaWRlLWNvbnRhaW5lci9pbmRleC5qcz9kZmViIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmcyBmcm9tICdub2RlOmZzJztcbmltcG9ydCBpc0RvY2tlciBmcm9tICdpcy1kb2NrZXInO1xuXG5sZXQgY2FjaGVkUmVzdWx0O1xuXG4vLyBQb2RtYW4gZGV0ZWN0aW9uXG5jb25zdCBoYXNDb250YWluZXJFbnYgPSAoKSA9PiB7XG5cdHRyeSB7XG5cdFx0ZnMuc3RhdFN5bmMoJy9ydW4vLmNvbnRhaW5lcmVudicpO1xuXHRcdHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGlzSW5zaWRlQ29udGFpbmVyKCkge1xuXHQvLyBUT0RPOiBVc2UgYD8/PWAgd2hlbiB0YXJnZXRpbmcgTm9kZS5qcyAxNi5cblx0aWYgKGNhY2hlZFJlc3VsdCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0Y2FjaGVkUmVzdWx0ID0gaGFzQ29udGFpbmVyRW52KCkgfHwgaXNEb2NrZXIoKTtcblx0fVxuXG5cdHJldHVybiBjYWNoZWRSZXN1bHQ7XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/.pnpm/is-inside-container@1.0.0/node_modules/is-inside-container/index.js\n");

/***/ })

};
;