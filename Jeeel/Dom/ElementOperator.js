Jeeel.directory.Jeeel.Dom.ElementOperator = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Dom + 'ElementOperator/';
    }
};

/**
 * コンストラクタ
 *
 * @class 複数のElementを一度に操作する特殊なクラス
 * @param {String|Hash} elementList セレクタ文字列もしくは、対象Element及び複数のElementリスト(Jeeel.Dom.ElementOperatorやJeeel.Dom.Element自体やリストでも可能)
 */
Jeeel.Dom.ElementOperator = function (elementList) {
    
    if (Jeeel.Type.isString(elementList)) {
        elementList = Jeeel.Document.getElementsBySelector(elementList);
    } else {
        elementList = this.constructor._flat(elementList);
    }
    
    for (var i = elementList.length; i--;) {
        this[i] = elementList[i];
        elementList[i] = new Jeeel.Dom.Element(elementList[i]);
    }
    
    var self = this;

    self._elementList = elementList;
    self.length = elementList.length;

    if (arguments[1] instanceof this.constructor) {
        self._prev = arguments[1];
    }
};

/**
 * インスタンスを作成する
 *
 * @param {String|Hash} elementList セレクタ文字列もしくは、対象Element及び複数のElementリスト(Jeeel.Dom.ElementOperatorやJeeel.Dom.Element自体やリストでも可能)
 * @return {Jeeel.Dom.ElementOperator} 作成したインスタンス
 */
Jeeel.Dom.ElementOperator.create = function (elementList) {
    return new this(elementList, arguments[1]);
};

/**
 * Elementのリスト上になるように成形する
 *
 * @param {Hash} elementList 元の要素
 * @return {Element[]} 変形後の要素
 * @protected
 */
Jeeel.Dom.ElementOperator._flat = (function (elementList) {
    var f = new Jeeel.Filter.Hash.Unique(true, true);
    
    return function (elementList) {
        var res = this._flatExec(elementList);

        return f.filter(res);
    };
})();

/**
 * Jeeel.Dom.ElementOperator._flatで使用する内部メソッド
 *
 * @param {Hash} elementList 元の要素
 * @return {Element[]} 変形後の要素
 * @protected
 */
Jeeel.Dom.ElementOperator._flatExec = function (elementList) {

    if (Jeeel.Type.isNode(elementList)) {
        return [elementList];
    }
    else if (elementList instanceof this) {
        return elementList.getAll();
    }
    else if (elementList instanceof Jeeel.Dom.Element) {
        return [elementList.getElement()];
    }
    else if (elementList instanceof Jeeel.Net.Form) {
        return [elementList.getForm()];
    }
    else if ( ! Jeeel.Type.isHash(elementList)) {
        return [];
    }
    else if ( ! Jeeel.Type.isArray(elementList)) {
        elementList = Jeeel.Hash.getValues(elementList);
    }

    var res = [];

    for (var i = 0, l = elementList.length; i < l; i++) {
        if (Jeeel.Type.isNode(elementList[i])) {
            res[res.length] = elementList[i];
        } else if (Jeeel.Type.isHash(elementList[i])) {
            var tmp = this._flatExec(elementList[i]);
            res = res.concat(tmp);
        }
    }

    return res;
};

Jeeel.Dom.ElementOperator.prototype = {

    /**
     * 絞り込みを掛ける前のインスタンス
     * 
     * @type Jeeel.Dom.ElementOperator
     * @protected
     */
    _prev: null,

    /**
     * 基となるElement(この操作モジュールを保持するElement)
     *
     * @type Jeeel.Dom.Element[]
     * @protected
     */
    _elementList: [],

    /**
     * 現在操作している要素数
     * 
     * @type Integer
     * @readOnly
     */
    length: 0,

    /**
     * 指定したインデックスの要素を取得する
     *
     * @param {Integer} index インデックス(負の数を指定すると後ろから参照する)
     * @return {Element} 取得要素
     */
    get: function (index) {
        if ( ! Jeeel.Type.isInteger(index) || this.length <= index) {
            return null;
        }

        if (0 > index) {
            index = this.length + index;
        }

        return this[index] || null;
    },

    /**
     * 全要素を取得する
     *
     * @return {Element[]} 全要素のリスト
     */
    getAll: function () {
        var res = [];
        
        for (var i = this.length; i--;) {
            res[i] = this[i];
        }
        
        return res;
    },

    /**
     * 指定したElementに対応するインデックスを取得する
     *
     * @param {Element} element 検索Element
     * @return {Integer} インデックス(見つからない場合は-1)
     */
    getIndex: function (element) {
        var res = -1;
        
        for (var i = this.length; i--;) {
            if (this[i] === element) {
                res = i;
            }
        }

        return res;
    },

    /**
     * 操作対象に新規にElementを追加する
     *
     * @param {Hash} element 追加するElementまたは複数のElementリスト(Jeeel.Dom.ElementOperatorやJeeel.Dom.Element自体やリストでも可能)
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     */
    add: function (element) {
        element = this.constructor._flat(element);

        var skip = 0;

        for (var i = 0, l = element.length; i < l; i++) {

            var brk = false;

            for (var j = 0; j < this.length; j++) {
                if (element[i] === this[j]) {
                    skip++;
                    brk = true;
                    break;
                }
            }

            if (brk) {
                continue;
            }

            this[this.length + i - skip] = element[i];
            var tmp = new Jeeel.Dom.Element(element[i]);
            
            this._elementList[this._elementList.length] = tmp;
        }

        this.length = this._elementList.length;

        return this;
    },

    /**
     * 絞り込み動作を行う前の要素を操作対象に追加する
     *
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     */
    andSelf: function () {
        return this.add(this._prev);
    },

    /**
     * 直前の絞り込み動作を行う前の状態のインスタンスを返す
     *
     * @return {Jeeel.Dom.ElementOperator} 直前のインスタンス(ない場合は要素が空のインスタンス)
     */
    end: function () {
        return (this._prev ? this._prev : this.constructor.create());
    },

    /**
     * 指定要素の子リストにElementを追加する
     *
     * @param {Element} child 追加Elementまたは複数のElementリスト(Jeeel.Dom.ElementOperatorやJeeel.Dom.Element自体やリストでも可能)
     * @param {Integer} [index] インデックス(省略は0)
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     */
    appendChild: function (child, index) {
        if ( ! index) {
            index = 0;
        } else if ( ! (index in this._elementList)) {
            return this;
        }

        this._elementList[index].appendChild(this.constructor._flat(child));

        return this;
    },

    /**
     * 指定要素の子リストからElementを取り除く
     *
     * @param {Element} child 削除Elementまたは複数のElementリスト(Jeeel.Dom.ElementOperatorやJeeel.Dom.Element自体やリストでも可能)
     * @param {Integer} [index] インデックス(省略は0)
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     */
    removeChild: function (child, index) {
        if ( ! index) {
            index = 0;
        } else if ( ! (index in this._elementList)) {
            return this;
        }

        this._elementList[index].removeChild(this.constructor._flat(child));

        return this;
    },
    
    /**
     * 全ての要素の子供を全て削除する
     *
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     */
    clearChildNodes: function () {
        return this._callMethod('clearChildNodes');
    },

    /**
     * 全ての要素それぞれを指定Elementで囲う<br />
     * それぞれを囲うElementはコピーされる
     *
     * @param {String|Element} wrapElement 囲いElement(Jeeel.Dom.ElementOperatorやJeeel.Dom.Elementでも可能)
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     * @ignore
     */
    wrap: function (wrapElement) {
      
        if (Jeeel.Type.isString(wrapElement)) {
            wrapElement = Jeeel.Document.createElementList(wrapElement);
        }

        wrapElement = this.constructor._flat(wrapElement)[0];

        return this._callMethod('wrapSelf', [wrapElement]);
    },
    
    /**
     * 指定要素のIDを取得する
     *
     * @param {Integer} [index] インデックス(省略は0)
     * @return {String} ID
     */
    getId: function (index) {
        return this._getCall(index, 'getId');
    },
    
    /**
     * IDを指定要素に設定する
     *
     * @param {String} id ID
     * @param {Integer} [index] インデックス(省略は0)
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     */
    setId: function (id, index) {
        if ( ! index) {
            index = 0;
        } else if ( ! (index in this._elementList)) {
            return this;
        }
        
        this._elementList[index].setId(id);

        return this;
    },
    
    /**
     * 指定要素のNameを取得する
     *
     * @param {Integer} [index] インデックス(省略は0)
     * @return {String} Name
     */
    getName: function (index) {
        return this._getCall(index, 'getName');
    },
    
    /**
     * Nameを全ての要素に設定する
     *
     * @param {String} name Name
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     */
    setName: function (name) {
        return this._callMethod('setName', [name]);
    },
    
    /**
     * 指定要素のTagNameを取得する
     *
     * @param {Integer} [index] インデックス(省略は0)
     * @return {String} Name
     */
    getTag: function (index) {
        return this._getCall(index, 'getTagName');
    },

    /**
     * 指定要素のクラス名のリストを全て取得する
     *
     * @param {Integer} [index] インデックス(省略は0)
     * @return {String[]} クラス名リスト
     */
    getClass: function (index) {
        return this._getCall(index, 'getClassNames') || [];
    },

    /**
     * クラス名を全ての要素に追加する
     *
     * @param {String|String[]} className クラス名もしくはクラス名リスト
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     */
    addClass: function (className) {
        return this._callMethod('addClassName', [className]);
    },

    /**
     * 指定したクラス名を全ての要素から取り除く
     *
     * @param {String|String[]} className クラス名もしくはクラス名リスト
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     */
    removeClass: function (className) {
        return this._callMethod('removeClassName', [className]);
    },

    /**
     * 指定したクラス名が存在していたら削除し、<br />
     * 存在していなかったら追加を全ての要素に対して行う
     *
     * @param {String|String[]} className クラス名もしくはクラス名リスト
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     */
    toggleClass: function (className) {
        return this._callMethod('toggleClassName', [className]);
    },

    /**
     * 全ての要素のクラス名を消去する
     *
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     */
    clearClass: function () {
        return this._callMethod('clearClassName');
    },
    
    /**
     * 指定したクラス名を保持しているかどうかを返す
     *
     * @param {String} className クラス名
     * @param {Integer} [index] インデックス(省略は0)
     * @return {Boolean} クラス名を保持していたかどうか
     */
    hasClass: function (className, index) {
        return this._getCall(index, 'hasClassName', [className]);
    },

    /**
     * 指定要素から属性取得する
     *
     * @param {String} attribute 属性名
     * @param {Integer} [index] インデックス(省略は0)
     * @return {String} 属性値
     */
    getAttr: function (attribute, index) {
        return this._getCall(index, 'getAttribute', [attribute]);
    },

    /**
     * 属性値を全ての要素に設定する
     *
     * @param {String} attribute 属性名
     * @param {String} value 属性値
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     */
    setAttr: function (attribute, value) {
        return this._callMethod('setAttribute', [attribute, value]);
    },
    
    /**
     * 属性値を全ての要素から削除する
     *
     * @param {String} attribute 属性名
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     */
    removeAttr: function (attribute) {
        return this._callMethod('removeAttribute', [attribute]);
    },

    /**
     * 指定要素からプロパティを取得する
     *
     * @param {String} property プロパティ名
     * @param {Integer} [index] インデックス(省略は0)
     * @return {Mixied} プロパティ値
     */
    getProp: function (property, index) {
        return this._getCall(index, 'getProperty', [property]);
    },

    /**
     * プロパティを全ての要素に設定する
     *
     * @param {String} property プロパティ名
     * @param {Mixied} value プロパティ値
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     */
    setProp: function (property, value) {
        return this._callMethod('setProperty', [property, value]);
    },

    /**
     * 指定要素からスタイルを取得する
     *
     * @param {String} css スタイル名
     * @param {Integer} [index] インデックス(省略は0)
     * @return {String} スタイル値
     * @see Jeeel.Dom.Style
     */
    getCss: function (css, index) {
        return this._getCall(index, 'getStyle', [css]);
    },

    /**
     * スタイルを全ての要素に設定する
     *
     * @param {String} css スタイル名
     * @param {String} value スタイル値
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     * @see Jeeel.Dom.Style
     */
    setCss: function (css, value) {
        return this._callMethod('setStyle', [css, value]);
    },
    
    /**
     * 複数のスタイルを全ての要素に設定する
     *
     * @param {Hash} cssList スタイル名と値のペアリスト
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     */
    setCssList: function (cssList) {
        return this._callMethod('setStyleList', [cssList]);
    },
    
    /**
     * 指定要素からDOMの独自データを取得する(属性値data-&#8727;)<br />
     * IE8以下ではメモリリークを起こす非推奨メソッド
     * 
     * @param {String} key データキー
     * @param {Integer} [index] インデックス(省略は0)
     * @return {String} データ
     */
    getData: function (key, index) {
        return this._getCall(index, 'getData', [key]);
    },
    
    /**
     * DOMの独自データを全ての要素に設定する(属性値data-&#8727;)<br />
     * IE8以下ではメモリリークを起こす非推奨メソッド
     * 
     * @param {String} key データキー
     * @param {String} data データ
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     */
    setData: function (key, data) {
        return this._callMethod('setData', [key, data]);
    },
    
    /**
     * 指定要素からJeeelの独自データを取得する<brr />
     * IE以外ではプロパティが拡張されるので注意(詳しくはJeeel.Storage.Objectを参照)<br />
     * またネームスペースは初期値を用いる
     * 
     * @param {String} key データキー
     * @param {Integer} [index] インデックス(省略は0)
     * @return {Mixied} データ
     * @see Jeeel.Storage.Object
     */
    getCustomData: function (key, index) {
        return this._getCall(index, 'getCustomData', [key]);
    },
    
    /**
     * Jeeelの独自データを全ての要素に設定する<brr />
     * IE以外ではプロパティが拡張されるので注意(詳しくはJeeel.Storage.Objectを参照)<br />
     * またネームスペースは初期値を用いる
     * 
     * @param {String} key データキー
     * @param {Mixied} data データ
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     * @see Jeeel.Storage.Object
     */
    setCustomData: function (key, data) {
        return this._callMethod('setCustomData', [key, data]);
    },
    
    /**
     * 指定要素の左上絶対軸座標を返す
     *
     * @param {Integer} [index] インデックス(省略は0)
     * @return {Jeeel.Object.Point} 左上の座標
     */
    getPos: function (index) {
        return this._getCall(index, 'getPosition');
    },
    
    /**
     * 指定要素のサイズを取得する
     * 
     * @param {Integer} [index] インデックス(省略は0)
     * @return {Jeeel.Object.Size} サイズ
     */
    getSize: function (index) {
        return this._getCall(index, 'getSize');
    },
    
    /**
     * 指定要素の左上絶対座標とサイズを併せ持った構造体を取得する
     * 
     * @param {Integer} [index] インデックス(省略は0)
     * @return {Jeeel.Object.Rect} レクト
     */
    getRect: function (index) {
        return this._getCall(index, 'getRect');
    },
    
    /**
     * 指定要素のスクロール位置を取得する
     * 
     * @param {Integer} [index] インデックス(省略は0)
     * @return {Jeeel.Object.Point} スクロール位置
     */
    getScrollPos: function (index) {
        return this._getCall(index, 'getScrollPosition');
    },

    /**
     * 指定要素のinnerHTMLを取得する
     *
     * @param {Integer} [index] インデックス(省略は0)
     * @return {String} 取得HTML
     */
    getHtml: function (index) {
        return this._getCall(index, 'getHtml');
    },

    /**
     * 全ての要素のinnerHTMLに指定HTMLを書き込む
     *
     * @param {String} html 設定HTML
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     */
    setHtml: function (html) {
        return this._callMethod('setHtml', [html]);
    },

    /**
     * 指定要素のTextを取得する
     *
     * @param {Integer} [index] インデックス(省略は0)
     * @return {String} 取得Text
     */
    getText: function (index) {
        return this._getCall(index, 'getText');
    },

    /**
     * 全ての要素にTextを書き込む<br />
     * その際innerHtmlが書き変わる
     *
     * @param {String} text 設定Text
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     */
    setText: function (text) {
        return this._callMethod('setText', [text]);
    },

    /**
     * 指定要素のvalueを取得する
     *
     * @param {Integer} [index] インデックス(省略は0)
     * @return {Mixied} 取得value
     */
    getVal: function (index) {
        return this.getProp('value', index);
    },

    /**
     * 全ての要素のvalueを取得する
     *
     * @return {Array} 取得value
     */
    getValAll: function () {
        var res = [];

        for (var i = this.length; i--;) {
            res[i] = this.getVal(i);
        }

        return res;
    },

    /**
     * 全ての要素のvalueに指定HTMLを書き込む
     *
     * @param {Mixied} value 設定値
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     */
    setVal: function (value) {
        return this.setProp('value', value);
    },

    /**
     * 指定要素の内部に含まれているInputのリストを返す<br />
     * 名前が指定されており、送信される状態の要素のみ対象になる
     *
     * @param {Integer} [index] インデックス(省略は0)
     * @return {Hash} input,select,button,textareaのリスト(キーはそれぞれのname)
     */
    getInput: function (index) {},

    /**
     * 指定要素の内部に含まれているInput値のリストを返す<br />
     * 名前が指定されており、送信される状態の要素のみ対象になる
     *
     * @param {Integer} [index] インデックス(省略は0)
     * @return {Hash} input,select,button,textareaのリスト(キーはそれぞれのname)
     */
    getInputVal: function (index) {},
    
    /**
     * 全ての要素のElementの共通の親を返す<br />
     * ただし全てがDom上に存在しないと正しい値は取れない
     * 
     * @return {Node} 共通の親最上階層はDocument(Dom上に存在しない要素が居た場合はnullを返す)
     */
    getCommonParent: function () {},
    
    /**
     * 指定したクラス名を持つ要素のみを新規にインスタンス作成して返す
     *
     * @param {String|String[]} className 許可クラスリストもしくは許可クラス
     * @return {Jeeel.Dom.ElementOperator} 作成したインスタンス
     */
    filterClass: function (className) {
      
        if ( ! Jeeel.Type.isArray(className)) {
            className = [className];
        }

        var res = this._each(
            function () {
                var tmp = this.getClassNames();

                for (var i = 0, l = tmp.length; i < l; i++) {
                    if (Jeeel.Hash.inHash(tmp[i], className)) {
                        return this;
                    }
                }
            }
        );

        return this.constructor.create(res, this);
    },
    
    /**
     * 指定した名前の要素のみを新規にインスタンス作成して返す
     *
     * @param {String|String[]} name 許可名リストもしくは許可名
     * @param {Boolean} [submitSearch] 送信時と同じようにc[]等の配列指定をヒットさせるかどうか(初期値はfalse)
     * @return {Jeeel.Dom.ElementOperator} 作成したインスタンス
     */
    filterName: function (name, submitSearch) {},
    
    /**
     * 指定したタグの要素のみを新規にインスタンス作成して返す
     *
     * @param {String|String[]} tag 許可タグリストもしくは許可タグ
     * @return {Jeeel.Dom.ElementOperator} 作成したインスタンス
     */
    filterTag: function (tag) {
      
        if ( ! Jeeel.Type.isArray(tag)) {
            tag = [tag];
        }

        var res = this._each(
            function () {
                var tmp = this.getTagName();

                if (Jeeel.Hash.inHash(tmp, tag)) {
                    return this;
                }
            }
        );

        return this.constructor.create(res, this);
    },

    /**
     * 指定した属性がある値の要素のみを新規にインスタンス作成して返す
     *
     * @param {String} attribute 属性名
     * @param {String|String[]} value 許可値リストもしくは許可値
     * @return {Jeeel.Dom.ElementOperator} 作成したインスタンス
     */
    filterAttr: function (attribute, value) {
        
        if ( ! Jeeel.Type.isArray(value)) {
            value = [value];
        }
      
        var res = this._each(
            function () {
                var tmp = this.getAttribute(attribute);

                if (Jeeel.Hash.inHash(tmp, value)) {
                    return this;
                }
            }
        );

        return this.constructor.create(res, this);
    },

    /**
     * 指定したプロパティがある値の要素のみを新規にインスタンス作成して返す
     *
     * @param {String} property プロパティ名
     * @param {Mixied} value 許可値リストもしくは許可値
     * @return {Jeeel.Dom.ElementOperator} 作成したインスタンス
     */
    filterProp: function (property, value) {
        if ( ! Jeeel.Type.isArray(value)) {
            value = [value];
        }
        
        var res = this._each(
            function () {
                var tmp = this.getProperty(property);

                if (Jeeel.Hash.inHash(tmp, value)) {
                    return this;
                }
            }
        );

        return this.constructor.create(res, this);
    },
    
    /**
     * 指定したスタイルがある値の要素のみを新規にインスタンス作成して返す
     *
     * @param {String} css スタイル名
     * @param {String|String[]} value 許可値リストもしくは許可値
     * @return {Jeeel.Dom.ElementOperator} 作成したインスタンス
     */
    filterCss: function (css, value) {
        if ( ! Jeeel.Type.isArray(value)) {
            value = [value];
        }
        
        var res = this._each(
            function () {
                var tmp = this.getStyle(css);

                if (Jeeel.Hash.inHash(tmp, value)) {
                    return this;
                }
            }
        );

        return this.constructor.create(res, this);
    },
    
    /**
     * 指定した範囲検索ひヒットした要素のみを新規にインスタンス作成して返す
     *
     * @param {Jeeel.Object.Rect} rect 対象範囲
     * @param {Function} [option] 検索オプション(デフォルトは重なったElement)
     * @return {Jeeel.Dom.ElementOperator} 作成したインスタンス
     * @see Jeeel.Dom.SearchOption
     */
    filterRange: function (rect, option) {
        var res = [], trect;
        
        if ( ! option) {
            option = Jeeel.Dom.SearchOption.RANGE_OVERLAY;
        }
      
        var res = this._each(
            function () {
                trect = this.getRect();

                if (option(rect, trect)) {
                    return this;
                }
            }
        );

        return this.constructor.create(res, this);
    },
    
    /**
     * 指定した要素のみを新規にインスタンス作成して返す
     *
     * @param {Hash} element 許可Elementまたは複数のElementリスト(Jeeel.Dom.ElementOperatorやJeeel.Dom.Element自体やリストでも可能)
     * @return {Jeeel.Dom.ElementOperator} 作成したインスタンス
     */
    filterElement: function (element) {
        element = this.constructor._flat(element);
        
        var res = [];
        
        for (var i = 0; i < this.length; i++) {
            if (Jeeel.Hash.inHash(this[i], element)) {
                res[res.length] = this[i];
            }
        }

        return this.constructor.create(res, this);
    },
    
    /**
     * 指定したクラス名を持つ要素を全て取り除き新規にインスタンス作成して返す
     *
     * @param {String|String[]} className 非許可クラスリストもしくは非許可クラス
     * @return {Jeeel.Dom.ElementOperator} 作成したインスタンス
     */
    revFilterClass: function (className) {
      
        if ( ! Jeeel.Type.isArray(className)) {
            className = [className];
        }

        var res = this._each(
            function () {
                var tmp = this.getClassNames();

                for (var i = 0, l = tmp.length; i < l; i++) {
                    if ( ! Jeeel.Hash.inHash(tmp[i], className)) {
                        return this;
                    }
                }
            }
        );

        return this.constructor.create(res, this);
    },
    
    /**
     * 指定した名前の要素を全て取り除き新規にインスタンス作成して返す
     *
     * @param {String|String[]} name 非許可名リストもしくは非許可名
     * @param {Boolean} [submitSearch] 送信時と同じようにc[]等の配列指定をヒットさせるかどうか(初期値はfalse)
     * @return {Jeeel.Dom.ElementOperator} 作成したインスタンス
     */
    revFilterName: function (name, submitSearch) {},
    
   /**
     * 指定したタグの要素を全て取り除き新規にインスタンス作成して返す
     *
     * @param {String|String[]} tag 許可タグリストもしくは許可タグ
     * @return {Jeeel.Dom.ElementOperator} 作成したインスタンス
     */
    revFilterTag: function (tag) {
      
        if ( ! Jeeel.Type.isArray(tag)) {
            tag = [tag];
        }

        var res = this._each(
            function () {
                var tmp = this.getTagName();

                if ( ! Jeeel.Hash.inHash(tmp, tag)) {
                    return this;
                }
            }
        );

        return this.constructor.create(res, this);
    },

    /**
     * 指定した属性がある値の要素を全て取り除き新規にインスタンスを作成して返す
     *
     * @param {String} attribute 属性名
     * @param {String|String[]} value 非許可値リストもしくは非許可値
     * @return {Jeeel.Dom.ElementOperator} 作成したインスタンス
     */
    revFilterAttr: function (attribute, value) {
        if ( ! Jeeel.Type.isArray(value)) {
            value = [value];
        }
        
        var res = this._each(
            function () {
                var tmp = this.getAttribute(attribute);

                if ( ! Jeeel.Hash.inHash(tmp, value)) {
                    return this;
                }
            }
        );

        return this.constructor.create(res, this);
    },

    /**
     * 指定したプロパティがある値の要素を全て取り除き新規にインスタンスを作成して返す
     *
     * @param {String} property プロパティ名
     * @param {Mixied} value 非許可値リストもしくは非許可値
     * @return {Jeeel.Dom.ElementOperator} 作成したインスタンス
     */
    revFilterProp: function (property, value) {
        if ( ! Jeeel.Type.isArray(value)) {
            value = [value];
        }
        
        var res = this._each(
            function () {
                var tmp = this.getProperty(property);

                if ( ! Jeeel.Hash.inHash(tmp, value)) {
                    return this;
                }
            }
        );

        return this.constructor.create(res, this);
    },
    
    /**
     * 指定したスタイルがある値の要素を全て取り除き新規にインスタンスを作成して返す
     *
     * @param {String} css スタイル名
     * @param {String|String[]} value 非許可値リストもしくは非許可値
     * @return {Jeeel.Dom.ElementOperator} 作成したインスタンス
     */
    revFilterCss: function (css, value) {
        if ( ! Jeeel.Type.isArray(value)) {
            value = [value];
        }
        
        var res = this._each(
            function () {
                var tmp = this.getStyle(css);

                if ( !  Jeeel.Hash.inHash(tmp, value)) {
                    return this;
                }
            }
        );

        return this.constructor.create(res, this);
    },
    
    /**
     * 指定した範囲検索ヒットした要素を全て取り除き新規にインスタンスを作成して返す
     *
     * @param {Jeeel.Object.Rect} rect 対象範囲
     * @param {Function} [option] 検索オプション(デフォルトは重なったElement)
     * @return {Jeeel.Dom.ElementOperator} 作成したインスタンス
     * @see Jeeel.Dom.SearchOption
     */
    revFilterRange: function (rect, option) {
        var res = [], trect;
        
        if ( ! option) {
            option = Jeeel.Dom.SearchOption.RANGE_OVERLAY;
        }
      
        var res = this._each(
            function () {
                trect = this.getRect();

                if ( ! option(rect, trect)) {
                    return this;
                }
            }
        );

        return this.constructor.create(res, this);
    },
    
    /**
     * 指定した要素を全て取り除き新規にインスタンス作成して返す
     *
     * @param {Hash} element 非許可Elementまたは複数のElementリスト(Jeeel.Dom.ElementOperatorやJeeel.Dom.Element自体やリストでも可能)
     * @return {Jeeel.Dom.ElementOperator} 作成したインスタンス
     */
    revFilterElement: function (element) {
        element = this.constructor._flat(element);

        var res = this._each(
            function () {
                var tmp = this.getElement();

                if ( ! Jeeel.Hash.inHash(tmp, element)) {
                    return this;
                }
            }
        );

        return this.constructor.create(res, this);
    },

    /**
     * インデックスが偶数の要素のみを纏めて新規インスタンスとして返す
     *
     * @return {Jeeel.Dom.ElementOperator} 作成したインスタンス
     */
    filterEven: function () {
        var res = this._each(
            function (val, key) {

                if ((key & 1) === 1) {
                    return this;
                }
            }
        );

        return this.constructor.create(res, this);
    },

    /**
     * インデックスが奇数の要素のみを纏めて新規インスタンスとして返す
     *
     * @return {Jeeel.Dom.ElementOperator} 作成したインスタンス
     */
    filterOdd: function () {
        var res = this._each(
            function (val, key) {

                if ((key & 1) === 0) {
                    return this;
                }
            }
        );

        return this.constructor.create(res, this);
    },
    
    /**
     * 指定したインデックスの要素を対象にElementラッパーを作成する
     *
     * @param {Integer} index インデックス(負の数を指定すると後ろから参照する)
     * @return {Jeeel.Dom.ElementOperator} 取得したElementラッパー
     */
    $GET: function (index) {
        return this.constructor.create(this.get(index), this);
    },

    /**
     * 全要素内の指定名のinput要素を対象にElementラッパーを作成する<br />
     * 名前が指定されており、送信される状態の要素のみ対象になる
     *
     * @param {String} [name] 名前を指定する場合は指定する
     * @return {Jeeel.Dom.ElementOperator} 取得したElementラッパー
     */
    $INPUT: function (name) {

        var res = [];

        for (var i = 0; i < this.length; i++) {
            var tmp = this.getInput(i);

            if (name) {
                tmp = tmp[name];
            }

            tmp = this.constructor._flat(tmp);
            res = res.concat(tmp);
        }

        return this.constructor.create(res, this);
    },

    /**
     * 全ての要素の子リストから指定IDのHTML要素を取得する
     *
     * @param {String} id 検索ID
     * @return {Jeeel.Dom.ElementOperator} 取得したElementラッパー(取得できなかった場合はnull)
     */
    $ID: function (id) {
        if ( ! id) {
            return null;
        }

        var res = null;

        this._each(
            function () {
                var tmp = this.getElementById(id);

                if (tmp) {
                    res = tmp;
                    return Jeeel.Hash.FOR_EACH_EXIT;
                }
            }
        );

        return res && this.constructor.create(res, this);
    },

    /**
     * 全ての要素の子リストから指定ClassのHTML要素を取得する
     *
     * @param {String|String[]} className 検索Class
     * @return {Jeeel.Dom.ElementOperator} 取得したElement配列ラッパー
     */
    $CLASS: function (className) {
        if ( ! className) {
            return this.constructor.create([], this);
        }

        var res = [];

        this._each(
            function () {
                var tmp = this.getElementsByClassName(className);

                if (tmp.length) {
                    res = Jeeel.Hash.merge(res, tmp);
                }
            }
        );

        return this.constructor.create(res, this);
    },

    /**
     * 全ての要素の子リストから指定NameのHTML要素を取得する
     * なおsubmitSearchを指定すると<br />
     * この動作は一部本来のgetElementsByNameと違い、<br />
     * c[]等で配列指定した値に対してもヒットする
     *
     * @param {String|String[]} name 検索Name
     * @param {Boolean} [submitSearch] 送信時と同じようにc[]等の配列指定をヒットさせるかどうか(初期値はfalse)
     * @return {Jeeel.Dom.ElementOperator} 取得したElement配列ラッパー
     */
    $NAME: function (name, submitSearch) {
        if ( ! name) {
            return this.constructor.create([], this);
        }

        var res = [];

        this._each(
            function () {
                var tmp = this.getElementsByName(name, submitSearch);

                if (tmp.length) {
                    res = Jeeel.Hash.merge(res, tmp);
                }
            }
        );

        return this.constructor.create(res, this);
    },

    /**
     * 全ての要素の子リストから指定TagのHTML要素を取得する
     *
     * @param {String|String[]} tagName 検索Tag
     * @return {Jeeel.Dom.ElementOperator} 取得したElement配列ラッパー
     */
    $TAG: function (tagName) {
        if ( ! tagName) {
            return this.constructor.create([], this);
        }

        var res = [];

        this._each(
            function () {
                var tmp = this.getElementsByTagName(tagName);

                if (tmp.length) {
                    res = Jeeel.Hash.merge(res, tmp);
                }
            }
        );

        return this.constructor.create(res, this);
    },

    /**
     * 全ての要素の子リストから指定属性が指定値のHTML要素を取得する
     *
     * @param {String} attribute 属性名
     * @param {String} value 属性値('*'を指定すると任意の値の意味になる)
     * @return {Jeeel.Dom.ElementOperator} 取得したElement配列ラッパー
     */
    $ATTR: function (attribute, value) {
        if ( ! attribute) {
            return this.constructor.create([], this);
        }

        var res = [];

        this._each(
            function () {
                var tmp = this.getElementsByAttribute(attribute, value);

                if (tmp.length) {
                    res = Jeeel.Hash.merge(res, tmp);
                }
            }
        );

        return this.constructor.create(res, this);
    },

    /**
     * 全ての要素の子リストから指定プロパティが指定値のHTML要素を取得する<br />
     * Elementのプロパティである事に注意
     *
     * @param {String} property プロパティ名
     * @param {Mixied} value 指定値('*'を指定すると任意の値の意味になる)
     * @return {Jeeel.Dom.ElementOperator} 取得したElement配列ラッパー
     */
    $PROP: function (property, value) {
        if ( ! property) {
            return this.constructor.create([], this);
        }

        var res = [];

        this._each(
            function () {
                var tmp = this.getElementsByProperty(property, value);

                if (tmp.length) {
                    res = Jeeel.Hash.merge(res, tmp);
                }
            }
        );

        return this.constructor.create(res, this);
    },
    
    /**
     * 全ての要素の子リストからセレクタにヒットするのHTML要素を取得する
     *
     * @param {String} selector CSSと同じ絞り込みセレクタ
     * @return {Jeeel.Dom.ElementOperator} 取得したElement配列ラッパー
     * @see Jeeel.Dom.Selector
     */
    $QUERY: function (selector) {
        if ( ! selector) {
            return this.constructor.create([], this);
        }

        var res = [];

        this._each(
            function () {
                var tmp = this.getElementsBySelector(selector);

                if (tmp.length) {
                    res = Jeeel.Hash.merge(res, tmp);
                }
            }
        );

        return this.constructor.create(res, this);
    },
    
    /**
     * 全ての要素の次の要素を検索取得する
     * 
     * @param {Integer} [nextCount] いくつ次を参照するか
     * @return {Jeeel.Dom.ElementOperator} 取得したElement配列ラッパー
     */
    $NEXT: function (nextCount) {
        if (nextCount === 0) {
            return this.clone(false);
        }

        var res = this._getCalls('getNextNode', [nextCount]);

        return this.constructor.create(res, this);
    },
    
    /**
     * 全ての要素の前の要素を検索取得する
     * 
     * @param {Integer} [prevCount] いくつ前を参照するか
     * @return {Jeeel.Dom.ElementOperator} 取得したElement配列ラッパー
     */
    $PREV: function (prevCount) {
        if (prevCount === 0) {
            return this.clone(false);
        }

        var res = this._getCalls('getPrevNode', [prevCount]);

        return this.constructor.create(res, this);
    },
    
    /**
     * 全ての要素の子要素を取得する
     * 
     * @return {Jeeel.Dom.ElementOperator} 取得したElement配列ラッパー
     */
    $CHILDREN: function () {
        var res = this._getCalls('getChildren');

        return this.constructor.create(res, this);
    },
    
    /**
     * 全ての要素の子リストからHTML要素を指定範囲検索する
     *
     * @param {Jeeel.Object.Rect} rect 対象範囲
     * @param {String} [option] 検索オプション(デフォルトは重なったElement)
     * @return {Jeeel.Dom.ElementOperator} 範囲検索に引っかかったElement配列ラッパー
     * @see Jeeel.Dom.SearchOption
     */
    $RANGE: function (rect, option) {
        if ( ! rect) {
            return this.constructor.create([], this);
        }

        var res = [];

        this._each(
            function () {
                var tmp = this.searchElementsByRange(rect, option);

                if (tmp.length) {
                    res = Jeeel.Hash.merge(res, tmp);
                }
            }
        );

        return this.constructor.create(res, this);
    },

    /**
     * 全ての要素内にforeachをかける<br />
     * その際foreachに渡される値はJeeel.Dom.ElementOperator型となる<br />
     * 詳しくはJeeel.Hash.forEach参照
     *
     * @param {Function} eachMethod コールバックメソッド
     * @param {Mixied} [thisArg] thisに相当する値
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     * @see Jeeel.Hash.forEach
     */
    $EACH: function (eachMethod, thisArg) {
        var res = [];
        
        for (var i = 0; i < this.length; i++) {
            res[i] = new this.constructor(this[i]);
        }

        Jeeel.Hash.forEach(res, eachMethod, thisArg);
        
        return this;
    },

    /**
     * 全ての要素内にforeachをかける<br />
     * その際foreachに渡される値はElement型となる<br />
     * 詳しくはJeeel.Hash.forEach参照
     *
     * @param {Function} eachMethod コールバックメソッド
     * @param {Mixied} [thisArg] thisに相当する値
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     * @see Jeeel.Hash.forEach
     */
    each: function (eachMethod, thisArg) {
        Jeeel.Hash.forEach(this.getAll(), eachMethod, thisArg);
        
        return this;
    },
    
    /**
     * 全ての要素をDom上から取り除く
     *
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     */
    remove: function () {
        return this._callMethod('remove');
    },
    
    /**
     * 全ての要素を表示する
     *
     * @param {Integer|String} [speed] 指定するとアニメーションになる(ミリ秒かfast, slow, defaultの文字列定数がある)
     * @param {Function|String} [easing] アニメーションの数値の変化度合いを変える関数もしくはそれを表す文字列(Jeeel.Dom.Style.Animation.Easingの中の関数名、例:swing等)
     * @param {Function} [complete] アニメーションにした際に終了時に呼ばれるコールバック
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     * @see Jeeel.Dom.Style.Animation.Easing
     */
    show: function (speed, easing, complete, thisArg) {
        return this._callMethod('show', [speed, easing, complete, thisArg || this]);
    },

    /**
     * 全ての要素を隠す
     *
     * @param {Integer|String} [speed] 指定するとアニメーションになる(ミリ秒かfast, slow, defaultの文字列定数がある)
     * @param {Function|String} [easing] アニメーションの数値の変化度合いを変える関数もしくはそれを表す文字列(Jeeel.Dom.Style.Animation.Easingの中の関数名、例:swing等)
     * @param {Function} [complete] アニメーションにした際に終了時に呼ばれるコールバック
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     * @see Jeeel.Dom.Style.Animation.Easing
     */
    hide: function (speed, easing, complete, thisArg) {
        return this._callMethod('hide', [speed, easing, complete, thisArg || this]);
    },

    /**
     * 全ての要素の表示状態を切り替える
     *
     * @param {Integer|String} [speed] 指定するとアニメーションになる(ミリ秒かfast, slow, defaultの文字列定数がある)
     * @param {Function|String} [easing] アニメーションの数値の変化度合いを変える関数もしくはそれを表す文字列(Jeeel.Dom.Style.Animation.Easingの中の関数名、例:swing等)
     * @param {Function} [complete] アニメーションにした際に終了時に呼ばれるコールバック
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     * @see Jeeel.Dom.Style.Animation.Easing
     */
    toggle: function (speed, easing, complete, thisArg) {
        return this._callMethod('toggle', [speed, easing, complete, thisArg || this]);
    },
    
    /**
     * 全ての要素に対してフェードインを行う
     * 
     * @param {Integer|String} [speed] 指定するとアニメーションになる(ミリ秒かfast, slow, defaultの文字列定数がある)
     * @param {Function|String} [easing] アニメーションの数値の変化度合いを変える関数もしくはそれを表す文字列(Jeeel.Dom.Style.Animation.Easingの中の関数名、例:swing等)
     * @param {Function} [complete] アニメーションにした際に終了時に呼ばれるコールバック
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     * @see Jeeel.Dom.Style.Animation.Easing
     */
    fadeIn: function (speed, easing, complete, thisArg) {
        return this._callMethod('fadeIn', [speed, easing, complete, thisArg || this]);
    },
    
    /**
     * 全ての要素に対してフェードアウトを行う
     * 
     * @param {Integer|String} [speed] 指定するとアニメーションになる(ミリ秒かfast, slow, defaultの文字列定数がある)
     * @param {Function|String} [easing] アニメーションの数値の変化度合いを変える関数もしくはそれを表す文字列(Jeeel.Dom.Style.Animation.Easingの中の関数名、例:swing等)
     * @param {Function} [complete] アニメーションにした際に終了時に呼ばれるコールバック
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     * @see Jeeel.Dom.Style.Animation.Easing
     */
    fadeOut: function (speed, easing, complete, thisArg) {
        return this._callMethod('fadeOut', [speed, easing, complete, thisArg || this]);
    },
    
    /**
     * 全ての要素に対してフェードトグルを行う
     * 
     * @param {Integer|String} [speed] 指定するとアニメーションになる(ミリ秒かfast, slow, defaultの文字列定数がある)
     * @param {Function|String} [easing] アニメーションの数値の変化度合いを変える関数もしくはそれを表す文字列(Jeeel.Dom.Style.Animation.Easingの中の関数名、例:swing等)
     * @param {Function} [complete] アニメーションにした際に終了時に呼ばれるコールバック
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     * @see Jeeel.Dom.Style.Animation.Easing
     */
    fadeToggle: function (speed, easing, complete, thisArg) {
        return this._callMethod('fadeToggle', [speed, easing, complete, thisArg || this]);
    },
    
    /**
     * 全ての要素に対してスライドアップを行う
     * 
     * @param {Integer|String} [speed] 指定するとアニメーションになる(ミリ秒かfast, slow, defaultの文字列定数がある)
     * @param {Function|String} [easing] アニメーションの数値の変化度合いを変える関数もしくはそれを表す文字列(Jeeel.Dom.Style.Animation.Easingの中の関数名、例:swing等)
     * @param {Function} [complete] アニメーションにした際に終了時に呼ばれるコールバック
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     * @see Jeeel.Dom.Style.Animation.Easing
     */
    slideUp: function (speed, easing, complete, thisArg) {
        return this._callMethod('slideUp', [speed, easing, complete, thisArg || this]);
    },
    
    /**
     * 全ての要素に対してスライドダウンを行う
     * 
     * @param {Integer|String} [speed] 指定するとアニメーションになる(ミリ秒かfast, slow, defaultの文字列定数がある)
     * @param {Function|String} [easing] アニメーションの数値の変化度合いを変える関数もしくはそれを表す文字列(Jeeel.Dom.Style.Animation.Easingの中の関数名、例:swing等)
     * @param {Function} [complete] アニメーションにした際に終了時に呼ばれるコールバック
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     * @see Jeeel.Dom.Style.Animation.Easing
     */
    slideDown: function (speed, easing, complete, thisArg) {
        return this._callMethod('slideDown', [speed, easing, complete, thisArg || this]);
    },
    
    /**
     * 全ての要素に対してスライドトグルを行う
     * 
     * @param {Integer|String} [speed] 指定するとアニメーションになる(ミリ秒かfast, slow, defaultの文字列定数がある)
     * @param {Function|String} [easing] アニメーションの数値の変化度合いを変える関数もしくはそれを表す文字列(Jeeel.Dom.Style.Animation.Easingの中の関数名、例:swing等)
     * @param {Function} [complete] アニメーションにした際に終了時に呼ばれるコールバック
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     * @see Jeeel.Dom.Style.Animation.Easing
     */
    slideToggle: function (speed, easing, complete, thisArg) {
        return this._callMethod('slideToggle', [speed, easing, complete, thisArg || this]);
    },
    
    /**
     * アニメーションを開始する
     * 
     * @param {Hash} params アニメーション変化の数値
     * @param {Integer|String} [duration] アニメーションが完結するまでの時間(ミリ秒)か定義文字列(fast, slow, defaultがある)
     * @param {Function|String} [easing] アニメーションの数値の変化度合いを変える関数もしくはそれを表す文字列(Jeeel.Dom.Style.Animation.Easingの中の関数名、例:swing等)
     * @param {Function} [complete] アニメーション終了時に呼ばれるコールバック
     * @param {Function} [step] アニメーション更新時に呼ばれるコールバック
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     * @see Jeeel.Dom.Style.Animation.Easing
     */
    animate: function (params, duration, easing, complete, step, thisArg) {
        return this._callMethod('animate', [params, duration, easing, complete, step, thisArg || this]);
    },
    
    /**
     * アニメーション管理インスタンスを取得する
     * 
     * @return {Jeeel.Dom.ElementOperator.Animator} 管理インスタンス
     */
    getAnimator: function () {
        return new this.constructor.Animator(this._getCalls('getAnimator'), this);
    },
    
    /**
     * 全ての要素を指定座標に移動する
     * 
     * @param {Integer} x X座標
     * @param {Integer} y Y座標
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     */
    shiftTo: function (x, y) {
        return this._callMethod('shiftTo', [x, y]);
    },
    
    /**
     * 全ての要素のスクロールを行う
     * 
     * @param {Integer} x X座標
     * @param {Integer} y Y座標
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     * @ignore
     */
    scroll: function (x, y) {
        return this._callMethod('scroll', [x, y]);
    },

    /**
     * 全ての要素にクリックイベントの登録をする
     *
     * @param {Function} callback イベントコールバック
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     */
    addClick: function (callback, thisArg) {
        return this.addEvent(Jeeel.Dom.Event.Type.CLICK, callback, thisArg);
    },
    
    /**
     * 全ての要素にマウスダウンイベントの登録をする
     *
     * @param {Function} callback イベントコールバック
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     */
    addMouseDown: function (callback, thisArg) {
        return this.addEvent(Jeeel.Dom.Event.Type.MOUSE_DOWN, callback, thisArg);
    },
    
    /**
     * 全ての要素にマウスアップイベントの登録をする
     *
     * @param {Function} callback イベントコールバック
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     */
    addMouseUp: function (callback, thisArg) {
        return this.addEvent(Jeeel.Dom.Event.Type.MOUSE_UP, callback, thisArg);
    },
    
    /**
     * 全ての要素にマウスムーブイベントの登録をする
     *
     * @param {Function} callback イベントコールバック
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     */
    addMouseMove: function (callback, thisArg) {
        return this.addEvent(Jeeel.Dom.Event.Type.MOUSE_MOVE, callback, thisArg);
    },

    /**
     * 全ての要素にロードイベントの登録をする
     *
     * @param {Function} callback イベントコールバック
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     */
    addLoad: function (callback, thisArg) {
        return this.addEvent(Jeeel.Dom.Event.Type.LOAD, callback, thisArg);
    },

    /**
     * 全ての要素にマウスオーバーイベントの登録をする
     *
     * @param {Function} callback イベントコールバック
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     */
    addOver: function (callback, thisArg) {
        return this.addEvent(Jeeel.Dom.Event.Type.MOUSE_OVER, callback, thisArg);
    },

    /**
     * 全ての要素にマウスアウトイベントの登録をする
     *
     * @param {Function} callback イベントコールバック
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     */
    addOut: function (callback, thisArg) {
        return this.addEvent(Jeeel.Dom.Event.Type.MOUSE_OUT, callback, thisArg);
    },

    /**
     * 全ての要素にマウスホバーイベントの登録をする
     *
     * @param {Function} overCallback マウスオーバーイベントコールバック
     * @param {Function} outCallback マウスアウトイベントのコールバック
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     */
    addHover: function (overCallback, outCallback, thisArg) {

        this.addOver(overCallback, thisArg);
        return this.addOut(outCallback, thisArg);
    },
    
    /**
     * 全ての要素にイベントの登録をする
     *
     * @param {String} type イベントタイプ
     * @param {Function} callback イベントコールバック
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     */
    addEvent: function (type, callback, thisArg) {
        var thisArgVal = thisArg;
        
        this._each(
            function () {
                if ( ! Jeeel.Type.isSet(thisArg)) {
                    thisArgVal = Jeeel.Dom.ElementOperator.create(this);
                }
                
                this.addEventListener(type, callback, thisArgVal);
            }
        );

        return this;
    },

    /**
     * 全ての要素からクリックイベントを削除する
     *
     * @param {Function} callback イベントコールバック
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     */
    removeClick: function (callback) {
        return this.removeEvent(Jeeel.Dom.Event.Type.CLICK, callback);
    },
    
    /**
     * 全ての要素からマウスダウンイベントを削除する
     *
     * @param {Function} callback イベントコールバック
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     */
    removeMouseDown: function (callback) {
        return this.removeEvent(Jeeel.Dom.Event.Type.MOUSE_DOWN, callback);
    },
    
    /**
     * 全ての要素からマウスアップイベントを削除する
     *
     * @param {Function} callback イベントコールバック
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     */
    removeMouseUp: function (callback) {
        return this.removeEvent(Jeeel.Dom.Event.Type.MOUSE_UP, callback);
    },
    
    /**
     * 全ての要素からマウスムーブイベントを削除する
     *
     * @param {Function} callback イベントコールバック
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     */
    removeMouseMove: function (callback) {
        return this.removeEvent(Jeeel.Dom.Event.Type.MOUSE_MOVE, callback);
    },

    /**
     * 全ての要素からロードイベントを削除する
     *
     * @param {Function} callback イベントコールバック
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     */
    removeLoad: function (callback) {
        return this.removeEvent(Jeeel.Dom.Event.Type.LOAD, callback);
    },

    /**
     * 全ての要素からマウスオーバーイベントを削除する
     *
     * @param {Function} callback イベントコールバック
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     */
    removeOver: function (callback) {
        return this.removeEvent(Jeeel.Dom.Event.Type.MOUSE_OVER, callback);
    },

    /**
     * 全ての要素からマウスアウトイベントを削除する
     *
     * @param {Function} callback イベントコールバック
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     */
    removeOut: function (callback) {
        return this.removeEvent(Jeeel.Dom.Event.Type.MOUSE_OUT, callback);
    },

    /**
     * 全ての要素からマウスホバーイベントを削除する
     *
     * @param {Function} overCallback マウスオーバーイベントコールバック
     * @param {Function} outCallback マウスアウトイベントのコールバック
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     */
    removeHover: function (overCallback, outCallback) {

        this.removeOver(overCallback);
        return this.removeOut(outCallback);
    },
    
    /**
     * 全ての要素からイベントを削除する
     *
     * @param {String} type イベントタイプ
     * @param {Function} callback イベントコールバック
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     */
    removeEvent: function (type, callback) {
        return this._callMethod('removeEventListener', [type, callback]);
    },
    
    /**
     * 全ての要素に対してのイベントを上位Elementに委譲して登録を行う
     *
     * @param {String} type イベントタイプ
     * @param {Function} callback イベントコールバック
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     */
    delegate: function (type, callback, thisArg) {
        if ( ! Jeeel.Type.isSet(thisArg)) {
            thisArg = this;
        }

        Jeeel.Dom.Event.delegate(this, type, callback, thisArg);
        
        return this;
    },
    
    /**
     * 全ての要素に対してのイベントを上位Elementに委譲してたものの削除を行う
     *
     * @param {String} type イベントタイプ
     * @param {Function} callback イベントコールバック
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     */
    undelegate: function (type, callback) {
        Jeeel.Dom.Event.undelegate(this, type, callback);

        return this;
    },
     
    /**
     * このElementに設定されているイベントを任意のタイミングで実行する
     *
     * @param {String} type イベントタイプ
     * @param {Jeeel.Dom.Event.Option} [option] マウスイベントやキーボードイベント等のイベント時のパラメータを指定する
     * @ignore 未完成
     */
    dispatchEvent: function (type, option) {
        return this._callMethod('dispatchEvent', [type, option]);
    },
    
    /**
     * インスタンスを複製する
     *
     * @param {Boolean} [isDeep] 要素まで複製するかどうか
     * @return {Jeeel.Dom.ElementOperator} 複製後のインスタンス
     */
    clone: function (isDeep) {
        
        if (isDeep) {
            return new this.constructor(this._getCalls('clone', [true]), this._prev);
        }
        
        return new this.constructor(this._elementList, this._prev);
    },
    
    /**
     * コンストラクタ
     * 
     * @param {Hash} elementList 対象Elementまたは複数のElementリスト(Jeeel.Dom.ElementOperatorやJeeel.Dom.Element自体やリストでも可能)
     * @constructor
     */
    constructor: Jeeel.Dom.ElementOperator,
    
    /**
     * メソッドの内部呼び出しを行う
     * 
     * @param {String} methodName メソッド名
     * @param {Array} [args] 引数を指定する場合に渡す
     * @return {Jeeel.Dom.ElementOperator} 自インスタンス
     * @private
     */
    _callMethod: function (methodName, args) {
        this._each(
            function () {
                this[methodName].apply(this, args || []);
            }
        );

        return this;
    },
    
    /**
     * 戻り値を持ったメソッドの内部呼び出しを行う
     * 
     * @param {Integer} index 要素Index
     * @param {String} methodName メソッド名
     * @param {Array} [args] 引数を指定する場合に渡す
     * @return {Mixied} 戻り値
     * @private
     */
    _getCall: function (index, methodName, args) {
        if ( ! index) {
            index = 0;
        }
        
        if ( ! (index in this._elementList)) {
            return null;
        }
        
        var elm = this._elementList[index];
        
        return elm[methodName].apply(elm, args || []);
    },
    
    /**
     * インデックスを指定せずに戻り値を持った内部呼び出しを行う
     * 
     * @param {String} methodName メソッド名
     * @param {Array} [args] 引数を指定する場合に渡す
     * @return {Mixied} 戻り値
     * @private
     */
    _getCalls: function (methodName, args) {
        return this._each(
            function () {
                return this[methodName].apply(this, args || []);
            }
        );
    },

    /**
     * 内部的にforeachを掛ける
     *
     * @param {Function} eachMethod コールバックメソッド
     * @param {Mixied} [thisArg] thisに相当する値
     * @return {Hash} コールバックメソッド中に返した戻り値の配列
     * @private
     */
    _each: function (eachMethod, thisArg) {
        var tmp, res = [];
        
        var exit = Jeeel.Hash.FOR_EACH_EXIT;
        
        for (var i = 0, l = this.length; i < l; i++) {
            
            tmp = eachMethod.call(this._elementList[i], this._elementList[i], i);
            
            if (tmp === exit) {
                break;
            }
            
            res[res.length] = tmp;
        }
        
        return res;
    },
    
    /**
     * @ignore
     */
    _init: function () {
        var ief = new Jeeel.Filter.Html.Form(),
            ivf = new Jeeel.Filter.Html.FormValue(),
            auf = new Jeeel.Filter.Hash.Unique(true, true);
        
        /**
         * @ignore
         */
        this.filterName = function (name, submitSearch) {
            if ( ! Jeeel.Type.isArray(name)) {
                name = [name];
            }

            var res;

            if (submitSearch) {
                for (var i = name.length; i--;) {
                    name[i] = new RegExp('^' + Jeeel.String.escapeRegExp(name[i]) + '(?:$|\\[)');
                }

                res = this._each(
                    function () {
                        var tmp = this.getName();

                        for (var i = name.length; i--;) {
                            if (tmp.match(name[i])) {
                                return this;
                            }
                        }
                    }
                );
            } else {
                res = this._each(
                    function () {
                        var tmp = this.getName();

                        if (Jeeel.Hash.inHash(tmp, name)) {
                            return this;
                        }
                    }
                );
            }

            return this.constructor.create(res, this);
        };
        
        /**
         * @ignore
         */
        this.revFilterName = function (name, submitSearch) {
            if ( ! Jeeel.Type.isArray(name)) {
                name = [name];
            }

            var res;

            if (submitSearch) {
                for (var i = name.length; i--;) {
                    name[i] = new RegExp('^' + Jeeel.String.escapeRegExp(name[i]) + '(?:$|\\[)');
                }

                res = this._each(
                    function () {
                        var tmp =this.getName();

                        for (var i = name.length; i--;) {
                            if ( ! tmp.match(name[i])) {
                                return this;
                            }
                        }
                    }
                );
            } else {
                res = this._each(
                    function () {
                        var tmp = this.getName();

                        if ( ! Jeeel.Hash.inHash(tmp, name)) {
                            return this;
                        }
                    }
                );
            }

            return this.constructor.create(res, this);
        };
        
        /**
         * @ignore
         */
        this.getInput = function (index) {
            if ( ! index) {
                index = 0;
            } else if ( ! (index in this._elementList)) {
                return {};
            }

            return ief.filter(this[index]);
        };
        
        /**
         * @ignore
         */
        this.getInputVal = function (index) {
            if ( ! index) {
                index = 0;
            } else if ( ! (index in this._elementList)) {
                return {};
            }

            return ivf.filter(this[index]);
        };
        
        /**
         * @ignore
         */
        this.getCommonParent = function () {
            var elms = this._elementList,
                min = -1,
                hirs = [],
                args = [],
                p, i, l;

            for (i = elms.length; i--;) {
                hirs[i] = elms[i].getHierarchy();

                if (min < 0 || min > hirs[i]) {
                    min = hirs[i];
                }
            }

            for (i = elms.length; i--;) {
                args[i] = elms[i].getParentNode(hirs[i] - min);
            }

            args = auf.filter(args);
            
            l = args.length;

            while(l > 1) {

                for (i = l; i--;) {
                    p = args[i].parentNode;

                    if (args[i].ownerDocument && ! p) {
                        return null;
                    }

                    args[i] = p;
                }

                args = auf.filter(args);
                
                l = args.length;
            }

            return args[0];
        };
        
        delete this._init;
    }
};

Jeeel.Dom.ElementOperator.prototype._init();

Jeeel.file.Jeeel.Dom.ElementOperator = ['Animator'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Dom.ElementOperator, Jeeel.file.Jeeel.Dom.ElementOperator);