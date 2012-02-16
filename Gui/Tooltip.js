
/**
 * コンストラクタ
 * 
 * @class ツールチップを管理するクラス
 * @augments Jeeel.Gui.Abstract
 * @param {Element} [target] ツールチップ表示対象のElement
 * @param {String} [text] 設定するテキスト
 */
Jeeel.Gui.Tooltip = function (target, text) {
    Jeeel.Gui.Abstract.call(this);
    
    this._init(target, text);
};

/**
 * インスタンスの作成を行う
 * 
 * @param {Element} [target] ツールチップ表示対象のElement
 * @param {String} [text] 設定するテキスト
 * @return {Jeeel.Gui.Tooltip} 作成したインスタンス
 */
Jeeel.Gui.Tooltip.create = function (target, text) {
    return new this(target, text);
};

/**
 * ツールチップ全インスタンス共通のスタイルを定義する
 */
Jeeel.Gui.Tooltip.initStyle = function () {
    if (arguments.callee.ignore) {
        return;
    }
    
    arguments.callee.ignore = true;
    
    var style = 'div.' + this.CLASS.TOOLTIP + ' {\n'
              + '  position: absolute;\n'
              + '  width: auto;\n'
              + '  height: auto;\n'
              + '  box-shadow: 5px 5px 3px #444;\n'
              + '  -moz-box-shadow: 5px 5px 3px #444;\n'
              + '  -webkit-box-shadow: 5px 5px 3px #444;\n'
              + '}\n'
              + 'div.' + this.CLASS.TOOLTIP + ' div.' + this.CLASS.TEXT_CONTENT + ' {\n'
              + '  padding: 2px;\n'
              + '  font-size: 12px;\n'
              + '  font-weight: normal;\n'
              + '  color: #000;\n'
              + '  border: 1px solid #000000;\n'
              + '  background-color: #FFFFE1;\n'
              + '}\n';
            
    if (Jeeel.UserAgent.isInternetExplorer()) {
        style += 'div.' + this.CLASS.TOOLTIP + ' {\n'
               + '  z-index: 3;\n'
               + '}\n'
               + 'div.' + this.CLASS.TOOLTIP + ' div.' + this.CLASS.TEXT_CONTENT + ' {\n'
               + '  position: relative;\n'
               + '  z-index: 4;\n'
               + '}\n'
               + 'div.' + this.CLASS.TOOLTIP + ' div.' + this.CLASS.IE_SHADOW_BOX + ' {\n'
               + '  display: block;\n'
               + '  position: absolute;\n'
               + '  z-index: 2;\n'
               + '  top: 2px;\n'
               + '  left: 2px;\n'
               + '  right: -2px;\n'
               + '  bottom: -2px;\n'
               + '  filter: progid:DXImageTransform.Microsoft.Blur(pixelradius=3);\n'
               + '  -ms-filter: "progid:DXImageTransform.Microsoft.Blur(pixelradius=3)";\n'
               + '  background-color: #444;\n'
               + '}\n';
    } else {
        style += 'div.' + this.CLASS.TOOLTIP + ' div.' + this.CLASS.IE_SHADOW_BOX + ' {\n'
               + '  display: none;\n'
               + '}\n';
    }

    this._styleTag = Jeeel.Import.addStyle(style);
};

/**
 * ツールチップのクラス名
 */
Jeeel.Gui.Tooltip.CLASS = {
    TOOLTIP: 'jeeel-gui-tooltip',
    IE_SHADOW_BOX: 'jeeel-gui-tooltip-ie-shadow-box',
    TEXT_CONTENT: 'jeeel-gui-tooltip-text-content'
};

/**
 * ツールチップの作成個数
 * 
 * @type Integer
 */
Jeeel.Gui.Tooltip.createLength = 0;

Jeeel.Gui.Tooltip.prototype = {
  
    /**
     * ツールチップ
     * 
     * @type Jeeel.Dom.ElementOperator
     * @private
     */
    _tooltip: null,
    
    /**
     * ツールチップ文字列コンテント
     * 
     * @type Jeeel.Dom.ElementOperator
     * @private
     */
    _textContent: null,
    
    /**
     * ツールチップの表示対象
     * 
     * @type Jeeel.Dom.ElementOperator
     * @private
     */
    _target: null,
    
    /**
     * タイムアウトID
     * 
     * @type Integer
     * @private
     */
    _timeOutId: null,
    
    /**
     * ツールチップにテキストを設定する
     * 
     * @param {String} text 設定するテキスト
     * @return {Jeeel.Gui.Tooltip} 自インスタンス
     */
    setText: function (text) {
        this._textContent.setText(text);
        
        return this;
    },
    
    /**
     * ツールチップにHTMLを設定する
     * 
     * @param {String} html 設定するHTML
     * @return {Jeeel.Gui.Tooltip} 自インスタンス
     */
    setHtml: function (html) {
        this._textContent.setHtml(html);
        
        return this;
    },
    
    /**
     * ツールチップが表示される対象を設定する
     * 
     * @param {Element} target 対象のElement
     * @return {Jeeel.Gui.Tooltip} 自インスタンス
     */
    setTarget: function (target) {
        if (this._target) {
            this._target.removeOut(this.hide)
                        .removeMouseMove(this._show);
        }
        
        this._target = Jeeel.Dom.ElementOperator.create(target);
        
        this._target.addOut(this.hide, this)
                    .addMouseMove(this._show, this);
        
        return this;
    },
    
    /**
     * ツールチップを表示する
     * 
     * @return {Jeeel.Gui.Tooltip} 自インスタンス
     */
    show: function () {
        this._tooltip.show();
        
        return this;
    },
    
    /**
     * ツールチップを隠す
     * 
     * @return {Jeeel.Gui.Tooltip} 自インスタンス
     */
    hide: function () {
        Jeeel.Timer.clearTimeout(this._timeOutId);
        
        this._tooltip.hide();
        
        return this;
    },
    
    /**
     * ツールチップを削除する
     */
    remove: function () {
        if (this._target) {
            this._target.removeOut(this.hide)
                        .removeMouseMove(this._show);
        }
        
        this.hide();
        this._tooltip.remove();
    },
    
    /**
     * コンストラクタ
     * 
     * @param {Element} [target] ツールチップ表示対象のElement
     * @param {String} [text] 設定するテキスト
     */
    constructor: Jeeel.Gui.Tooltip,
    
    /**
     * ツールチップを対象の要素上に表示する
     * 
     * @param {Jeeel.Dom.Event} e イベントオブジェクト
     */
    _show: function (e) {
        this.hide();
        
        var pos = e.mousePoint;
        var self = this;
        
        this._timeOutId = Jeeel.Timer.setTimeout(
            function () {
                self._tooltip.shiftTo(pos.x, pos.y + 20);
                self.show();
            }, 800
        );
    },
    
    /**
     * ツールチップの初期化を行う
     */
    _init: function (target, text) {
        var index = this.constructor.createLength;
        
        this.constructor.initStyle();
        
        var tip = Jeeel.Document.createElement('div');
        var textContent = Jeeel.Document.createElement('div');
        var ieShadowBox = Jeeel.Document.createElement('div');

        tip.id = this.constructor.CLASS.TOOLTIP + '-' + index;
        tip.className = this.constructor.CLASS.TOOLTIP;
        
        textContent.className = this.constructor.CLASS.TEXT_CONTENT;
        ieShadowBox.className = this.constructor.CLASS.IE_SHADOW_BOX;
        
        tip.appendChild(textContent);
        tip.appendChild(ieShadowBox);

        this._textContent = new Jeeel.Dom.ElementOperator(textContent);
        this._tooltip = new Jeeel.Dom.ElementOperator(tip);
        this._tooltip.hide();
        
        if (target) {
            this.setTarget(target);
        }
        
        if (text) {
            this.setText(text);
        }
        
        Jeeel.Document.appendToBody(tip);
        
        this.constructor.createLength++;
        
        this._styleTag = this.constructor._styleTag;
    }
};

Jeeel.Class.extend(Jeeel.Gui.Tooltip, Jeeel.Gui.Abstract);
