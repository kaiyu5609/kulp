(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.kulper = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function indexOfListener(listeners, listener) {
    var i = listeners.length;

    while (i--) {
        if (listeners[i].listener === listener) {
            return i;
        }
    }

    return -1;
}

function isValidListener(listener) {
    if (typeof listener === 'function' || listener instanceof RegExp) {
        return true;
    } else if (listener && (typeof listener === 'undefined' ? 'undefined' : _typeof(listener)) === 'object') {
        return isValidListener(listener.listener);
    } else {
        return false;
    }
}

var EventEmitter = function () {
    function EventEmitter(options) {
        _classCallCheck(this, EventEmitter);
    }

    _createClass(EventEmitter, [{
        key: '_getEvents',
        value: function _getEvents() {
            return this._events || (this._events = {});
        }
        /**
         * @param {String|RegExp} name
         * @return {Function[]|Object}
         */

    }, {
        key: 'getListeners',
        value: function getListeners(name) {
            var events = this._getEvents();
            var response;
            var key;

            if (name instanceof RegExp) {
                response = {};
                for (key in events) {
                    if (events.hasOwnProperty(key) && name.test(key)) {
                        response[key] = events[key];
                    }
                }
            } else {
                response = events[name] || (events[name] = []);
            }

            return response;
        }
        /**
         * @param {Object[]} listeners
         * @return {Function[]}
         */

    }, {
        key: 'flattenListeners',
        value: function flattenListeners(listeners) {
            var flatListeners = [];
            var i;
            var l;

            for (i = 0, l = listeners.length; i < l; i++) {
                flatListeners.push(listeners[i].listener);
            }

            return flatListeners;
        }
        /**
         * @param {String|RegExp} name
         * @return {Object}
         */

    }, {
        key: 'getListenersAsObject',
        value: function getListenersAsObject(name) {
            var listeners = this.getListeners(name);
            var response;

            if (listeners instanceof Array) {
                response = {};
                response[name] = listeners;
            }

            return response || listeners;
        }
        /**
         * @param {String|RegExp} name
         * @param {Function} listener
         * @return {Object}
         */

    }, {
        key: 'addListener',
        value: function addListener(name, listener) {
            if (!isValidListener(listener)) {
                throw new TypeError('listener must be a function');
            }

            var listeners = this.getListenersAsObject(name);
            var listenerIsWrapped = (typeof listener === 'undefined' ? 'undefined' : _typeof(listener)) === 'object';
            var key;

            for (key in listeners) {
                if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
                    listeners[key].push(listenerIsWrapped ? listener : {
                        listener: listener,
                        once: false
                    });
                }
            }

            return this;
        }
        /**
         * @param {String|RegExp} name
         * @param {Function} listener
         * @return {Object}
         */

    }, {
        key: 'on',
        value: function on(name, listener) {
            return this.addListener(name, listener);
        }
        /**
         * @param {String|RegExp} name
         * @param {Function} listener
         * @return {Object}
         */

    }, {
        key: 'addOnceListener',
        value: function addOnceListener(name, listener) {
            return this.addListener(name, {
                listener: listener,
                once: true
            });
        }
        /**
         * @param {String|RegExp} name
         * @param {Function} listener
         * @return {Object}
         */

    }, {
        key: 'once',
        value: function once(name, listener) {
            return this.addOnceListener(name, listener);
        }
        /**
         * @param {String} name
         * @return {Object}
         */

    }, {
        key: 'defineEvent',
        value: function defineEvent(name) {
            this.getListeners(name);
            return this;
        }
        /**
         * @param {String[]} name
         * @return {Object}
         */

    }, {
        key: 'defineEvents',
        value: function defineEvents(names) {
            for (var i = 0, l = names.length; i < l; i++) {
                this.defineEvent(name[i]);
            }
            return this;
        }
        /**
         * @param {String|RegExp} name
         * @param {Function} listener
         * @return {Object}
         */

    }, {
        key: 'removeListener',
        value: function removeListener(name, listener) {
            var listeners = this.getListenersAsObject(name);
            var index;
            var key;

            for (key in listeners) {
                if (listeners.hasOwnProperty(key)) {
                    index = indexOfListener(listeners[key], listener);

                    if (index !== -1) {
                        listeners[key].splice(index, 1);
                    }
                }
            }

            return this;
        }
        /**
         * @param {String|RegExp} name
         * @param {Function} listener
         * @return {Object}
         */

    }, {
        key: 'off',
        value: function off(name, listener) {
            return this.removeListener(name, listener);
        }
        /**
         * @param {Boolean} remove
         * @param {String|Object|RegExp} name
         * @param {Function[]} [listener]
         * @return {Object}
         */

    }, {
        key: 'manipulateListeners',
        value: function manipulateListeners(remove, name, listeners) {
            var i;
            var value;
            var single = remove ? this.removeListener : this.addListener;
            var multiple = remove ? this.removeListeners : this.addListeners;

            if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object' && !(name instanceof RegExp)) {
                for (i in name) {
                    if (name.hasOwnProperty(i) && (value = name[i])) {
                        if (typeof value === 'function') {
                            single.call(this, i, value);
                        } else {
                            multiple.call(this, i, value);
                        }
                    }
                }
            } else {
                i = listeners.length;
                while (i--) {
                    single.call(this, name, listeners[i]);
                }
            }

            return this;
        }
        /**
         * @param {String|Object|RegExp} name
         * @param {Function[]} [listener]
         * @return {Object}
         */

    }, {
        key: 'addListeners',
        value: function addListeners(name, listeners) {
            return this.manipulateListeners(false, name, listeners);
        }
        /**
         * @param {String|Object|RegExp} name
         * @param {Function[]} [listener]
         * @return {Object}
         */

    }, {
        key: 'removeListeners',
        value: function removeListeners(name, listeners) {
            return this.manipulateListeners(true, name, listeners);
        }
        /**
         * @param {String|RegExp} name
         * @return {Object}
         */

    }, {
        key: 'removeEvent',
        value: function removeEvent(name) {
            var type = typeof name === 'undefined' ? 'undefined' : _typeof(name);
            var events = this._getEvents();
            var key;

            if (type === 'string') {
                delete events[name];
            } else if (name instanceof RegExp) {
                for (key in events) {
                    if (events.hasOwnProperty(key) && name.test(key)) {
                        delete events[key];
                    }
                }
            } else {
                delete this._events;
            }

            return this;
        }
        /**
         * @param {String|RegExp} name
         * @return {Object}
         */

    }, {
        key: 'removeAllListeners',
        value: function removeAllListeners(name) {
            return this.removeEvent(name);
        }
        /**
         * @param {String|RegExp} name
         * @param {Array} [args]
         * @return {Object}
         */

    }, {
        key: 'emitEvent',
        value: function emitEvent(name, args) {
            var listenersMap = this.getListenersAsObject(name);
            var listeners;
            var listener;
            var i;
            var l;
            var key;
            var response;

            for (key in listenersMap) {
                if (listenersMap.hasOwnProperty(key)) {
                    listeners = listenersMap[key].slice(0);

                    for (i = 0, l = listeners.length; i < l; i++) {
                        listener = listeners[i];

                        if (listener.once === true) {
                            this.removeListener(name, listener.listener);
                        }

                        response = listener.listener.apply(this, args || []);

                        if (response === this._getOnceReturnValue()) {
                            this.removeListener(name, listener.listener);
                        }
                    }
                }
            }

            return this;
        }
        /**
         * @param {String|RegExp} name
         * @param {Array} [args]
         * @return {Object}
         */

    }, {
        key: 'trigger',
        value: function trigger(name, args) {
            return this.emitEvent(name, args);
        }
        /**
         * @param {String|RegExp} name
         * @param {...*}
         * @return {Object}
         */

    }, {
        key: 'fire',
        value: function fire(name) {
            var args = Array.prototype.slice.call(arguments, 1);
            return this.emitEvent(name, args);
        }
        /**
         * @param {*} value
         * @return {Object}
         */

    }, {
        key: 'setOnceReturnValue',
        value: function setOnceReturnValue(value) {
            this._onceReturnValue = value;
            return this;
        }
        /**
         * @return {*|Boolean}
         */

    }, {
        key: '_getOnceReturnValue',
        value: function _getOnceReturnValue() {
            if (this.hasOwnProperty('_onceReturnValue')) {
                return this._onceReturnValue;
            } else {
                return true;
            }
        }
    }]);

    return EventEmitter;
}();

module.exports = EventEmitter;

},{}],2:[function(require,module,exports){
'use strict';

var EventEmitter = require('./event-emitter/EventEmitter');
var Request = require('./request/Request');
var Utils = require('./utils/Utils');

module.exports = {
    EventEmitter: EventEmitter,
    Request: Request,
    Utils: Utils
};

},{"./event-emitter/EventEmitter":1,"./request/Request":3,"./utils/Utils":4}],3:[function(require,module,exports){
(function (global){
'use strict';

var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);

// ajax对返回的原始数据进行预处理
function defaultDataFilter(data, type) {
    return data;
}

function transformData(contentType, data) {
    if (contentType.indexOf('json') > -1) {
        return JSON.stringify(data);
    }
    return data;
}

function Request(settings) {
    var _settings = {
        url: settings.url,
        data: settings.data,
        timeout: settings.timeout || 120000,
        format: settings.format || defaultDataFilter,
        contentType: settings.contentType || 'application/json'
    };

    return {
        _convert: function _convert(opts) {
            var contentType = settings.contentType || 'application/json';
            var defer = $.Deferred();
            var ajaxSettings = {
                url: _settings.url,
                type: opts.type,
                data: transformData(_settings.contentType, opts.data),
                async: true,
                // cache: true,
                timeout: _settings.timeout,
                // contentType: 'application/x-www-form-urlencoded',
                contentType: _settings.contentType,
                dataType: "json",
                beforeSend: function beforeSend(xhr) {},
                complete: function complete(xhr, textStatus) {
                    // 调用本次ajax请求时传递的options参数
                },
                error: function error(xhr) {}
            };

            $.ajax(ajaxSettings).done(function (res) {
                if (res.success === true) {
                    defer.resolve(res);
                } else {
                    // Logger.error(res);
                    defer.reject(res);
                }
            }).fail(function (xhr) {
                var response;
                if (xhr.responseText) {
                    try {
                        response = JSON.parse(xhr.responseText);
                    } catch (e) {
                        response = { errorCode: xhr.status, data: null, message: xhr.responseText };
                    }
                } else {
                    response = { errorCode: xhr.status, data: null, message: '系统处理错误，请稍候再试！' };
                }

                if (xhr.statusText === 'timeout' && xhr.status === 0) {
                    response.message = '请求超时，请稍候再试！';
                    defer.reject(response);
                } else {
                    defer.reject(response);
                }
            });

            return defer.promise();
        },
        get: function get() {
            return this._convert({
                type: 'GET'
            });
        },
        post: function post(data) {
            return this._convert({
                type: 'POST',
                data: data || _settings.data
            });
        },
        put: function put(data) {
            return this._convert({
                type: 'PUT',
                data: data || _settings.data
            });
        },
        delete: function _delete(data) {
            return this._convert({
                type: 'DELETE',
                data: data || _settings.data
            });
        }

    };
}

Request.Deferred = function () {
    return $.Deferred();
};

Request.reject = function () {
    var defer = $.Deferred();
    defer.reject(arguments);
    return defer;
};

Request.when = function () {
    return $.when.apply($, arguments);
};

Request.step = function (queue) {
    var defer = $.Deferred(),
        p,
        next;

    defer.resolve();

    while (queue.length > 0 && (p = queue.shift())) {
        next = next ? next.pipe(p) : defer.pipe(p);
    }

    return next;
};

module.exports = Request;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],4:[function(require,module,exports){
'use strict';

var version = "0.0.1";

/**
 *不重复ID
 * @public
 * @method uid
 * @returns {String}
 */
var guid = function () {
    var u = Date.now();
    return function () {
        return (u++).toString(16);
    };
}();

/**
 * Canvas文本
 * @public
 * @method measure
 * @param {String} label
 * @param {String} [font]
 * @returns {Object}
 */
var measureText = function () {
    try {
        var canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;
        return function (label, font) {
            var context = canvas.getContext("2d");
            context.font = font || '12px Arial';
            return context.measureText(label);
        };
    } catch (e) {
        return function () {
            return 0;
        };
    }
}();

var getDOMOffset = function () {
    var options = { visibility: 'hidden', display: 'block' };
    var cssExpand = ['Top', 'Right', 'Bottom', 'Left'];
    var rdisplayswap = /^(none|table(?!-c[ea]).+)/;
    var originElem,
        storeWidth,
        recursion = 0;

    var css = function css(elem, attr) {
        if (elem && elem.nodeType === 1) {
            return window.getComputedStyle(elem, null)[attr];
        }
    };

    var augmentWidthOrHeight = function augmentWidthOrHeight(elem, name) {
        var i = name === 'width' ? 1 : 0,
            val = 0;
        for (; i < 4; i += 2) {
            val -= parseInt(css(elem, 'padding' + cssExpand[i]), 10);
            val -= parseInt(css(elem, 'border' + cssExpand[i] + 'Width'), 10);
        }
        return val;
    };

    var getWidthOrHeight = function getWidthOrHeight(elem, name) {
        var val = name === 'width' ? elem && elem.nodeType === 1 && elem.offsetWidth : elem && elem.nodeType === 1 && elem.offsetHeight;
        return val + augmentWidthOrHeight(elem, name);
    };

    var swap = function swap(elem, options, callback) {
        var ret,
            name,
            old = {};
        for (name in options) {
            old[name] = elem.style[name];
            elem.style[name] = options[name];
        }
        ret = callback.call(elem);
        for (name in options) {
            elem.style[name] = old[name];
        }
        return ret;
    };

    var getOffset = function getOffset(elem, minHeight) {
        var width, height;
        if (!originElem) {
            originElem = elem;
        }

        if (elem && elem.nodeType === 1 && elem.offsetWidth === 0 && elem.offsetHeight === 0) {
            if (rdisplayswap.test(css(elem, 'display'))) {
                return swap(elem, options, function () {
                    width = getWidthOrHeight(originElem, 'width');
                    height = getWidthOrHeight(originElem, 'height');

                    if (!width) {
                        return getOffset(elem.parentNode);
                    }

                    if (!height) {
                        storeWidth = width;
                        return getOffset(elem.parentNode);
                    }

                    originElem = undefined;
                    return {
                        width: width,
                        height: height
                    };
                });
            } else {
                width = getWidthOrHeight(elem, 'width');
                if (!storeWidth && width) {
                    storeWidth = width;
                }
                return getOffset(elem.parentNode);
            }
        } else {
            width = getWidthOrHeight(elem, 'width');
            if (elem && elem.nodeName === 'BODY') {
                height = minHeight || 300;
            } else {
                height = getWidthOrHeight(elem, 'height');
                height = height >= 300 ? height : minHeight || 300;
            }
            if (storeWidth && storeWidth > 0) {
                width = storeWidth;
            }
            originElem = storeWidth = undefined;
            return {
                width: width,
                height: height
            };
        }
    };

    return getOffset;
}();

module.exports = {
    version: version,
    guid: guid,
    measureText: measureText,
    getDOMOffset: getDOMOffset
};

},{}]},{},[2])(2)
});

