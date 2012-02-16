
/**
 * コンストラクタ
 *
 * @class ウインドウを作成するクラス
 * @ignore 未完成
 */
Jeeel.Gui.Dialog = function (title, body) {
    Jeeel.Gui.Abstract.call(this);
    
    this._init(title, body);
};

/**
 * インスタンスの作成を行う
 * 
 * @return {Jeeel.Gui.Dialog} 作成したインスタンス
 */
Jeeel.Gui.Dialog.create = function (title, body) {
    return new this(title, body);
};

Jeeel.Gui.Dialog.CLASS = {
    ROOT: 'jeeel-gui-dialog',
    TITLE_BAR: 'jeeel-gui-title-bar',
    TITLE: 'jeeel-gui-title',
    CLOSE_BOX: 'jeeel-gui-close-box',
    BODY: 'jeeel-gui-body'
};

Jeeel.Gui.Dialog._objs = [];

Jeeel.Gui.Dialog._addObj = function (obj) {
    var index = this._objs.length;
    this._objs[index] = obj;
    
    obj.id = index;
    obj.titleBar = obj.$CLASS(this.CLASS.TITLE_BAR)[0];
    obj[0].id = this.CLASS.ROOT + '-' + index;
    obj[0].className = this.CLASS.ROOT;
    
    Jeeel.Document.appendToBody(obj[0]);
};

Jeeel.Gui.Dialog._removeObj = function (obj) {
    for (var i = 0, l = this._objs.length; i < l; i++) {
        if (obj === this._objs[i]) {
            this._objs.splice(i, 1)[0].remove();
            break;
        }
    }
};

Jeeel.Gui.Dialog._selectObj = null;

Jeeel.Gui.Dialog._setSelectObj = function (ev) {
    var target = ev.target;
    
    for (var i = 0, l = this._objs.length; i < l; i++) {
        if (target === this._objs[i].titleBar) {
            this._selectObj = this._objs[i];
            this._selectObj.setCss('z-index', 100);
            return;
        }
    }
    
    this._selectObj = null;
};

Jeeel.Gui.Dialog._down = function () {
    var ev = Jeeel.Dom.Event.getEventObject();
    
    this._setSelectObj(ev);
    
    if ( ! this._selectObj) {
        return true;
    }
    
    
    
    ev.stop();
    
    return false;
};

Jeeel.Gui.Dialog._move = function () {
    var ev = Jeeel.Dom.Event.getEventObject();
};

Jeeel.Gui.Dialog._up = function () {
    var ev = Jeeel.Dom.Event.getEventObject();
    
    if (this._selectObj) {
        this._selectObj.setCss('z-index', 0);
        this._selectObj = null;
    }
};

Jeeel.Gui.Dialog._init = function () {
    if (arguments.callee.ignore) {
        return;
    }
    
    arguments.callee.ignore = true;
    
    for (var property in this) {
        if (Jeeel.Type.isFunction(this[property])) {
            this[property] = Jeeel.Function.create(this[property]).bind(this);
        }
    }
    
    Jeeel.Dom.Event.addEventListener(Jeeel._doc, Jeeel.Dom.Event.Type.MOUSE_DOWN, this._down);
    Jeeel.Dom.Event.addEventListener(Jeeel._doc, Jeeel.Dom.Event.Type.MOUSE_MOVE, this._move);
    Jeeel.Dom.Event.addEventListener(Jeeel._doc, Jeeel.Dom.Event.Type.MOUSE_UP, this._up);
};

Jeeel.Gui.Dialog.prototype = {

    /**
     * @type Jeeel.Object.Size
     */
    _size: null,
    
    /**
     * @type Jeeel.Dom.ElementOperator
     */
    _dialog: null,

    show: function () {
        this._dialog.show();
        
        Jeeel.Function.create(function () {
            this._size = this._dialog.getSize();
        }).bind(this).delay(1)();
        
        return this;
    },
    
    hide: function () {
        this._dialog.hide();
        
        return this;
    },
    
    shiftTo: function (x, y) {
        this._dialog.shiftTo(x, y);
        
        return this;
    },
    
    constructor: Jeeel.Gui.Dialog,
    
    _init: function (titleTxt, bodyElm) {
        var layer = Jeeel.Document.createElement('div');
        var titleBar = Jeeel.Document.createElement('div');
        var title = Jeeel.Document.createElement('div');
        var closeBox = Jeeel.Document.createElement('div');
        var body = Jeeel.Document.createElement('div');
        
        title.className = this.constructor.CLASS.TITLE;
        title.innerHTML = titleTxt;
        closeBox.className = this.constructor.CLASS.CLOSE_BOX;
        closeBox.innerHTML = '×';
        titleBar.className = this.constructor.CLASS.TITLE_BAR;
        titleBar.appendChild(title);
        titleBar.appendChild(closeBox);
        
        body.className = this.constructor.CLASS.BODY;
        body.appendChild(bodyElm);
        
        layer.appendChild(titleBar);
        layer.appendChild(body);
        
        closeBox.onclick = Jeeel.Function.create(function () {
            this.hide();
        }).bind(this);
        
        this._dialog = Jeeel.Dom.ElementOperator.create(layer);
        
        this.constructor._addObj(this._dialog);
        
        this._initStyle(layer.id);
        
        this.constructor._init();
    },
    
    _initStyle: function (id) {
        var style = 'div#' + id + ' {\n'
                  + '  position: absolute;\n'
                  + '  top: 0px;\n'
                  + '  left: 0px;\n'
                  + '  width: 600px;\n'
                  + '  height: 502px;\n'
                  + '  border: 2px solid black;\n'
                  + '  background-color: #FFFFFF;\n'
                  + '  border-top: 3px solid #CCCCCC;\n'
                  + '  border-left: 3px solid #CCCCCC;\n'
                  + '  border-right: 3px solid #666666;\n'
                  + '  border-bottom: 3px solid #666666;\n'
                  + '  display: none;\n'
                  + '}\n'
                  + 'div#' + id + ' div.' + this.constructor.CLASS.TITLE_BAR + ' {\n'
                  + '  position: absolute;\n'
                  + '  top: 0px;\n'
                  + '  left: 0px;\n'
                  + '  width: 596px;\n'
                  + '  height: 26px;\n'
                  + '  background-color: #316AC5;\n'
                  + '  color: #FFFFFF;\n'
                  + '  border-bottom: 2px solid #666666;\n'
                  + '  font-size: 10px;\n'
                  + '  font-weight: bold;\n'
                  + '  padding: 2px;\n'
                  + '  text-align: left;\n'
                  + '}\n'
                  + 'div#' + id + ' div.' + this.constructor.CLASS.CLOSE_BOX + ' {\n'
                  + '  position: absolute;\n'
                  + '  top: 1px;\n'
                  + '  right: 1px;\n'
                  + '  cursor: pointer;\n'
                  + '}\n'
                  + 'div#' + id + ' div.' + this.constructor.CLASS.TITLE + ' {\n'
                  + '  padding-left: 3px;\n'
                  + '}\n'
                  + 'div#' + id + ' div.' + this.constructor.CLASS.BODY + ' {\n'
                  + '  position: absolute;\n'
                  + '  top: 30px;\n'
                  + '  left: 0px;\n'
                  + '  width: 600px;\n'
                  + '  height: 472px;\n'
                  + '  background-color: #FFFFFF;\n'
                  + '  margin-left: 0px;\n'
                  + '  margin-top: 0px;\n'
                  + '  overflow: visible;\n'
                  + '}\n';
                
        this._defaultStyle = style;
        this._styleTag = Jeeel.Import.addStyle(style);
    }
};

Jeeel.Class.extend(Jeeel.Gui.Dialog, Jeeel.Gui.Abstract);
