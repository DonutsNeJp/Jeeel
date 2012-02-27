
/**
 * コンストラクタ
 * @class 水平スクロールバーを単体で扱うクラス
 * @augments Jeeel.Gui.Abstract
 */
Jeeel.Gui.Scrollbar.Horizontal = function () {
    this._init();
};

/**
 * インスタンスの作成を行う
 * 
 * @return {Jeeel.Gui.Scrollbar.Horizontal} 作成したインスタンス
 */
Jeeel.Gui.Scrollbar.Horizontal.create = function () {
    return new this();
};

Jeeel.Gui.Scrollbar.Horizontal.MIN_WIDTH = 30;

Jeeel.Gui.Scrollbar.Horizontal.CLASS = {
    SCROLLBAR: 'jeeel-gui-scrollbar-horizontal',
    INNER: 'jeeel-gui-scrollbar-horizontal-inner'
};

/**
 * 水平スクロールバー全インスタンス共通のスタイルを定義する
 */
Jeeel.Gui.Scrollbar.Horizontal.initStyle = function () {
    if (arguments.callee.ignore) {
        return;
    }
    
    arguments.callee.ignore = true;
    
    var className = this.CLASS.SCROLLBAR;
    var style = 'div.' + className + ' {\n'
              + '  position: relative;\n'
              + '  width: 100px;\n'
              + '  height: 18px;\n'
              + '  cursor: pointer;\n'
              + '  margin-left: -1px;\n'
              + '  border: 1px #EEEDE5 solid;\n'
              + '}\n'
              + 'div.' + className + ' div.' + this.CLASS.INNER + ' {\n'
              + '  position: absolute;\n'
              + '  width: 60px;\n'
              + '  height: 16px;\n'
              + '  background-color: #C2D5FC;\n'
              + '  text-align: center;\n'
              + '  color: #666;\n'
              + '  overflow: hidden;\n'
              + '  border: 1px #FFFFFF solid;\n'
              + '  cursor: pointer;\n'
              + '  font-size: 16px;\n'
              + '}\n'
              + 'div.' + className + ' div.' + this.CLASS.INNER + ':hover {\n'
              + '  background-color: #D6E7FF;\n'
              + '}';

    this._styleTag = Jeeel.Loader.addStyle(style);
};

Jeeel.Gui.Scrollbar.Horizontal.prototype = {
    _scrollbarWidth: 100,
    _innerWidth: 200,
    _barWidth: 60,
    _barLeftMax: 38,
    _scrollDx: 1,
    _scrollLeft: 0,
    _scrollLeftMax: 100,
    _scrollDelta: 20,
    
    _scrollbar: null,
    _innerBar: null,
    
    _scrollHandlers: [],
    _scrollable: false,
    _startPoint: null,
    
    /**
     * スクロールバーHTML要素を返す
     * 
     * @return {Element} スクロールバー
     */
    getScrollbar: function () {
        return this._scrollbar;
    },
    
    /**
     * スクロールイベントを登録する
     * 
     * @param {Function} listener 登録イベントメソッド
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値
     * @param {Mixied} var_args 可変引数、コールバックに渡す引数(最初の引数はJeeel.Dom.Eventで固定)
     * @return {Jeeel.Gui.Scrollbar.Horizontal} 自インスタンス
     */
    addScrollEvent: function (listener, thisArg, var_args) {
        var args = Array.prototype.slice.call(arguments, 2, arguments.length);
        
        args.unshift(null);
        
        this._scrollHandlers[this._scrollHandlers.length] = {
            listener: listener,
            thisArg: thisArg || this,
            args: args
        };
        
        return this;
    },
    
    /**
     * このスクロールバーに対応するコンテナの幅を設定する
     * 
     * @param {Integer} width 幅
     * @return {Jeeel.Gui.Scrollbar.Horizontal} 自インスタンス
     */
    setContainerWidth: function (width) {
        this._innerWidth = +width;
        
        this._innerBar.style.width = this._innerWidth + 'px';
        
        return this._resize();
    },
    
    /**
     * このスクロールバーに対応するコンテナの幅を取得する
     * 
     * @return {Integer} 幅
     */
    getContainerWidth: function () {
        return this._innerWidth;
    },
    
    /**
     * スクロールバー自体の幅を設定する
     * 
     * @param {Integer} width 幅
     * @return {Jeeel.Gui.Scrollbar.Horizontal} 自インスタンス
     */
    setScrollWidth: function (width) {
        this._scrollbarWidth = +width;
        
        this._scrollbar.style.width = (this._scrollbarWidth + 1) + 'px';
        
        return this._resize();
    },
    
    /**
     * スクロールバー自体の幅を取得する
     * 
     * @return {Integer} 幅
     */
    getScrollWidth: function () {
        return this._scrollbarWidth;
    },
    
    /**
     * スクロールのレフト座標を設定する
     * 
     * @param {Number} left レフト座標
     * @return {Jeeel.Gui.Scrollbar.Horizontal} 自インスタンス
     */
    setScrollLeft: function (left) {
        left = Jeeel.Number.limit(+left, 0, this._scrollLeftMax);

        var barLeft = left / this._scrollDx;
        
        this._scrollLeft = left;
        this._innerBar.style.left = barLeft + 'px';
        
        return this;
    },
    
    /**
     * スクロールのレフト座標を取得する
     * 
     * @return {Number} レフト座標
     */
    getScrollLeft: function () {
        return this._scrollLeft;
    },
    
    /**
     * スクロールバーをスクロールする
     * 
     * @param {Number} [delta] スクロール量(1に対して1ホイール分に相当する, +で左に、-で右に進む)
     * @param {Boolean} [doDispatch] スクロールイベントを発生させるかどうか
     * @return {Jeeel.Gui.Scrollbar.Horizontal} 自インスタンス
     */
    scroll: function (delta, doDispatch) {
        this.setScrollLeft(this._scrollLeft + (this._scrollDelta * -delta) || 0);
        
        doDispatch && this._callHandlers(null);
        
        return this;
    },
    
    /**
     * スクロール可能かどうかを返す
     * 
     * @param {Boolean} [isLeft] 方向が左かどうか
     * @return {Boolean} スクロール可能かどうか
     */
    canScroll: function (isLeft) {
        return isLeft ? this.canScrollLeft() : this.canScrollRight();
    },
    
    /**
     * 左にスクロールが可能かどうかを返す
     * 
     * @return {Boolean} 左にスクロール可能かどうか
     */
    canScrollLeft: function () {
        return this._scrollLeft > 0;
    },
    
    /**
     * 右にスクロールが可能かどうかを返す
     * 
     * @return {Boolean} 右にスクロール可能かどうか
     */
    canScrollRight: function () {
        return this._scrollLeft < this._scrollLeftMax;
    },
    
    _resize: function () {
        var barWidth = this._scrollbarWidth / this._innerWidth * this._scrollbarWidth - 2;

        if (barWidth < this.constructor.MIN_WIDTH) {
            barWidth = this.constructor.MIN_WIDTH;
        }
        
        this._barLeftMax = this._scrollbarWidth - barWidth - 2;
        this._scrollLeftMax = this._innerWidth - this._scrollbarWidth;
        this._scrollDx = this._scrollLeftMax / this._barLeftMax;
        this._scrollDelta = barWidth * this._scrollDx / 3;
        
        this._barWidth = barWidth;
        this._innerBar.style.width = barWidth + 'px';
        
        return this;
    },
    
    _onClick: function (event) {
        event.stop();
        
        if (this._scrollable || event.target !== this._scrollbar) {
            return;
        }
        
        var op = (event.getRelativeMousePoint(this._innerBar).x < 0 ? -1 : 1);
        
        this.setScrollLeft(this._scrollLeft + op * this._barWidth * this._scrollDx);
        
        this._callHandlers(event);
    },
    
    _onScroll: function (event) {
        if (this._scrollable) {
            return;
        }
        
        var op = (event.mouseWheel > 0 ? -1 : 1);
        var lf = op < 0;
          
        if (this.canScroll(lf)) {
            event.stop();
            
            this.setScrollLeft(this._scrollLeft + op * this._scrollDelta);

            this._callHandlers(event);
        }
    },
    
    _onMouseDown: function (event) {
        event.stop();
        
        this._scrollable = true;
        
        this._startPoint = event.getRelativeMousePoint(this._innerBar);
    },
    
    _onMouseMove: function (event) {
        if ( ! this._scrollable) {
            return;
        }
        
        event.stop();
        
        var left = event.getRelativeMousePoint(this._scrollbar).x
                - this._startPoint.x;
              
        left = Jeeel.Number.limit(left, 0, this._barLeftMax);
        
        this._innerBar.style.left = left + 'px';
        this.setScrollLeft(left * this._scrollDx);
        
        this._callHandlers(event);
    },
    
    _onMouseUp: function (event) {
        if (this._scrollable) {
            event.stop();

            this._scrollable = false;
        }
    },
    
    _callHandlers: function (event) {
        for (var i = 0, l = this._scrollHandlers.length; i < l; i++) {
            var listener = this._scrollHandlers[i].listener;
            var thisArg  = this._scrollHandlers[i].thisArg;
            var args     = this._scrollHandlers[i].args;
            
            args[0] = event;
            
            listener.apply(thisArg, args);
            
            args[0] = null;
        }
    },
    
    /**
     * コンストラクタ
     * 
     * @constructor
     */
    constructor: Jeeel.Gui.Scrollbar.Horizontal,
    
    _init: function () {
        this.constructor.initStyle();
        var scrollbar = Jeeel.Document.createElement('div');
        var inner = Jeeel.Document.createElement('div');
        
        this._scrollHandlers = [];
        
        scrollbar.className = this.constructor.CLASS.SCROLLBAR;
        inner.className = this.constructor.CLASS.INNER;
        
        inner.innerHTML = '▒';
        
        this._scrollbar = scrollbar;
        this._innerBar = inner;
        
        this._scrollbar.appendChild(this._innerBar);
        
        Jeeel.Dom.Event.addEventListener(this._scrollbar, Jeeel.Dom.Event.Type.CLICK, this._onClick, this);
        Jeeel.Dom.Event.addEventListener(this._scrollbar, Jeeel.Dom.Event.Type.MOUSE_WHEEL, this._onScroll, this);
        Jeeel.Dom.Event.addEventListener(this._innerBar, Jeeel.Dom.Event.Type.MOUSE_DOWN, this._onMouseDown, this);
        Jeeel.Document.addEventListener(Jeeel.Dom.Event.Type.MOUSE_MOVE, this._onMouseMove, this);
        Jeeel.Document.addEventListener(Jeeel.Dom.Event.Type.MOUSE_UP, this._onMouseUp, this);
    }
};

Jeeel.Class.extend(Jeeel.Gui.Scrollbar.Horizontal, Jeeel.Gui.Abstract);
