
/**
 * コンストラクタ
 *
 * @class セレクタのデータ集合を示すクラス
 * @param {String} css 基の条件となるCSSセレクタ(,の区切りが入っていてはならず、スペースが二つ以上や改行等も不可)
 * @param {String} [narrowType] 絞り込みタイプ
 */
Jeeel.Dom.Selector.Data = function (css, narrowType) {

    var self = this;

    self.css = css;

    if (narrowType) {
        self.narrow = narrowType;
    }

    //self._analyze();
};

Jeeel.Dom.Selector.Data.prototype = {

    /**
     * CSSセレクタ
     *
     * @type String
     */
    css: '',

    /**
     * ID
     *
     * @type String
     */
    id: null,

    /**
     * Class
     *
     * @type String[]
     */
    classNames: null,
    
    /**
     * 属性
     * 
     * @type Array
     */
    attributes: null,

    /**
     * Tag
     *
     * @type String
     */
    tag: null,

    /**
     * 子孫要素( )
     *
     * @type Jeeel.Dom.Selector.Data
     */
    descendant: null,
    
    /**
     * 親要素(&gt;)
     * 
     * @type Jeeel.Dom.Selector.Data
     */
    parent: null,

    /**
     * 子要素(&gt;)
     *
     * @type Jeeel.Dom.Selector.Data
     */
    child: null,

    /**
     * 前要素(+)
     *
     * @type Jeeel.Dom.Selector.Data
     */
    prev: null,

    /**
     * 次要素(+)
     *
     * @type Jeeel.Dom.Selector.Data
     */
    next: null,

    /**
     * 絞り込みのタイプ
     *
     * @type String
     */
    narrow: null,

    /**
     * 階層型のデータ構造をリスト上にして返す
     *
     * @return {Jeeel.Dom.Selector.Data[]} データリスト()
     */
    getDataList: function () {
        var res = [];
        res[res.length] = this;

        if (this.child) {
            res = res.concat(this.child.getDataList());
        }

        if (this.next) {
            res = res.concat(this.next.getDataList());
        }

        if (this.descendant) {
            res = res.concat(this.descendant.getDataList());
        }

        return res;
    },

    /**
     * 指定したElementをルートをして検索する
     *
     * @param {Element} element ルートElement
     * @return {Element[]} 検索結果
     */
    search: function (element) {
        var match = this.match(element);

        if (this.parent) {
            return (match ? [element] : []);
        }

        if (match && this.child) {
            return this.child.searchChildren(element);
        }

        if (match && ! this.descendant) {
            return [element];
        }

        var hitList  = [];

        var _search = Jeeel.Function.create(function (target) {
            if (this.match(target)) {
                hitList[hitList.length] = target;
            }
            
            for (var i = 0, l = target.children.length; i < l; i++) {
                _search(target.children[i]);
            }
        }).bind(this);
        
        _search(element);

        var res = [];

        if (this.descendant) {
            for (var i = 0, l = hitList.length; i < l; i++) {
                res = res.concat(this.descendant.searchChildren(hitList[i]));
            }
        } else {
            res = hitList;
        }

        return res;
    },

    searchChildren: function (element) {
        var res = [];

        for (var i = 0, l = element.children.length; i < l; i++) {
            res = res.concat(this.search(element.children[i]));
        }

        return res;
    },

    match: function (element) {
        if (this.tag && this.tag !== '*' && (element.tagName.toLowerCase() !== this.tag)) {
            return false;
        }

        if (this.id && (element.id.toLowerCase() != this.id)) {
            return false;
        }


        if (this.classNames) {
            for (var i = 0, l = this.classNames.length; i < l; i++) {
                if ( ! element.className.match(new RegExp('(^| )' + this.classNames[i] + '( |$)'))) {
                    return false;
                }
            }
        }

        if (this.child && ! this.child._childrenMatch(element)) {
            return false;
        }

        if (this.next && ! this.next.match(element.nextSibling)) {
            return false;
        }

        return true;
    },

    _childrenMatch: function (element) {
        var match = false;

        for (var i = 0, l = element.children.length; i < l; i++) {
            if (this.match(element.children[i])) {
                match = true;
            }
        }

        return match;
    },
    
    /**
     * CSSセレクタの解析を行う
     *
     * @private
     */
    _analyze: function () {
        var list = ['.', '#'];
        var css = this.css.split(/>|\+| /, 1)[0];
        var cssBase = css;

        while(css.charAt(0)) {
            var index = css.length, tmp;

            for (var i = 0, l = list.length; i < l; i++) {
                tmp = css.indexOf(list[i], 1);

                if (tmp >= 0 && index > tmp) {
                    index = tmp;
                }
            }

            var cssCol = css.substr(0, index);

            if (cssCol.length <= 0) {
                break;
            }

            this._setData(cssCol);

            css = css.substr(index, css.length);
        }

        var childIndex = this.css.search(/(>|\+| )/) + 1;

        if (childIndex > 0) {
            var reg = new RegExp('^' + cssBase + '(>|\\+| )');
            var narrow = this.css.match(reg)[1];
            var cssNarrow = this.css.replace(reg, '');

            this._setNarrowData(cssNarrow, narrow);
        }
    },

    /**
     * 次の絞り込みデータをセットする
     */
    _setNarrowData: function (css, narrow) {
        if ( ! css) {
            return;
        }

        var data = new Jeeel.Dom.Selector.Data(css, narrow);

        if (narrow == '+') {
            data.prev = this;
            this.next = data;
        } else if (narrow == '>') {
            data.parent = this;
            this.child  = data;
        } else {
            this.descendant = data;
        }
    },

    /**
     * CSSの一つのデータをセットする(タグ・CLASS・IDのいずれかを示すCSSセレクタ)
     *
     * @param {String} cssCol CSSセレクタの最小単位
     * @private
     */
    _setData: function (cssCol) {
        var prefix = cssCol.charAt(0);
        var base = cssCol.replace(/^(\.|#)/, '');

        if ( ! base) {
            throw new SyntaxError('構文エラー');
        }

        switch (prefix) {
            case '.':
              if ( ! this.classNames) {
                  this.classNames = [];
              }
              
              this.classNames[this.classNames.length] = base;
              break;

            case '#':
              this.id = base;
              break;

            default:
              this.tag = base;
              break;
        }
    }
};
