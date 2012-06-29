
/**
 * コンストラクタ
 *
 * @class オブジェクトの展開を動的に行うクラス
 * @param {Boolean} [useHtmlExplorer=false] Html展開及び操作を行う機能を使用するかどうか
 */
Jeeel.Debug.ObjectExpander = function (useHtmlExplorer) {
    Jeeel.Debug.ObjectExpander._createCss();
    
    this._useHtmlExplorer = !!useHtmlExplorer;
    this._mouseGesture = Jeeel.Gui.Mouse.Gesture.create();
};

/**
 * インスタンスの作成を行う
 *
 * @param {Boolean} [useHtmlExplorer=false] Html展開及び操作を行う機能を使用するかどうか
 * @return {Jeeel.Debug.ObjectExpander} 作成したインスタンス
 */
Jeeel.Debug.ObjectExpander.create = function (useHtmlExplorer) {
    return new this(useHtmlExplorer);
};

/**
 * 指定したオブジェクトを展開する
 *
 * @param {Mixied} obj 展開するオブジェクト
 * @param {Boolean} [useHtmlExplorer=false] Html展開及び操作を行う機能を使用するかどうか
 * @return {Element} 展開したオブジェクト
 */
Jeeel.Debug.ObjectExpander.expand = function (obj, useHtmlExplorer) {
    return this.create(useHtmlExplorer).expand(obj);
};

/**
 * 展開HTML要素のClass名
 *
 * @type String
 * @scope Jeeel.Debug.ObjectExpander
 * @constant
 */
Jeeel.Debug.ObjectExpander.EXPAND_OBJECT_ROOT_CLASS = 'jeeel-expand-object-root';

/**
 * 展開HTML要素のtableタグにあたる子要素のClass名
 *
 * @type String
 * @scope Jeeel.Debug.ObjectExpander
 * @constant
 */
Jeeel.Debug.ObjectExpander.EXPAND_TABLE_CLASS = 'jeeel-expand-object-table';

/**
 * 展開HTML要素のtrタグにあたる子要素のClass名
 *
 * @type String
 * @scope Jeeel.Debug.ObjectExpander
 * @constant
 */
Jeeel.Debug.ObjectExpander.EXPAND_CHILD_CLASS = 'jeeel-expand-object-child';

/**
 * HtmlExplorerを有効にした時の前景レイヤーのClass名
 *
 * @type String
 * @scope Jeeel.Debug.ObjectExpander
 * @constant
 */
Jeeel.Debug.ObjectExpander.HTML_LAYER_CLASS = 'jeeel-expand-element-layer';

/**
 * 開いている時の矢印のHTML文字列
 *
 * @type String
 * @scope Jeeel.Debug.ObjectExpander
 * @constant
 */
Jeeel.Debug.ObjectExpander.EXPAND_ARROW = '<font color="#515151">&#9660;</font>';

/**
 * 閉じている時の矢印のHTML文字列
 *
 * @type String
 * @scope Jeeel.Debug.ObjectExpander
 * @constant
 */
Jeeel.Debug.ObjectExpander.COLLAPSE_ARROW = '<font color="#515151">&#9654;</font>';

/**
 * メインに使用するフォントサイズ
 *
 * @type Integer
 * @scope Jeeel.Debug.ObjectExpander
 * @constant
 */
Jeeel.Debug.ObjectExpander.MAIN_FONT_SIZE = 16;

/**
 * 展開する矢印のフォントサイズ
 *
 * @type Integer
 * @scope Jeeel.Debug.ObjectExpander
 * @constant
 */
Jeeel.Debug.ObjectExpander.ARROW_FONT_SIZE = 15;

/**
 * この機能内で使用するCSSを定義する
 *
 * @private
 */
Jeeel.Debug.ObjectExpander._createCss = function () {
    if (arguments.callee.ignore) {
        return;
    }

    arguments.callee.ignore = true;

    var css = 'table.' + this.EXPAND_OBJECT_ROOT_CLASS + ' {\n'
            + '    position: relative;\n'
            + '    z-index: 10;\n'
            + '    border-spacing: 0px;\n'
            + '    white-space: nowrap;\n'
            + '    color: black;\n'
            + '    background-color: white;\n'
            + '    text-align: left;\n'
            + '    vertical-align: middle;\n'
            + '    font-family: "Arial", "Times New Roman", "Courier New", "Courier", cursive;\n'
            + '    width: auto;\n'
            + '}\n'
            + 'table.' + this.EXPAND_OBJECT_ROOT_CLASS + ' th,\n'
            + 'table.' + this.EXPAND_OBJECT_ROOT_CLASS + ' td {\n'
            + '    display: table-cell;\n'
            + '}\n'
            + 'table.' + this.EXPAND_OBJECT_ROOT_CLASS + ' table {\n'
            + '    width: auto;\n'
            + '    border-spacing: 0px;\n'
            + '}\n'
            + 'table.' + this.EXPAND_OBJECT_ROOT_CLASS + ' table,\n'
            + 'table.' + this.EXPAND_OBJECT_ROOT_CLASS + ' tbody,\n'
            + 'table.' + this.EXPAND_OBJECT_ROOT_CLASS + ' tr,\n'
            + 'table.' + this.EXPAND_OBJECT_ROOT_CLASS + ' th,\n'
            + 'table.' + this.EXPAND_OBJECT_ROOT_CLASS + ' td {\n'
            + '    font-size: ' + this.MAIN_FONT_SIZE + 'px;\n'
            + '    font-weight: normal;\n'
            + '    font-style: normal;\n'
            + '    margin: 0px;\n'
            + '    padding: 0px;\n'
            + '}\n'
            + 'tr.' + this.EXPAND_CHILD_CLASS + ' th,\n'
            + 'tr.' + this.EXPAND_CHILD_CLASS + ' td {\n'
            + '    padding: 0 0 2px 0;\n'
            + '}';

    Jeeel.Loader.addStyle(css);
};

Jeeel.Debug.ObjectExpander.prototype = {

    /**
     * Html要素の展開及び操作を行うモードかどうかを示す
     *
     * @type Boolean
     * @private
     */
    _useHtmlExplorer: false,
    
    /**
     * 展開を行った情報を保持するHtml要素
     * 
     * @type Element
     * @private
     */
    _rootElement: null,

    /**
     * 現在選択中のHTML要素
     *
     * @type Element
     * @private
     */
    _selectedElement: null,

    /**
     * 現在選択中のexpand要素
     *
     * @type Element
     * @private
     */
    _selectedTarget: null,

    /**
     * 現在選択中の削除expand要素
     *
     * @type Element
     * @private
     */
    _selectedRemoveTarget: null,

    /**
     * マウスジェスチャインスタンス
     *
     * @type Jeeel.Gui.Mouse.Gesture
     * @private
     */
    _mouseGesture: null,

    /**
     * Html要素の削除を行うジェスチャー<br />
     * ↓→
     *
     * @type Integer[]
     * @private
     * @constant
     */
    _removeGesture: [40, 39],
    
    /**
     * コンストラクタ
     * 
     * @param {Boolean} [useHtmlExplorer=false] Html展開及び操作を行う機能を使用するかどうか
     * @constructor
     */
    constructor: Jeeel.Debug.ObjectExpander,

    /**
     * 指定したオブジェクトを展開する
     *
     * @param {Mixied} obj 展開するオブジェクト
     * @return {Element} 展開したオブジェクト
     */
    expand: function (obj) {
        this._rootElement = this._createExpander.call(this, obj, null, false, true);
        this._rootElement.className = this.constructor.EXPAND_OBJECT_ROOT_CLASS;
        
        return this._rootElement;
    },
    
    /**
     * オブジェクトを展開できるHTML要素を作成する
     *
     * @param {Mixied} obj 展開対象のオブジェクト
     * @param {String} [key] オブジェクトに対応するキー
     * @param {Boolean} [isSimple=false] シンプルな形で取得するかどうか
     * @param {Boolean} [isFirst=false] 最初の呼び出しかどうか
     * @param {Boolean} [isHided=false] この展開キーが隠されているかどうか
     * @return {Element} テーブルタグのHTML要素
     * @private
     */
    _createExpander: function (obj, key, isSimple, isFirst, isHided) {

        var elm = this._expandObject.call(this, obj, key, isHided, isFirst);

        if (isSimple && ! elm.canExpand && ! elm.isError) {
            return elm;
        }

        var table = Jeeel.Document.createElement('table');
        var tbody = Jeeel.Document.createElement('tbody');
        var tr    = Jeeel.Document.createElement('tr');
        var th    = Jeeel.Document.createElement('th');
        var td    = Jeeel.Document.createElement('td');

        var thStyle = th.style;
        var arrowSize = this.constructor.ARROW_FONT_SIZE + 'px';
        
        thStyle.fontSize  = arrowSize;
        thStyle.width     = arrowSize;
        thStyle.height    = arrowSize;
        thStyle.textAlign = 'center';

        table.className = this.constructor.EXPAND_TABLE_CLASS;

        var self = this;

        if (elm.canExpand) {
            th.innerHTML = this.constructor.COLLAPSE_ARROW;
            thStyle.cursor = 'pointer';

            /**
             * @ignore
             */
            var func = function () {
                var data  = arguments.callee.data;
                var tbody = arguments.callee.tbody;

                if (arguments.callee.isExpand) {
                    self._collapseTable.call(self, data, tbody);
                } else {
                    self._expandTable.call(self, data, tbody, arguments.callee.first);
                }

                arguments.callee.first = false;
                arguments.callee.isExpand = ! arguments.callee.isExpand;
                
                Jeeel.Dom.Event.getEventObject().stop();
            };

            func.first = true;
            func.isExpand = false;
            func.data = obj;
            func.tbody = tbody;

            th.onclick = func;
        } else if (elm.isError) {
            th.innerHTML = '<font color="red">&#8855;</font>';
        } else {
            thStyle.width = arrowSize;
            th.innerHTML = '<div style="width: ' + arrowSize + '; height: ' + arrowSize + ';">&nbsp;</div>';
        }

        if (elm.isElement) {

            /**
             * @ignore
             */
            var mouseDown = function () {
                var data   = arguments.callee.data;
                var target = arguments.callee.targetTr;

                self._selectElement(data, target);
                
                Jeeel.Dom.Event.getEventObject().stop();
            };

            mouseDown.data = obj;
            mouseDown.targetTr = tr;

            /**
             * @ignore
             */
            var mouseUp = function () {
                var event  = Jeeel.Dom.Event.getEventObject();

                if (event.ctrlKey && event.isLeftDown) {
                    self._removeElement();
                }
                
                Jeeel.Dom.Event.getEventObject().stop();
            };

            /**
             * @ignore
             */
            var over = function () {
                var data   = arguments.callee.data;
                var target = arguments.callee.targetTr;

                if (target.enableMouse) {
                    self._markupElement(data, target);
                }
                
                Jeeel.Dom.Event.getEventObject().stop();
            };

            over.data = obj;
            over.targetTr = tr;

            /**
             * @ignore
             */
            var out = function () {
                var data   = arguments.callee.data;
                var target = arguments.callee.targetTr;

                if (target.enableMouse) {
                    self._cleanupElement(data, target);
                }
                
                Jeeel.Dom.Event.getEventObject().stop();
            };

            out.data = obj;
            out.targetTr = tr;

            elm.onmousedown = mouseDown;
            elm.onmouseup   = mouseUp;
//            tr.onmouseover = over;
//            tr.onmouseout  = out;
            tr.enableMouse = true;
        }
        
        td.appendChild(elm);
        tr.appendChild(th);
        tr.appendChild(td);
        tbody.appendChild(tr);
        table.appendChild(tbody);

        return table;
    },
    
    /**
     * 不特定なオブジェクトの名前を取得する
     *
     * @param {Mixied} obj 展開対象のオブジェクト
     * @return {String} 名前
     * @private
     */
    _getUnknownObjectName: Jeeel._Object.JeeelDebug.getUnknownObjectName,

    /**
     * 不特定なオブジェクトの展開を定義づける
     *
     * @param {Element} elm 定義づけ対象のElement
     * @param {Mixied} obj 展開対象のオブジェクト
     * @private
     */
    _expandForUnknownObject: function (elm, obj) {
        elm.color = 'black';
        elm.innerHTML = this._getUnknownObjectName(obj);
    },

    /**
     * オブジェクトを展開し、それを示す文字列等に変換して返す
     *
     * @param {Mixied} obj 展開対象のオブジェクト
     * @param {String} [key] オブジェクトに対応するキー
     * @param {Boolean} [isFirst=false] 最初の呼び出しかどうか
     * @return {Element} 要素を示す文字列等を含むHTML要素
     * @private
     */
    _expandObject: function (obj, key, isHided, isFirst) {

        var elm = Jeeel.Document.createElement('font');
        var type;
        var canExpand = true;
        var isError   = false;
        var isElement = false;
        var isArray   = false;

        try {
            type = Jeeel.Type.getType(obj);
        } catch (e) {
            obj = e;
            type = Jeeel.Type.getType(obj);
        }

        switch (type) {
            case Jeeel.Type.ObjectType.STRING:
                elm.color = 'red';
                elm.innerHTML = '&quot;' + Jeeel.String.escapeHtml(obj, true) + '&quot;';

                if (obj.match(/^(https?|ttp):\/\/.+/)) {
                    var url = (obj.match(/^ttp:\/\/.+/) ? 'h' + obj : obj);

                    elm.innerHTML = '<a href="' + url + '" target="_blank">' + elm.innerHTML + '</a>';
                }

                canExpand = false;
                break;

            case Jeeel.Type.ObjectType.REGULAR_EXPRESSION:
                elm.color = 'violet';
                elm.innerHTML = Jeeel.String.escapeHtml('' + obj, true);
                canExpand = false;
                break;

            case Jeeel.Type.ObjectType.DATE:
                elm.color = 'black';
                elm.innerHTML = Jeeel.String.escapeHtml(obj.toString(), true);
                break;

            case Jeeel.Type.ObjectType.BOOLEAN:
            case Jeeel.Type.ObjectType.NUMBER:
                elm.color = 'blue';
                elm.innerHTML = '' + obj;
                canExpand = false;
                break;

            case Jeeel.Type.ObjectType.UNDEFINED:
            case Jeeel.Type.ObjectType.NULL:
                elm.color = 'gray';
                elm.innerHTML = '' + obj;
                canExpand = false;
                break;

            case Jeeel.Type.ObjectType.ARGUMENTS:
            case Jeeel.Type.ObjectType.ARRAY:
                isArray = true;
                
                if ( ! isFirst || obj.length > 100) {
                    elm.innerHTML = type + '[' + obj.length + ']';
                    break;
                }
                
                elm = Jeeel.Document.createElement('table');
                var tbody = Jeeel.Document.createElement('tbody');
                var tr = Jeeel.Document.createElement('tr');
                var th, td;

                tr.style.verticalAlign = 'top';
                
                var tmp;
                var txt = Jeeel.Document.createTextNode('[');
                th = Jeeel.Document.createElement('th');
                th.style.verticalAlign = 'top';
                th.appendChild(txt);
                tr.appendChild(th);

                for (var i = 0; i < obj.length; i++) {
                    if (i > 0) {
                        txt = Jeeel.Document.createTextNode(',　');
                        th = Jeeel.Document.createElement('th');
                        th.appendChild(txt);
                        tr.appendChild(th);
                    }

                    tmp = this._createExpander.call(this, obj[i], null, true);
                    td = Jeeel.Document.createElement('td');
                    td.appendChild(tmp);
                    td.style.verticalAlign = 'top';
                    tr.appendChild(td);
                }

                txt = Jeeel._doc.createTextNode(']');
                th = Jeeel.Document.createElement('th');
                th.appendChild(txt);
                th.style.verticalAlign = 'top';
                tr.appendChild(th);
                
                tbody.appendChild(tr);
                elm.appendChild(tbody);
                
                canExpand = false;
                break;

            case Jeeel.Type.ObjectType.FUNCTION:
                var func = Jeeel.String.escapeHtml('' + obj).replace(/(\r\n|\n)/g, '&crarr;');
                elm.color = 'black';
                elm.innerHTML = (func.length > 100 ? func.substr(0, 100) + ' ...' : func);
                break;

            case Jeeel.Type.ObjectType.WINDOW:
                elm.color = 'green';
                elm.innerHTML = 'Window';
                break;

            case Jeeel.Type.ObjectType.DOCUMENT_FRAGMENT:
                elm.color = 'black';
                elm.innerHTML = 'Document Fragment';
                break;

            case Jeeel.Type.ObjectType.DOCUMENT:
                elm.color = 'green';
                elm.innerHTML = 'Document';
                break;

            case Jeeel.Type.ObjectType.OBJECT:
                this._expandForUnknownObject(elm, obj);
                break;

            case Jeeel.Type.ObjectType.PROTOTYPE:
                elm.color = 'black';
                elm.innerHTML = 'Object(__proto__)';
                break;

            case Jeeel.Type.ObjectType.ELEMENT:

                if ( ! this._useHtmlExplorer) {
                    this._expandForUnknownObject(elm, obj);
                    break;
                }

                elm.color = '#881391';
                elm.innerHTML = this._createInfoElement(obj);
                isElement = true;

                if ( ! obj.contentWindow && ( ! obj.childNodes[0] || this._isAlwaysOpenedElement(obj))) {
                    canExpand = false;
                }
                break;
                
            case Jeeel.Type.ObjectType.ATTRIBUTE:

                if ( ! this._useHtmlExplorer) {
                    elm.color = 'black';
                    elm.innerHTML = type;
                    break;
                }
                
                var div = Jeeel.Document.createElement('div');
                var name = Jeeel.Document.createElement('font');
                
                name.color = '#994500';
                name.innerHTML = obj.name;
                
                elm.color = '#1A1AA6';
                elm.innerHTML = Jeeel.String.escapeHtml('"' + obj.value + '"', true);
                
                div.appendChild(name);
                div.appendChild(elm);
                
                elm = div;

                canExpand = false;
                break;

            case Jeeel.Type.ObjectType.TEXT:

                if ( ! this._useHtmlExplorer) {
                    elm.color = 'black';
                    elm.innerHTML = type;
                    break;
                }

                var replaceCR = !(obj.data.match(/^(\r|\n|\t| )*$/) && true);
                elm.color = 'black';
                elm.innerHTML = Jeeel.String.escapeHtml('"' + obj.data + '"', replaceCR);

                canExpand = false;
                break;

            case Jeeel.Type.ObjectType.COMMENT:

                if ( ! this._useHtmlExplorer) {
                    elm.color = 'black';
                    elm.innerHTML = type;
                    break;
                }
                
                elm.color = '#236E25';
                elm.innerHTML = Jeeel.String.escapeHtml('<!--' + obj.data + '-->', true);
                canExpand = false;
                break;

            case Jeeel.Type.ObjectType.EVENT:
                var eventType = this._getUnknownObjectName(obj);
                
                elm.color = '#0080FF';
                elm.innerHTML = (eventType == 'Object' ? 'Event' : eventType);
                break;

            case Jeeel.Type.ObjectType.ERROR:
                elm.color = 'red';
                elm.innerHTML = Jeeel.String.escapeHtml(obj.name + ': ' + obj.message, true);
                canExpand = false;
                isError = true;
                break;
                
            case Jeeel.Type.ObjectType.MATH:
                elm.color = '#006699';
                elm.innerHTML = 'Math';
                break;
                
            case Jeeel.Type.ObjectType.JSON:
                elm.color = '#61A458';
                elm.innerHTML = 'JSON';
                break;  

            case Jeeel.Type.ObjectType.STORAGE:
                elm.color = 'black';
                elm.innerHTML = 'Storage';
                break;

            default:
                elm.innerHTML = type;
                break;
        }

        if (Jeeel.Type.isString(key)) {
            var tab = Jeeel.Document.createElement('table');
            var tby = Jeeel.Document.createElement('tbody');
            var tre = Jeeel.Document.createElement('tr');
            var the = Jeeel.Document.createElement('th');
            var tde = Jeeel.Document.createElement('td');
            var col = '881391';
            
            if (isHided) {
                col = 'B771BD';
            }

            the.innerHTML = '<font color="#' + col + '">' + key + '</font>:&nbsp;&nbsp;';

            the.style.verticalAlign = 'top';
            tde.appendChild(elm);
            
            tre.appendChild(the);
            tre.appendChild(tde);
            tby.appendChild(tre);
            tab.appendChild(tby);
            
            elm = tab;
        }

        elm.canExpand = canExpand;
        elm.isError   = isError;
        elm.isElement = isElement;
        elm.isArray   = isArray;
        
        return elm;
    },

    /**
     * Tableを展開する
     *
     * @param {Mixied} obj Tableに定義づけられているオブジェクト
     * @param {Element} tbody 閉じる対象のtbody
     * @param {Boolean} [isFirst=false] 最初の展開かどうか
     * @private
     */
    _expandTable: function (obj, tbody, isFirst) {

        if (this._useHtmlExplorer && Jeeel.Type.isDocumentFragment(obj)) {
            this._expandTableForDocumentFragment.call(this, obj, tbody, isFirst);
            return;
        } else if (this._useHtmlExplorer && Jeeel.Type.isElement(obj)) {
            this._expandTableForElement.call(this, obj, tbody, isFirst);
            return;
        }

        var i, l, tmp, th;

        th = tbody.firstChild.firstChild;
        th.innerHTML = Jeeel.Debug.ObjectExpander.EXPAND_ARROW;

        if (isFirst) {
            var tr;
            var list = Jeeel.Hash.getPairs(obj);
            var flag = Jeeel._doc.createDocumentFragment();
            
            for (i = 0, l = list.length; i < l; i++) {
                var key = list[i].key;
                var val = list[i].value;
                
                if (Object.getOwnPropertyDescriptor && Object.prototype.hasOwnProperty && Object.prototype.hasOwnProperty.call(obj, key)) {
                  
                    try {
                        tmp = Object.getOwnPropertyDescriptor(obj, key);
                    } catch (e) {
                        tmp = {
                            enumerable: key !== '__proto__'
                        };
                    }

                    if (tmp && (tmp.get || tmp.set)) {
                        if (tmp.get) {
                            tr = this._createExpanderTr(tmp.get, 'get ' + key, ! tmp.enumerable);
                            flag.appendChild(tr);
                        }

                        if (tmp.set) {
                            tr = this._createExpanderTr(tmp.set, 'set ' + key, ! tmp.enumerable);
                            flag.appendChild(tr);
                        }
                    } else {
                        tr = this._createExpanderTr(val, key, !tmp || !tmp.enumerable);
                        flag.appendChild(tr);
                    }
                } else {
                    tr = this._createExpanderTr(val, key, key === '__proto__');
                    flag.appendChild(tr);
                }
            }
            
            tbody.appendChild(flag);
        } else {
            var children = tbody.childNodes;

            for (i = 0, l = children.length; i < l; i++) {
                if (children[i].className == this.constructor.EXPAND_CHILD_CLASS) {
                    children[i].style.display = '';
                }
            }
        }
    },
    
    _createExpanderTr: function (val, key, isHided) {
        var tr = Jeeel.Document.createElement('tr');
        var th = Jeeel.Document.createElement('th');
        var td = Jeeel.Document.createElement('td');

        var elm = this._createExpander.call(this, val, key, false, false, isHided);

        td.appendChild(elm);

        tr.appendChild(th);
        tr.appendChild(td);
        tr.className = this.constructor.EXPAND_CHILD_CLASS;

        return tr;
    },

    /**
     * Tableを閉じる
     *
     * @param {Mixied} obj Tableに定義づけられているオブジェクト
     * @param {Element} tbody 閉じる対象のtbody
     * @private
     */
    _collapseTable: function (obj, tbody) {

        if (this._useHtmlExplorer && Jeeel.Type.isElement(obj)) {
            this._collapseTableForElement.call(this, obj, tbody);
            return;
        }

        var th;

        th = tbody.firstChild.firstChild;
        th.innerHTML = this.constructor.COLLAPSE_ARROW;

        var children = tbody.childNodes;

        for (var i = 0, l = children.length; i < l; i++) {
            if (children[i].className == this.constructor.EXPAND_CHILD_CLASS) {
                children[i].style.display = 'none';
            }
        }
    },

    /**
     * Html要素のための展開メソッド
     *
     * @param {Element} element 展開するElement
     * @param {Element} tbody 閉じる対象のtbody
     * @param {Boolean} [isFirst=false] 最初の展開かどうか
     * @private
     */
    _expandTableForElement: function (element, tbody, isFirst) {

        var i, l, th, td, children;
        var nodeName = element.nodeName.toLowerCase();

        th = tbody.firstChild.firstChild;
        td = tbody.firstChild.children[1];
        th.innerHTML = this.constructor.EXPAND_ARROW;

        if (td.firstChild.nodeName.toLowerCase() !== 'font') {
            td = td.firstChild.firstChild.firstChild.children[1];
        }

        td.firstChild.innerHTML = this._createInfoElement(element, true);
        tbody.firstChild.enableMouse = false;
        this._cleanupElement(element);

        if (isFirst) {
            var tr;
            var flag = Jeeel.Document.createDocumentFragment();
            children = (element.contentWindow ? [element.contentWindow.document.documentElement] : element.childNodes);

            for (i = 0, l = children.length; i < l; i++) {

                if (Jeeel.Type.isText(children[i]) && children[i].data.match(/^(\r|\n|\t| )*$/)) {
                    continue;
                }
                
                tr = this._createExpanderTr(children[i]);
                flag.appendChild(tr);
            }

            tr = Jeeel.Document.createElement('tr');
            th = Jeeel.Document.createElement('th');
            td = Jeeel.Document.createElement('td');
            
            td.innerHTML = '<font color="#881391">&lt;/' + nodeName + '&gt;</font>';

            var self = this;
            var mouseDown = function () {
                var data   = arguments.callee.data;
                var target = arguments.callee.targetTr;

                self._selectElement(data, target);
            };

            mouseDown.data = element;
            mouseDown.targetTr = tr;

            var mouseUp = function () {
                var event  = Jeeel.Dom.Event.getEventObject();

                if (event.ctrlKey && event.isLeftDown) {
                    self._removeElement();
                }
            };

            td.firstChild.onmousedown = mouseDown;
            td.firstChild.onmouseup   = mouseUp;
            
            tr.appendChild(th);
            tr.appendChild(td);
            
            flag.appendChild(tr);

            tbody.appendChild(flag);

        } else {
            children = tbody.childNodes;

            for (i = 0, l = children.length; i < l; i++) {
                if (children[i].className == this.constructor.EXPAND_CHILD_CLASS) {
                    children[i].style.display = '';
                }
            }

            tbody.lastChild.style.display = '';
        }
    },

    /**
     * Html要素のための閉じるメソッド
     *
     * @param {Element} element 閉じるElement
     * @param {Element} tbody 閉じる対象のtbody
     * @private
     */
    _collapseTableForElement: function (element, tbody) {
        var th, td;

        th = tbody.firstChild.firstChild;
        td = tbody.firstChild.children[1];
        th.innerHTML = this.constructor.COLLAPSE_ARROW;

        if (td.firstChild.nodeName.toLowerCase() !== 'font') {
            td = td.firstChild.firstChild.firstChild.children[1];
        }
        
        td.firstChild.innerHTML = this._createInfoElement(element);
        tbody.firstChild.enableMouse = true;

        var children = tbody.childNodes;

        for (var i = 0, l = children.length; i < l; i++) {
            if (children[i].className == this.constructor.EXPAND_CHILD_CLASS) {
                children[i].style.display = 'none';
            }
        }

        tbody.lastChild.style.display = 'none';
    },

    /**
     * DocumentFragmentを展開する
     *
     * @param {Mixied} obj Tableに定義づけられているオブジェクト
     * @param {Element} tbody 閉じる対象のtbody
     * @param {Boolean} [isFirst=false] 最初の展開かどうか
     * @private
     */
    _expandTableForDocumentFragment: function (obj, tbody, isFirst) {

        var i, l, th;

        th = tbody.firstChild.firstChild;
        th.innerHTML = this.constructor.EXPAND_ARROW;

        if (isFirst) {
            var tr;
            var flag = Jeeel.Document.createDocumentFragment();
            var length = obj.childNodes.length;

            for (i = 0; i < length; i++) {
                var val = obj.childNodes[i];
                
                tr = this._createExpanderTr(val);
                flag.appendChild(tr);
            }
            
            tbody.appendChild(flag);
        } else {
            var children = tbody.childNodes;

            for (i = 0, l = children.length; i < l; i++) {
                if (children[i].className == this.constructor.EXPAND_CHILD_CLASS) {
                    children[i].style.display = '';
                }
            }
        }
    },

    /**
     * ジェスチャーの判定を行う
     * 
     * @param {Integer[]} judge 判定対象のジェスチャー
     * @type Jeeel.Function.create
     * @function
     */
    _mouseGestureJudge: Jeeel.Function.create(function (judge) {

        if (this._mouseGesture.matchGesture(judge)) {
            this._removeElement();
            this._mouseGesture.end();
        }
    }),

    /**
     * @ignore
     */
    _markupElement: function (element, target) {
        var foreground = Jeeel.Document.createElement('div');
        var foregroundStyle = Jeeel.Dom.Style.create(foreground);
        var elementStyle = element.style;
        
        Jeeel.Dom.Event.disableMouseEvent(foreground);
        
        foreground.className = this.constructor.HTML_LAYER_CLASS;
        
        foregroundStyle.setStyleList({
            backgroundColor: '#3879D9',
            width: '100%',
            height: '100%',
            zIndex: '50',
            top: '0px',
            left: '0px',
            position: 'absolute',
            opacity: 0.3
        });

//        target._position = elementStyle.position;
//        target._zIndex   = elementStyle.zIndex;
//
//        elementStyle.position = 'relative';
//
//        if ( ! elementStyle.zIndex) {
//            elementStyle.zIndex   = '1';
//        }
        
        element.appendChild(foreground);
    },

    /**
     * @ignore
     */
    _cleanupElement: function (element, target) {
        var elm = Jeeel.Dom.Element.create(element);
        var elementStyle = element.style;
        var foreground = elm.getElementsByClassName(this.constructor.HTML_LAYER_CLASS)[0];

        if ( ! foreground) {
            return;
        }

        Jeeel.Dom.Element.create(foreground).remove();

//        if (Jeeel.Type.isString(target._position)) {
//            elementStyle.position = target._position;
//        }
//
//        if (Jeeel.Type.isString(target._zIndex)) {
//            elementStyle.zIndex = target._zIndex;
//        }
    },

    /**
     * 指定したHTML要素を選択し、それに対応するexpand要素をセレクト状態にする
     *
     * @param {Element} element 対象HTML要素
     * @param {Element} target 対象expand要素
     */
    _selectElement: function (element, target) {
        if (this._selectedTarget) {
            this._mouseGesture.end();
            this._selectedTarget.style.backgroundColor = '';
        }

        target.style.backgroundColor = '#C8D8FB';

        this._selectedElement = element;
        this._selectedTarget  = target;
        this._selectedRemoveTarget = target.parentNode.parentNode.parentNode.parentNode;
        this._mouseGestureJudge.reset();
        this._mouseGestureJudge.curry(this._removeGesture).bind(this);
        this._mouseGesture.setInactiveCallback(this._mouseGestureJudge)
                          .start();
    },

    /**
     * 現在選択中のHTML要素を取り除く
     */
    _removeElement: function () {
        if ( ! this._selectedTarget) {
            return;
        }

        Jeeel.Dom.Element.create(this._selectedElement).remove();
        Jeeel.Dom.Element.create(this._selectedRemoveTarget).remove();

        this._selectedElement = null;
        this._selectedTarget  = null;
        this._selectedRemoveTarget = null;
    },

    /**
     * Html要素を表すHTML文字列を作成する
     *
     * @param {Element} element 対象のElement
     * @param {Boolean} [isExpanded] 開いた状態のHTML文字列かどうか
     * @private
     */
    _createInfoElement: function (element, isExpanded) {
        var nodeName = (element.scopeName && element.scopeName !== 'HTML' ? element.scopeName + ':' : '')
                     + element.nodeName.toLowerCase();
        var html = ['&lt;' + nodeName];
        var attr = element.attributes;
        var isIE = Jeeel.UserAgent.isInternetExplorer();

        for (var i = 0, l = attr.length; i < l; i++) {

            if ( ! attr[i].value || (isIE && attr[i].value === 'null')) {
                continue;
            }

            html[html.length] = ' <font color="#994500">' + attr[i].name + '=&quot;<font color="#1A1AA6">' + attr[i].value + '</font>&quot;</font>';
        }

        html[html.length] = '&gt;';

        if ( ! isExpanded) {

            if (element.firstChild || element.tagName.toUpperCase() == 'STYLE') {
              
                var isOpendElm = this._isAlwaysOpenedElement(element);
                var multiLine = false;
                var innerText;
                
                if (isOpendElm) {
                    innerText = (element.styleSheet && element.styleSheet.cssText || element.innerHTML).replace(/(^(\r\n|\n))|((\r\n|\n)$)/, '');
                }
                
                if (innerText && innerText.indexOf('\n') + 1) {
                    multiLine = true;
                }
                
                var txt = (isOpendElm ? Jeeel.String.escapeHtml(innerText, true) : '_');
                
                if (isOpendElm && multiLine) {
                    txt = '<br />' + txt + '<br />';
                }
                
                html[html.length] = '<font color="black">' + txt + '</font>';
            }

            html[html.length] = '&lt;/' + nodeName + '&gt;';
        }

        return html.join('');
    },

    /**
     *
     */
    _isAlwaysOpenedElement: function (element) {
        var closeElm = ['SCRIPT', 'STYLE'];

//        if (Jeeel.Hash.inHash(element.tagName.toUpperCase(), closeElm)) {
//            return true;
//        }

        return (element.childNodes.length == 1 && Jeeel.Type.isText(element.childNodes[0]));
    }
};
