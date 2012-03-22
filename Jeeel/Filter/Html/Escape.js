
/**
 * コンストラクタ
 *
 * @class HTML内で使用できない文字を特殊文字にエスケープするフィルター
 * @augments Jeeel.Filter.Abstract
 * @param {Boolean} [replaceSpaceAndLineFeed] 改行とスペースを置き換えるかどうか(デフォルトは置き換えない)
 */
Jeeel.Filter.Html.Escape = function (replaceSpaceAndLineFeed) {
    Jeeel.Filter.Abstract.call(this);
    
    this._replaceSpaceAndLineFeed = !!replaceSpaceAndLineFeed;
};

/**
 * インスタンスの作成を行う
 *
 * @param {Boolean} [replaceSpaceAndLineFeed] 改行とスペースを置き換えるかどうか(デフォルトは置き換えない)
 * @return {Jeeel.Filter.Html.Escape} 作成したインスタンス
 */
Jeeel.Filter.Html.Escape.create = function (replaceSpaceAndLineFeed) {
    return new this(replaceSpaceAndLineFeed);
};

Jeeel.Filter.Html.Escape.prototype = {
  
    /**
     * 改行とスペースを置き換えるかどうか
     * 
     * @type Boolean
     * @private
     */
    _replaceSpaceAndLineFeed: false,
    
    _filter: function (val) {
        val = '' + val;

        val = val.replace(/&/g, '&amp;')
                 .replace(/"/g, '&quot;')
                 .replace(/</g, '&lt;')
                 .replace(/>/g, '&gt;');

        if (this._replaceSpaceAndLineFeed) {
            val = val.replace(/ /g, '&nbsp;')
                     .replace(/\n/g, '<br />');
        }

        return val;
    }
};

Jeeel.Class.extend(Jeeel.Filter.Html.Escape, Jeeel.Filter.Abstract);
