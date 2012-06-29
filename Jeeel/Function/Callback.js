
/**
 * コンストラクタ
 * 
 * @class コールバックを管理するクラス
 * @param {String} methodName メソッド名
 * @param {Object} [obj] オブジェクト(省略時はグローバルオブジェクト)
 */
Jeeel.Function.Callback = function (methodName, obj) {
    this._method = methodName;
    this._obj = (obj || obj === 0 ? obj : Jeeel._global);
    
    if ( ! Jeeel.Type.isFunction(this._obj[this._method])) {
        throw new Error('"' + this._method + '" is not a method of "' + this._obj.toString() + '".');
    }
};

/**
 * インスタンスの作成を行う
 * 
 * @param {String} methodName メソッド名
 * @param {Object} [obj] オブジェクト(省略時はグローバルオブジェクト)
 * @return {Jeeel.Function.Callback} 作成したインスタンス
 */
Jeeel.Function.Callback.create = function (methodName, obj) {
    return new this(methodName, obj);
};

Jeeel.Function.Callback.prototype = {
    
    /**
     * オブジェクト
     * 
     * @type Object
     * @private
     */
    _obj: null,
    
    /**
     * メソッド名
     * 
     * @type String
     * @private
     */
    _method: '',
    
    /**
     * オブジェクトを取得する
     * 
     * @return {Object} オブジェクト
     */
    getMethodOwner: function () {
        return this._obj;
    },
    
    /**
     * メソッド名を取得する
     * 
     * @return {String} メソッド名
     */
    getMethodName: function () {
        return this._method;
    },
    
    /**
     * メソッドを取得する
     * 
     * @return {Function} メソッド
     */
    getMethod: function () {
        return this._obj[this._method];
    },
    
    /**
     * メソッドをコールする
     * 
     * @param {Mixied} var_args 可変引数、メソッドに引き渡す引数を指定する
     * @return {Mixied} 戻り値
     */
    call: function (var_args) {
        return this.apply(arguments);
    },
    
    /**
     * メソッドを引数に配列を渡してコールする
     * 
     * @param {Array} [args] メソッドに引き渡す引数のリストを指定する
     * @return {Mixied} 戻り値
     */
    apply: function (args) {
        return this._obj[this._method].apply(this._obj, args || []);
    }
};
