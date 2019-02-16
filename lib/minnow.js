(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["minnow"] = factory();
	else
		root["minnow"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/Engine/Engine.js":
/*!******************************!*\
  !*** ./src/Engine/Engine.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Screen_Screen__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Screen/Screen */ \"./src/Screen/Screen.js\");\n\n\nclass Engine {\n  constructor() {\n    this.screen = null;\n  }\n\n  create() {\n    this.screen = new _Screen_Screen__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n    this.screen.create();\n  }\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Engine);\n\n\n//# sourceURL=webpack://minnow/./src/Engine/Engine.js?");

/***/ }),

/***/ "./src/Screen/Screen.js":
/*!******************************!*\
  !*** ./src/Screen/Screen.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n\n/**\n * The screen class\n */\nclass Screen {\n  constructor() {\n    this.width = 320;\n    this.height = 180;\n    this.scale = 3;\n    this.palette = [\n      [0x00, 0x00, 0x00],\n      [0xff, 0xff, 0xff],\n      [0xff, 0x00, 0x00],\n      [0x00, 0xff, 0x00],\n      [0x00, 0x00, 0xff],\n    ];\n\n    this.canvas = null;\n    this.context = null;\n    this._screenData = null;\n    this._generatedPalette = null;\n\n    this._isLittleEndian = true;\n  }\n\n  create() {\n    const container = document.createElement( 'div' );\n    container.id = 'main-container';\n\n    this.canvas = document.createElement( 'canvas' );\n    this.canvas.setAttribute( 'id', 'game-device' );\n    this.canvas.setAttribute( 'width', this.width );\n    this.canvas.setAttribute( 'height', this.height );\n\n    let canvasStyle = `width: ${ this.width * this.scale }px;`;\n    canvasStyle += `height: ${ this.height * this.scale }px;`;\n    canvasStyle += 'image-rendering: -webkit-optimize-contrast;';\n    canvasStyle += 'image-rendering: crisp-edges;';\n    canvasStyle += 'image-rendering: pixelated;';\n\n    this.canvas.setAttribute( 'style', canvasStyle );\n\n    container.appendChild( this.canvas );\n    document.body.appendChild( container );\n\n    this.context = this.canvas.getContext( '2d' );\n\n    this._screenData = new Uint8ClampedArray( this.width * this.height );\n\n    // check if we are little endian\n    const buffer = new ArrayBuffer( 4 );\n    const test8 = new Uint8ClampedArray( buffer );\n    const test32 = new Uint32Array( buffer );\n    test32[0] = 0x0a0b0c0d;\n\n    if ( test8[0] === 0x0a\n      && test8[1] === 0x0b\n      && test8[2] === 0x0c\n      && test8[3] === 0x0d\n    ) {\n      this._isLittleEndian = false;\n    }\n\n\n    this._buildPalette();\n  }\n\n  _buildPalette() {\n    this._generatedPalette = new Uint32Array( this.palette.length + 1 );\n    let currentColor = null;\n    this._generatedPalette[0] = 0x00000000;\n    if ( this._isLittleEndian ) {\n      for ( let i = 0; i < this.palette.length; i += 1 ) {\n        currentColor = this.palette[i];\n        this._generatedPalette[i + 1] = (\n          ( 255 << 24 ) // a\n          | ( currentColor[2] << 16 ) // b\n          | ( currentColor[1] << 8 ) // g\n          | currentColor[0] // r\n        );\n      }\n    }\n    else {\n      for ( let i = 0; i < this.palette.length; i += 1 ) {\n        currentColor = this.palette[i];\n        this._generatedPalette[i + 1] = (\n          ( currentColor[0] << 24 ) // r\n          | ( currentColor[1] << 16 ) // g\n          | ( currentColor[2] << 8 ) // b\n          | 255 // a\n        );\n      }\n    }\n  }\n\n  setPixel( x, y, id ) {\n    if ( x < 0 || x >= this.width || y < 0 || y >= this.height ) {\n      return;\n    }\n    this._screenData[y * this.width + x] = id;\n  }\n\n  setPixelUnsafe( x, y, id ) {\n    this._screenData[y * this.width + x] = id;\n  }\n\n  getPixel( x, y ) {\n    return this._screenData[y * this.width + x];\n  }\n\n  clearScreen( id ) {\n    this._screenData.fill( id );\n  }\n\n  _drawScreen() {\n    const imageData = this.context.getImageData( 0, 0, this.width, this.height );\n    const buffer = new ArrayBuffer( imageData.data.length );\n    const data8 = new Uint8ClampedArray( buffer );\n    const data32 = new Uint32Array( buffer );\n\n    let index = 0;\n    let screenY = 0;\n    for ( let y = 0; y < this.height; y += 1 ) {\n      for ( let x = 0; x < this.width; x += 1 ) {\n        screenY = this.height - y - 1; // origin from top left to bottom left\n        index = this._screenData[screenY * this.width + x];\n        data32[y * this.width + x] = this._generatedPalette[index];\n      }\n    }\n    imageData.data.set( data8 );\n    this.context.putImageData( imageData, 0, 0 );\n  }\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Screen);\n\n\n//# sourceURL=webpack://minnow/./src/Screen/Screen.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: default, Engine, Screen */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Engine_Engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Engine/Engine */ \"./src/Engine/Engine.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return _Engine_Engine__WEBPACK_IMPORTED_MODULE_0__[\"default\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"Engine\", function() { return _Engine_Engine__WEBPACK_IMPORTED_MODULE_0__[\"default\"]; });\n\n/* harmony import */ var _Screen_Screen__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Screen/Screen */ \"./src/Screen/Screen.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"Screen\", function() { return _Screen_Screen__WEBPACK_IMPORTED_MODULE_1__[\"default\"]; });\n\n\n\n\n\n\n\n\n//# sourceURL=webpack://minnow/./src/index.js?");

/***/ })

/******/ });
});