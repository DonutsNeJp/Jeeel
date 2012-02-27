Jeeel.directory.Jeeel.Dom.Style = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Dom + 'Style/';
    }
};

/**
 * コンストラクタ
 * 
 * @class スタイルを扱うクラス
 * @param {Element} element スタイルの操作対象Element
 */
Jeeel.Dom.Style = function (element) {
    this._style = element && element.style || null;
    this._defaultDisplay = this.constructor.getDefaultDisplay(element && element.nodeName);
    
    if (element) {
        this._computedStyle = element.parentNode && Jeeel.Document.getComputedStyle(element) || null;
    }
};

/**
 * インスタンスの作成を行う
 * 
 * @param {Style} style 操作スタイル
 * @return {Jeeel.Dom.Style} 作成したインスタンス
 */
Jeeel.Dom.Style.create = function (style) {
    return new this(style);
};

(function () {
    var cache = {};
    
    /**
     * 初期状態のdisplayの値を取得する
     * 
     * @param {String} nodeName 取得したいノード名
     * @return {String} 取得したdisplayの初期値
     */
    Jeeel.Dom.Style.getDefaultDisplay = function (nodeName) {
      
        if ( ! nodeName) {
            return 'inline';
        }
        
        if (nodeName in cache) {
            return cache[nodeName];
        }
        
        var elm = Jeeel.Document.createElement(nodeName);
        var body = Jeeel.Document.getBody();

        body.appendChild(elm);

        var display = Jeeel.Document.getComputedStyle(elm).display;

        body.removeChild(elm);

        // 任意にスタイルが設定されていた場合で且displayの値がnoneもしくは不明の場合はiframe内で再取得
        if (display === 'none' || display === '') {
            var iframe = Jeeel.Document.createElement('iframe');

            iframe.frameBorder = iframe.width = iframe.height = 0;

            body.appendChild(iframe);

            var iframeDoc = (iframe.contentWindow || iframe.contentDocument).document;
            iframeDoc.write((Jeeel.Document.getDocument().compatMode === 'CSS1Compat' ? '<!doctype html>' : '' ) + '<html><body>');
            iframeDoc.close();

            elm = iframeDoc.createElement(nodeName);

            iframeDoc.body.appendChild(elm);

            display = Jeeel.Document.getComputedStyle(elm).display;

            body.removeChild(iframe);
        }
        
        cache[nodeName] = display;

        return display;
    };
})();

Jeeel.Dom.Style.prototype = {
  
    /**
     * 操作対象スタイル
     * 
     * @type Style
     * @private
     */
    _style: null,
    
    /**
     * 計算済みスタイル
     * 
     * @type CSSStyleDeclaration
     * @private
     */
    _computedStyle: null,
    
    /**
     * デフォルトの表示状態(inlineかblock、もしくはnoneの可能性もある: head)
     * 
     * @type String
     * @private
     */
    _defaultDisplay: '',
    
    _oldDisplay: '',
    
    _animationQueue: [],
    
    /**
     * スタイルを取得する
     *
     * @param {String} style スタイル名
     * @return {String} スタイル値
     */
    getStyle: function (style) {
        style = Jeeel.String.toCamelCase(style);
        
        // まず通常のスタイルを参照し、存在しないスタイルは計算済みスタイルから参照する
        return this._style[style] || this._computedStyle[style];
    },

    /**
     * スタイルの設定を行う
     *
     * @param {String} style スタイル名
     * @param {String} value スタイル値
     * @return {Jeeel.Dom.Style} 自インスタンス
     */
    setStyle: function (style, value) {
        this._style[Jeeel.String.toCamelCase(style)] = value;

        return this;
    },
    
    /**
     * 複数のスタイルの設定を行う
     *
     * @param {Hash} styles スタイル名と値のペアリスト
     * @return {Jeeel.Dom.Style} 自インスタンス
     */
    setStyleList: function (styles) {
        var cssText = [];
        
        for (var style in styles) {
            cssText[cssText.length] = Jeeel.String.toHyphenation(style) + ': ' + styles[style] + ';';
        }
        
        this._style.cssText += '; ' + cssText.join('');
        
        return this;
    },
    
    /**
     * @ignore 未完成
     */
    animate: function (params, duration, easing, callback) {
        this._animationQueue[this._animation.length] = new this.constructor.Animation(this, params, duration, easing, callback);
        
        return this;
    },
    
    /**
     * @ignore 未完成
     */
    stop: function (clearQueue, gotoEnd) {
        
    },
    
    /**
     * 表示する
     * 
     * @return {Jeeel.Dom.Style} 自インスタンス
     */
    show: function () {
        var display = this._style.display;
        
        if (display !== '' && display !== 'none') {
            return this;
        } else if ( ! this._computedStyle) {
            this._style.display = this._defaultDisplay;
            
            return this;
        }
        
        if (this._oldDisplay) {
            this._style.display = this._oldDisplay;
            
            return this;
        }
        
        if (display === 'none') {
            display = this._style.display = '';
        }
        
        if (display === '' && this._computedStyle.display === 'none') {
            this._oldDisplay = this._style.display = this._defaultDisplay;
        } else {
            this._oldDisplay = this._computedStyle.display;
        }
        
        return this;
    },
    
    /**
     * 隠す
     * 
     * @return {Jeeel.Dom.Style} 自インスタンス
     */
    hide: function () {
        this._style.display = 'none';
        
        return this;
    },
    
    /**
     * 表示の切り替えをする
     * 
     * @return {Jeeel.Dom.Style} 自インスタンス
     */
    toggle: function () {
        return this._style.display === 'none' ? this.show() : this.hide();
    },
    
    /**
     * 指定座標に移動する
     * 
     * @param {Integer} x X座標
     * @param {Integer} y Y座標
     * @return {Jeeel.Dom.Style} 自インスタンス
     */
    shiftTo: function (x, y) {
        this.setStyle('left', x + 'px');
        return this.setStyle('top',  y + 'px');
    },
    
    /**
     * 不透明度を取得する
     * 
     * @return {Number} 不透明度(0.0～1.0)
     */
    getOpacity: function () {
        var style = this._computedStyle || this._style;
        
        if (Jeeel.Type.isSet(style.MozOpacity)) {
            return +(style.MozOpacity || 1.0);
        } else if (Jeeel.Type.isSet(style.opacity)) {
            return +(style.opacity || 1.0);
        } else if (Jeeel.Type.isSet(style.filter)) {
            return (style.filter.replace(/.*alpha\(.*opacity=([0-9]+).*\).*/, '$1') || 100) / 100;
        }
        
        return 1.0;
    },
    
    /**
     * 不透明度を設定する
     * 
     * @param {Number} opacity 不透明度(0.0～1.0)
     * @return {Jeeel.Dom.Style} 自インスタンス
     */
    setOpacity: function (opacity) {
        var style = this._style;
        
        if (Jeeel.Type.isSet(style.MozOpacity)) {
            style.MozOpacity = opacity;
        } else if (Jeeel.Type.isSet(style.opacity)) {
            style.opacity = opacity;
        } else if (Jeeel.Type.isSet(style.filter)) {
            style.zoom   = (style.zoom || 1);
            style.filter = 'alpha(opacity=' + (opacity * 100) + ')';
        }
        
        return this;
    },
    
    /**
     * コンストラクタ
     * 
     * @param {Style} style 操作スタイル
     */
    constructor: Jeeel.Dom.Style,
    
    _enqueueAnimate: function (animate) {
        
    },
    
    _dequeueAnimate: function () {
        
    }
};

Jeeel.file.Jeeel.Dom.Style = ['Animation'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Dom.Style, Jeeel.file.Jeeel.Dom.Style);