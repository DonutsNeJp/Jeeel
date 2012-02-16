
/**
 * コンストラクタ
 * @class 垂直スクロールバーを単体で扱うクラス
 * @augments Jeeel.Gui.Abstract
 */
Jeeel.Gui.Scrollbar.Vertical = function () {
    this._init();
};

/**
 * インスタンスの作成を行う
 * 
 * @return {Jeeel.Gui.Scrollbar.Vertical} 作成したインスタンス
 */
Jeeel.Gui.Scrollbar.Vertical.create = function () {
    return new this();
};

Jeeel.Gui.Scrollbar.Vertical.MIN_HEIGHT = 30;

Jeeel.Gui.Scrollbar.Vertical.CLASS = {
    SCROLLBAR: 'jeeel-gui-scrollbar-vertical',
    INNER: 'jeeel-gui-scrollbar-vertical-inner'
};

/**
 * 垂直スクロールバー全インスタンス共通のスタイルを定義する
 */
Jeeel.Gui.Scrollbar.Vertical.initStyle = function () {
    if (arguments.callee.ignore) {
        return;
    }
    
    arguments.callee.ignore = true;
    
    var className = this.CLASS.SCROLLBAR;
    var style = 'div.' + className + ' {\n'
              + '  position: relative;\n'
              + '  width: 18px;\n'
              + '  height: 100px;\n'
              + '  cursor: pointer;\n'
              + '  margin-top: -1px;\n'
              + '  border: 1px #EEEDE5 solid;\n'
              + '}\n'
              + 'div.' + className + ' div.' + this.CLASS.INNER + ' {\n'
              + '  position: absolute;\n'
              + '  width: 16px;\n'
              + '  height: 60px;\n'
              + '  background-color: #C2D5FC;\n'
              + '  text-align: center;\n'
              + '  line-height: 60px;\n'
              + '  color: #666;\n'
              + '  overflow: hidden;\n'
              + '  border: 1px #FFFFFF solid;\n'
              + '  cursor: pointer;\n'
              + '  font-size: 16px;\n'
              + '}\n'
              + 'div.' + className + ' div.' + this.CLASS.INNER + ':hover {\n'
              + '  background-color: #D6E7FF;\n'
              + '}';

    this._styleTag = Jeeel.Import.addStyle(style);
};

Jeeel.Gui.Scrollbar.Vertical.prototype = {
    _scrollbarHeight: 100,
    _innerHeight: 200,
    _barHeight: 60,
    _barTopMax: 38,
    _scrollDy: 1,
    _scrollTop: 0,
    _scrollTopMax: 100,
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
     * @return {Jeeel.Gui.Scrollbar.Vertical} 自インスタンス
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
     * このスクロールバーに対応するコンテナの高さを設定する
     * 
     * @param {Integer} height 高さ
     * @return {Jeeel.Gui.Scrollbar.Vertical} 自インスタンス
     */
    setContainerHeight: function (height) {
        this._innerHeight = +height;
        
        this._innerBar.style.height = this._innerHeight + 'px';
        
        return this._resize();
    },
    
    /**
     * このスクロールバーに対応するコンテナの高さを取得する
     * 
     * @return {Integer} 高さ
     */
    getContainerHeight: function () {
        return this._innerHeight;
    },
    
    /**
     * スクロールバー自体の高さを設定する
     * 
     * @param {Integer} height 高さ
     * @return {Jeeel.Gui.Scrollbar.Vertical} 自インスタンス
     */
    setScrollHeight: function (height) {
        this._scrollbarHeight = +height;
        
        this._scrollbar.style.height = (this._scrollbarHeight + 1) + 'px';
        
        return this._resize();
    },
    
    /**
     * スクロールバー自体の高さを取得する
     * 
     * @return {Integer} 高さ
     */
    getScrollHeight: function () {
        return this._scrollbarHeight;
    },
    
    /**
     * スクロールのトップ座標を設定する
     * 
     * @param {Number} top トップ座標
     * @return {Jeeel.Gui.Scrollbar.Vertical} 自インスタンス
     */
    setScrollTop: function (top) {
        top = Jeeel.Number.limit(+top, 0, this._scrollTopMax);

        var barTop = top / this._scrollDy;
        
        this._scrollTop = top;
        this._innerBar.style.top = barTop + 'px';
        
        return this;
    },
    
    /**
     * スクロールのトップ座標を取得する
     * 
     * @return {Number} トップ座標
     */
    getScrollTop: function () {
        return this._scrollTop;
    },
    
    /**
     * スクロールバーをスクロールする
     * 
     * @param {Number} [delta] スクロール量(1に対して1ホイール分に相当する, +で上に、-で下に進む)
     * @param {Boolean} [doDispatch] スクロールイベントを発生させるかどうか
     * @return {Jeeel.Gui.Scrollbar.Vertical} 自インスタンス
     */
    scroll: function (delta, doDispatch) {
        this.setScrollTop(this._scrollTop + (this._scrollDelta * -delta) || 0);
        
        doDispatch && this._callHandlers(null);
        
        return this;
    },
    
    /**
     * スクロール可能かどうかを返す
     * 
     * @param {Boolean} [isUp] 方向が上かどうか
     * @return {Boolean} スクロール可能かどうか
     */
    canScroll: function (isUp) {
        return isUp ? this.canScrollUp() : this.canScrollDown();
    },
    
    /**
     * 上にスクロールが可能かどうかを返す
     * 
     * @return {Boolean} 上にスクロール可能かどうか
     */
    canScrollUp: function () {
        return this._scrollTop > 0;
    },
    
    /**
     * 下にスクロールが可能かどうかを返す
     * 
     * @return {Boolean} 下にスクロール可能かどうか
     */
    canScrollDown: function () {
        return this._scrollTop < this._scrollTopMax;
    },
    
    _resize: function () {
        var barHeight = this._scrollbarHeight / this._innerHeight * this._scrollbarHeight;

        if (barHeight < this.constructor.MIN_HEIGHT) {
            barHeight = this.constructor.MIN_HEIGHT;
        }
        
        this._barTopMax = this._scrollbarHeight - barHeight;
        this._scrollTopMax = this._innerHeight - this._scrollbarHeight;
        this._scrollDy = this._scrollTopMax / this._barTopMax;
        this._scrollDelta = barHeight * this._scrollDy / 3;
        
        this._barHeight = barHeight;
        this._innerBar.style.height = barHeight + 'px';
        this._innerBar.style.lineHeight = barHeight + 'px';
        
        return this;
    },
    
    _onClick: function (event) {
        event.stop();
        
        if (this._scrollable || event.target !== this._scrollbar) {
            return;
        }
        
        var op = (event.getRelativeMousePoint(this._innerBar).y < 0 ? -1 : 1);
        
        this.setScrollTop(this._scrollTop + op * this._barHeight * this._scrollDy);
        
        this._callHandlers(event);
    },
    
    _onScroll: function (event) {
        if (this._scrollable) {
            return;
        }
        
        var op = (event.mouseWheel > 0 ? -1 : 1);
        var up = op < 0;
        
        if (this.canScroll(up)) {
            event.stop();
            
            this.setScrollTop(this._scrollTop + op * this._scrollDelta);

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
        
        var top = event.getRelativeMousePoint(this._scrollbar).y
                - this._startPoint.y;
              
        top = Jeeel.Number.limit(top, 0, this._barTopMax);
        
        this._innerBar.style.top = top + 'px';
        this.setScrollTop(top * this._scrollDy);
        
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
    constructor: Jeeel.Gui.Scrollbar.Vertical,
    
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

Jeeel.Class.extend(Jeeel.Gui.Scrollbar.Vertical, Jeeel.Gui.Abstract);
