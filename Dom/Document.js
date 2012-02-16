Jeeel.directory.Jeeel.Dom.Document = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Dom + 'Document/';
    }
};

/**
 * コンストラクタ
 * 
 * @class documentをラップして拡張するクラス
 * @param {Document|IFrameElement} [document] 対象のドキュメント(iframe等で階層が違う場合に指定)
 * @throws {Error} documentが指定されてかつiframeやDocument型でない場合に発生
 */
Jeeel.Dom.Document = function (document) {

    if (Jeeel.Document && ( ! document || document === Jeeel._doc)) {
        return Jeeel.Document;
    }
    
    if ( ! document) {
        document = Jeeel._doc;
    } else if (document.nodeName && document.nodeName.toUpperCase() == 'IFRAME') {
        document = document.contentWindow.document;
    } else if (document instanceof Jeeel.Dom.Window) {
        this._window = document;
        document = document.getWindow().document;
    }
    
    if ( ! Jeeel.Type.isDocument(document)) {
        throw new Error('引数はDocumentまたはIFrameElementを渡してください。');
    }

    this._document = document;
    this._elementCash = {};
};

/**
 * インスタンスの作成を行う
 *
 * @param {Document|IFrameElement} [document] 対象のドキュメント(iframe等で階層が違う場合に指定)
 * @return {Jeeel.Dom.Document} 作成したインスタンス
 */
Jeeel.Dom.Document.create = function (document) {
    return new this(document);
};

Jeeel.Dom.Document.prototype = {

    /**
     * 操作対象のDocument
     * 
     * @type Document
     * @protected
     */
    _document: null,
    
    /**
     * Documentに属するWindowのラッパーインスタンス
     * 
     * @type Jeeel.Dom.Window
     * @private
     */
    _window: null,
    
    /**
     * Elementの作成で使用するキャッシュ
     * 
     * @type Hash
     */
    _elementCash: {},
    
    /**
     * ネームスペース使用時のElementの作成で使用するキャッシュ
     * 
     * @type Hash
     */
    _elementNsCash: {},
    
    /**
     * 操作しているDocumentを取得する
     * 
     * @return {Document} 操作しているDocument
     */
    getDocument: function () {
        return this._document;
    },
    
    /**
     * このDocumentに属するWindowのラッパーインスタンスを取得する
     * 
     * @return {Jeeel.Dom.Window} Windowラッパーインスタンス
     */
    getWindow: function () {
        return this._window || (this._window = Jeeel.Dom.Window.create(this));
    },
    
    /**
     * Elementの作成を行う(複数回同じタグを生成する場合はdocumentのcreateElementを使用するよりも早い)
     * 
     * @param {String} tagName 作成タグの名前(タグ名は大文字小文字を統一した方が早くなる)
     * @return {Element} 作成したタグ
     */
    createElement: function (tagName) {
        if (this._elementCash[tagName]) {
            return this._elementCash[tagName].cloneNode(false);
        }
        
        var elm = this._document.createElement(tagName);
        
        return elm && (this._elementCash[tagName] = elm).cloneNode(false) || null;
    },
    
    /**
     * ネームスペースを指定してElementの作成を行う(複数回同じタグを生成する場合はdocumentのcreateElementNSを使用するよりも早い)
     * 
     * @param {String} namespaceUri ネームスペースURI(例： http://www.w3.org/1999/xhtml)
     * @param {String} tagName 作成タグの名前(タグ名は大文字小文字を統一した方が早くなる)
     * @return {Element} 作成したタグ
     */
    createElementNS: function (namespaceUri, tagName) {
        if ( ! this._elementNsCash[namespaceUri]) {
            this._elementNsCash[namespaceUri] = {};
        }
        
        if (this._elementNsCash[namespaceUri][tagName]) {
            return this._elementNsCash[namespaceUri][tagName].cloneNode(false);
        }
        
        var elm = this._document.createElementNS(namespaceUri, tagName);
        
        return elm && (this._elementNsCash[namespaceUri][tagName] = elm).cloneNode(false) || null;
    },
    
    /**
     * Textノードの作成を行う
     * 
     * @param {String} text 作成するテキスト
     * @return {Text} 作成したTextノード
     */
    createTextNode: function (text) {
        return this._document.createTextNode(text);
    },
    
    /**
     * DocumentFragmentの作成を行う
     * 
     * @return {DocumentFragment} 作成したDocumentFragment
     */
    createDocumentFragment: function () {
        return this._document.createDocumentFragment();
    },
    
    /**
     * HTML文字列からNodeリストを作成して返す
     *
     * @param {String} html HTML文字列
     * @return {Node[]} 作成されたNodeリスト
     */
    createNodeList: function (html) {

        var div;
        
        var supports = this.constructor.Supports;

        if ( ! supports.rhtml.test(html)) {
            div = {childNodes: [this.createTextNode(html)]};
        } else {
            // Fix "XHTML"-style tags in all browsers
            html = html.replace(supports.rxhtmlTag, "<$1></$2>");

            // Trim whitespace, otherwise indexOf won't work as expected
            var tag = (supports.rtagName.exec(html) || ["", ""])[1].toLowerCase(),
            wrap = supports.wrapMap[tag] || supports.wrapMap._default,
            depth = wrap[0];

            div = this.createElement('div');

            // Go to html and back, then peel off extra wrappers
            div.innerHTML = wrap[1] + html + wrap[2];

            // Move to the right depth
            while (depth--) {
                div = div.lastChild;
            }

            // Remove IE's autoinserted <tbody> from table fragments
            if ( ! supports.tbody) {

                // String was a <table>, *may* have spurious <tbody>
                var hasBody = supports.rtbody.test(html),
                  tbody = tag === "table" && !hasBody ?
                    div.firstChild && div.firstChild.childNodes :

                    // String was a bare <thead> or <tfoot>
                    wrap[1] === "<table>" && !hasBody ?
                      div.childNodes : [];

                for (var j = tbody.length - 1; j >= 0 ; --j) {
                    if (tbody[j].nodeName.toLowerCase() == "tbody" && ! tbody[j].childNodes.length ) {
                        tbody[j].parentNode.removeChild(tbody[j]);
                    }
                }
            }

            // IE completely kills leading whitespace when innerHTML is used
            if ( ! supports.leadingWhitespace && supports.rleadingWhitespace.test(html)) {
                div.insertBefore(this.createTextNode(supports.rleadingWhitespace.exec(html)[0]), div.firstChild);
            }
        }

        var res = [];

        var children = div.childNodes;

        for (var i = 0, l = children.length; i < l; i++) {
            res[i] = children[i];
        }

        return res;
    },
    
    /**
     * HTML文字列からElementリストを作成して返す
     *
     * @param {String} html HTML文字列
     * @return {Element[]} 作成されたElementリスト
     */
    createElementList: function (html) {
        var res = [];
        var tmp = this.createNodeList(html);
        var elmType = Jeeel.Dom.Node.ELEMENT_NODE;
        
        for (var i = 0, l = tmp.length; i < l; i++) {
            if (tmp[i].nodeType === elmType) {
                res[res.length] = tmp[i];
            }
        }
        
        return res;
    },
    
    /**
     * ヘッダの取得
     *
     * @return {Element} ヘッダElement
     */
    getHead: function () {
        return this._document.head || this.getElementsByTagName('head')[0];
    },

    /**
     * ボディの取得
     *
     * @return {Element} ボディElement
     */
    getBody: function () {
        return this._document.body;
    },
    
    /**
     * ルートElementの取得
     * 
     * @return {Element} ルートElement
     */
    getDocumentElement: function () {
        return this._document.documentElement;
    },

    /**
     * 指定IDのHTML要素を取得する
     *
     * @param {String} id 検索ID
     * @return {Element} 取得したElement
     */
    getElementById: function (id) {},

    /**
     * 指定ClassのHTML要素を取得する
     *
     * @param {String} className 検索Class
     * @return {Element[]} 取得したElement配列
     */
    getElementsByClassName: function (className) {},

    /**
     * 指定NameのHTML要素を取得する<br />
     * なおsubmitSearchを指定すると<br />
     * この動作は一部本来のgetElementsByNameと違い、<br />
     * c[]等で配列指定した値に対してもヒットする<br />
     * submitSearchなしのIEではName属性の解釈が違うので注意
     * 
     * @param {String} name 検索Name
     * @param {Boolean} [submitSearch=false] 送信時と同じようにc[]等の配列指定をヒットさせるかどうか
     * @return {Element[]} 取得したElement配列
     */
    getElementsByName: function (name, submitSearch) {},

    /**
     * 指定TagのHTML要素を取得する
     *
     * @param {String} tagName 検索Tag
     * @return {Element[]} 取得したElement配列
     */
    getElementsByTagName: function (tagName) {},

    /**
     * 指定属性が指定値のHTML要素を取得する
     *
     * @param {String} attribute 属性名
     * @param {String} value 属性値('*'を指定すると任意の値の意味になる)
     * @return {Element[]} 取得したElement配列
     */
    getElementsByAttribute: function (attribute, value) {},

    /**
     * 指定プロパティが指定値のHTML要素を取得する<br />
     * Elementのプロパティである事に注意
     *
     * @param {String} property プロパティ名
     * @param {Mixied} value 指定値('*'を指定すると任意の値の意味になる)
     * @return {Element[]} 取得したElement配列
     */
    getElementsByProperty: function (property, value) {},

    /**
     * 指定セレクタで絞り込んだHTML要素を取得する
     *
     * @param {String} selector CSSセレクタ
     * @return {Element[]} 取得したElement配列
     * @ignore
     */
    getElementsBySelector: function (selector) {},
    
    /**
     * HTML要素を指定範囲検索する
     * 
     * @param {Jeeel.Object.Rect} rect 対象範囲
     * @param {Function} [option] 検索オプション(デフォルトは重なったElement)
     * @return {Element[]} 範囲検索に引っかかったElement配列
     * @see Jeeel.Dom.SearchOption
     */
    searchElementsByRange: function (rect, option) {},
    
    /**
     * 計算済みのスタイルを取得する
     * 
     * @param {Element} element 取得対象のElement
     * @return {CSSCurrentStyleDeclaration|CSSStyleDeclaration} 取得した計算済みスタイル
     */
    getComputedStyle: function (element) {
        return element.currentStyle || this._document.defaultView.getComputedStyle(element, '');
    },
    
    /**
     * ヘッダに対して要素を追加する
     * 
     * @param {Element} element 追加Element
     * @return {Jeeel.Dom.Document} 自インスタンス
     */
    appendToHead: function (element) {
        this.getHead().appendChild(element);
        return this;
    },
    
    /**
     * ボディに対して要素を追加する
     * 
     * @param {Element} element 追加Element
     * @return {Jeeel.Dom.Document} 自インスタンス
     */
    appendToBody: function (element) {
        this.getBody().appendChild(element);
        return this;
    },
    
    /**
     * このDocumentにイベントを追加する<br />
     * 引数はJeeel.Dom.Event, このDocumentになる
     *
     * @param {String} type イベントタイプ
     * @param {Function} listener 登録イベントメソッド
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.Dom.Document} 自インスタンス
     */
    addEventListener: function (type, listener, thisArg) {
        if ( ! Jeeel.Type.isSet(thisArg)) {
            thisArg = this;
        }

        Jeeel.Dom.Event.addEventListener(this._document, type, listener, thisArg);
        
        return this;
    },

    /**
     * イベントの削除を行う<br />
     * このインスタンスのaddEventListenerに対して行わなければ削除はできない
     *
     * @param {String} type イベントタイプ
     * @param {Function} listener 登録イベントメソッド
     * @return {Jeeel.Dom.Document} 自インスタンス
     */
    removeEventListener: function (type, listener) {
        Jeeel.Dom.Event.removeEventListener(this._document, type, listener);

        return this;
    },
    
    /**
     * このDocumentに設定されているイベントを任意のタイミングで実行する
     *
     * @param {String} type イベントタイプ
     * @param {Jeeel.Dom.Event.Option} [option] マウスイベントやキーボードイベント等のイベント時のパラメータを指定する
     * @return {Jeeel.Dom.Document} 自インスタンス
     * @ignore 未完成
     */
    dispatchEvent: function (type, option) {
        Jeeel.Dom.Event.dispatchEvent(this._document, type, option);
        
        return this;
    },

    /**
     * イメージ全てに対してロールオーバー動作を定義づける
     * 
     * @return {Jeeel.Dom.Document} 自インスタンス
     * @ignore
     */
    rolloverImages: function () {
        var inputs = this.getElementsByTagName('input');
        var images = this.getElementsByTagName('img');
        
        var rollover = new Jeeel.Dom.Event.Rollover.Image();
        
        rollover.rollover(inputs.concat(images));
        
        return this;
    },

    /**
     * コンストラクタ
     * 
     * @param {Document} [document] 対象のドキュメント(iframe等で階層が違う場合に指定)
     * @constructor
     */
    constructor: Jeeel.Dom.Document,
    
    _init: function () {
      
        var nodeType = Jeeel.Dom.Node.ELEMENT_NODE;
        var doc  = Jeeel._doc;

        if ( ! doc) {
            delete this._init;
            return;
        }
        
        var rf = new Jeeel.Filter.RegularExpressionEscape();
        var _id, _name, _tag, _reg, _s, _attr, _prop, _value, _option, _rect;
        var slice = Array.prototype.slice;
        
        function _searchId(target) {

            if (target.id === _id) {
                return target;
            }

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

            if (target.className.match(_reg)) {
                res[res.length] = target;
            }

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
              
            if (name) {
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

            var child = target.firstChild;

            while(child) {

                if (child.nodeType === nodeType) {
                    _searchName(res, child);
                }

                child = child.nextSibling;
            }
        }
        
        function _searchTag(res, target) {

            if (target.nodeName.toUpperCase() === _tag) {
                res[res.length] = target;
            }

            var child = target.firstChild;

            while(child) {

                if (child.nodeType === nodeType) {
                    _searchTag(res, child);
                }

                child = child.nextSibling;
            }
        }
        
        function _searchAttr(res, target) {

            if (target.getAttribute) {
                var val = target.getAttribute(_attr);

                if ((val && _value === '*') || val === _value) {
                    res[res.length] = target;
                }
            }

            var child = target.firstChild;

            while(child) {

                if (child.nodeType === nodeType) {
                    _searchAttr(res, child);
                }

                child = child.nextSibling;
            }
        }
        
        function _searchProp(res, target) {

            if (_prop in target) {
                var val = target[_prop];

                if (_value === '*' || val == _value) {
                    res[res.length] = target;
                }
            }

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

            if (_option(_rect, trect)) {
                res[res.length] = target;
            }

            var child = target.firstChild;

            while(child) {

                if (child.nodeType === nodeType) {
                    _searchRange(res, child);
                }

                child = child.nextSibling;
            }
        }
        
        var self = this;
        
        if (doc.getElementById) {
            if (Jeeel.UserAgent.isInternetExplorer()) {
                self.getElementById = function (id) {
                    return this._document.getElementById(id) || null;
                };
            } else {
                self.getElementById = function (id) {
                    return this._document.getElementById(id);
                };
            }
        } else {
            self.getElementById = function (id) {
                if ( ! id) {
                    return null;
                }

                _id = id;

                return _searchId(this._document.documentElement);
            };
        }
        
        if (doc.getElementsByClassName) {
            self.getElementsByClassName = function (className) {
                var tmp = this._document.getElementsByClassName(className);

                return Jeeel.Hash.toArray(tmp);
            };
        } else {
            self.getElementsByClassName = function (className) {
                if ( ! className) {
                    return [];
                }

                _reg = new RegExp('(^| )' + className + '( |$)', 'i');
                var res = [];

                _searchClass(res, this._document.documentElement);

                return res;
            };
        }
        
        if (doc.getElementsByName) {
            self.getElementsByName = function (name, submitSearch) {

                if ( ! name) {
                    return [];
                }

                _s = !!submitSearch;

                if (_s) {
                    _reg = new RegExp('^' + rf.filter(name) + '($|\\[)');
                } else {
                    var tmp = this._document.getElementsByName(name);

                    return Jeeel.Hash.toArray(tmp);
                }

                var res = [];

                _searchName(res, this._document.documentElement);

                return res;
            };
        } else {
            self.getElementsByName = function (name, submitSearch) {

                if ( ! name) {
                    return [];
                }

                _s = !!submitSearch;

                if (_s) {
                    _reg = new RegExp('^' + rf.filter(name) + '($|\\[)');
                } else {
                    _name = name;
                }

                var res = [];

                _searchName(res, this._document.documentElement);

                return res;
            };
        }
        
        if (doc.getElementsByTagName) {
            self.getElementsByTagName = function (tagName) {
                if ( ! tagName) {
                    return [];
                }

                tagName = tagName.toUpperCase();

                if (tagName === 'BODY') {
                    return [this._document.body];
                } else if (tagName === 'HEAD' && this._document.head) {
                    return [this._document.head];
                } else if (tagName === 'HTML') {
                    return [this._document.documentElement];
                }
                
                var tmp = this._document.getElementsByTagName(tagName);

                return Jeeel.Hash.toArray(tmp);
            };
        } else {
            self.getElementsByTagName = function (tagName) {

                if ( ! tagName) {
                    return [];
                }

                _tag = tagName.toUpperCase();

                if (_tag === 'BODY') {
                    return [this._document.body];
                } else if (_tag === 'HEAD' && this._document.head) {
                    return [this._document.head];
                } else if (_tag === 'HTML') {
                    return [this._document.documentElement];
                }

                var res = [];

                _searchTag(res, this._document.documentElement);

                return res;
            };
        }
        
        self.getElementsByAttribute = function (attribute, value) {
            if ( ! attribute) {
                return [];
            }
            
            _attr = attribute;
            _value = value;

            var res = [];

            _searchAttr(res, this._document.documentElement);

            return res;
        };
        
        self.getElementsByProperty = function (property, value) {
            if ( ! property) {
                return [];
            }
            
            _prop = property;
            _value = value;

            var res = [];

            _searchProp(res, this._document.documentElement);

            return res;
        };
        
        if (doc.querySelectorAll) {
            self.getElementsBySelector = function (selector) {
                var tmp = this._document.querySelectorAll(selector);

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
            
            _searchRange(res, this._document.documentElement);

            return res;
        };
        
        // createElementNSが存在しないブラウザはネームスペースを無視
        if ( ! doc.createElementNS) {
            self.createElementNS = function (namespaceUri, tagName) {
                return this.createElement(tagName);
            };
        }
        
        delete this._init;
    }
};

Jeeel.Dom.Document.prototype._init();

Jeeel.file.Jeeel.Dom.Document = ['ReadyStatus'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Dom.Document, Jeeel.file.Jeeel.Dom.Document);

if (Jeeel._doc) {
    Jeeel.Document = Jeeel.Dom.Document.create();
    Jeeel.Window = Jeeel.Document.getWindow();
} else if (Jeeel._global) {
    Jeeel.Window = Jeeel.Dom.Window.create();
}

(function () {
    if ( ! Jeeel.Document) {
        return;
    }
    
    var div = Jeeel.Document.createElement('div');
    
    div.setAttribute("className", "t");
    div.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

    Jeeel.Dom.Document.Supports = ({
        leadingWhitespace: ( div.firstChild.nodeType === 3 ),

        // Make sure that tbody elements aren't automatically inserted
        // IE will insert them into empty tables
        tbody: !div.getElementsByTagName( "tbody" ).length,

        // Make sure that link elements get serialized correctly by innerHTML
        // This requires a wrapper element in IE
        htmlSerialize: !!div.getElementsByTagName( "link" ).length,
        
        wrapMap: {
            option: [1, "<select multiple='multiple'>", "</select>"],
            legend: [1, "<fieldset>", "</fieldset>"],
            thead: [1, "<table>", "</table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
            area: [1, "<map>", "</map>"],
            _default: [0, "", ""]
        },
        
        rtbody: /<tbody/i,
        rhtml: /<|&#?\w+;/,
        rleadingWhitespace: /^\s+/,
        rxhtmlTag: /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
        rtagName: /<([\w:]+)/,
        
        _init: function () {
            this.wrapMap.optgroup = this.wrapMap.option;
            this.wrapMap.tbody = this.wrapMap.tfoot = this.wrapMap.colgroup = this.wrapMap.caption = this.wrapMap.thead;
            this.wrapMap.th = this.wrapMap.td;
            
            if ( ! this.htmlSerialize ) {
                this.wrapMap._default = [1, "div<div>", "</div>"];
            }
            
            delete this._init;
            
            return this;
        }
    })._init();
})();
