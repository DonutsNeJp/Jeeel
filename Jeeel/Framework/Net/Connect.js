
/**
 * コンストラクタ
 * 
 * @class サーバーコネクトのプロトタイプ
 */
Jeeel.Framework.Net.Connect = function () {
    
};

Jeeel.Framework.Net.Connect.prototype = {
    
    /**
     * 並列接続時の動作ポリシー
     * 
     * @type Integer
     * @protected
     */
    _collisionPolicy: 0,
    
    /**
     * タイムアウト時間(ミリ秒)
     * 
     * @type Integer
     * @protected
     */
    _timeout: 60000,
    
    /**
     * HTTPメソッド
     * 
     * @type String
     * @protected
     */
    _method: 'POST',
    
    /**
     * Ajaxインスタンス
     * 
     * @type Jeeel.Net.Ajax
     * @protected
     */
    _ajax: null,
    
    /**
     * 並列リクエストをした場合の動作を設定する
     * 
     * @param {Integer} collisionPolicy コリジョンポリシー
     * @return {Jeeel.Framework.Net.Connect} 自インスタンス
     * @see Jeeel.Net.Ajax.CollisionPolicy
     */
    setCollisionPolicy: function (collisionPolicy) {
        this._collisionPolicy = collisionPolicy;
        
        return this;
    },
    
    /**
     * リクエストのタイムアウトまでの時間を設定する(デフォルトは60秒)
     * 
     * @param {Integer} time タイムアウト時間、0で無制限(ミリ秒)
     * @return {Jeeel.Framework.Net.Connect} 自インスタンス
     */
    setTimeoutTime: function (time) {
        this._timeout = time;
        
        return this;
    },
    
    /**
     * HTTPメソッドを設定する
     * 
     * @param {String} [method] HTTPメソッド(POSTもしくはGET、大文字小文字は問わない)
     * @return {Jeeel.Framework.Net.Connect} 自インスタンス
     */
    setMethod: function (method) {
        this._method = method;
        
        return this;
    },
    
    /**
     * サーバーに接続する
     * 
     * @param {String} url 接続URL
     * @param {Hash} [params] 送信データのリスト
     * @param {Function} [success] 成功時のコールバック(明示的に指定する場合) void callBack(Jeeel.Net.Ajax.Response response)
     * @param {Function} [failure] 失敗時のコールバック(明示的に指定する場合) void callBack(Jeeel.Net.Ajax.Response response)
     * @param {Function} [timeout] タイムアウト時のコールバック(明示的に指定する場合) void callBack(Jeeel.Net.Ajax.Response response)
     * @return {Jeeel.Framework.Net.Connect} 自インスタンス
     */
    connect: function (url, params, success, failure, timeout) {
        this._ajax = new Jeeel.Net.Ajax(url, this._method);
        
        this._ajax.setAll(params || {})
                  .setTimeoutTime(this._timeout)
                  .setCollisionPolicy(this._collisionPolicy)
                  .setSuccessMethod(success || this.update, this)
                  .setFailureMethod(failure || this.recover, this)
                  .setTimeoutMethod(timeout || this.abanbon, this)
                  .setCompleteMethod(function () {
                      this._ajax = null;
                  }, this)
                  .execute();
        
        return this;
    },
    
    /**
     * 現在の通信を中止させる
     * 
     * @return {Jeeel.Framework.Net.Connect} 自インスタンス
     */
    abort: function () {
        if (this._ajax) {
            this._ajax.abort();
        }
        
        return this;
    },
    
    /**
     * 接続成功時に通常呼ばれるコールバック(内部のthisは自インスタンスになる)
     * 
     * @param {Jeeel.Net.Ajax.Response} response レスポンス
     * @abstract
     */
    update: function (response) {
        
    },
    
    /**
     * タイムアウト時に通常呼ばれるコールバック(内部のthisは自インスタンスになる)
     * 
     * @param {Jeeel.Net.Ajax.Response} response レスポンス
     * @abstract
     */
    abanbon: function (response) {
        
    },
    
    /**
     * エラー時に通常呼ばれるコールバック(内部のthisは自インスタンスになる)
     * 
     * @param {Jeeel.Net.Ajax.Response} response レスポンス
     * @abstract
     */
    recover: function (response) {
        
    },
    
    /**
     * コンストラクタ
     * 
     * @constructor
     */
    constructor: Jeeel.Framework.Net.Connect
};
