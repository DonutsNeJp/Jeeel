
/**
 * コンストラクタ
 * 
 * @class 双方向通信の機能を管理するクラス
 * @param {String} [url] コネクションを張るURL
 */
Jeeel.Net.Socket = function (url) {
    this._openEvent = Jeeel.Function.simpleBind(this._openEvent, this);
    this._closeEvent = Jeeel.Function.simpleBind(this._closeEvent, this);
    this._messageEvent = Jeeel.Function.simpleBind(this._messageEvent, this);
    this._errorEvent = Jeeel.Function.simpleBind(this._errorEvent, this);
    
    this._opens = [];
    this._closes = [];
    this._messages = [];
    this._errors = [];
    
    this.open(url);
};

/**
 * インスタンスの作成を行う
 * 
 * @param {String} [url] コネクションを張るURL
 * @return {Jeeel.Net.Socket} 作成したインスタンス
 */
Jeeel.Net.Socket.create = function (url) {
    return new this(url);
};

Jeeel.Net.Socket.prototype = {
  
    /**
     * ソケット
     * 
     * @type WebSocket
     * @private
     */
    _socket: null,
    
    /**
     * オープンイベントリスト
     * 
     * @type Function[]
     * @private
     */
    _opens: [],
    
    /**
     * クローズイベントリスト
     * 
     * @type Function[]
     * @private
     */
    _closes: [],
    
    /**
     * メッセージイベントリスト
     * 
     * @type Function[]
     * @private
     */
    _messages: [],
    
    /**
     * エラーイベントリスト
     * 
     * @type Function[]
     * @private
     */
    _errors: [],
    
    /**
     * オープンイベント
     * 
     * @private
     */
    _openEvent: function (e) {
        var evs = this._opens;
        
        for (var i = 0, l = evs.length; i < l; i++) {
            evs[i](e);
        }
    },
    
    /**
     * クローズイベント
     * 
     * @private
     */
    _closeEvent: function (e) {
        var evs = this._closes;
        
        for (var i = 0, l = evs.length; i < l; i++) {
            evs[i](e);
        }
    },
    
    /**
     * メッセージイベント
     * 
     * @private
     */
    _messageEvent: function (e) {
        var evs = this._messages;
        
        for (var i = 0, l = evs.length; i < l; i++) {
            evs[i](e);
        }
    },
    
    /**
     * エラーイベント
     * 
     * @private
     */
    _errorEvent: function (e) {
        var evs = this._errors;
        
        for (var i = 0, l = evs.length; i < l; i++) {
            evs[i](e);
        }
    },
    
    /**
     * コネクションを張り終えた際に呼ばれるイベントの追加を行う
     * 
     * @param {Function} listener イベント
     * @return {Jeeel.Net.Socket} 自インスタンス
     */
    addOpenEvent: function (listener) {
        this._opens.push(listener);

        return this;
    },
    
    /**
     * コネクションを閉じた際に呼ばれるイベントの追加を行う
     * 
     * @param {Function} listener イベント
     * @return {Jeeel.Net.Socket} 自インスタンス
     */
    addCloseEvent: function (listener) {
        this._closes.push(listener);

        return this;
    },
    
    /**
     * サーバー側からデータを受信した際に呼ばれるイベントの追加を行う
     * 
     * @param {Function} listener イベント
     * @return {Jeeel.Net.Socket} 自インスタンス
     */
    addReceiveEvent: function (listener) {
        this._messages.push(listener);

        return this;
    },

    /**
     * タスク内でエラーが発生した場合に呼ばれるイベントの追加を行う
     * 
     * @param {Function} listener イベント
     * @return {Jeeel.Net.Socket} 自インスタンス
     */
    addErrorEvent: function (listener) {
        this._errors.push(listener);

        return this;
    },
    
    /**
     * サーバー側にデータを送信する
     * 
     * @param {String} content サーバー側に送るデータ
     * @return {Jeeel.Net.Socket} 自インスタンス
     */
    send: function (content) {
        if (this._socket.readyState === 1) {
            this._socket.send(content);
        }
        
        return this;
    },
    
    /**
     * 新たにコネクションを張り直す<br />
     * その際前のコネクションは閉じられる
     * 
     * @param {String} url コネクションを張るURL
     * @return {Jeeel.Net.Socket} 自インスタンス
     */
    open: function (url) {
        
        if ( ! url) {
            return this;
        } else if (this._socket) {
            this.close();
        }
        
        this._socket = new WebSocket(url);
        
        this._socket.onopen = this._openEvent;
        this._socket.onclose = this._closeEvent;
        this._socket.onmessage = this._messageEvent;
        this._socket.onerror = this._errorEvent;
        
        return this;
    },
    
    /**
     * コネクションを閉じる
     * 
     * @return {Jeeel.Net.Socket} 自インスタンス
     */
    close: function () {
        
        if ( ! this._socket) {
            return this;
        }
        
        this._socket.close();
        
        this._socket = null;
        
        return this;
    },
    
    /**
     * コンストラクタ
     * 
     * @constructor
     * @param {String} [url] コネクションを張るURL
     */
    constructor: Jeeel.Net.Socket
};
