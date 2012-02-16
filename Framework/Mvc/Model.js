
/**
 * コンストラクタ
 * 
 * @class モデルのプロトタイプ
 * @augments Jeeel.Framework.Net.Connect
 */
Jeeel.Framework.Mvc.Model = function () {
    Jeeel.Framework.Net.Connect.call(this);
    
    this._state = {};
};

/**
 * インスタンスの作成を行う
 * 
 * @return {Jeeel.Framework.Mvc.Model} 作成したインスタンス
 */
Jeeel.Framework.Mvc.Model.create = function () {
    return new this();
};

Jeeel.Framework.Mvc.Model.prototype = {
    
    /**
     * モデルのステータス(配列もしくは連想配列)
     * 
     * @type Hash
     * @protected
     */
    _state: {},
    
    /**
     * このモデルを管理するコントローラ
     * 
     * @type Jeeel.Framework.Mvc.Controller
     * @protected
     */
    _controller: null,
    
    /**
     * ステータスを取得する
     * 
     * @return {Hash} ステータス
     */
    getState: function () {
        return this._state;
    },
    
    /** 
     * ステータスを設定する
     * 
     * @param {Hash} state ステータス
     * @return {Jeeel.Framework.Mvc.Model} 自インスタンス
     */
    setState: function (state) {},
    
    /**
     * モデルの初期化を行い、登録してあるビューに通知する
     * 
     * @return {Jeeel.Framework.Mvc.Model} 自インスタンス
     */
    init: function () {
        this._state = {};
        return this.notify();
    },
    
    /**
     * サーバー接続後に呼び出される
     * 
     * @param {Jeeel.Net.Ajax.Response} response レスポンス
     */
    update: function (response) {
        var res;
        
        try {
            res = Jeeel.Json.decode(decodeURIComponent(response.responseText));
        } catch (e) {}
        
        if ( ! Jeeel.Type.isHash(res)) {
            this.recover(response);
        } else {
            this._state = res;
            this.notify();
        }
    },
        
    /**
     * コントローラを紐付ける
     * 
     * @param {Jeeel.Framework.Mvc.Controller} controller コントローラ
     * @return {Jeeel.Framework.Mvc.Model} 自インスタンス
     */
    attach: function (controller) {
        if (this._controller) {
            this._controller.setModel(null);
        }
        
        this._controller = controller;
        
        return this;
    },
    
    /**
     * コントローラとの紐付けを解除する
     * 
     * @param {Jeeel.Framework.Mvc.Controller} controller コントローラ
     * @return {Jeeel.Framework.Mvc.Model} 自インスタンス
     */
    detach: function (controller) {
        if (this._controller === controller) {
            this._controller = null;
        }
        
        return this;
    },
    
    /**
     * ビューへの通知を行う
     * 
     * @return {Jeeel.Framework.Mvc.Model} 自インスタンス
     */
    notify: function () {
        this._controller.update();
        
        return this;
    },
    
    /**
     * コンストラクタ
     * 
     * @constructor
     */
    constructor: Jeeel.Framework.Mvc.Model
};

/**
 * ステータスをサーバーから取得し設定する
 * 
 * @param {String} url 取得先URL
 * @param {Hash} [params] 送信データのリスト
 * @param {Function} [success] 成功時のコールバック(明示的に指定する場合) void callBack(Jeeel.Net.Ajax.Response response)
 * @param {Function} [failure] 失敗時のコールバック(明示的に指定する場合) void callBack(Jeeel.Net.Ajax.Response response)
 * @param {Function} [timeout] タイムアウト時のコールバック(明示的に指定する場合) void callBack(Jeeel.Net.Ajax.Response response)
 * @return {Jeeel.Framework.Mvc.Model} 自インスタンス
 */
Jeeel.Framework.Mvc.Model.prototype.setState = function (url, params, success, failure, timeout) {
    var state = url;
    
    if (Jeeel.Type.isString(url) || arguments.length > 1) {
        return this.connect(url, params, success, failure, timeout);
    }
    
    if ( ! Jeeel.Type.isHash(state)) {
        throw new Error('stateがHashではありません。');
    }

    this._state = state;
    
    return this;
};

Jeeel.Class.extend(Jeeel.Framework.Mvc.Model, Jeeel.Framework.Net.Connect);
