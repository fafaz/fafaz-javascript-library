(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Modal"] = factory();
	else
		root["fafaz"] = root["fafaz"] || {}, root["fafaz"]["Modal"] = factory();
})(this, function() {
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

__webpack_require__(1);

/**
 * Copyright (c) fafazlab
 * fafaz-modal projects are licensed under the MIT license
 */

// IE8
// https://stackoverflow.com/questions/43216659/babel-ie8-inherit-issue-with-object-create
/* eslint-disable */
if (typeof Object.create !== "function") {
  Object.create = function (o, properties) {
    if ((typeof o === "undefined" ? "undefined" : _typeof(o)) !== "object" && typeof o !== "function") {
      throw new TypeError("Object prototype may only be an Object: " + o);
    } else if (o === null) {
      throw new Error("This browser's implementation of Object.create is a shim and doesn't support 'null' as the first argument.");
    }

    function F() {}
    F.prototype = o;
    return new F();
  };
}

var Modal = function () {
  function Modal(trigger, options) {
    var _this = this;

    _classCallCheck(this, Modal);

    if (!trigger) return;
    trigger = document.querySelectorAll(trigger);

    this._options = {
      overlayColor: '',
      useContainerScroll: false,
      useContentCache: true,
      preventBackgroundScroll: true,
      useHeader: true,
      useFooter: true,
      footerFocusingColor: '',
      footerButtonName: ['cancel', 'apply'],
      footerApplyCallback: null,
      callback: null
    };

    if (options) {
      _extends(this._options, options);
    }

    if (trigger.length > 1) {
      for (var i = 0, c = trigger.length; i < c; i++) {
        trigger[i].addEventListener('click', function (ev) {
          var target = ev.currentTarget || ev.target;
          var params = {};
          params.id = target.getAttribute('data-modal-id');
          params.title = target.getAttribute('data-modal-title');
          params.width = target.getAttribute('data-modal-width') ? target.getAttribute('data-modal-width') : 500;

          // checking already generated
          if (document.getElementById("modal_" + params.id + "_temp")) {
            _this.open(params.id + "_temp");
          } else {
            _this.generate(params, function () {
              _this.open(params.id + "_temp");
            });
          }
        });
      }
    } else {
      trigger.addEventListener('click', function (ev) {
        var target = ev.currentTarget || ev.target;
        var params = {};
        params.id = target.getAttribute('data-modal-id');
        params.title = target.getAttribute('data-modal-title');
        params.width = target.getAttribute('data-modal-width') ? target.getAttribute('data-modal-width') : 500;

        // checking already generated
        if (document.getElementById("modal_" + params.id + "_temp")) {
          _this.open(params.id + "_temp");
        } else {
          _this.generate(params, function () {
            _this.open(params.id + "_temp");
          });
        }
      });
    }
  } // constructor end

  Modal.prototype.generate = function generate(params, callback) {
    var layer = document.getElementById(params.id);
    var layerClone = layer.cloneNode(true);
    layerClone.id = params.id + "_temp";
    layerClone.classList.add('modal-content');

    var overlay = document.createElement('div');
    var wrapper = document.createElement('div');

    layerClone.style.width = params.width + "px";
    overlay.id = "modal_" + params.id + "_temp";
    overlay.classList.add('modal-overlay');
    if (this._options.overlayColor) overlay.style.backgroundColor = this._options.overlayColor;

    wrapper.classList.add('modal-wrapper');
    wrapper.classList.add('close');
    var header = this._options.useHeader ? "<div class=\"modal-header\"><span class=\"modal-header__title\">" + params.title + "</span><button class=\"modal-header__closeBtn close\"><svg width='1em' height='1em' fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"0.85\" viewBox=\"0 0 24 24\"><path d=\"M18 6L6 18M6 6l12 12\"/></svg></button></div>" : '';

    var footer = this._options.useFooter ? "<div class=\"modal-footer\"><button class=\"modal-footer__close close\">" + this._options.footerButtonName[0] + "</button><button class=\"modal-footer__apply\" style=\"background-color:" + this._options.footerFocusingColor + "\">" + this._options.footerButtonName[1] + "</button></div>" : '';

    layerClone.innerHTML = header + "<div class=\"modal-content__inner\">" + layerClone.innerHTML + "</div>" + footer;

    wrapper.appendChild(layerClone);
    overlay.appendChild(wrapper);
    document.body.appendChild(overlay);

    //let height = layer.clientHeight;
    if (this._options.useFooter && typeof this._options.footerApplyCallback === 'function') layerClone.querySelector('.modal-footer__apply').addEventListener('click', this._options.footerApplyCallback);
    if (typeof callback === 'function') callback(layerClone);
  };

  Modal.prototype.open = function open(id) {
    var _this2 = this;

    var layer = document.getElementById(id);
    var overlay = document.getElementById("modal_" + id);
    var nodeForClose = overlay.querySelectorAll('.close');

    overlay.classList.add('is-active');
    layer.classList.add('is-active');

    var scrollArea = layer.querySelector('.modal-content__inner');
    var checkHeight = this.resize(scrollArea);
    window.addEventListener('resize', function () {
      _this2.resize(scrollArea);
    }, true);

    // close event
    nodeForClose.forEach(function (item) {
      item.addEventListener('click', function () {
        _this2.close(layer, overlay);
      });
    });

    layer.addEventListener('click', function (e) {
      e.stopPropagation();
    });
    if (this._options.useContainerScroll && checkHeight) {
      scrollArea.style.overflowY = 'scroll';
    }

    if (this._options.preventBackgroundScroll) {
      document.body.style.overflowY = 'hidden';
    }

    if (typeof this._options.callback === 'function') this._options.callback(layer);
  };

  Modal.prototype.close = function close(layer, overlay) {
    if (!this._options.useContentCache) {
      overlay.parentNode.removeChild(overlay);
    }
    overlay.classList.remove('is-active');
    layer.classList.remove('is-active');

    document.body.style.overflowY = 'auto';
  };

  Modal.prototype.resize = function resize(scrollArea) {
    var _this3 = this;

    var contentHeight = scrollArea.scrollHeight;
    var maxHeight = window.innerHeight - 30;
    var substractHeight = function () {
      if (!_this3._options.useFooter && !_this3._options.useHeader) return 30;else if (_this3._options.useHeader && !_this3._options.useFooter || !_this3._options.useHeader && _this3._options.useFooter) return 80;else return 130;
    }();
    var scrollAreaHeight = contentHeight >= maxHeight - substractHeight ? maxHeight - substractHeight : contentHeight;
    scrollArea.style.height = scrollAreaHeight + "px";
    return contentHeight >= maxHeight;
  };

  return Modal;
}();

exports["default"] = Modal;
;

Modal.VERSION = '1.0.0';
module.exports = Modal;
module.exports = exports["default"];

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);
});