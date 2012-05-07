
/**
 * コンストラクタ
 * 
 * @class サーバーを監視する機能を管理するクラス(Server-Sent Events)
 * @param {String} [url] コネクションを張るURL
 * @example
 * サーバー側
 * サーバー側でアクセスするURLに以下のヘッダを設定
 * "Content-type: text/event-stream;"
 * 
 * レスポンスは行区切りでキーとペアで返す
 * data: [dataString] // レスポンスに載せるデータ
 * event: [customEventName] // カスタムイベントに使用するイベント名
 * retry: [nextAccessTimeout] // 次にアクセスするまでの時間(ミリ秒)
 * 
 * クライアント側
 * var c = new Jeeel.Net.Comet();
 * c.addResponseEvent(listener); // レスポンスが帰ってきた際のイベント登録
 * c.addErrorEvent(listener); // エラー時のイベント登録
 * 
 * c.open(URL);
 */
Jeeel.Net.Comet = function (url) {
    this._openEvent = Jeeel.Function.simpleBind(this._openEvent, this);
    this._messageEvent = Jeeel.Function.simpleBind(this._messageEvent, this);
    this._errorEvent = Jeeel.Function.simpleBind(this._errorEvent, this);
    this._customEvent = Jeeel.Function.simpleBind(this._customEvent, this);
        
    this._opens = [];
    this._messages = [];
    this._errors = [];
    this._customs = {};
    
    this.open(url);
};

/**
 * インスタンスの作成を行う
 * 
 * @param {String} [url] コネクションを張るURL
 * @return {Jeeel.Net.Comet} 作成したインスタンス
 */
Jeeel.Net.Comet.create = function (url) {
    return new this(url);
};

Jeeel.Net.Comet.prototype = {
  
    /**
     * コネクション
     * 
     * @type EventSource
     * @private
     */
    _source: null,
    
    /**
     * オープンイベントリスト
     * 
     * @type Function[]
     * @private
     */
    _opens: [],
    
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
     * カスタムイベントリスト
     * 
     * @type Hash
     * @private
     */
    _customs: {},
    
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
     * カスタムイベント
     * 
     * @private
     */
    _customEvent: function (e) {
        var evs = this._customs[e.type];
        
        for (var i = 0, l = evs.length; i < l; i++) {
            evs[i](e);
        }
    },
    
    /**
     * コネクションを張り終えた際に呼ばれるイベントの追加を行う
     * 
     * @param {Function} listener イベント
     * @return {Jeeel.Net.Comet} 自インスタンス
     */
    addOpenEvent: function (listener) {
        this._opens.push(listener);

        return this;
    },
    
    /**
     * サーバーがレスポンスを返した際に呼ばれるイベントの追加を行う
     * 
     * @param {Function} listener イベント
     * @return {Jeeel.Net.Comet} 自インスタンス
     */
    addResponseEvent: function (listener) {
        this._messages.push(listener);

        return this;
    },

    /**
     * サーバー側でイベント名を指定した場合に呼ばれる独自イベントの追加を行う<br >
     * その際レスポンスイベントは発生しない
     * 
     * @param {String} eventName イベント名
     * @param {Function} listener イベント
     * @return {Jeeel.Net.Comet} 自インスタンス
     */
    addCustomEvent: function (eventName, listener) {
        
        if ( ! (eventName in this._customs)) {
            this._customs[eventName] = [];
            
            if (this._source) {
                this._source.addEventListener(eventName, this._customEvent, false);
            }
        }
        
        this._customs[eventName].push(listener);
        
        return this;
    },
    
    /**
     * タスク内でエラーが発生した場合に呼ばれるイベントの追加を行う
     * 
     * @param {Function} listener イベント
     * @return {Jeeel.Net.Comet} 自インスタンス
     */
    addErrorEvent: function (listener) {
        this._errors.push(listener);

        return this;
    },
    
    /**
     * 新たにコネクションを張り直す<br />
     * その際前のコネクションは閉じられる
     * 
     * @param {String} url コネクションを張るURL
     * @return {Jeeel.Net.Comet} 自インスタンス
     */
    open: function (url) {
        
        if (Jeeel.Acl && Jeeel.Acl.isDenied(url, '*', 'Url')) {
            Jeeel.Acl.throwError('Access Error', 404);
        }
        
        if ( ! url) {
            return this;
        } else if (this._source) {
            this.close();
        }
        
        this._source = new EventSource(url);
        
        this._source.onopen = this._openEvent;
        this._source.onmessage = this._messageEvent;
        this._source.onerror = this._errorEvent;
        
        if (Jeeel.Hash.getCount(this._customs)) {
            for (var name in this._customs) {
                this._source.addEventListener(name, this._customEvent, false);
            }
        }
        
        return this;
    },
    
    /**
     * コネクションを閉じる
     * 
     * @return {Jeeel.Net.Comet} 自インスタンス
     */
    close: function () {
        
        if ( ! this._source) {
            return this;
        }
        
        for (var name in this._customs) {
            this._source.removeEventListener(name, this._customEvent, false);
        }
        
        this._source.close();
        
        this._source = null;
        
        return this;
    },
    
    /**
     * コンストラクタ
     * 
     * @constructor
     * @param {String} [url] コネクションを張るURL
     */
    constructor: Jeeel.Net.Comet
};
