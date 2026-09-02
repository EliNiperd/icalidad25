"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/define-lazy-prop@3.0.0";
exports.ids = ["vendor-chunks/define-lazy-prop@3.0.0"];
exports.modules = {

/***/ "(rsc)/./node_modules/.pnpm/define-lazy-prop@3.0.0/node_modules/define-lazy-prop/index.js":
/*!******************************************************************************************!*\
  !*** ./node_modules/.pnpm/define-lazy-prop@3.0.0/node_modules/define-lazy-prop/index.js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ defineLazyProperty)\n/* harmony export */ });\nfunction defineLazyProperty(object, propertyName, valueGetter) {\n\tconst define = value => Object.defineProperty(object, propertyName, {value, enumerable: true, writable: true});\n\n\tObject.defineProperty(object, propertyName, {\n\t\tconfigurable: true,\n\t\tenumerable: true,\n\t\tget() {\n\t\t\tconst result = valueGetter();\n\t\t\tdefine(result);\n\t\t\treturn result;\n\t\t},\n\t\tset(value) {\n\t\t\tdefine(value);\n\t\t}\n\t});\n\n\treturn object;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvLnBucG0vZGVmaW5lLWxhenktcHJvcEAzLjAuMC9ub2RlX21vZHVsZXMvZGVmaW5lLWxhenktcHJvcC9pbmRleC5qcyIsIm1hcHBpbmdzIjoiOzs7O0FBQWU7QUFDZixzRUFBc0Usd0NBQXdDOztBQUU5RztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9pY2FsaWRhZDI1Ly4vbm9kZV9tb2R1bGVzLy5wbnBtL2RlZmluZS1sYXp5LXByb3BAMy4wLjAvbm9kZV9tb2R1bGVzL2RlZmluZS1sYXp5LXByb3AvaW5kZXguanM/NjJmNSJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkZWZpbmVMYXp5UHJvcGVydHkob2JqZWN0LCBwcm9wZXJ0eU5hbWUsIHZhbHVlR2V0dGVyKSB7XG5cdGNvbnN0IGRlZmluZSA9IHZhbHVlID0+IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIHByb3BlcnR5TmFtZSwge3ZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZX0pO1xuXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIHByb3BlcnR5TmFtZSwge1xuXHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdGdldCgpIHtcblx0XHRcdGNvbnN0IHJlc3VsdCA9IHZhbHVlR2V0dGVyKCk7XG5cdFx0XHRkZWZpbmUocmVzdWx0KTtcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fSxcblx0XHRzZXQodmFsdWUpIHtcblx0XHRcdGRlZmluZSh2YWx1ZSk7XG5cdFx0fVxuXHR9KTtcblxuXHRyZXR1cm4gb2JqZWN0O1xufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/.pnpm/define-lazy-prop@3.0.0/node_modules/define-lazy-prop/index.js\n");

/***/ })

};
;