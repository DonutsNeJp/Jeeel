Jeeel.directory.Jeeel.Dom.Window = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Dom + 'Window/';
    }
};

/**
 * コンストラクタ
 * 
 * @class windowをラップして拡張するクラス
 * @param {Window|IFrameElement} [window] 対象のウィンドウ(iframe等で階層が違う場合に指定)
 * @throws {Error} windowが指定されてかつiframeやWindow型でない場合に発生
 */
Jeeel.Dom.Window = function (window) {
  
    if (Jeeel.Window && ( ! window || window === Jeeel._global)) {
        return Jeeel.Window;
    }
    
    if ( ! window) {
        window = Jeeel._global;
    } else if (window.nodeName && window.nodeName.toUpperCase() == 'IFRAME') {
        window = window.contentWindow;
    } else if (window instanceof Jeeel.Dom.Document) {
        this._document = window;
        window = window.getDocument();
        window = window.defaultView || window.parentWindow;
    }
    
    if ( ! Jeeel.Type.isWindow(window)) {
        throw new Error('引数はWindowまたはIFrameElementを渡してください。');
    }
    
    this._window = window;
};

/**
 * インスタンスの作成を行う
 *
 * @param {Window|IFrameElement} [window] 対象のウィンドウ(iframe等で階層が違う場合に指定)
 * @return {Jeeel.Dom.Window} 作成したインスタンス
 */
Jeeel.Dom.Window.create = function (window) {
    return new this(window);
};

Jeeel.Dom.Window.prototype = {
    /**
     * 操作対象のWindow
     * 
     * @type Window
     * @protected
     */
    _window: null,
    
    /**
     * Windowに属するDocumentのラッパーインスタンス
     * 
     * @type Jeeel.Dom.Document
     * @private
     */
    _document: null,
    
    /**
     * setIntervalを高速化するためのインスタンス
     * 
     * @type Jeeel.Dom.Window.Interval
     * @private
     */
    _interval: null,
    
    /**
     * 操作しているWindowを取得する
     * 
     * @return {Window} 操作しているWindow
     */
    getWindow: function () {
        return this._window;
    },
    
    /**
     * このWindowに属するDocumentのラッパーインスタンスを取得する
     * 
     * @return {Jeeel.Dom.Document} Documentラッパーインスタンス
     */
    getDocument: function () {
        return this._document || (this._document = Jeeel.Dom.Document.create(this));
    },
    
    /**
     * 現在のウィンドウのサイズを取得する(ブラウザサイズの切り替えで値も変わる)
     * 
     * @return {Jeeel.Object.Size} サイズ
     */
    getWindowSize: function () {},
    
    /**
     * 現在のウィンドウのスクロール位置を取得する
     * 
     * @return {Jeeel.Object.Point} スクロール位置
     */
    getScrollPosition: function () {},
    
    /**
     * モードレスなサブウィンドウを開くためのインスタンスを作成する
     * 
     * @param {String} url サブウィンドウを開く際のURL
     * @return {Jeeel.Dom.Window.Opener.Window} 作成したインスタンス
     */
    createWindowOpener: function (url) {
        return new this.constructor.Opener.Window(this._window, url);
    },
    
    /**
     * モーダルなサブウィンドウを開くためのインスタンスを作成する
     * 
     * @param {String} url サブウィンドウを開く際のURL
     * @return {Jeeel.Dom.Window.Opener.Dialog} 作成したインスタンス
     * @ignore 未完成
     */
    createDialogOpener: function (url) {
        return new this.constructor.Opener.Dialog(this._window, url);
    },
    
    /**
     * 定期的に実行するタイマーをセットする(複数のタイマーをセットする場合はこの関数を使う事で高速化が図れる)
     * 
     * @param {Function|String} func 一定時間毎に呼び出されるコールバック
     * @param {Integer} interval コールバックを呼び出す間隔(ミリ秒)
     * @param {Mixied} var_args 可変引数、コールバックに渡す引数
     * @return {Integer} タイマーID
     */
    setInterval: function (func, interval, var_args) {
        if ( ! this._interval) {
            this._interval = new this.constructor.Interval(this._window);
        }
        
        return this._interval.addTask.apply(this._interval, arguments);
    },
    
    /**
     * 定期実行タイマーを破棄する(このインスタンスのsetIntervalで無ければ無効)
     * 
     * @param {Integer} intervalID 破棄対象のタイマーID
     * @return {Jeeel.Dom.Window} 自インスタンス
     */
    clearInterval: function (intervalID) {
        if ( ! this._interval) {
            return this;
        }
        
        this._interval.removeTask(intervalID);
        
        return this;
    },
    
    /**
     * このWindowにイベントを追加する<br />
     * 引数はJeeel.Dom.Event, このWindowになる
     *
     * @param {String} type イベントタイプ
     * @param {Function} listener 登録イベントメソッド
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.Dom.Window} 自インスタンス
     */
    addEventListener: function (type, listener, thisArg) {
        if ( ! Jeeel.Type.isSet(thisArg)) {
            thisArg = this;
        }

        Jeeel.Dom.Event.addEventListener(this._window, type, listener, thisArg);
        
        return this;
    },

    /**
     * イベントの削除を行う<br />
     * このインスタンスのaddEventListenerに対して行わなければ削除はできない
     *
     * @param {String} type イベントタイプ
     * @param {Function} listener 登録イベントメソッド
     * @return {Jeeel.Dom.Window} 自インスタンス
     */
    removeEventListener: function (type, listener) {
        Jeeel.Dom.Event.removeEventListener(this._window, type, listener);

        return this;
    },
    
    /**
     * このWindowに設定されているイベントを任意のタイミングで実行する
     *
     * @param {String} type イベントタイプ
     * @param {Jeeel.Dom.Event.Option} [option] マウスイベントやキーボードイベント等のイベント時のパラメータを指定する
     * @return {Jeeel.Dom.Window} 自インスタンス
     * @ignore 未完成
     */
    dispatchEvent: function (type, option) {
        Jeeel.Dom.Event.dispatchEvent(this._window, type, option);
        
        return this;
    },
    
    /**
     * このWindowにオーバーレイを設定する
     * 
     * @param {Boolean} enable オーバーレイを有効にするかどうか
     * @param {Hash} [styles] zIndex, backgroundColor, opacityを独自に設定する場合に指定<br />
     *                         デフォルトは以下である<br />
     *                         zIndex: 1000, backgroundColor: '#000000', opacity: 0.75
     * @return {Jeeel.Dom.Window} 自インスタンス
     */
    setOverlay: function (enable, styles) {
        if ( ! styles) {
            styles = {};
        }
        
        var doc = this._document;
        var size, overlay = doc.getElementById('jeeel-window-overlay');
        
        if ( ! enable) {
            if (overlay) {
                Jeeel.Dom.Element.create(overlay).hide();
            }
            
            return this;
        }
        
        size = Jeeel.Dom.Element.prototype.getSize.call({_element: doc.getDocumentElement()});
        
        if (overlay) {
            overlay = new Jeeel.Dom.Element(overlay);
            overlay.setStyleList({
                zIndex: styles.zIndex || 1000,
                backgroundColor: styles.backgroundColor || '#000000',
                width: size.width + 'px',
                height: size.height + 'px'
            }).setOpacity(styles.opacity ||0.75).show();

            return this;
        }
        
        overlay = new Jeeel.Dom.Element(doc.createElement('div'));

        overlay.setId('jeeel-window-overlay').setStyleList({
            position: 'absolute',
            top: '0px',
            left: '0px',
            zIndex: styles.zIndex || 1000,
            backgroundColor: styles.backgroundColor || '#000000',
            width: size.width + 'px',
            height: size.height + 'px'
        }).setOpacity(styles.opacity ||0.75).setBackgroundIframe();
        
        doc.appendToBody(overlay.getElement());
        
        return this;
    },

    /**
     * コンストラクタ
     * 
     * @param {Window|IFrameElement} [window] 対象のウィンドウ(iframe等で階層が違う場合に指定)
     * @constructor
     */
    constructor: Jeeel.Dom.Window,
    
    _init: function () {
      
        var doc = Jeeel._doc,
            win = Jeeel._global;
        
        if ( ! doc) {
            delete this._init;
            return;
        }
        
        var self = this;
        
        if (win.innerWidth) {
            self.getWindowSize = function () {
                var win = this._window;

                return new Jeeel.Object.Size(win.innerWidth, win.innerHeight);
            };
            
            self.getScrollPosition = function () {
                var win = this._window;
                
                return new Jeeel.Object.Point(win.pageXOffset, win.pageYOffset);
            };
        } else if (doc.documentElement && doc.documentElement.clientWidth) {
            self.getWindowSize = function () {
                var root = this._document.getDocumentElement();

                return new Jeeel.Object.Size(root.clientWidth, root.clientWidth);
            };
            
            self.getScrollPosition = function () {
                var root = this._document.getDocumentElement();
                
                return new Jeeel.Object.Point(root.scrollLeft, root.scrollTop);
            };
        } else if (doc.body.clientWidth) {
            self.getWindowSize = function () {
                var root = this._document.getBody();

                return new Jeeel.Object.Size(root.clientWidth, root.clientWidth);
            };
            
            self.getScrollPosition = function () {
                var root = this._document.getBody();
                
                return new Jeeel.Object.Point(root.scrollLeft, root.scrollTop);
            };
        } else {
            self.getWindowSize = function () {
                return new Jeeel.Object.Size(0, 0);
            };
            
            self.getScrollPosition = function () {
                return new Jeeel.Object.Point(0, 0);
            };
        }

        delete this._init;
    }
};

Jeeel.Dom.Window.prototype._init();

Jeeel.file.Jeeel.Dom.Window = ['Opener', 'Interval'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Dom.Window, Jeeel.file.Jeeel.Dom.Window);