Jeeel.directory.Jeeel.Dom.Element = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Dom + 'Element/';
    }
};

/**
 * コンストラクタ
 *
 * @class Elementをラップして操作系を強化するクラス
 * @param {Element} element 対象Element
 */
Jeeel.Dom.Element = function (element) {
    this._element = element;
    this._style = new Jeeel.Dom.Style(element);
    this._doc = new Jeeel.Dom.Document(element && element.ownerDocument || Jeeel._doc);
};

/**
 * インスタンスを作成する
 *
 * @param {Element} element 対象Element
 * @return {Jeeel.Dom.Element} 作成したインスタンス
 */
Jeeel.Dom.Element.create = function (element) {
    return new this(element);
};

/**
 * 指定したElementと任意のElementを交換する
 *
 * @param {Element} element 指定Element
 * @param {Element} replaceElement 交換Element
 * @return {Element} 挿入されていない方のElement
 */
Jeeel.Dom.Element.replace = function (element, replaceElement) {
    if ( ! element || ! element.parentNode || ! replaceElement) {
        return replaceElement;
    }

    var parent = element.parentNode;
    parent.replaceChild(replaceElement, element);
    return element;
};

Jeeel.Dom.Element.prototype = {

    /**
     * 基となるElement(この操作モジュールを保持するElement)
     *
     * @type Element
     * @private
     */
    _element: null,
    
    /**
     * 操作Document
     * 
     * @type Jeeel.Dom.Document
     * @private
     */
    _doc: null,
    
    /**
     * ElementのStyleラッパー
     * 
     * @type Jeeel.Dom.Style
     * @private
     */
    _style: null,

    /**
     * 基となるElementを取得する
     *
     * @return {Element} 取得したElement
     */
    getElement: function () {
        return this._element;
    },
    
    /**
     * このElementを所有しているDocumentを取得する
     * 
     * @return {Document} Document
     */
    getOwnerDocument: function () {
        return this._element.ownerDocument;
    },
    
    /**
     * このElementを所有しているWindowを取得する
     * 
     * @return {Window} Window
     */
    getOwnerWindow: function () {
        var dc = this.getOwnerDocument();
        return dc.defaultView || dc.parentWindow;
    },

    /**
     * このElement内から指定IDのHTML要素を取得する
     *
     * @param {String} id 検索ID
     * @return {Element} 取得したElement
     */
    getElementById: function (id) {},

    /**
     * このElement内から指定ClassのHTML要素を取得する
     *
     * @param {String} className 検索Class
     * @return {Element[]} 取得したElement配列
     */
    getElementsByClassName: function (className) {},

    /**
     * このElement内から指定NameのHTML要素を取得する
     * なおsubmitSearchを指定すると<br />
     * この動作は一部本来のgetElementsByNameと違い、<br />
     * c[]等で配列指定した値に対してもヒットする
     *
     * @param {String} name 検索Name
     * @param {Boolean} [submitSearch=false] 送信時と同じようにc[]等の配列指定をヒットさせるかどうか
     * @return {Element[]} 取得したElement配列
     */
    getElementsByName: function (name, submitSearch) {},

    /**
     * このElement内から指定TagのHTML要素を取得する
     *
     * @param {String} tagName 検索Tag
     * @return {Element[]} 取得したElement配列
     */
    getElementsByTagName: function (tagName) {},

    /**
     * このElement内から指定属性が指定値のHTML要素を取得する
     *
     * @param {String} attribute 属性名
     * @param {String} value 属性値('*'を指定すると任意の値の意味になる)
     * @return {Element[]} 取得したElement配列
     */
    getElementsByAttribute: function (attribute, value) {},

    /**
     * このElement内から指定プロパティが指定値のHTML要素を取得する<br />
     * Elementのプロパティである事に注意
     *
     * @param {String} property プロパティ名
     * @param {Mixied} value プロパティ値('*'を指定すると任意の値の意味になる)
     * @return {Element[]} 取得したElement配列
     */
    getElementsByProperty: function (property, value) {},
    
    /**
     * このElement内部に絞り込みを掛ける<br />
     * 現在のHTML内に存在しない要素は取れない
     *
     * @param {String} selector CSSと同じ絞り込みセレクタ
     * @return {Element[]} 絞り込んだElement配列
     */
    getElementsBySelector: function (selector) {},
    
    /**
     * このElement内のHTML要素を指定範囲検索する
     * 
     * @param {Jeeel.Object.Rect} rect 対象範囲
     * @param {Function} [option] 検索オプション(デフォルトは重なったElement)
     * @return {Element[]} 範囲検索に引っかかったElement配列
     * @see Jeeel.Dom.SearchOption
     */
    searchElementsByRange: function (rect, option) {},
    
    /**
     * このElementのIDを取得する
     *
     * @return {String} ID
     */
    getId: function () {
        return this._element.id;
    },
    
    /**
     * このElementのIDを設定する
     *
     * @param {String} id ID
     * @return {Jeeel.Dom.Element} 自インスタンス
     */
    setId: function (id) {
        this._element.id = id;
        
        return this;
    },

    /**
     * このElementのNameを取得する
     *
     * @return {String} Name
     */
    getName: function () {
        return this._element.name;
    },
    
    /**
     * このElementのNameを設定する
     *
     * @param {String} name Name
     * @return {Jeeel.Dom.Element} 自インスタンス
     */
    setName: function (name) {
        this._element.name = name;
        
        return this;
    },
    
    /**
     * このElementのTagNameを取得する
     *
     * @return {String} TagName
     */
    getTagName: function () {
        return this._element.nodeName.toLowerCase();
    },
    
    /**
     * このElement内のクラス名を全て取得する
     *
     * @return {String[]} クラス名のリスト
     */
    getClassNames: function () {},

    /**
     * クラス名を追加する
     *
     * @param {String|String[]} className クラス名もしくはクラス名リスト
     * @return {Jeeel.Dom.Element} 自インスタンス
     */
    addClassName: function (className) {},

    /**
     * クラス名の削除を行う
     *
     * @param {String|String[]} className クラス名もしくはクラス名リスト
     * @return {Jeeel.Dom.Element} 自インスタンス
     */
    removeClassName: function (className) {},

    /**
     * クラス名が存在していたら削除し、存在していなかったら追加を行う
     *
     * @param {String|String[]} className クラス名もしくはクラス名リスト
     * @return {Jeeel.Dom.Element} 自インスタンス
     */
    toggleClassName: function (className) {},

    /**
     * クラス名を消去する
     *
     * @return {Jeeel.Dom.Element} 自インスタンス
     */
    clearClassName: function () {
        this._element.className = '';

        return this;
    },

    /**
     * 指定したクラス名を保持しているかどうかを返す
     *
     * @param {String} className クラス名
     * @return {Boolean} クラス名を保持していたかどうか
     */
    hasClassName: function (className) {},

    /**
     * 属性値を取得する
     *
     * @param {String} attribute 属性名
     * @return {String} 属性値
     */
    getAttribute: function (attribute) {
        return this._element.getAttribute(attribute);
    },

    /**
     * 属性値の設定を行う
     *
     * @param {String} attribute 属性名
     * @param {String} value 属性値
     * @return {Jeeel.Dom.Element} 自インスタンス
     */
    setAttribute: function (attribute, value) {
        this._element.setAttribute(attribute, value);

        return this;
    },
    
    /**
     * 属性値が設定されているかどうかを返す
     * 
     * @param {String} attribute 属性名
     * @return {Boolean} 属性値が設定されているかどうか
     */
    hasAttribute: function (attribute) {
        return this._element.getAttribute(attribute) !== null;
    },
    
    /**
     * 属性値の削除を行う
     *
     * @param {String} attribute 属性名
     * @return {Jeeel.Dom.Element} 自インスタンス
     */
    removeAttribute: function (attribute) {
        this._element.removeAttribute(attribute);

        return this;
    },

    /**
     * プロパティを取得する
     *
     * @param {String} property プロパティ名
     * @return {Mixied} プロパティ値
     */
    getProperty: function (property) {
        return this._element[property];
    },

    /**
     * プロパティの設定を行う
     *
     * @param {String} property プロパティ名
     * @param {Mixied} value プロパティ値
     * @return {Jeeel.Dom.Element} 自インスタンス
     */
    setProperty: function (property, value) {
        this._element[property] = value;

        return this;
    },

    /**
     * スタイルを取得する
     *
     * @param {String} style スタイル名
     * @return {String} スタイル値
     */
    getStyle: function (style) {
        return this._style.getStyle(style);
    },

    /**
     * スタイルの設定を行う
     *
     * @param {String} style スタイル名
     * @param {String} value スタイル値
     * @return {Jeeel.Dom.Element} 自インスタンス
     */
    setStyle: function (style, value) {
        this._style.setStyle(style, value);

        return this;
    },
    
    /**
     * 複数のスタイルの設定を行う
     *
     * @param {Hash} styles スタイル名と値のペアリスト
     * @return {Jeeel.Dom.Element} 自インスタンス
     */
    setStyleList: function (styles) {
        this._style.setStyleList(styles);

        return this;
    },
    
    /**
     * このElementの不透明度を取得する
     * 
     * @return {Number} 不透明度(0.0～1.0)
     */
    getOpacity: function () {
        return this._style.getOpacity();
    },
    
    /**
     * このElementの不透明度を設定する
     * 
     * @param {Number} opacity 不透明度(0.0～1.0)
     * @return {Jeeel.Dom.Element} 自インスタンス
     */
    setOpacity: function (opacity) {
        this._style.setOpacity(opacity);
        
        return this;
    },
    
    /**
     * このElementの左上絶対軸座標を返す
     * 
     * @return {Jeeel.Object.Point} 左上の座標
     */
    getPosition: function () {
        var pos = new Jeeel.Object.Point(0, 0);
        var el = this._element;
        var body = this._doc.getBody();
        
        while (el) {
            pos.x += el.offsetLeft;
            pos.y += el.offsetTop;

            el = el.offsetParent;
        }
        
        el = this._element.parentNode;
        
        while (el && el !== body) {
            pos.x -= el.scrollLeft;
            pos.y -= el.scrollTop;

            el = el.parentNode;
        }
        
        return pos;
    },
    
    /**
     * このElementのサイズを取得する
     * 
     * @return {Jeeel.Object.Size} サイズ
     */
    getSize: function () {
        var elm = this._element;
        var style = elm.style;
        var clip  = elm.clip;
        
        var w = elm.offsetWidth
             || clip && clip.width
             || style && style.pixelWidth
             || 0;

        var h = elm.offsetHeight
             || clip && clip.height
             || style && style.pixelHeight
             || 0;

        return new Jeeel.Object.Size(+w, +h);
    },
    
    /**
     * このElementの左上絶対座標とサイズを併せ持った構造体を取得する
     * 
     * @return {Jeeel.Object.Rect} レクト
     */
    getRect: function () {
        return new Jeeel.Object.Rect(this.getPosition(), this.getSize());
    },
    
    /**
     * このElementのスクロール位置を取得する
     * 
     * @return {Jeeel.Object.Point} スクロール位置
     */
    getScrollPosition: function () {
        return new Jeeel.Object.Point(this._element.scrollLeft, this._element.scrollTop);
    },
    
    /**
     * このElementの親からの相対位置を取得する
     * 
     * @return {Jeeel.Object.Point} 親要素からの相対位置
     */
    getRelativePosition: function () {
        var el = this._element;
        var pos = new Jeeel.Object.Point(el.offsetLeft, el.offsetTop);
        
        var body = this._doc.getBody();
        
        el = el.parentNode;
        
        if (el && el !== body) {
            pos.x -= el.scrollLeft;
            pos.y -= el.scrollTop;
        }
        
        return pos;
    },

    /**
     * innerHtmlを取得する
     * 
     * @return {String} Html文字列
     */
    getHtml: function () {
        return this._element.innerHTML;
    },

    /**
     * innerHtmlの設定を行う
     *
     * @param {String} html Html文字列
     * @return {Jeeel.Dom.Element} 自インスタンス
     */
    setHtml: function (html) {
        this._element.innerHTML = html;

        return this;
    },

    /**
     * Textを取得する<br />
     * TextNodeを全て結合して取り出す
     *
     * @return {String} Html文字列
     */
    getText: function () {},

    /**
     * Textの設定を行う<br />
     * innerHtml内にエスケープした文字列を代入する
     *
     * @param {String} text 設定文字列
     * @return {Jeeel.Dom.Element} 自インスタンス
     */
    setText: function (text) {},
    
    /**
     * このElementの次のElementを取得する
     *
     * @param {Integer} [nextCount] いくつ次を参照するか
     * @return {Element} 取得したElement
     */
    getNextNode: function (nextCount) {
        if ( ! Jeeel.Type.isInteger(nextCount)) {
            nextCount = 1;
        } else if (nextCount < 0) {
            return null;
        }

        var children = this._element.parentNode.children;

        for (var i = 0, l = children.length - nextCount; i < l; i++) {
            if (children[i] === this._element){
                return children[i + nextCount];
            }
        }

        return null;
    },

    /**
     * このElementの前のElementを取得する
     *
     * @param {Integer} [prevCount] いくつ前を参照するか
     * @return {Element} 取得したElement
     */
    getPrevNode: function (prevCount) {
        if ( ! Jeeel.Type.isInteger(prevCount)) {
            prevCount = 1;
        } else if (prevCount < 0) {
            return null;
        }

        var children = this._element.parentNode.children;

        for (var i = prevCount, l = children.length; i < l; i++) {
            if (children[i] === this._element) {
                return children[i - prevCount];
            }
        }

        return null;
    },
    
    /**
     * このElementの親のElementを取得する
     *
     * @param {Integer} [parentCount] いくつ上階層の親を参照するか
     * @return {Element} 取得したElement
     */
    getParentNode: function (parentCount) {
        if ( ! Jeeel.Type.isInteger(parentCount)) {
            parentCount = 1;
        } else if (parentCount < 0) {
            return null;
        }
        
        var parent = this._element;

        while (parent && parentCount--) {
            parent = parent.parentNode;
        }

        return parent;
    },

    /**
     * このElementの子リストを取得する
     *
     * @return {Element[]} 取得したElementリスト
     */
    getChildren: function () {
        var children = this._element.children;
        var res = [];

        for (var i = 0, l = children.length; i < l; i++) {
            res[i] = children[i];
        }

        return res;
    },
    
    /**
     * このElementの階層の深さを返す<br />
     * documentが最上層となり数値0を返す<br />
     * なおdom上に存在しないElementについてはこの限りではない
     * 
     * @return {Integer} 階層の深さレベル
     */
    getHierarchy: function () {
        var h = 0;
        var parent = this._element.parentNode;
        
        while(parent) {
            parent = parent.parentNode;
            h++;
        }
        
        return h;
    },

    /**
     * このElementの前に追加Elementを挿入する
     *
     * @param {Element} addElement 追加Element
     * @return {Jeeel.Dom.Element} 自インスタンス
     */
    insertBefore: function (addElement) {
        this._element.parentNode.insertBefore(addElement, this._element);
        return this;
    },

    /**
     * このElementの後に追加Elementを挿入する
     *
     * @param {Element} addElement 追加Element
     * @return {Jeeel.Dom.Element} 自インスタンス
     */
    insertAfter: function (addElement) {
        var next = this.getNextNode();
        this._element.parentNode.insertBefore(addElement, next);
        return this;
    },

    /**
     * このElementの一番上に追加Elementを挿入する
     *
     * @param {Element} addElement 追加Element
     * @return {Jeeel.Dom.Element} 自インスタンス
     */
    insertTop: function (addElement) {
        var first = this._element.firstChild;

        if (first) {
            this._element.insertBefore(addElement, first);
        } else {
            this._element.appendChild(addElement);
        }
        
        return this;
    },

    /**
     * このElementの一番下に追加Elementを挿入する
     *
     * @param {Element} addElement 追加Element
     * @return {Jeeel.Dom.Element} 自インスタンス
     */
    insertBottom: function (addElement) {
        this._element.appendChild(addElement);
        return this;
    },

    /**
     * このElementの指定した子Elementの前に追加Elementを挿入する
     *
     * @param {Element} child このElement内の子Element
     * @param {Element} addElement 追加Element
     * @return {Jeeel.Dom.Element} 自インスタンス
     */
    insertChildBefore: function (child, addElement) {
        this._element.insertBefore(child, addElement);
        return this;
    },

    /**
     * このElementの指定した子Elementの後に追加Elementを挿入する
     *
     * @param {Element} child このElement内の子Element
     * @param {Element} addElement 追加Element
     * @return {Jeeel.Dom.Element} 自インスタンス
     */
    insertChildAfter: function (child, addElement) {
        var next = child.nextSibling;
        this._element.insertBefore(addElement, next);
        return this;
    },

    /**
     * このElementの指定したElementで囲う<br />
     * ただしElementをコピーされる
     *
     * @param {String|Element} wrap 囲みElement
     * @return {Jeeel.Dom.Element} 自インスタンス
     * @ignore
     */
    wrapSelf: function (wrap) {
        if (Jeeel.Type.isElement(wrap)) {
            wrap = wrap.cloneNode(true);
        } else {
            wrap = this._doc.createElementList(wrap)[0];
        }

        var parent = this._element.parentNode;

        parent.replaceChild(wrap, this._element);
        wrap.appendChild(this._element);

        return this;
    },
    
    /**
     * このElementの子リストを指定要素で囲む<br />
     * 但し、要素を渡した場合その要素はコピーされる
     * 
     * @param {String|Element} wrap 子リストを囲むHTML文字列もしくはHTML要素
     * @return {Jeeel.Dom.Element} 自インスタンス
     * @ignore
     */
    wrapInner: function (wrap) {
        if (Jeeel.Type.isElement(wrap)) {
            wrap = wrap.cloneNode(true);
        } else {
            wrap = this._doc.createElementList(wrap)[0];
        }
        
        if ( ! wrap) {
            return this;
        }
        
        var wrapOwner = wrap;
        
        while (wrap.firstChild) {
            wrap = wrap.firstChild;
        }
        
        var flag = this._doc.createDocumentFragment();
        
        while(this._element.firstChild) {
            flag.appendChild(this._element.firstChild);
        }
        
        wrap.appendChild(flag);
        
        this._element.appendChild(wrapOwner);
        
        return this;
    },

    /**
     * このElementの子供に追加する
     *
     * @param {Element|Element[]} child 追加子Element
     * @return {Jeeel.Dom.Element} 自インスタンス
     */
    appendChild: function (child) {
        if (Jeeel.Type.isArray(child)) {
            var tmp = this._doc.createDocumentFragment();
            
            for (var i = 0, l = child.length; i < l; i++) {
                tmp.appendChild(child[i]);
            }
            
            child = tmp;
        }

        this._element.appendChild(child);
        
        return this;
    },

    /**
     * このElementの子供を削除する
     *
     * @param {Element|Element[]} child 削除子Element
     * @return {Jeeel.Dom.Element} 自インスタンス
     */
    removeChild: function (child) {
        if (Jeeel.Type.isArray(child)) {
            var tmp = this._doc.createDocumentFragment();
            
            for (var i = 0, l = child.length; i < l; i++) {
                tmp.appendChild(child[i]);
            }
            
            child = tmp;
        }

        this._element.removeChild(child);

        return this;
    },
    
    /**
     * このElementの子供を全て削除する
     *
     * @return {Jeeel.Dom.Element} 自インスタンス
     */
    clearChildNodes: function () {
        var f, elm = this._element;

        while (f = elm.firstChild) {
            elm.removeChild(f);
        }

        return this;
    },

    /**
     * このElementの子リストにforeachをかける<br />
     * 但し対象は通常Nodeに限る(TextNode等は除外)<br />
     * 詳しくはJeeel.Hash.forEach参照
     *
     * @param {Function} eachMethod コールバックメソッド
     * @param {Mixied} [thisArg] thisに相当する値
     * @return {Jeeel.Dom.Element} 自インスタンス
     * @see Jeeel.Hash.forEach
     */
    each: function (eachMethod, thisArg) {
        Jeeel.Hash.forEach(this._element.children, eachMethod, thisArg);
        
        return this;
    },

    /**
     * このElementを複製する
     *
     * @param {Boolean} [isDeep] ディープコピーを行うかどうか
     * @return {Element} 複製したElement
     */
    clone: function (isDeep) {
        return this._element.cloneNode(isDeep);
    },

    /**
     * このElementを隠す
     * 
     * @return {Jeeel.Dom.Element} 自インスタンス
     */
    hide: function () {
        this._style.hide();
        
        return this;
    },

    /**
     * このElementを表示する
     * 
     * @return {Jeeel.Dom.Element} 自インスタンス
     */
    show: function () {
        this._style.show();
        
        return this;
    },
    
    /**
     * このElementの表示状態を切り替える
     * 
     * @return {Jeeel.Dom.Element} 自インスタンス
     */
    toggle: function () {
        this._style.toggle();
        
        return this;
    },
    
    /**
     * このElementを有効にする
     * 
     * @return {Jeeel.Dom.Element} 自インスタンス
     */
    enable: function () {
        this.removeAttribute('disabled');
        
        return this;
    },
    
    /**
     * このElementを無効にする
     * 
     * @return {Jeeel.Dom.Element} 自インスタンス
     */
    disable: function () {
        this.setAttribute('disabled', '1');
        
        return this;
    },
    
    /**
     * このElementを移動可能にする
     * 
     * @param {Element|Element[]} dispatchTargets このElement上でマウスを押し込むと移動を始める(デフォルトはこのElement)
     * @return {Jeeel.Dom.Element} 自インスタンス
     */
    movable: function (dispatchTargets) {},
    
    /**
     * このElementを移動不可能にする
     * 
     * @return {Jeeel.Dom.Element} 自インスタンス
     */
    immovable: function () {},
    
    /**
     * IE6のためのバグ回避を簡単に行うメソッド<br />
     * ダイアログの様なpositionを変えて、selectタグの下にもぐりこんでしまう場合に指定する
     * 
     * @param {Hash} [style] BGのiframeのスタイルをカスタムに指定するための値(基本は指定しない)
     * @return {Jeeel.Dom.Element} 自インスタンス
     */
    setBackgroundIframe: function (style) {},
    
    /**
     * このElementを指定座標に移動する
     * 
     * @param {Integer} x X座標
     * @param {Integer} y Y座標
     * @return {Jeeel.Dom.Element} 自インスタンス
     */
    shiftTo: function (x, y) {
        this._style.shiftTo(x, y);
        
        return this;
    },
    
    scroll: function (x, y) {
        this._element.scrollLeft = x;
        this._element.scrollTop = y;
        
        return this;
    },
    
    /**
     * このElementを取り除く
     *
     * @return {Jeeel.Dom.Element} 自インスタンス
     */
    remove: function () {
        if ( ! this._element.parentNode) {
            return this;
        }
        
        var parent = this._element.parentNode;
        parent.removeChild(this._element);
        
        return this;
    },

    /**
     * このElementと任意のElementを交換する
     *
     * @param {Element} replaceElement 交換Element
     * @return {Jeeel.Dom.Element} 自インスタンス
     */
    replace: function (replaceElement) {
        var parent = this._element.parentNode;
        parent.replaceChild(replaceElement, this._element);
        return this;
    },

    /**
     * このElementを上に移動する
     *
     * @param {Integer} [upCount] 上に動かす距離
     * @return {Jeeel.Dom.Element} 自インスタンス
     */
    up: function (upCount) {
        var prev = this.getPrevNode(upCount);

        if (prev) {
            this._element.parentNode.insertBefore(this._element, prev);
        }
        
        return this;
    },

    /**
     * このElementを下に移動する
     *
     * @param {Integer} [downCount] 下に動かす距離
     * @return {Jeeel.Dom.Element} 自インスタンス
     */
    down: function (downCount) {
        if (Jeeel.Type.isInteger(downCount)) {
            downCount++;
        } else {
            downCount = 2;
        }

        var next = this.getNextNode(downCount);
        
        this._element.parentNode.insertBefore(this._element, next);
        
        return this;
    },

    /**
     * このElementとDom上のEleentの位置を入れ替える<br />
     * replaceメソッドはDom上のElementとDom外のElementの交換
     *
     * @param {Element} swapElement 交換対象のElement(同じDom上にあり階層関係に不一致がないことが条件)
     * @return {Jeeel.Dom.Element} 自インスタンス
     */
    swap: function (swapElement) {
        var thisParent = this._element.parentNode;
        var swapParent = swapElement.parentNode;
        var thisNext = this.getNextNode();
        var swapNext = Jeeel.Dom.Element.create(swapElement).getNextNode();

        if (thisParent) {
            thisParent.insertBefore(swapElement, thisNext);
        }

        if (swapParent) {
            swapParent.insertBefore(this._element, swapNext);
        }
        
        return this;
    },

    /**
     * このElementを一番上に移動する
     * 
     * @return {Jeeel.Dom.Element} 自インスタンス
     */
    upTop: function () {
        var first = this._element.parentNode.firstChild;

        this._element.parentNode.insertBefore(this._element, first);
        
        return this;
    },

    /**
     * このElementを一番下に移動する
     * 
     * @return {Jeeel.Dom.Element} 自インスタンス
     */
    downBottom: function () {
        this._element.parentNode.insertBefore(this._element, null);
        
        return this;
    },

    /**
     * このElementにイベントを追加する<br />
     * 引数はJeeel.Dom.Event, このElementになる
     *
     * @param {String} type イベントタイプ
     * @param {Function} listener 登録イベントメソッド
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.Dom.Element} 自インスタンス
     */
    addEventListener: function (type, listener, thisArg) {
        if ( ! Jeeel.Type.isSet(thisArg)) {
            thisArg = this;
        }
        
        Jeeel.Dom.Event.addEventListener(this._element, type, listener, thisArg);
        
        return this;
    },

    /**
     * イベントの削除を行う
     *
     * @param {String} type イベントタイプ
     * @param {Function} listener 登録イベントメソッド
     * @return {Jeeel.Dom.Element} 自インスタンス
     */
    removeEventListener: function (type, listener) {
        Jeeel.Dom.Event.removeEventListener(this._element, type, listener);

        return this;
    },
    
    /**
     * このElementに設定されているイベントを任意のタイミングで実行する
     *
     * @param {String} type イベントタイプ
     * @param {Jeeel.Dom.Event.Option} [option] マウスイベントやキーボードイベント等のイベント時のパラメータを指定する
     * @return {Jeeel.Dom.Element} 自インスタンス
     * @ignore 未完成
     */
    dispatchEvent: function (type, option) {
        Jeeel.Dom.Event.dispatchEvent(this._element, type, option);
        
        return this;
    },
    
    /**
     * コンストラクタ
     * 
     * @param {Element} element 対象Element
     * @constructor
     */
    constructor: Jeeel.Dom.Element,
    
    _init: function () {
        var nodeType = Jeeel.Dom.Node.ELEMENT_NODE;
        var txt = Jeeel.Dom.Node.TEXT_NODE;
        
        if ( ! Jeeel._doc) {
            delete this._init;
            return;
        }
        
        var div = (Jeeel.Document || Jeeel._doc).createElement('div');
        
        var _first, _id, _name, _tag, _reg, _s, _attr, _prop, _value, _option, _rect;
        var uf = new Jeeel.Filter.Array.Unique(true, true);
        var rf = new Jeeel.Filter.RegularExpressionEscape();
        var ef = new Jeeel.Filter.Html.Escape(true);
        var slice = Array.prototype.slice;
        
        function _searchId(target) {

            if ( ! _first && target.id === _id) {
                return target;
            }
            
            _first = false;

            var tmp, child = target.firstChild;

            while(child) {

                if (child.nodeType === nodeType) {
                    tmp = _searchId(child);

                    if (tmp) {
                        return tmp;
                    }
                }

                child = child.nextSibling;
            }

            return null;
        }
        
        function _searchClass(res, target) {

            if ( ! _first && target.className.match(_reg)) {
                res[res.length] = target;
            }
            
            _first = false;

            var child = target.firstChild;

            while(child) {

                if (child.nodeType === nodeType) {
                    _searchClass(res, child);
                }

                child = child.nextSibling;
            }
        }
        
        function _searchName(res, target) {
            var name = target.name;
              
            if ( ! _first && name) {
                if (_s) {
                    if (name.match(_reg)) {
                        res[res.length] = target;
                    }
                } else {
                    if (name === _name) {
                        res[res.length] = target;
                    }
                }
            }
            
            _first = false;

            var child = target.firstChild;

            while(child) {

                if (child.nodeType === nodeType) {
                    _searchName(res, child);
                }

                child = child.nextSibling;
            }
        }
        
        function _searchTag(res, target) {

            if ( ! _first && target.nodeName.toUpperCase() === _tag) {
                res[res.length] = target;
            }
            
            _first = false;

            var child = target.firstChild;

            while(child) {

                if (child.nodeType === nodeType) {
                    _searchTag(res, child);
                }

                child = child.nextSibling;
            }
        }
        
        function _searchAttr(res, target) {

            if ( ! _first && target.getAttribute) {
                var val = target.getAttribute(_attr);

                if ((val && _value === '*') || val === _value) {
                    res[res.length] = target;
                }
            }
            
            _first = false;

            var child = target.firstChild;

            while(child) {

                if (child.nodeType === nodeType) {
                    _searchAttr(res, child);
                }

                child = child.nextSibling;
            }
        }
        
        function _searchProp(res, target) {

            if ( ! _first && _prop in target) {
                var val = target[_prop];

                if (_value === '*' || val == _value) {
                    res[res.length] = target;
                }
            }
            
            _first = false;

            var child = target.firstChild;

            while(child) {

                if (child.nodeType === nodeType) {
                    _searchProp(res, child);
                }

                child = child.nextSibling;
            }
        }
        
        function _searchRange(res, target) {
            var trect = Jeeel.Dom.Element.create(target).getRect();

            if ( ! _first && _option(_rect, trect)) {
                res[res.length] = target;
            }
            
            _first = false;

            var child = target.firstChild;

            while(child) {

                if (child.nodeType === nodeType) {
                    _searchRange(res, child);
                }

                child = child.nextSibling;
            }
        }
        
        function _searchTxt(res, target) {
            if (target.nodeType === txt) {
                res[res.length] = target.data;
            }

            var child = target.firstChild;

            while(child) {

                _searchTxt(res, child);

                child = child.nextSibling;
            }
        }
        
        var self = this;

        self.getElementById = function (id) {
            if ( ! id) {
                return null;
            }

            _id = id;
            _first = true;

            return _searchId(this._element);
        };
        
        if (div.getElementsByClassName) {
            self.getElementsByClassName = function (className) {
                var tmp = this._element.getElementsByClassName(className);

                return Jeeel.Hash.toArray(tmp);
            };
        } else {
            self.getElementsByClassName = function (className) {
                if ( ! className) {
                    return [];
                }

                _first = true;
                _reg = new RegExp('(^| )' + className + '( |$)', 'i');
                var res = [];

                _searchClass(res, this._element);

                return res;
            };
        }
        
        if (div.getElementsByName) {
            self.getElementsByName = function (name, submitSearch) {

                if ( ! name) {
                    return [];
                }

                _s = !!submitSearch;

                if (_s) {
                    _first = true;
                    _reg = new RegExp('^' + rf.filter(name) + '($|\\[)');
                } else {
                    var tmp = this._element.getElementsByName(name);

                    return Jeeel.Hash.toArray(tmp);
                }

                var res = [];

                _searchName(res, this._element);

                 return res;
            };
        } else {
            self.getElementsByName = function (name, submitSearch) {

                if ( ! name) {
                    return [];
                }

                _first = true;
                _s = !!submitSearch;

                if (_s) {
                    _reg = new RegExp('^' + rf.filter(name) + '($|\\[)');
                } else {
                    _name = name;
                }

                var res = [];

                _searchName(res, this._element);

                 return res;
            };
        }
        
        if (div.getElementsByTagName) {
            self.getElementsByTagName = function (tagName) {
                var tmp = this._element.getElementsByTagName(tagName);

                return Jeeel.Hash.toArray(tmp);
            };
        } else {
            self.getElementsByTagName = function (tagName) {

                if ( ! tagName) {
                    return [];
                }

                _first = true;
                _tag = tagName.toUpperCase();

                var res = [];

                _searchTag(res, this._element);

                return res;
            };
        }
        
        self.getElementsByAttribute = function (attribute, value) {
            if ( ! attribute) {
                return [];
            }
            
            _first = true;
            _attr = attribute;
            _value = value;

            var res = [];

            _searchAttr(res, this._element);

            return res;
        };
        
        self.getElementsByProperty = function (property, value) {
            if ( ! property) {
                return [];
            }
            
            _first = true;
            _prop = property;
            _value = value;

            var res = [];

            _searchProp(res, this._element);

            return res;
        };
        
        if (div.querySelectorAll) {
            self.getElementsBySelector = function (selector) {
                var tmp = this._element.querySelectorAll(selector);

                return slice.call(tmp, 0, tmp.length);
            };
        } else {
            self.getElementsBySelector = function (selector) {
                if ( ! selector) {
                    return [];
                }

                return [];
            };
        }
        
        self.searchElementsByRange = function (rect, option) {
            if ( ! rect) {
                return [];
            }

            if ( ! option) {
                option = Jeeel.Dom.SearchOption.RANGE_OVERLAY;
            }
            
            _rect = rect;
            _option = option;

            var res = [];
            
            _searchRange(res, this._element);

            return res;
        };
        
        if (div.classList) {
            self.getClassNames = function () {
                return slice.call(this._element.classList);
            };
            
            self.addClassName = function (className) {
                if ( ! className) {
                    return this;
                }
                
                if ( ! Jeeel.Type.isArray(className)) {
                    className = [className];
                }
                
                var classList = this._element.classList;
                
                for (var i = className.length; i--;) {
                    classList.add(className[i]);
                }
                
                return this;
            };
            
            self.removeClassName = function (className) {
                if ( ! className) {
                    return this;
                }

                if ( ! Jeeel.Type.isArray(className)) {
                    className = [className];
                }
                var classList = this._element.classList;
                
                for (var i = className.length; i--;) {
                    classList.remove(className[i]);
                }

                return this;
            };
            
            self.toggleClassName = function (className) {
                if ( ! className) {
                    return this;
                }

                if ( ! Jeeel.Type.isArray(className)) {
                    className = [className];
                }
                var classList = this._element.classList;
                
                for (var i = className.length; i--;) {
                    classList.toggle(className[i]);
                }

                return this;
            };
            
            self.hasClassName = function (className) {
                return this._element.classList.contains(className);
            };
            
        } else {
            self.getClassNames = function () {
                return this._element.className.split(' ');
            };
            
            self.addClassName = function (className) {
                if ( ! className) {
                    return this;
                }
                
                if ( ! Jeeel.Type.isArray(className)) {
                    className = [className];
                }
                
                var ec = this._element.className;
                
                for (var i = 0, l = className.length; i < l; i++) {
                    if ( ! className[i]) {
                        continue;
                    } else if(ec === className[i] || ec.search('\\b' + className[i] + '\\b') !== -1) {
                        continue;
                    }
                    
                    ec += (ec ? ' ' : '') + className[i];
                }
                
                this._element.className = ec;
                
                return this;
            };
            
            self.removeClassName = function (className) {
                if ( ! className) {
                    return this;
                }
                
                if ( ! Jeeel.Type.isArray(className)) {
                    className = [className];
                }
                
                var ec = this._element.className;
                
                for (var i = 0, l = className.length; i < l; i++) {
                    if ( ! className[i]) {
                        continue;
                    }
                    
                    ec = ec.replace(new RegExp('\\b' + className[i] + '\\b\\s*','g'),'');
                }
                
                this._element.className = ec.replace(/\s+$/g, '');
                
                return this;
            };
            
            self.toggleClassName = function (className) {
                if ( ! className) {
                    return this;
                }

                if ( ! Jeeel.Type.isArray(className)) {
                    className = [className];
                }

                var classNames = this.getClassNames();

                for (var i = 0, l = className.length; i < l; i++) {
                    if (Jeeel.Type.inArray(className[i], classNames, true)) {
                        this.removeClassName(className[i]);
                    } else {
                        this.addClassName(className[i]);
                    }
                }

                return this;
            };
            
            self.hasClassName = function (className) {
                if ( ! className) {
                    return false;
                }
                
                var ec = this._element.className;
                
                return ec === className
                    || ec.search('\\b' + className + '\\b') !== -1;
            };
        }
        
        self.getText = function () {
            var res = [];

            _searchTxt(res, this._element);

            return res.join('');
        };
        
        self.setText = function (text) {
            this._element.innerHTML = ef.filter(text);

            return this;
        };
        
        if (Jeeel.UserAgent.isInternetExplorer6()) {
            self.setBackgroundIframe = function (style) {
                style = Jeeel.Hash.merge({
                    top     : 'auto', // auto == .currentStyle.borderTopWidth
                    left    : 'auto', // auto == .currentStyle.borderLeftWidth
                    width   : 'auto', // auto == offsetWidth
                    height  : 'auto', // auto == offsetHeight
                    opacity : true,
                    src     : 'javascript:false;'
                }, style || {});

                var prop = function (n){return n&&n.constructor==Number?n+'px':n;},
                    html = '<iframe class="jeeel-bgiframe"frameborder="0"tabindex="-1"src="'+style.src+'"'
                         + 'style="display:block;position:absolute;z-index:-1;'
                         + (style.opacity !== false?'filter:Alpha(Opacity=\'0\');':'')
                         + 'top:'+(style.top=='auto'?'expression(((parseInt(this.parentNode.currentStyle.borderTopWidth)||0)*-1)+\'px\')':prop(style.top))+';'
                         + 'left:'+(style.left=='auto'?'expression(((parseInt(this.parentNode.currentStyle.borderLeftWidth)||0)*-1)+\'px\')':prop(style.left))+';'
                         + 'width:'+(style.width=='auto'?'expression(this.parentNode.offsetWidth+\'px\')':prop(style.width))+';'
                         + 'height:'+(style.height=='auto'?'expression(this.parentNode.offsetHeight+\'px\')':prop(style.height))+';'
                         + '"/>';

                var child = this._element.firstChild;
                var nodeType = Jeeel.Dom.Node.ELEMENT_NODE;

                while(child) {
                    if (child.nodeType === nodeType) {
                        if (child.tagName.toUpperCase() === 'IFRAME' && child.className === 'jeeel-bgiframe') {
                            return this;
                        }
                    }

                    child = child.nextSibling;
                }

                var elm = this._doc.createElementList(html)[0];

                return this.insertTop(elm);
            };
        } else {
            self.setBackgroundIframe = function (style) {
                return this;
            };
        }
        
        var moveCash = [];
        
        function _searchMoveCashIndex(self) {
            for (var i = 0, l = moveCash.length; i < l; i++) {
                if (self._element === moveCash[i].target) {
                    return i;
                }
            }
            
            return -1;
        }
        
        self.movable = function (dispatchTargets) {
            
            var i, l, cash, index = _searchMoveCashIndex(this);
            
            if ( ! dispatchTargets) {
                dispatchTargets = [this._element];
            } else if ( ! Jeeel.Type.isArray(dispatchTargets)) {
                dispatchTargets = [dispatchTargets];
            }
            
            if (index >= 0) {
                cash = moveCash[index];
                
                for (i = 0, l = cash.dispatch.length; i < l; i++) {
                    Jeeel.Dom.Event.removeEventListener(cash.dispatch[i], Jeeel.Dom.Event.Type.MOUSE_DOWN, cash.down, this);
                }
                
                for (i = 0, l = dispatchTargets.length; i < l; i++) {
                    Jeeel.Dom.Event.addEventListener(dispatchTargets[i], Jeeel.Dom.Event.Type.MOUSE_DOWN, cash.down, this);
                }
                
                cash.dispatch = dispatchTargets;
                
                return this;
            }
            
            cash = moveCash[moveCash.length] = {
                dispatch: dispatchTargets,
                target: this._element,
                position: '',
                point: null,
                down: function (ev) {
                    ev.stop();
                    
                    this._doc.addEventListener(Jeeel.Dom.Event.Type.MOUSE_MOVE, cash.move, this)
                             .addEventListener(Jeeel.Dom.Event.Type.MOUSE_UP, cash.up, this);
                             
                    cash.point = ev.getRelativeMousePoint(this._element);
                },
                move: function (ev) {
                    ev.stop();
                    
                    var p = ev.mousePoint;
                    
                    var top  = p.y - cash.point.y;
                    var left = p.x - cash.point.x;
                    
                    this.setStyleList({
                        top: top + 'px',
                        left: left + 'px'
                    });
                },
                up: function (ev) {
                    ev.stop();
                    
                    this._doc.removeEventListener(Jeeel.Dom.Event.Type.MOUSE_MOVE, cash.move)
                             .removeEventListener(Jeeel.Dom.Event.Type.MOUSE_UP, cash.up);
                }
            };
            
            for (i = 0, l = dispatchTargets.length; i < l; i++) {
                Jeeel.Dom.Event.addEventListener(dispatchTargets[i], Jeeel.Dom.Event.Type.MOUSE_DOWN, cash.down, this);
            }

            cash.position = this.getStyle('position');
            
            this.setStyle('position', 'absolute');
            
            return this;
        };
        
        self.immovable = function () {
            
            var index = _searchMoveCashIndex(this);
            
            if (index < 0) {
                return this;
            }
            
            var cash = moveCash[index];
            
            for (var i = 0, l = cash.dispatch.length; i < l; i++) {
                Jeeel.Dom.Event.removeEventListener(cash.dispatch[i], Jeeel.Dom.Event.Type.MOUSE_DOWN, cash.down, this);
            }
            
            this.setStyle('position', cash.position);
            
            moveCash.splice(index, 1);
            
            return this;
        };
 
        delete this._init;
    }
};

Jeeel.Dom.Element.prototype._init();

Jeeel.file.Jeeel.Dom.Element = ['Abstract', 'Textarea'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Dom.Element, Jeeel.file.Jeeel.Dom.Element);
