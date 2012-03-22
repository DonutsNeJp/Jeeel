
/**
 * コンストラクタ
 *
 * @class evalの遅延実行を可能にするクラス
 * @param {String} script 実行するスクリプト
 * @throws {Error} scriptが文字列でない場合に起こる
 * @deprecated 今後削除される可能性あり
 */
Jeeel.Evaluator = function (script) {

    if ( ! Jeeel.Type.isString(script)) {
        throw new Error('実行スクリプトは必ず指定しなければなりません。');
    }

    /**
     * evalで解析するスクリプト文字列
     * 
     * @type String
     * @private
     */
    this._script = script;

    /**
     * 実行する際に必要な変数名と値のペアリスト
     * 
     * @type Hash
     * @private
     */
    this._params = {};
};

/**
 * インスタンスの作成
 *
 * @param {String} script 実行するスクリプト
 * @return {Jeeel.Evaluator} 作成したインスタンス
 */
Jeeel.Evaluator.create = function (script) {
    return new this(script);
};

/**
 * メソッドを呼び出せるようにした文字列を作成する
 *
 * @param {String} methodName メソッド名(window.setTimeout等でもよい)
 * @param {String[]|Primitive[]} params メソッドに渡す変数名(もしくは文字列以外の基本型)のリスト
 * @return {String} eval出来る形に形成した文字列
 */
Jeeel.Evaluator.createScriptMethod = function (methodName, params) {
    return methodName + '(' + params.join(', ') + ')';
};

Jeeel.Evaluator.prototype = {

    /**
     * evalする際に使用する変数をセットする
     *
     * @param {String} key 変数名
     * @param {Mixed} value 変数の値
     * @return {Jeeel.Evaluator} 自インスタンス
     */
    assign: function (key, value) {
        this._params[key] = Jeeel.Method.clone(value);

        return this;
    },

    /**
     * 指定した連想配列のキーを変数名として全てassignする
     *
     * @param {Hash} values 変数名と変数値のペアリスト
     * @return {Jeeel.Evaluator} 自インスタンス
     */
    assignAll: function (values) {
        if ( ! Jeeel.Type.isHash(values)) {
            throw new Error('valuesは必ず配列式でなければなりません。');
        }

        for (var key in values) {
            this.assign(key, values[key]);
        }

        return this;
    },

    /**
     * セットされた変数の値を破棄する
     *
     * @param {String} key 変数名
     * @return {Jeeel.Evaluator} 自インスタンス
     */
    clearAssign: function (key) {
        delete this._params[key];

        return this;
    },

    /**
     * セットされた変数の値をすべて破棄する
     *
     * @return {Jeeel.Evaluator} 自インスタンス
     */
    clearAssignAll: function () {
        this._params = {};

        return this;
    },

    /**
     * 実際にevalを実行する
     *
     * @return {Mixed} 実行結果
     */
    eval: function () {
        var $$__params = this._params;

        for (var key in $$__params) {

            eval('var '+key+' = $$__params[key];');
        }
        
        var $$__self = this;

        return (function () {
            return eval($$__self._script);
        })();
    }
};
