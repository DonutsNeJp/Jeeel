
/**
 * 未完成
 *
 * @ignore
 */
Jeeel.Debug.Debugger.Observer = function () {
    this._listeners = [];
    this._observing = false;
};

Jeeel.Debug.Debugger.Observer.prototype = {

    /**
     * @type Function[]
     * @private
     */
    _listeners: [],

    /**
     * @type Boolean
     * @private
     */
    _observing: false,

    observe: function (object, name, deepObserve) {

        var self = this;
        
        name = name || object.constructor.name;

        for (var property in object) {

            if (Jeeel.Type.isFunction(object[property])) {
                if ('_jeeel_observe' in object[property]) {
                    return;
                } else if ('ignore' in object[property]) {
                    continue;
                }

                var method = object[property];

                object[property] = (function (name_, property_, method_) {

                    return function () {
                        if (self._observing) {
                            self._notifyBeforeCall(name_, property_, arguments);
                        }

                        var rv =  method_.apply(this, arguments);

                        if (self._observing) {
                            self._notifyAfterCall(name_, property_, arguments);
                        }
                        
                        return rv;
                    };
                })(name, property, method);

                for (var staticProperty in method) {
                    object[property][staticProperty] = method[staticProperty];
                }

                object[property].prototype = method.prototype;
                object[property]._jeeel_observe = true;
            }
            
            if (deepObserve) {
                var ObjName;

                if (Jeeel.Type.isHash(object[property])) {
                    ObjName = name + '.' + property;
                    arguments.callee.call(self, object[property], ObjName, deepObserve);
                }
                else if (Jeeel.Type.isFunction(object[property])) {
                    ObjName = name + '#' + property;
                    arguments.callee.call(self, object[property], ObjName, deepObserve);
                }
            }
        }
    },

    addListener: function (listener) {
        this._listeners.push(listener);

        return this;
    },

    start: function () {
        this._observing = true;

        return this;
    },

    stop: function () {
        this._observing = false;

        return this;
    },

    _notifyBeforeCall: function (name, property, args) {
        this._observing = false;

        for(var i = 0; i < this._listeners.length; i++) {
            this._listeners[i].beforeCall(name, property, args);
        }

        this._observing = true;
    },

    _notifyAfterCall: function (name, property, args) {
        this._observing = false;

        for(var i = 0; i < this._listeners.length; i++) {
            this._listeners[i].afterCall(name, property, args);
        }

        this._observing = true;
    }
};
