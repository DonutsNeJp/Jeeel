
/**
 * コンストラクタ
 *
 * @class 正規表現に使用するメタ文字をエスケープするフィルター
 * @augments Jeeel.Filter.Abstract
 */
Jeeel.Filter.RegularExpressionEscape = function () {
    Jeeel.Filter.Abstract.call(this);
};

/**
 * インスタンスの作成
 *
 * @return {Jeeel.Filter.RegularExpressionEscape} 作成したインスタンス
 */
Jeeel.Filter.RegularExpressionEscape.create = function () {
    return new this();
};

Jeeel.Filter.RegularExpressionEscape.prototype = {
  
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

Jeeel.Class.extend(Jeeel.Filter.RegularExpressionEscape, Jeeel.Filter.Abstract);
