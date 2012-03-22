
/**
 * 未完成
 *
 * @ignore
 */
Jeeel.Debug.Debugger.StackTracer = function () {
    this._stack = [];
};

Jeeel.Debug.Debugger.StackTracer.StackObj = function (name, property, args) {
    this.parent = name;
    this.method = property;
    this.args   = args;
    this.toString = function () {
        return this.parent + '::' + this.method;
    };
};

Jeeel.Debug.Debugger.StackTracer.prototype = {
    _stack: [],

    beforeCall: function (name, property, args) {
        var obj = new Jeeel.Debug.Debugger.StackTracer.StackObj(name, property, args);
        this._stack.push(obj);
    },

    afterCall: function (name, property, args) {
        this._stack.pop();
    }
};

