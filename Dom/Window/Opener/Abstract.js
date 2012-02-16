
/**
 * コンストラクタ
 * 
 * @abstractClass Opener系の抽象クラス
 */
Jeeel.Dom.Window.Opener.Abstract = function () {
    
};

Jeeel.Dom.Window.Opener.Abstract.prototype = {
    /**
     * 操作対象のWindow
     * 
     * @type Window
     * @private
     */
    _window: null,
    
    /**
     * 新しく開くウィンドウのURL
     * 
     * @type String
     * @private
     */
    _url: '',
    
    /**
     * HTTPメソッド
     * 
     * @type String
     * @private
     */
    _method: 'POST',

    /**
     * window.openの際にサーバー側に渡すパラメータ
     *
     * @type Jeeel.Parameter
     * @private
     */
    _params: null,
    
    /**
     * window.openの際のwindowオプション
     *
     * @type Jeeel.Parameter
     * @private
     */
    _options: null,
    
    /**
     * HTTPメソッドを取得する
     *
     * @return {String} HTTPメソッド(getまたはpost、大文字小文字は問わない)
     */
    getMethod: function () {
        return this._method;
    },
    
    /**
     * HTTPメソッドを設定する
     *
     * @param {String} method HTTPメソッド(getまたはpost、大文字小文字は問わない)
     * @return {Jeeel.Dom.Window.Opener.Abstract} 自インスタンス
     */
    setMethod: function (method) {
        if ( ! Jeeel.Type.isString(method)) {
            method = 'POST';
        }
        
        method = method.toUpperCase();

        if (method !== 'GET' && method !== 'POST') {
            method = 'POST';
        }

        this._method = method;

        return this;
    },
    
    /**
     * 新しく開くウィンドウのURLを取得する
     * 
     * @return {String} ウィンドウのURL
     */
    getUrl: function () {
        return this._url;
    },
    
    /**
     * 新しく開くウィンドウのURLを設定する
     * 
     * @param {String} url ウィンドウのURL
     * @return {Jeeel.Dom.Window.Opener.Abstract} 自インスタンス
     */
    setUrl: function (url) {
        this._url = url;
        
        return this;
    },
    
    /**
     * ウィンドウに渡すパラメータの取得
     *
     * @param {String} key キー
     * @param {Mixied} [defaultValue] デフォルト値
     * @return {Mixied} 値
     */
    get: function (key, defaultValue) {
        return this._params.get(key, defaultValue);
    },
    
    /**
     * ウィンドウに渡すパラメータ全取得
     *
     * @return {Hash} 値リスト
     */
    getAll: function () {
        return this._params.getAll();
    },
    
    /**
     * ウィンドウに渡すパラメータをセットする
     * 
     * @param {String} key キー
     * @param {Mixied} val 値
     * @return {Jeeel.Dom.Window.Opener.Abstract} 自インスタンス
     */
    set: function (key, val) {
        this._params.set(key, val);
        
        return this;
    },
    
    /**
     * ウィンドウに渡すパラメータを総入れ替えする
     * 
     * @param {Hash} vals 値リスト
     * @return {Jeeel.Dom.Window.Opener.Abstract} 自インスタンス
     */
    setAll: function (vals) {
        this._params.setAll(vals);
        
        return this;
    },
    
    /**
     * ウィンドウに渡すパラメータの値を破棄する
     *
     * @param {String} key キー
     * @return {Jeeel.Dom.Window.Opener.Abstract} 自インスタンス
     */
    unset: function (key) {
        this._params.unset(key);

        return this;
    },
    
    /**
     * ウィンドウのオプションの取得
     *
     * @param {String} key キー
     * @param {Mixied} [defaultValue] デフォルト値
     * @return {Mixied} 値
     */
    getOption: function (key, defaultValue) {
        return this._options.get(key, defaultValue);
    },
    
    /**
     * ウィンドウのオプション全取得
     *
     * @return {Hash} 値リスト
     */
    getOptionAll: function () {
        return this._options.getAll();
    },
    
    /**
     * ウィンドウのオプションをセットする
     * 
     * @param {String} key キー
     * @param {String|Integer} val 値
     * @return {Jeeel.Dom.Window.Opener.Abstract} 自インスタンス
     */
    setOption: function (key, val) {
        this._options.set(key, val);
        
        return this;
    },
    
    /**
     * ウィンドウのオプションを総入れ替えする
     * 
     * @param {Hash} vals 値リスト
     * @return {Jeeel.Dom.Window.Opener.Abstract} 自インスタンス
     */
    setOptionAll: function (vals) {
        this._options.setAll(vals);
        
        return this;
    },
    
    /**
     * ウィンドウのオプションの値を破棄する
     *
     * @param {String} key キー
     * @return {Jeeel.Dom.Window.Opener.Abstract} 自インスタンス
     */
    unsetOption: function (key) {
        this._options.unset(key);
        
        return this;
    },
    
    /**
     * ウィンドウを開く
     * 
     * @return {Mixied} 戻り値(子クラスの実装による)
     * @abstract
     */
    open: function () {
        throw new Error('実装されていません');
    }
};
