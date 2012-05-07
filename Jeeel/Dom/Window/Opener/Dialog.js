Jeeel.directory.Jeeel.Dom.Window.Opener.Dialog = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Dom.Window.Opener + 'Dialog/';
    }
};

/**
 * コンストラクタ
 * 
 * @class サブウィンドウの生成を管理するクラス
 * @param {Window} window サブウィンドウのオープン元となるWindow
 * @param {String} url サブウィンドウを開く際のURL
 * @throws {Error} windowが指定されていない場合に起こる
 * @throws {Error} urlが指定されていない場合に起こる
 * @ignore 未完成
 */
Jeeel.Dom.Window.Opener.Dialog = function (window, url) {
    Jeeel.Dom.Window.Opener.Abstract.call(this);
    
    if ( ! Jeeel.Type.isWindow(window)) {
        throw new Error('Windowを指定してください。');
    } 
    else if ( ! Jeeel.Type.isString(url)) {
        throw new Error('URLを指定してください。');
    }
    
    this._window = window;
    this._url = url;
    
    this._params  = new Jeeel.Parameter();
    this._options = new Jeeel.Parameter();
    this._args = new Jeeel.Parameter();
    this._method = 'GET';
};

/**
 * インスタンスの作成を行う
 * 
 * @param {Window} window サブウィンドウのオープン元となるWindow
 * @param {String} url サブウィンドウを開く際のURL
 * @return {Jeeel.Dom.Window.Opener.Dialog} 作成したインスタンス
 */
Jeeel.Dom.Window.Opener.Dialog.create = function (window, url) {
    return new this(window, url);
};

Jeeel.Dom.Window.Opener.Dialog.prototype = {
  
    _args: null,
    
    /**
     * HTTPメソッドはGETのみ
     * 
     * @return {Jeeel.Dom.Window.Opener.Dialog} 自インスタンス
     */
    setMethod: function () {
        return this;
    },

    /**
     * ダイアログのパラメータの取得
     *
     * @param {String} key キー
     * @param {Mixied} [defaultValue] デフォルト値
     * @return {Mixied} 値
     */
    getArgument: function (key, defaultValue) {
        return this._args.get(key, defaultValue);
    },
    
    /**
     * ダイアログのパラメータ全取得
     *
     * @return {Hash} 値リスト
     */
    getArgumentAll: function () {
        return this._args.getAll();
    },
    
    /**
     * ダイアログのパラメータをセットする
     * 
     * @param {String} key キー
     * @param {String|Integer} val 値
     * @return {Jeeel.Dom.Window.Opener.Dialog} 自インスタンス
     */
    setArgument: function (key, val) {
        this._args.set(key, val);
        
        return this;
    },
    
    /**
     * ダイアログのパラメータを総入れ替えする
     * 
     * @param {Hash} vals 値リスト
     * @return {Jeeel.Dom.Window.Opener.Dialog} 自インスタンス
     */
    setArgumentAll: function (vals) {
        this._args.setAll(vals);
        
        return this;
    },
    
    /**
     * ダイアログのパラメータの値を破棄する
     *
     * @param {String} key キー
     * @return {Jeeel.Dom.Window.Opener.Dialog} 自インスタンス
     */
    unsetArgument: function (key) {
        this._args.unset(key);
        
        return this;
    },

    /**
     * 実際にダイアログウィンドウを開く
     * 
     * @return {Mixied} ダイアログからの戻り値
     */
    open: function () {
        var options = [];
        var ops = this._options.getAll();
        
        for (var key in ops) {
            options[options.length] = key + '=' + ops[key];
        }
        
        var url;
        var prms = {};
        
        if (this._method == 'GET') {
            url = this._url + '?' + this._params.toQueryString();
            prms = this._args.getAll();
        } else {
            url = Jeeel.directory.Jeeel.Dom.Window.Opener.Dialog + 'Post.html';
            prms.Jeeel = Jeeel;
            prms.url = this._url;
            prms.method = this._method;
            prms.args = this._args.getAll();
            prms.params = this._params.getAll();
        }
        
        return this._window.showModalDialog(url, prms, options.join(';'));
    },
    
    /**
     * テンプレートを介してダイアログを開く
     * 
     * @param {Function} [callback] ページロード時のコールバック
     * @return {Mixied} ダイアログからの戻り値
     * @ignore
     */
    openTemplate: function (callback) {
        var options = [];
        var ops = this._options.getAll();
        
        for (var key in ops) {
            options[options.length] = key + '=' + ops[key];
        }
        
        var url = Jeeel.directory.Jeeel.Dom.Window.Opener.Dialog + 'Template.html?' + this._params.toQueryString();
        var prms = {
            Jeeel: Jeeel,
            parent: Jeeel._global,
            params: this._args.getAll(),
            callback: callback || Jeeel.Function.Template.EMPTY
        };

        return this._window.showModalDialog(url, prms, options.join(';'));
    },
    
    /**
     * コンストラクタ
     * 
     * @param {Window} window サブウィンドウのオープン元となるWindow
     * @param {String} url サブウィンドウを開く際のURL
     */
    constructor: Jeeel.Dom.Window.Opener.Dialog
};

Jeeel.Class.extend(Jeeel.Dom.Window.Opener.Dialog, Jeeel.Dom.Window.Opener.Abstract);
