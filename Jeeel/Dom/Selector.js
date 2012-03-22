Jeeel.directory.Jeeel.Dom.Selector = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Dom + 'Selector/';
    }
};

/**
 * コンストラクタ
 *
 * @class セレクタを扱うクラス
 * @param {String} selector CSSセレクタ
 * @param {Document} [doc] 検索階層のDocument
 */
Jeeel.Dom.Selector = function (selector, doc) {

    if ( ! doc) {
        doc = Jeeel._doc;
    }

    this._selector = selector.replace(/(^ +|\r\n|\n| +$)/g, ' ')
                             .replace(/ *, */, ',')
                             .replace(/ *> */, '>')
                             .replace(/ *\+ */, '+')
                             .replace(/ +/, ' ');
    this._document = doc;
    
    this._analyze();
};

/**
 * インスタンスの作成を行う
 *
 * @param {String} selector CSSセレクタ
 * @param {Document} [doc] 検索階層のDocument
 * @return {Jeeel.Dom.Selector} 作成したインスタンス
 * @ignore 未完
 */
Jeeel.Dom.Selector.create = function (selector, doc) {
    return new this(selector, doc);
};

Jeeel.Dom.Selector.prototype = {

    /**
     * CSSセレクタ
     *
     * @type String
     * @private
     */
    _selector: '',

    /**
     * CSSセレクタの対象別リスト
     *
     * @type Jeeel.Dom.Selector.Data[]
     * @private
     */
    _selectorDataList: [],

    /**
     * 対象Document
     *
     * @type Document
     * @private
     */
    _document: null,

    /**
     * セレクタの情報からElementのリストを得る
     *
     * @return {Element[]} Elementリスト
     */
    getElements: function () {
        var result = [];
        var idx, len = this._selectorDataList.length;

        var _search = Jeeel.Function.create(function (target) {

            var tmp = this._selectorDataList[idx].search(target);

            result = result.concat(tmp);
        }).bind(this);

        for (idx = 0; idx < len; idx++) {
            _search(this._document.documentElement);
        }

        return result;
    },

    /**
     * CSSセレクタから対象となるDataのリストを作成する
     *
     * @private
     */
    _analyze: function () {
        this._selectorDataList = [];
        var css = this._selector.split(',');

        for (var i = 0, l = css.length; i < l; i++) {
            this._selectorDataList[i] = new Jeeel.Dom.Selector.Data(css[i]);
        }
    }
};

Jeeel.file.Jeeel.Dom.Selector = ['Searcher', 'Matcher', 'Data'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Dom.Selector, Jeeel.file.Jeeel.Dom.Selector);
