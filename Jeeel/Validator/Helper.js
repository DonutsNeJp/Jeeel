
/**
 * コンストラクタ
 *
 * @class バリデートの助けを行うクラス
 * @param {Mixied} val バリデートを掛ける対象値
 * @param {Function|Function[]} [plugins] メソッドリスト
 */
Jeeel.Validator.Helper = function (val, plugins) {

    if ( ! Jeeel.Type.isObject(plugins)) {
        plugins = {};
    }

    this._value = val;
    this._errors = [];

    var notValidator = ['isValid', 'hasErrors', 'hasError', 'getErrors', 'getFirstError'];
    
    for (var name in plugins) {
        
        if (Jeeel.Type.inArray(name, notValidator)) {
            continue;
        }

        this[name] = plugins[name];
    }

    var self = this;

    for (var property in this) {

        if (property[0] === '_' || Jeeel.Type.inArray(property, notValidator)) {
            continue;
        } else if (Jeeel.Type.keyExists(property, plugins)) {
            this[property] = (function (_property, method) {
                return function () {
                    var args = [self._value];
                    
                    for (var i = 0, l = arguments.length; i < l; i++) {
                        args.push(arguments[i]);
                    }

                    var res  = method.apply(self, args);

                    if (res === false) {
                        self._errors[self._errors.length] = _property;
                    }

                    return self;
                };
            })(property, this[property]);
        } else {
            this[property] = (function (_property, method) {
                return function () {
                    var res = method.apply(self, arguments);

                    if (res === false) {
                        self._errors[self._errors.length] = _property;
                    }

                    return self;
                };
            })(property, this[property]);
        }
    }
};

/**
 * インスタンスの作成を行う
 *
 * @param {Mixied} val バリデートを掛ける対象値
 * @return {Jeeel.Validator.Helper} 作成したインスタンス
 */
Jeeel.Validator.Helper.create = function (val) {
    return new this(val, this.getPlugins());
};

/**
 * プラグインの追加
 *
 * @param {String} name メソッド名
 * @param {Function} method メソッド(メソッドは最初の引数にバリデートする値その後は任意の引数となる)<br />
 *                           Boolean method(Mixied value, ...)
 * @throws {Error} methodがメソッドではない場合に発生
 */
Jeeel.Validator.Helper.setPlugin = function (name, method) {
    if ( ! Jeeel.Type.isFunction(method)) {
        throw new Error('指定した引数がメソッドではありません。');
    }

    if (Jeeel.Type.isEmpty(this._plugins)) {
        this._plugins = {};
    }

    this._plugins[name] = method;
};

/**
 * プラグインの設定
 *
 * @param {Function[]} methods メソッドの連想配列(メソッドは最初の引数にバリデートする値その後は任意の引数となる)<br />
 *                              Boolean method(Mixied value, ...)
 * @throws {Error} methodsがメソッドまたはメソッドリストではない場合に発生
 */
Jeeel.Validator.Helper.setPlugins = function (methods) {

    if ( ! Jeeel.Type.isObject(methods)) {
        throw new Error('指定した引数がメソッドリストではありません。');
    }

    for (var name in methods) {
        if (Jeeel.Type.isFunction(methods[name])) {
            throw new Error('指定した引数にメソッド以外のものが含まれています。');
        }
    }

    /**
     * プラグイン
     *
     * @type Function[]
     * @private
     */
    this._plugins = methods;
};

/**
 * プラグインを取得
 *
 * @return {Function[]} メソッド連想配列
 */
Jeeel.Validator.Helper.getPlugins = function () {
    if (Jeeel.Type.isEmpty(this._plugins)) {
        return {};
    }

    return this._plugins;
};

Jeeel.Validator.Helper.prototype = {

    /**
     * バリデートを掛ける値
     * 
     * @type Mixied
     * @private
     */
    _value: null,

    /**
     * エラー保持配列
     *
     * @type String[]
     * @private
     */
    _errors: [],

    /**
     * バリデートを通過したかどうかを返す
     *
     * @return {Boolean} バリデータが通過したならばtrueそれ以外はfalseを返す
     */
    isValid: function () {
        return ! this.hasErrors();
    },

    /**
     * エラーが存在するかどうかを返す
     *
     * @return {Boolean} エラーがあったらtrueそれ以外はfalseを返す
     */
    hasErrors: function () {
        return !!this._errors.length;
    },

    /**
     * 指定したメソッドのエラーがあるかどうかを返す
     *
     * @param {String} name エラーがあったかどうかを調べるメソッド名
     * @return {Boolean} エラーがあったらtrueそれ以外はfalseを返す
     */
    hasError: function (name) {
        return Jeeel.Type.inArray(name, this._errors);
    },
    
    /**
     * エラーリストを取得する
     * 
     * @return {String[]} エラーの出たメソッド名のリスト
     */
    getErrors: function () {
        return this._errors;
    },

    /**
     * 最初のエラーを返す
     *
     * @return {String} エラーが起こったメソッド名
     * @throws {Error} エラーがそもそも存在しない場合に発生する
     */
    getFirstError: function () {
        if ( ! this.hasErrors()) {
            throw new Error('エラーが存在しません。');
        }

        return this._errors[0];
    },

    /**
     * 値が文字列で英数字のみで構成されているかどうかを調べる
     * 
     * @return {Jeeel.Validator.Helper} 自身のインスタンス
     */
    alnum: function () {
        if ( ! Jeeel.Type.isString(this._value)) {
            return false;
        }

        return (this._value.match(/^[0-9a-zA-Z]*$/) ? true : false);
    },

    /**
     * 値が文字列でアルファベットのみで構成されているかどうかを調べる
     *
     * @return {Jeeel.Validator.Helper} 自身のインスタンス
     */
    alpha: function () {
        if ( ! Jeeel.Type.isString(this._value)) {
            return false;
        }

        return (this._value.match(/^[a-zA-Z]*$/) ? true : false);
    },

    /**
     * 値がminからmaxまでの整数値(文字列整数値でも可)であるかどうかを調べる
     *
     * @param {Integer} min 最小値
     * @param {Integer} max 最大値
     * @return {Jeeel.Validator.Helper} 自身のインスタンス
     */
    between: function (min, max) {
        if ( ! Jeeel.Type.isDigit(this._value)) {
            return false;
        }

        var digit = +this._value;

        return (min <= digit && digit <= max);
    },

    /**
     * 値が整数値か整数文字列かどうかを調べる
     *
     * @return {Jeeel.Validator.Helper} 自身のインスタンス
     */
    digits: function () {
        return Jeeel.Type.isDigit(this._value);
    },

    /**
     * 値が文字列でメール形式であるかどうかを調べる
     *
     * @return {Jeeel.Validator.Helper} 自身のインスタンス
     */
    email: function () {
        if ( ! Jeeel.Type.isString(this._value)) {
            return false;
        }

        return (this._value.match(/^[_a-zA-Z0-9-]+([\.\+_a-zA-Z0-9-]+)*@[a-zA-Z0-9]([_a-zA-Z0-9-])*(\.[_a-zA-Z0-9-]+)*(\.[_a-zA-Z0-9-]{2,})+$/i) ? true : false);
    },

    /**
     * 値が文字列で郵便番号形式であるかどうかを調べる
     *
     * @return {Jeeel.Validator.Helper} 自身のインスタンス
     */
    zipcode: function () {
        if ( ! Jeeel.Type.isString(this._value)) {
            return false;
        }

        return (this._value.match(/^[0-9]{3}-?[0-9]{4}$/) ? true : false);
    },

    /**
     * 値が空(null, undefined, 空文字)でないかどうかを調べる
     *
     * @return {Jeeel.Validator.Helper} 自身のインスタンス
     */
    notEmpty: function () {
        return !(Jeeel.Type.isEmpty(this._value) || this._value === '');
    },

    /**
     * 値がmin文字からmax文字までの文字数であるかどうかを調べる
     *
     * @param {Integer} min 最小値
     * @param {Integer} max 最大値
     * @return {Jeeel.Validator.Helper} 自身のインスタンス
     */
    length: function (min, max) {

        if ( ! Jeeel.Type.isString(this._value)) {
            return false;
        }

        var length = this._value.length;

        return (min <= length && length <= max);
    }
};
