
/**
 * コンストラクタ
 * 
 * @class 検証エラーを管理するクラス
 * @param {Jeeel.Parameter.Field} field 対象フィールド
 * @param {Mixed} value フィールド値
 * @param {String} validationName バリデートメソッド名
 * @param {Array} [args] バリデートメソッドの引数リストリスト
 */
Jeeel.Parameter.Validator.Error = function (field, value, validationName, args) {
    this._field = field;
    this._value = value;
    this._validationName = ('' + validationName).replace(/^_?validate/, '');
    this._args = args || [];
};

Jeeel.Parameter.Validator.Error.prototype = {
    _field: null,
    _value: null,
    _validationName: '',
    _args: [],
    _msg: '',
    
    /**
     * フィールドを取得する
     * 
     * @return {Jeeel.Parameter.Field} フィールド
     */
    getValidationField: function() {
        return this._field;
    },

    /**
     * バリデートで引っ掛かったバリデーション名を取得する
     * 
     * @return {String} バリデーション名
     */
    getValidationName: function () {
        return this._validationName;
    },
    
    /**
     * バリデートで引っ掛かったバリデート対象の値を取得する
     * 
     * @return {Mixed} バリデート対象値
     */
    getValidationValue: function () {
        return this._value;
    },
    
    /**
     * バリデーションを通した際に渡した引数を取得する
     * 
     * @return {Array} 引数リスト
     */
    getValidationArgs: function () {
        return this._args;
    },
    
    /**
     * 現在の内部情報からエラーメッセージを取得する
     * 
     * @return {String} エラーメッセージ
     */
    getMessage: function () {
        var path = 'Parameter.Validator';
        var res;
        
        if (Jeeel.Language.hasLanguage(path)) {
            var language = Jeeel.Language.getLanguage(path);

            var vName = Jeeel.String.toHyphenation(this._validationName).replace(/^-/, '');
            
            if (language[vName]) {
                res = language[vName];
            } else {
                res = this._msg;
            }
        } else {
            res = this._msg;
        }

        res = res.replace(':label', this._field.getLabel());
        res = res.replace(':param:0', this._value);
        
        for (var i = this._args.length; i--;) {
            res = res.replace(':param:' + (i + 1), this._args[i]);
        }
        
        return res;
    },
    
    /**
     * エラーメッセージを設定する
     * 
     * @param {String} msg エラーメッセージ
     * @return {Jeeel.Parameter.Validator.Error} 自インスタンス
     */
    setMessage: function (msg) {
        this._msg = msg;
        
        return this;
    },
    
    /**
     * 文字列に変換する
     * 
     * @return string エラーメッセージ
     */
    toString: function () {
        return this.getMessage();
    }
};

if (Jeeel._auto) {
    Jeeel._tmp();
}
