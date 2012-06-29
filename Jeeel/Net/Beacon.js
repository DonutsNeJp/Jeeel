
/**
 * コンストラクタ
 * 
 * @class ビーコンを使用した通信を提供するクラス
 * @augments Jeeel.Net.Abstract
 * @param {String} url データ送信先URL
 * @throws {Error} urlが指定されていない場合に起こる
 */
Jeeel.Net.Beacon = function (url) {

    if ( ! Jeeel.Type.isString(url)) {
        throw new Error('URLを指定してください。');
    }
        
    Jeeel.Net.Abstract.call(this);
    
    this._url = url;
    this._onLoad = Jeeel.Function.simpleBind(this._onLoad, this);
    this._onError = Jeeel.Function.simpleBind(this._onError, this);
};

/**
 * インスタンスの作成を行う
 * 
 * @param {String} url データ送信先URL
 * @return {Jeeel.Net.Beacon} 作成したインスタンス
 */
Jeeel.Net.Beacon.create = function (url) {
    return new this(url);
};

Jeeel.Net.Beacon.prototype = {
  
    /**
     * ビーコン通信URL
     *
     * @type String
     * @private
     */
    _url: '',
    
    /**
     * ビーコン
     * 
     * @type Element
     * @private
     */
    _beacon: null,
    
    /**
     * ビーコンの通信成功時のコールバック
     * 
     * @type Hash
     * @private
     */
    _loadCallback: null,
    
    /**
     * ビーコンの通信失敗時のコールバック
     * 
     * @type Hash
     * @private
     */
    _errorCallback: null,
    
    /**
     * ビーコン通信終了後に呼び出すメソッドを設定する
     * 
     * @param {Function} callback 通信終了メソッド<br />
     *                             コールバックメソッドに渡される引数はビーコンElementになる<br />
     *                             void callBack(Element script)
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.Net.Beacon} 自インスタンス
     */
    setLoadedMethod: function (callback, thisArg) {
        this._loadCallback = {func: callback, thisArg: thisArg};
        
        return this;
    },
    
    /**
     * ビーコン通信失敗時に呼び出すメソッドを設定する
     * 
     * @param {Function} callback 通信終了メソッド<br />
     *                             コールバックメソッドに渡される引数はビーコンElementになる<br />
     *                             void callBack(Element script)
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.Net.Beacon} 自インスタンス
     */
    setErrorMethod: function (callback, thisArg) {
        this._errorCallback = {func: callback, thisArg: thisArg};
        
        return this;
    },

    /**
     * 実際にビーコン通信を実行する
     *
     * @return {Jeeel.Net.Beacon} 自インスタンス
     */
    execute: function () {
        if (Jeeel.Acl && Jeeel.Acl.isDenied(this._url, '*', 'Url')) {
            Jeeel.Acl.throwError('Access Error', 404);
        }
        
        if ( ! this.isValid()) {
            throw new Error('There is an error in the submission.');
        }
        
        var url = this._url + '?' + this._params.toQueryString();
        
        var beacon = new Image();
        
        beacon.src = url;
        
        beacon.onload = this._onLoad;
        beacon.onerror = this._onError;
        
        this._beacon = beacon;
        
        return this;
    },
    
    /**
     * コンストラクタ
     * 
     * @param {String} url データ送信先URL
     * @constructor
     */
    constructor: Jeeel.Net.Beacon,
    
    /**
     * 読み込み完了イベント
     */
    _onLoad: function () {
        if (this._loadCallback) {
            this._loadCallback.func.call(this._loadCallback.thisArg || this, this._beacon);
        }
    },
    
    /**
     * 通信エラーイベント
     */
    _onError: function () {
        if (this._errorCallback) {
            this._errorCallback.func.call(this._errorCallback.thisArg || this, this._beacon);
        }
    }
};

Jeeel.Class.extend(Jeeel.Net.Beacon, Jeeel.Net.Abstract);
