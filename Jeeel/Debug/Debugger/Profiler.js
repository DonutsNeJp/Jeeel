
/**
 * 未完成
 *
 * @ignore
 */
Jeeel.Debug.Debugger.Profiler = function () {
    this._records = {};
    this._start = null;
};

Jeeel.Debug.Debugger.Profiler.prototype = {

    _records: {},
    _start: null,

    beforeCall: function (name, property, args) {
        this._start = new Date();
    },

    afterCall: function (name, property, args) {
        var key = name + "::" + property;

        if (typeof this._records[key] == "undefined"){
            this._records[key] = [];
        }
        
        this._records[key].push( (new Date()) - this._start);
    }
};
