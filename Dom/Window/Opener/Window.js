/**
 * コンストラクタ
 * 
 * @class サブウィンドウの生成を管理するクラス
 * @param {Window} window サブウィンドウのオープン元となるWindow
 * @param {String} url サブウィンドウを開く際のURL
 * @throws {Error} windowが指定されていない場合に起こる
 * @throws {Error} urlが指定されていない場合に起こる
 */
Jeeel.Dom.Window.Opener.Window = function (window, url) {
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
};

/**
 * インスタンスの作成を行う
 * 
 * @param {Window} window サブウィンドウのオープン元となるWindow
 * @param {String} url サブウィンドウを開く際のURL
 * @return {Jeeel.Dom.Window.Opener.Window} 作成したインスタンス
 */
Jeeel.Dom.Window.Opener.Window.create = function (window, url) {
    return new this(window, url);
};

Jeeel.Dom.Window.Opener.Window.prototype = {
  
    /**
     * 新しく開くウィンドウの名前
     * 
     * @type String
     * @private
     */
    _name: '',
  
    /**
     * 新しく開くウィンドウの名前を取得する
     * 
     * @return {String} ウィンドウの名前
     */
    getName: function () {
        return this._name;
    },
    
    /**
     * 新しく開くウィンドウの名前を設定する
     * 
     * @param {String} name ウィンドウの名前
     * @return {Jeeel.Dom.Window.Opener.Window} 自インスタンス
     */
    setName: function (name) {
        this._name = name;
        
        return this;
    },
  
    /**
     * 実際にウィンドウを開く
     * 
     * @return {Window} 開いたウィンドウ(ウィンドウを開けなかった場合はnull)
     */
    open: function () {
        var options = [];
        var ops = this._options.getAll();
        var markerName = this._name || '__MARK_WINDOW_NAME__';
        
        for (var key in ops) {
            options[options.length] = key + '=' + ops[key];
        }
        
        var window = this._window.open('', markerName, options.join(','));
        
        if ( ! window) {
            throw Error('ウィンドウを作成出来ませんでした。');
        }
        
        var submitter = Jeeel.Net.Submit.newForm(this._url, this._method);
        
        submitter.setAll(this._params.getAll())
                 .setTarget(markerName)
                 .execute();
                
        window.name = this._name;
        
        return window;
    },
    
    /**
     * コンストラクタ
     * 
     * @param {Window} window サブウィンドウのオープン元となるWindow
     * @param {String} url サブウィンドウを開く際のURL
     */
    constructor: Jeeel.Dom.Window.Opener.Window
};

Jeeel.Class.extend(Jeeel.Dom.Window.Opener.Window, Jeeel.Dom.Window.Opener.Abstract);
