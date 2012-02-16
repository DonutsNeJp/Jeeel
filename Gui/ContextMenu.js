
/**
 * コンストラクタ
 * 
 * @class コンテキストメニューを管理するクラス
 */
Jeeel.Gui.ContextMenu = function () {
    this._init();
};

/**
 * インスタンスの作成を行う
 * 
 * @return {Jeeel.Gui.ContextMenu} 作成したインスタンス
 */
Jeeel.Gui.ContextMenu.create = function () {
    return new this();
};

Jeeel.Gui.ContextMenu.CLASS = {
    CONTEXT_MENU: 'jeeel-gui-context-menu'
};

Jeeel.Gui.ContextMenu._initStyle = function () {
        
    if (arguments.callee.ignore) {
        return;
    }
    
    arguments.callee.ignore = true;
    
    var classNames = this.CLASS;

    var css = 'ul.' + classNames.CONTEXT_MENU + ' {\n'
            + '  display: block;\n'
            + '  width: 200px;\n'
            + '  height: auto;\n'
            + '  background-color: white;\n'
            + '  border: black 1px solid;\n'
            + '}\n';

    this._defaultStyle = css;
    this._styleTag = Jeeel.Import.addStyle(css);
};

Jeeel.Gui.ContextMenu.prototype = {

    /**
     * コンテキストメニュー
     * 
     * @type Jeeel.Dom.ElementOperator
     * @private
     */
    _context: null,
    
    /**
     * メニューアイテムリスト
     * 
     * @type Jeeel.Gui.ContextMenu.Item[]
     * @private
     */
    _items: [],
    
    /**
     * コンテキストメニューが起動する要素をバインディングする
     * 
     * @param {Element} bindTarget バインディング要素
     * @param {Boolean} [bindRightClick] 右クリックを禁止して代わりに表示させるかどうか(通常は左クリックに対応させる)
     * @return {Jeeel.Gui.ContextMenu} 自インスタンス
     */
    bind: function(bindTarget, bindRightClick) {
      
        if (bindRightClick) {
            Jeeel.Dom.Event.addEventListener(bindTarget, Jeeel.Dom.Event.Type.CONTEXT_MENU, this._click, this);
        } else {
            Jeeel.Dom.Event.addEventListener(bindTarget, Jeeel.Dom.Event.Type.CLICK, this._click, this);
        }
        
        return this;
    },
    
    /**
     * コンテキストメニューの起動を消去する
     * 
     * @param {Element} unbindTarget バインディング要素
     * @return {Jeeel.Gui.ContextMenu} 自インスタンス
     */
    unbind: function (unbindTarget) {
        Jeeel.Dom.Event.removeEventListener(unbindTarget, Jeeel.Dom.Event.Type.CLICK, this._click)
                       .removeEventListener(unbindTarget, Jeeel.Dom.Event.Type.CONTEXT_MENU, this._click);
        
        return this;
    },
    
    /**
     * メニューに表示される項目を追加する
     * 
     * @param {Jeeel.Gui.ContextMenu.Item} item 追加要素
     * @return {Jeeel.Gui.ContextMenu} 自インスタンス
     */
    addItem: function (item) {
        this._items[this._items.length] = item;
        
        this._context.appendChild(item._item);
        
        return this;
    },
    
    /**
     * コンストラクタ
     * 
     * @constructor
     */
    constructor: Jeeel.Gui.ContextMenu,
    
    _show: function(e) {
        
        var p = e.mousePoint;
        
        this._context.shiftTo(p.x, p.y);
        
        this._context.show();
    },
    
    _hide: function(e) {
        this._context.hide();
    },
    
    _init: function () {
        this._context = Jeeel.Dom.ElementOperator.create(Jeeel.Document.createElement('ul'));
        
        this._context.addClass(this.constructor.CLASS.CONTEXT_MENU);
        
        this.constructor._initStyle();
        
        this._defaultStyle = this.constructor._defaultStyle;
        this._styleTag = this.constructor._styleTag;
    }
};