
/**
 * コンストラクタ
 *
 * @class HTML内の特殊文字にを元に戻すフィルター(全てを全て置き換える訳ではない)
 * @augments Jeeel.Filter.Abstract
 * @param {Boolean} [replaceSpaceAndLineFeed] 改行とスペースを置き換えるかどうか(デフォルトは置き換えない)
 */
Jeeel.Filter.Html.Unescape = function (replaceSpaceAndLineFeed) {

    Jeeel.Filter.Abstract.call(this);
    
    this._replaceSpaceAndLineFeed = !!replaceSpaceAndLineFeed;
};

/**
 * インスタンスの作成を行う
 *
 * @param {Boolean} [replaceSpaceAndLineFeed] 改行とスペースを置き換えるかどうか(デフォルトは置き換えない)
 * @return {Jeeel.Filter.Html.Unescape} 作成したインスタンス
 */
Jeeel.Filter.Html.Unescape.create = function (replaceSpaceAndLineFeed) {
    return new this(replaceSpaceAndLineFeed);
};

Jeeel.Filter.Html.Unescape.prototype = {

    /**
     * 改行とスペースを置き換えるかどうか
     * 
     * @type Boolean
     * @private
     */
    _replaceSpaceAndLineFeed: false,
  
    _filter: function (val) {
        val = '' + val;

        val = val.replace(/&amp;|&#38;|&#x26;/g, '&')
                 .replace(/&quot;|&#34;|&#x22;/g, '"')
                 .replace(/&lt;|&#60;|&#x3C;/g, '<')
                 .replace(/&gt;|&#62;|&#x3E;/g, '>');

        if (this._replaceSpaceAndLineFeed) {
            val = val.replace(/&nbsp;|&#160;|&#xA0;/g, ' ')
                     .replace(/<br *(\/)?>/g, '\n');
        }

        return val;
    }
};

Jeeel.Class.extend(Jeeel.Filter.Html.Unescape, Jeeel.Filter.Abstract);
