
/**
 * コンストラクタ
 *
 * @class 対象の要素に対して文字列として扱い文字列置換を行うフィルター
 * @augments Jeeel.Filter.Abstract
 * @param {String} separator 区切り文字
 * @param {Integer} [limit] 配列の要素数の制限をする場合に指定
 * @throws {Error} separatorが文字列ではない場合に投げられる
 */
Jeeel.Filter.Split = function (separator, limit) {
    Jeeel.Filter.Abstract.call(this);

    if ( ! Jeeel.Type.isString(separator)) {
        throw new Error('separatorが文字列ではありません。');
    }

    this._separator = separator;
    this._limit = limit;
};

/**
 * インスタンスの作成
 *
 * @param {String} separator 区切り文字
 * @param {Integer} [limit] 配列の要素数の制限をする場合に指定
 * @return {Jeeel.Filter.Split} 作成したインスタンス
 */
Jeeel.Filter.Split.create = function (separator, limit) {
    return new this(separator, limit);
};

Jeeel.Filter.Split.prototype = {
  
    /**
     * 区切り文字
     * 
     * @type String
     * @private
     */
    _separator: '',
    
    /**
     * 配列の要素数の制限
     * 
     * @type Integer
     * @private
     */
    _limit: -1,
    
    /**
     * @private
     */
    _filter: function (val) {
        val = '' + val;

        return val.split(this._separator, this._limit);
    }
};

Jeeel.Class.extend(Jeeel.Filter.Split, Jeeel.Filter.Abstract);
