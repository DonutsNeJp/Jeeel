Jeeel.directory.Jeeel.Function = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel + 'Function/';
    }
};

/**
 * コンストラクタ
 *
 * @class 関数を拡張するクラス(name, length等の部分は初期化される)
 * @param {Function} target 基となる関数
 * @throws {Error} targetが関数でない場合に起こる
 * @example
 * このクラスは関数をラッパーし幾つかの機能を追加するクラスである
 * thisの固定や引数の固定、繰り返しや遅延実行などを使用する場合にこの機能を使う
 * 
 * 例：
 * var base = function (name, id) {
 *     return 'id: ' + id + ' name: ' + name + this;
 * }
 * var func = Jeeel.Function.create(base);
 * func.bind(' hello!!'); // thisの束縛
 *
 * var b = func('devid', 22);
 * // b = 'id: 22 name: devid hello!!'
 */
Jeeel.Function = function (target) {

    if ( ! Jeeel.Type.isFunction(target)) {
        throw new Error('targetが関数ではありません。');
    }

    /**
     * @ignore
     */
    var f = function () {
        return arguments.callee._cnvTarget.apply(this, arguments);
    };

    for (var key in Jeeel.Function.prototype) {
        f[key] = Jeeel.Function.prototype[key];
    }
    
    /**
     * 対象の関数
     *
     * @type Function
     * @private
     */
    f._target = target;

    /**
     * 変換後の関数
     *
     * @type Function
     * @private
     */
    f._cnvTarget = target;
    
    target = null;

    try {
        return f;
    } finally {
        f = null;
    }
};

/**
 * インスタンスの作成を行う
 *
 * @param {Function} target 基となる関数
 * @return {Jeeel.Function} 作成したインスタンス
 */
Jeeel.Function.create = function (target) {
    return new this(target);
};

/**
 * 関数ネイティブ化を行う<br />
 * コンストラクタやapplyのないIEのための関数
 * 
 * @param {Mixied} obj 親オブジェクト
 * @param {String} methodName ネイティブにしたい関数の名前
 * @param {Boolean} [useNew] インスタンス化するかどうか
 * @return {Function} ネイティブ化した関数
 */
Jeeel.Function.toNative = function (obj, methodName, useNew) {
    methodName = (useNew ? 'new' : '') + ' this["' + methodName + '"]';
    
    return function () {
        var params = [];
        
        for (var i = arguments.length; i--;) {
            params[i] = "_" + i;
        }
        
        params = params.join(',');
        
        return Function(
            params,
            'return ' + methodName + '(' + params + ')'
        ).apply(obj, arguments);
    };
};

/**
 * 単にthisをbindする関数<br />
 * メモリ消費等が少ないがエラー処理等は一切しない
 * 
 * @param {Function} target bind対象の関数
 * @param {Mixied} thisArg thisの部分にあたる値
 * @return {Function} bind後の関数
 */
Jeeel.Function.simpleBind = function (target, thisArg) {
    return function () {
        return target.apply(thisArg, arguments);
    };
};

Jeeel.Function.prototype = {
  
    /**
     * 対象の関数
     *
     * @type Function
     * @private
     */
    _target: null,
    
    /**
     * 変換後の関数
     *
     * @type Function
     * @private
     */
    _cnvTarget: null,
    
    /**
     * 関数内のthisの部分を定義する<br />
     * 一度しか意味がない
     *
     * @param {Mixied} thisArg thisの部分にあたる値
     * @return {Jeeel.Function} 自インスタンス
     */
    bind: function (thisArg) {
        var target = this._cnvTarget;

        this._cnvTarget = function () {
            return target.apply(thisArg, arguments);
        };

        return this;
    },

    /**
     * 関数の遅延実行を定義する<br />
     * 関数の戻り値はタイムアウトIDに変更される
     *
     * @param {Integer} delayTime 遅延時間(ミリ秒)
     * @return {Jeeel.Function} 自インスタンス
     */
    delay: function (delayTime) {

        var func = function () {
            Array.prototype.unshift.call(arguments, arguments.callee._target, arguments.callee._delayTime);

            return Jeeel.Timer.setTimeout.apply(null, arguments);
        };

        func._target = this._cnvTarget;
        func._delayTime = delayTime;

        this._cnvTarget = func;
        
        func = null;

        return this;
    },

    /**
     * 関数を複数回実行する<br />
     * 関数の戻り値はJeeel.Timerのインスタンスになる<br />
     * 関数内部のthisはこの関数前にbindしていない限りJeeel.Timerのインスタンスになる
     *
     * @param {Integer} interval 実行間隔(ミリ秒)
     * @param {Integer} count 実行回数
     * @return {Jeeel.Function} 自インスタンス
     */
    repeat: function (interval, count) {

        var func = function () {
            Array.prototype.unshift.call(arguments, arguments.callee._target, interval, count);

            return Jeeel.Timer.setLimitInterval.apply(null, arguments);
        };

        func._target = this._cnvTarget;

        this._cnvTarget = func;

        return this;
    },

    /**
     * 複数の関数を結合する<br />
     * 現在の関数が最初に実行される<br />
     * 関数の戻り値は複数の関数の戻り値のリストになる
     *
     * @param {Function} var_args 結合する関数を順に渡す
     * @return {Jeeel.Function} 自インスタンス
     * @throws {Error} 引数に関数以外を渡した場合に起こる
     * @example
     * var f1 = function (n) {
     *     return a + 1;
     * };
     * var f2 = function (n) {
     *     return a + 2;
     * };
     * var f3 = function (n) {
     *     return a + 3;
     * };
     * var sf = Jeeel.Function.create(f1);
     * sf.join(f2, f3);
     *
     * var res = sf(2);
     *
     * // res = [3, 4, 5]
     */
    join: function (var_args) {
        var funcs = Array.prototype.slice.call(arguments, 0, arguments.length);

        for (var i = 0, l = funcs.length; i < l; i++) {
            if ( ! Jeeel.Type.isFunction(funcs[i])) {
                throw new Error('引数に関数以外が含まれています。');
            }
        }

        var func = function () {
            var res = [];

            res[res.length] = arguments.callee._target.apply(this, arguments);

            for (var i = 0, l = funcs.length; i < l; i++) {
                res[res.length] = funcs[i].apply(this, arguments);
            }

            return res;
        };

        func._target = this._cnvTarget;

        this._cnvTarget = func;

        return this;
    },

    /**
     * 複数の関数を切り替えて実行する機能を付加する<br />
     * 現在の関数を起点として、引数に指定した関数を呼び出す毎に切り替えて実行する<br />
     * 最後まで実行したら自動的に最初に戻る
     *
     * @param {Function} var_args 順次実行する関数を順に渡す
     * @return {Jeeel.Function} 自インスタンス
     * @throws {Error} 引数に関数以外を渡した場合に起こる
     * @example
     * var f1 = function (n) {
     *     return n + 1;
     * };
     * var f2 = function (n) {
     *     return n + 2;
     * };
     * var f3 = function (n) {
     *     return n + 3;
     * };
     * var sf = Jeeel.Function.create(f1);
     * sf.iterate(f2, f3);
     *
     * var res = [];
     *
     * for (var i = 0; i &lt; 3; i++) {
     *     res[i] = sf(i);
     * }
     *
     * // res = [1, 3, 5]
     */
    iterate: function (var_args) {
        var funcs = Array.prototype.slice.call(arguments, 0, arguments.length);

        for (var i = 0, l = funcs.length; i < l; i++) {
            if ( ! Jeeel.Type.isFunction(funcs[i])) {
                throw new Error('引数に関数以外が含まれています。');
            }
        }

        var func = function () {

            var res = funcs[arguments.callee._cnt].apply(this, arguments);

            arguments.callee._cnt++;

            if (funcs.length <= arguments.callee._cnt) {
                arguments.callee._cnt = 0;
            }

            return res;
        };

        funcs.unshift(this._cnvTarget);
        func._cnt = 0;

        this._cnvTarget = func;

        return this;
    },

    /**
     * パラメータを定義づける
     *
     * @param {Mixied} var_args 定義づけるパラメータを左から順に渡す
     * @return {Jeeel.Function} 自インスタンス
     * @example
     * var f = function (a, b, c) {
     *     return a + b + c;
     * };
     * var sf = Jeeel.Function.create(f);
     * sf.curry('Hello! ', 'World ');
     *
     * var res = sf('Jhon!!');
     * // res = 'Hello! World Jhon!!'
     */
    curry: function (var_args) {
        var slice = Array.prototype.slice;
        var args = slice.call(arguments);

        var func = function () {
            var prms = slice.call(arguments);
            prms = args.concat(prms);

            return arguments.callee._target.apply(this, prms);
        };

        func._target = this._cnvTarget;

        this._cnvTarget = func;

        return this;
    },

    /**
     * 関数の変更を元に戻す
     * 
     * @return {Jeeel.Function} 自インスタンス
     */
    reset: function () {
        this._cnvTarget = this._target;

        return this;
    },

    /**
     * ベースとなった関数を取得する
     *
     * @return {Function} ベースになった関数
     */
    getBaseMethod: function () {
        return this._target;
    }
};

Jeeel.file.Jeeel.Function = ['Template', 'Callback'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Function, Jeeel.file.Jeeel.Function);
