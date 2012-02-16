Jeeel.directory.Jeeel.Number = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel + 'Number/';
    }
};

/**
 * コンストラクタ
 * 
 * @class 数値の複雑な処理をするクラス
 * @param {Number} [number] 基となる数値
 */
Jeeel.Number = function (number) {
    
    if ( ! Jeeel.Type.isSet(number)) {
        number = 0;
    }
    
    this._num = +number;
};

/**
 * インスタンスの作成を行う
 * 
 * @param {Number} [number] 基となる数値
 * @return {Jeeel.Number} 作成したインスタンス
 */
Jeeel.Number.create = function (number) {
    return new this(number);
};

Jeeel.Number.prototype = {
  
    /**
     * 元の数値
     * 
     * @type Number
     * @private
     */
    _num: 0,
    
    /**
     * 数値を絶対値にする
     * 
     * @return {Jeeel.Number} 自インスタンス
     */
    abs: function () {
        this._num =  (this._num > 0 ? this._num : -this._num);
        
        return this;
    },
    
    /**
     * 数値を切り上げる
     * 
     * @return {Jeeel.Number} 自インスタンス
     */
    ceil: function () {
        this._num = Math.ceil(this._num);
        
        return this;
    },
    
    /**
     * 数値を切り下げる
     * 
     * @return {Jeeel.Number} 自インスタンス
     */
    floor: function () {
        this._num = Math.floor(this._num);
        
        return this;
    },
    
    /**
     * 数値を四捨五入する
     * 
     * @return {Jeeel.Number} 自インスタンス
     */
    round: function () {
        this._num = Math.round(this._num);
        
        return this;
    },
    
    /**
     * 数値を指定範囲に収める
     * 
     * @return {Jeeel.Number} 自インスタンス
     */
    limit: function (min, max) {
        this._num = this.constructor.limit(this._num, min, max);
        
        return this;
    },
    
    /**
     * 数値を千単位でグループ化してフォーマットする
     * 
     * @param {String} [separator] 千単位を区切る文字列(デフォルトは , )
     * @param {String} [prefix] 接頭辞
     * @param {String} [suffix] 接尾辞
     * @return {String} フォーマット後の文字列
     */
    toFormatted: function (separator, prefix, suffix) {
        return this.constructor.format(this._num, separator, prefix, suffix);
    },
    
    /**
     * 数値を百分率表記に変換する
     * 
     * @return {String} 百分率表記の文字列
     */
    toPercentage: function () {
        return this.constructor.percentage(this._num);
    },
    
    /**
     * インスタンスを文字列に変換する
     * 
     * @param {Integer} [radix] 進数を指定する場合に指定
     * @return {String} 文字列
     */
    toString: function (radix) {
        return (radix ? this._num.toString(radix) : this._num.toString());
    },
    
    /**
     * インスタンスを数値に変換する
     * 
     * @return {Number} 数値
     */
    valueOf: function () {
        return this._num;
    },
    
    /**
     * コンストラクタ
     * 
     * @param {Number} [number] 基となる数値
     * @constructor
     */
    constructor: Jeeel.Number
};

Jeeel.file.Jeeel.Number = ['Limit', 'Format', 'Percentage', 'GetSum', 'GetAvg', 'GetGcd', 'GetLcm'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Number, Jeeel.file.Jeeel.Number);
