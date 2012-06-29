
/**
 * コンストラクタ
 * 
 * @class フィールドを扱うクラス
 * @param {Jeeel.Parameter} parameter パラメータ
 * @param {String} name フィールド名
 * @param {String} [label] ラベル
 * @param {Array} [validateRules] バリデートルール
 * @param {Array} [filterRules] フィルタルール
 */
Jeeel.Parameter.Field = function (parameter, name, label, validateRules, filterRules) {
    this._parameter = parameter;
    this._name = name;
    this._label = label || '';
    this._validateRules = validateRules || [];
    this._filterRules = filterRules || [];
};

Jeeel.Parameter.Field.prototype = {
    
    _parameter: null,
    _name: '',
    _label: '',
    _value: null,
    _validateRules: [],
    _filterRules: [],
    
    /**
     * パラメータを取得する
     * 
     * @return {Jeeel.Parameter} パラメータ
     */
    getParameter: function () {
        return this._parameter;
    },

    /**
     * フィールド名を取得する
     * 
     * @return {String} フィールド名
     */
    getName: function () {
        return this._name;
    },
    
    /**
     * フィールドのラベルを取得する
     * 
     * @return {String} ラベル値
     */
    getLabel: function () {
        return this._label;
    },
    
    /**
     * フィールドの値を取得する
     * 
     * @return {Mixed} フィールド値
     */
    getValue: function () {
        return this._value;
    },
    
    /**
     * フィールドの値を設定する
     * 
     * @param {Mixed} value フィールド値
     * @return {Jeeel.Parameter.Field} 自インスタンス
     */
    setValue: function (value) {
        this._value = value;
        
        return this;
    },
    
    /**
     * バリデートルールのリストを取得する
     * 
     * @return {Array} バリデートルールリスト
     */
    getValidateRules: function () {
        return this._validateRules;
    },
    
    /**
     * フィルタのルールのリストを取得する
     * 
     * @return {Array} フィルタルールリスト
     */
    getFilterRules: function () {
        return this._filterRules;
    }
};
