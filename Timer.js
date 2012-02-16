
/**
 * コンストラクタ
 *
 * @class タイマーを管理するクラス
 * @param {Function} func 一定時間毎に呼び出されるコールバック(関数内のthisはここで作成するインスタンスになる)
 * @param {Integer} interval コールバックを呼び出す間隔(ミリ秒)
 * @param {Mixied} var_args 可変引数、コールバックに渡す引数
 */
Jeeel.Timer = function (func, interval, var_args) {

    var limit = -1;

    if (func && Jeeel.Type.isInteger(func.limit)) {
        limit = func.limit;
    }

    var args = Array.prototype.slice.call(arguments, 2, arguments.length);

    if (arguments[0]) {
        var self = this;
        var baseFunc = func;
        arguments[0] = function () {

            if (self._limit >= 0 && self._limit <= self._count) {
                self.end();
                return;
            }

            self._lastResult = baseFunc.apply(self, args);
            
            self._count++;
        };
    }

    this._count = 0;
    this._limit = limit;
    this._args  = Array.prototype.slice.call(arguments);
    this._timer = this._setInterval.apply(null, arguments);
    this._enabled = true;
    this._lastResult = null;
};

/**
 * インスタンスの作成を行う
 *
 * @param {Function} func 一定時間毎に呼び出されるコールバック(関数内のthisはここで作成するインスタンスになる)
 * @param {Integer} interval コールバックを呼び出す間隔(ミリ秒)
 * @param {Mixied} var_args 可変引数、コールバックに渡す引数
 * @return {Jeeel.Timer} 作成したインスタンス
 */
Jeeel.Timer.create = function (func, interval, var_args) {
    return Jeeel.Function.toNative(Jeeel, 'Timer', true).apply(null, arguments);
};

/**
 * 指定した回数だけタイマーを回す
 *
 * @param {Function} func 一定時間毎に呼び出されるコールバック(関数内のthisはJeeel.Timerのインスタンスになる)
 * @param {Integer} interval コールバックを呼び出す間隔(ミリ秒)
 * @param {Integer} limit タイマーを回す回数(マイナスを指定すると無制限になる)
 * @param {Mixied} var_args 可変引数、コールバックに渡す引数(最初の引数には0から始まるタイマーが回った回数が渡される)
 * @return {Jeeel.Timer} 作成したインスタンス
 */
Jeeel.Timer.setLimitInterval = function (func, interval, limit, var_args) {
    var baseFunc = func;
    
    func = function () {
        if (arguments[0]) {
            arguments[0] = this._count;
        }

        return baseFunc.apply(this, arguments);
    };

    func.limit = limit;

    if (arguments[0]) {
        arguments[0] = func;
    }

    return Jeeel.Function.toNative(Jeeel, 'Timer', true).apply(null, arguments);
};

/**
 * 指定時間後にメソッドを実行する
 *
 * @param {Function} func コールバックメソッド
 * @param {Integer} delayTime コールバックを呼び出す遅延時間(ミリ秒)
 * @param {Mixied} var_args コールバックに渡す引数を可変的に渡す
 * @return {Integer} タイムアウトID
 */
Jeeel.Timer.setTimeout = function (func, delayTime, var_args) {
    var args = Array.prototype.slice.call(arguments, 2, arguments.length);

    var _func = function () {
        return func.apply(this, args);
    };

    return setTimeout(_func, delayTime);
};

/**
 * 指定時間後にセットしたメソッドの設定を解除する
 *
 * @param {Integer} timeoutId タイムアウトID
 */
Jeeel.Timer.clearTimeout = function (timeoutId) {
    clearTimeout(timeoutId);
};

Jeeel.Timer.prototype = {
    
    /**
     * タイマーが回った回数
     *
     * @type Integer
     * @private
     */
    _count: 0,

    /**
     * タイマーを回す回数(マイナスで無制限)
     *
     * @type Integer
     * @private
     */
    _limit: 0,
    
    /**
     * コンストラクタに引き渡された引数
     *
     * @type Arguments
     * @private
     */
    _args: null,
    
    /**
     * タイマーID
     *
     * @type Integer
     * @private
     */
    _timer: 0,

    /**
     * タイマーが有効かどうかを示す真偽値
     *
     * @type Boolean
     * @private
     */
    _enabled: true,

    /**
     * タイマーで実行されたコールバックの最後の戻り値
     *
     * @type Mixied
     * @private
     */
    _lastResult: null,

    /**
     * setIntervalを呼ぶ
     *
     * @return {Integer} タイマーID
     * @private
     */
    _setInterval: function (func, interval) {
        return Jeeel.Window.setInterval(func, interval);
    },

    /**
     * タイマーをスタートする
     *
     * @return {Jeeel.Timer} 自インスタンス
     */
    start: function () {
        if ( ! this._enabled) {
            this._timer   = this._setInterval.apply(null, this._args);
            this._enabled = true;
        }

        return this;
    },

    /**
     * タイマーをストップする
     *
     * @return {Jeeel.Timer} 自インスタンス
     */
    stop: function () {
        if (this._enabled) {
            Jeeel.Window.clearInterval(this._timer);
            this._enabled = false;
        }

        return this;
    },

    /**
     * タイマーを終了する<br />
     * このメソッドを呼んだ後のインスタンスに対して何をしても意味が無い
     */
    end: function () {
        this.stop();

        for (var key in this) {
            delete this[key];
        }
    },

    /**
     * タイマーで実行されたコールバックの最後の戻り値を取得する
     *
     * @return {Mixied} タイマーで実行されたコールバックの最後の戻り値
     */
    getLastResult: function () {
        return this._lastResult;
    },

    /**
     * タイマーが回った回数を取得する
     *
     * @return {Integer} タイマーが回った回数
     */
    getCount: function () {
        return this._count;
    },

    /**
     * タイマーが回っているかどうかを返す
     *
     * @return {Boolean} タイマーが回っているかどうか
     */
    isEnabled: function () {
        return this._enabled;
    },
    
    /**
     * コンストラクタ
     * 
     * @param {Function} func 一定時間毎に呼び出されるコールバック(関数内のthisはここで作成するインスタンスになる)
     * @param {Integer} interval コールバックを呼び出す間隔(ミリ秒)
     * @param {Mixied} var_args 可変引数、コールバックに渡す引数
     * @constructor
     */
    constructor: Jeeel.Timer
};
