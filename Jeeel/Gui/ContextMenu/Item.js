
/**
 * コンストラクタ
 * 
 * @class コンテキストメニューの項目を示すクラス
 * @ignore
 */
Jeeel.Gui.ContextMenu.Item = function (text) {
    this._init(text);
};

Jeeel.Gui.ContextMenu.Item.create = function (text) {
    return new this(text);
};

Jeeel.Gui.ContextMenu.Item.CLASS = {
    ITEM: 'jeeel-gui-context-menu-item',
    ACTIVE: 'jeeel-gui-context-menu-item-active',
    SEPARATE: 'jeeel-gui-context-menu-item-separate'
};

Jeeel.Gui.ContextMenu.Item.prototype = {
    
    _item: null,
    
    _sub: null,
    _callbacks: [],
    
    setText: function (text) {
        this._item.setText(text);
        
        return this;
    },
    
    setHtml: function (html) {
        if (Jeeel.Type.isString(html)) {
            this._item.setHtml(html);
        } else {
            this._item.addChild(html);
        }
        
        return this;
    },
    
    separate: function () {
        this._item.addClass(this.constructor.CLASS.SEPARATE);
        
        return this;
    },
    
    addCallback: function (callback) {
        this._callbacks[this._callbacks.length] = callback;
        
        return this;
    },
    
    removeCallback: function (callback) {
        
        for (var i = this._callbacks.length; i--;) {
            if (this._callbacks[i] === callback) {
                this._callbacks.splice(i, 1);
                break;
            }
        }
        
        return this;
    },

    setSubmenu: function (submenu) {
        this._sub = submenu;
        
        return this;
    },
    
    /**
     * コンストラクタ
     * 
     * @constructor
     */
    constructor: Jeeel.Gui.ContextMenu.Item,
    
    _click: function () {
        for (var i = 0, l = this._callbacks.length; i < l; i++) {
            this._callbacks[i]();
        }
    },
    
    _over: function() {
        this._item.addClass(this.constructor.CLASS.ACTIVE);
    },
    
    _out: function () {
        this._item.removeClass(this.constructor.CLASS.ACTIVE);
    },
    
    _init: function (text) {
        var item = Jeeel.Dom.ElementOperator.create(Jeeel.Document.createElement('li'));
        
        this._item = item;
        
        item.addClick(this._click, this)
            .addHover(this._over, this._out, this)
            .setText(text);
            
        this.constructor._initStyle();
        
        this._defaultStyle = this.constructor._defaultStyle;
        this._styleTag = this.constructor._styleTag;
    }
};
