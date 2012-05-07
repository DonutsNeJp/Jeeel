
/**
 * コンストラクタ
 * 
 * @class ビーコンを使用した通信を提供するクラス
 * @param {String} url データ送信先URL
 */
Jeeel.Net.Beacon = function (url) {
    this._url = url;
    this._params = new Jeeel.Parameter();
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
     * ビーコン通信の際にサーバー側に渡すパラメータのハッシュを保持するJeeel.Parameter
     *
     * @type Jeeel.Parameter
     * @private
     */
    _params: null,

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
     * ビーコンパラメータの全取得
     *
     * @return {Hash} 値リスト
     */
    getAll: function () {
        return this._params.getAll();
    },

    /**
     * ビーコンパラメータの取得
     *
     * @param {String} key キー
     * @param {Mixied} [defaultValue] デフォルト値
     * @return {Mixied} 値
     */
    get: function (key, defaultValue) {
        return this._params.get(key, defaultValue);
    },

    /**
     * ビーコンパラメータを総入れ替えする
     *
     * @param {Hash} vals 値リスト
     * @return {Jeeel.Net.Beacon} 自インスタンス
     * @throws {Error} valsが配列式でない場合に起こる
     */
    setAll: function (vals) {

        if ( ! Jeeel.Type.isHash(vals)) {
            throw new Error('valsが配列・連想配列ではありあせん。');
        }

        this._params.setAll({});

        var self = this;

        Jeeel.Hash.forEach(vals,
            function (val, key) {
                self._params.set(key, val);
            }
        );

        return this;
    },

    /**
     * ビーコンパラメータの設定
     *
     * @param {String} key キー
     * @param {Mixied} val 値
     * @return {Jeeel.Net.Beacon} 自インスタンス
     */
    set: function (key, val) {
        this._params.set(key, val);

        return this;
    },
    
    /**
     * ビーコンパラメータの指定キーの値を破棄する
     *
     * @param {String} key キー
     * @return {Jeeel.Net.Beacon} 自インスタンス
     */
    unset: function (key) {
        this._params.unset(key);

        return this;
    },

    /**
     * ビーコンパラメータの指定キーの値を保持しているかどうかを返す
     *
     * @param {String} key キー
     * @return {Boolean} 値を保持していたらtrueそれ以外はfalseを返す
     */
    has: function (key) {
        return this._params.has(key);
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

