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
    } else if (listener && typeof listener === 'object') {
        return isValidListener(listener.listener);
    } else {
        return false;
    }
}

class EventEmitter {
    constructor(options) {

    }

    _getEvents() {
        return this._events || (this._events = {});
    }
    /**
     * @param {String|RegExp} name
     * @return {Function[]|Object}
     */
    getListeners(name) {
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
    flattenListeners(listeners) {
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
    getListenersAsObject(name) {
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
    addListener(name, listener) {
        if (!isValidListener(listener)) {
            throw new TypeError('listener must be a function');
        }

        var listeners = this.getListenersAsObject(name);
        var listenerIsWrapped = typeof listener === 'object';
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
    on(name, listener) {
        return this.addListener(name, listener);
    }
    /**
     * @param {String|RegExp} name
     * @param {Function} listener
     * @return {Object}
     */
    addOnceListener(name, listener) {
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
    once(name, listener) {
        return this.addOnceListener(name, listener);
    }
    /**
     * @param {String} name
     * @return {Object}
     */
    defineEvent(name) {
        this.getListeners(name);
        return this;
    }
    /**
     * @param {String[]} name
     * @return {Object}
     */
    defineEvents(names) {
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
    removeListener(name, listener) {
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
    off(name, listener) {
        return this.removeListener(name, listener);
    }
    /**
     * @param {Boolean} remove
     * @param {String|Object|RegExp} name
     * @param {Function[]} [listener]
     * @return {Object}
     */
    manipulateListeners(remove, name, listeners) {
        var i;
        var value;
        var single = remove ? this.removeListener : this.addListener;
        var multiple = remove ? this.removeListeners : this.addListeners;

        if (typeof name === 'object' && !(name instanceof RegExp)) {
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
    addListeners(name, listeners) {
        return this.manipulateListeners(false, name, listeners);
    }
    /**
     * @param {String|Object|RegExp} name
     * @param {Function[]} [listener]
     * @return {Object}
     */
    removeListeners(name, listeners) {
        return this.manipulateListeners(true, name, listeners);
    }
    /**
     * @param {String|RegExp} name
     * @return {Object}
     */
    removeEvent(name) {
        var type = typeof name;
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
    removeAllListeners(name) {
        return this.removeEvent(name);
    }
    /**
     * @param {String|RegExp} name
     * @param {Array} [args]
     * @return {Object}
     */
    emitEvent(name, args) {
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
    trigger(name, args) {
        return this.emitEvent(name, args);
    }
    /**
     * @param {String|RegExp} name
     * @param {...*}
     * @return {Object}
     */
    fire(name) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(name, args);
    }
    /**
     * @param {*} value
     * @return {Object}
     */
    setOnceReturnValue(value) {
        this._onceReturnValue = value;
        return this;
    }
    /**
     * @return {*|Boolean}
     */
    _getOnceReturnValue() {
        if (this.hasOwnProperty('_onceReturnValue')) {
            return this._onceReturnValue;
        } else {
            return true;
        }

    }
}

module.exports = EventEmitter;