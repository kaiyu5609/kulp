'use strict';

var version = "0.0.1";

/**
 *不重复ID
 * @public
 * @method uid
 * @returns {String}
 */
var guid = (function () {
    var u = Date.now();
    return function () {
        return (u++).toString(16);
    };
})();

/**
 * Canvas文本
 * @public
 * @method measure
 * @param {String} label
 * @param {String} [font]
 * @returns {Object}
 */
var measureText = (function() {
    try{
        var canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;
        return function (label, font) {
            var context = canvas.getContext("2d");
            context.font = font || '12px Arial';
            return context.measureText(label);
        };
    } catch(e) {
        return function() {
            return 0;
        };
    }
})();


var getDOMOffset = (function() {
    var options = { visibility: 'hidden', display: 'block' };
    var cssExpand = ['Top', 'Right', 'Bottom', 'Left'];
    var rdisplayswap = /^(none|table(?!-c[ea]).+)/;
    var originElem, storeWidth, recursion = 0;

    var css = function(elem, attr) {
        if (elem && elem.nodeType === 1) {
            return window.getComputedStyle(elem, null)[attr];
        }
    };

    var augmentWidthOrHeight = function(elem, name) {
        var i = name === 'width' ? 1 : 0, val = 0;
        for ( ; i < 4; i += 2) {
            val -= parseInt(css(elem, 'padding' + cssExpand[i]), 10);
            val -= parseInt(css(elem, 'border' + cssExpand[i] + 'Width'), 10);
        }
        return val;
    };

    var getWidthOrHeight = function(elem, name) {
        var val = (name === 'width') ?
            (elem && elem.nodeType === 1 && elem.offsetWidth) :
            (elem && elem.nodeType === 1 && elem.offsetHeight);
        return (val + augmentWidthOrHeight(elem, name));
    };

    var swap = function(elem, options, callback) {
        var ret, name, old ={};
        for (name in options) {
            old[name] = elem.style[name];
            elem.style[name] = options[name];
        }
        ret = callback.call(elem);
        for(name in options) {
            elem.style[name] = old[name];
        }
        return ret;
    };

    var getOffset = function(elem, minHeight) {
        var width, height;
        if (!originElem) { originElem = elem; }

        if (elem && elem.nodeType === 1 && (elem.offsetWidth === 0 && elem.offsetHeight === 0)) {
            if (rdisplayswap.test(css(elem, 'display'))) {
                return swap(elem, options, function() {
                    width = getWidthOrHeight(originElem, 'width');
                    height = getWidthOrHeight(originElem, 'height');

                    if (!width) { return getOffset(elem.parentNode); }

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

})();


module.exports = {
    version: version,
    guid: guid,
    measureText: measureText,
    getDOMOffset: getDOMOffset
};
