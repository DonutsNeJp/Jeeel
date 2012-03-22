
/**
 * コンストラクタ
 *
 * @class 正規表現に使用するメタ文字をエスケープするフィルター
 * @augments Jeeel.Filter.Abstract
 */
Jeeel.Filter.String.RegularExpressionEscape = function () {
    Jeeel.Filter.Abstract.call(this);
};

/**
 * インスタンスの作成
 *
 * @return {Jeeel.Filter.String.RegularExpressionEscape} 作成したインスタンス
 */
Jeeel.Filter.String.RegularExpressionEscape.create = function () {
    return new this();
};

Jeeel.Filter.String.RegularExpressionEscape.prototype = {
  
    /**
     * エスケープ対象の正規表現
     * 
     * @type RegExp
     * @private
     */
    _reg: /([\/()\[\]{}|*+-.,\^$?\\])/g,
    
    /**
     * @private
     */
    _filter: function (val) {
        return ('' + val).replace(this._reg, '\\$1');
    }
};

Jeeel.Class.extend(Jeeel.Filter.String.RegularExpressionEscape, Jeeel.Filter.Abstract);
