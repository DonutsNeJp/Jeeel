(function () {
    var index = 0;
    
    /**
     * コンストラクタ
     * 
     * @class Jsonp通信の制御を行うクラス
     * @augments Jeeel.Net.Abstract
     * @param {String} url Jsonp通信URL
     * @throws {Error} urlが指定されていない場合に起こる
     */
    Jeeel.Net.Jsonp = function (url) {
        if ( ! Jeeel.Type.isString(url)) {
            throw new Error('URLを指定してください。');
        }
        
        Jeeel.Net.Abstract.call(this);

        this._url = url;
        this._loaded = Jeeel.Function.simpleBind(this._loaded, this);

        this._id = index++;
    };
})();

/**
 * インスタンスの作成を行う
 * 
 * @param {String} url Jsonp通信URL
 * @return {Jeeel.Net.Jsonp} 作成したインスタンス
 * @throws {Error} urlが指定されていない場合に起こる
 */
Jeeel.Net.Jsonp.create = function (url) {
    return new this(url);
};

Jeeel.Net.Jsonp.prototype = {
  
    /**
     * インスタンスの固有ID
     * 
     * @type Integer
     * @private
     */
    _id: null,

    /**
     * Jsonp通信URL
     *
     * @type String
     * @private
     */
    _url: '',
    
    /**
     * サーバー側で呼び出させるためのキャッシュキー
     * 
     * @type String
     * @private
     */
    _callbackKey: null,
    
    /**
     * Jsonp通信終了後のコールバック
     * 
     * @type Hash
     * @private
     */
    _loadCallback: null,
    
    /**
     * スクリプトタグ
     * 
     * @type Element
     * @private
     */
    _script: null,

    /**
     * Jsonp通信URLの設定
     *
     * @param {String} url Jsonp通信URL
     * @return {Jeeel.Net.Jsonp} 自インスタンス
     * @throws {Error} urlが文字列でない場合に起こる
     */
    setUrl: function (url) {
        if ( ! Jeeel.Type.isString(url)) {
            throw new Error('URLを指定してください。');
        }

        this._url = url;

        return this;
    },
    
    /**
     * Jsonp通信時にサーバー側で呼び出すコールバックを設定する<br />
     * このコールバック設定を使用した場合グローバル関数を作成する必要は無くなる<br />
     * ただし、Jsonp通信が終了した時点でこのコールバックは無効になる
     * 
     * @param {String} callbackKey サーバー側でコールバックの名前を取得する際のキー
     * @param {Function} callback 実際に呼び出されるコールバック
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.Net.Jsonp} 自インスタンス
     */
    setCallback: function (callbackKey, callback, thisArg) {
        
        this._callbackKey = callbackKey;
        
        Jeeel._jsp['f' + this._id] = function () {
            callback.apply(thisArg, arguments);
        };
        
        this._params.set(callbackKey, 'Jeeel._jsp.f' + this._id);
        
        return this;
    },
    
    /**
     * Jsonp通信終了後に呼び出すメソッドを設定する
     * 
     * @param {Function} callback 通信終了メソッド<br />
     *                             コールバックメソッドに渡される引数はJsonpを行ったスクリプトElementになる<br />
     *                             void callBack(Element script)
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.Net.Jsonp} 自インスタンス
     */
    setLoadedMethod: function (callback, thisArg) {
        this._loadCallback = {func: callback, thisArg: thisArg};
        
        return this;
    },

    /**
     * 実際にJsonp通信を実行する
     *
     * @return {Jeeel.Net.Jsonp} 自インスタンス
     */
    execute: function () {
        if (Jeeel.Acl && Jeeel.Acl.isDenied(this._url, '*', 'Url')) {
            Jeeel.Acl.throwError('Access Error', 404);
        }
        
        if ( ! this.isValid()) {
            throw new Error('There is an error in the submission.');
        }
      
        var url = this._url + '?' + this._params.toQueryString();
        
        this._script = Jeeel.Loader.loadScript(url, this._loaded);
         
        return this;
    },
    
    /**
     * コンストラクタ
     * 
     * @constructor
     */
    constructor: Jeeel.Net.Jsonp,
    
    /**
     * 読み込み終了後に呼ばれるイベントメソッド
     */
    _loaded: function () {
        Jeeel.Dom.Element.create(this._script).remove();

        if (this._loadCallback) {
            this._loadCallback.func.call(this._loadCallback.thisArg || this, this._script);
        }
        
        if (this._callbackKey) {
            this._params.unset(this._callbackKey);
            
            delete Jeeel._jsp['f' + this._id];
        }

        this._script = null;
    }
};

Jeeel.Class.extend(Jeeel.Net.Jsonp, Jeeel.Net.Abstract);
