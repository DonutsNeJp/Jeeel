Jeeel.directory.Jeeel.Net.Ajax = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Net + 'Ajax/';
    }
};

/**
 * コンストラクタ
 * 
 * @class Ajaxの制御を行うクラス
 * @augments Jeeel.Net.Abstract
 * @param {String} url Ajax対象URLの文字列
 * @param {String} [method] HTTPメソッド(getまたはpost、大文字小文字は問わない、初期値はPOST)
 * @throws {Error} urlが指定されていない場合に起こる
 */
Jeeel.Net.Ajax = function (url, method) {

    if ( ! Jeeel.Type.isString(url)) {
        throw new Error('URLを指定してください。');
    }
    
    Jeeel.Net.Abstract.call(this);

    this.setMethod(method);
    
    this._requestQueue = [];
    
    this._url = url;
    this._fields = new Jeeel.Parameter();
};

/**
 * インスタンスの作成を行う
 *
 * @param {String} url Ajax対象URL文字列
 * @param {String} [method] HTTPメソッド(getまたはpost、大文字小文字は問わない、初期値はPOST)
 * @return {Jeeel.Net.Ajax} 作成したインスタンス
 */
Jeeel.Net.Ajax.create = function (url, method) {
    return new this(url, method);
};

/**
 * Ajaxのリクエストを作成する
 * 
 * @return {XMLHttpRequest} 作成したリクエスト(作成出来なかった場合はnullを返す)
 */
Jeeel.Net.Ajax.createXMLHttpRequest = function () {
    var obj = null, activeXIds =[
        'MAXM12.XMLHTTP.3.0',
        'MAXM12.XMLHTTP',
        'Microsoft.XMLHTTP'
    ];
    
    if (typeof XMLHttpRequest !== 'undefined') {
        obj = new XMLHttpRequest();
    } 
    else if (typeof ActiveXObject !== 'undefined') {
      
        // IE7以前の作成
        for (var i = 0, l = activeXIds.length; i < l; i++) {
            try {
                obj = new ActiveXObject(activeXIds[i]);
                break;
            } catch (e) {}
        }
    }
    
    return obj;
};

/**
 * 指定したURLのレスポンスをそのまま返す
 *
 * @param {String} url アクセスURL
 * @param {Hash} [parameter] URLに渡すPostパラメータを示す連想配列
 * @return {String|Object} サーバーからのレスポンス、異常終了時はstatu, statusText, responseのキーをもつオブジェクト
 * @throws {Error} Ajaxがサポートされていないと発生する
 */
Jeeel.Net.Ajax.serverResponse = function (url, parameter) {

    if (Jeeel.Acl && Jeeel.Acl.isDenied(url, '*', 'Url')) {
        Jeeel.Acl.throwError('Access Error', 404);
    }

    if ( ! Jeeel.Type.isHash(parameter)) {
        parameter = {};
    }

    var request = this.createXMLHttpRequest();
    var response;

    if (request) {
        var check = function () {
            if (request.readyState == 4 && request.status == 200) {
                response = request.responseText;
            } else if (request.readyState == 4) {
                response = {
                    status: request.status,
                    statusText: request.statusText,
                    response: request.responseText
                };
            }
        };

        request.open('POST', url, false);
        request.onreadystatechange = check;

        request.setRequestHeader('X-Requested-With' , 'XMLHttpRequest');
        request.setRequestHeader('X-Jeeel-Version' , Jeeel.VERSION);
        request.setRequestHeader('Accept' , 'text/javascript, text/html, application/xml, text/xml, */*');
        request.setRequestHeader('Content-Type' , 'application/x-www-form-urlencoded; charset=UTF-8');

        if (request.overrideMimeType &&
            (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0,2005])[1] < 2005)
        {
            request.setRequestHeader('Connection' , 'close');
        }

        request.send(Jeeel.Parameter.create(parameter).toQueryString());
    } else {
        throw new Error('Ajaxがサポートされていません。');
    }

    if (response) {
        return response;
    }

    if (request.readyState == 4 && request.status == 200) {
        return request.responseText;
    }

    return {
        status: request.status,
        statusText: request.statusText,
        response: request.responseText
    };
};

Jeeel.Net.Ajax.prototype = {

    /**
     * Ajaxの際にサーバー側に渡さずに戻り値に定義づけるパラメータのハッシュを保持するJeeel.Parameter
     *
     * @type Jeeel.Parameter
     * @private
     */
    _fields: null,
    
    /**
     * リトライ情報
     * 
     * @type 
     * @private
     */
    _retry: null,

    /**
     * Ajax対象のURL
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
    _method: '',

    /**
     * 現在通信中かどうか
     *
     * @type Boolean
     * @private
     */
    _executing: false,

    /**
     * 非同期通信かどうか
     *
     * @type Boolean
     * @private
     */
    _asynchronous: true,
    
    /**
     * タイムアウト時間(ミリ秒)
     * 
     * @type Integer
     * @private
     */
    _timeoutTime: 0,
    
    /**
     * 並列接続時の動作ポリシー
     * 
     * @type Integer
     * @private
     */
    _collisionPolicy: 0,
    
    /**
     * 通信に必要な情報
     * 
     * @type Array
     * @private
     */
    _requestQueue: [],

    /**
     * 作成メソッド
     *
     * @type Function void callback(Jeeel.Net.Ajax.Response response, Object jsonHeader)
     * @private
     */
    _create: null,

    /**
     * 完了メソッド
     *
     * @type Function void callback(Jeeel.Net.Ajax.Response response, Object jsonHeader)
     * @private
     */
    _complete: null,

    /**
     * 成功メソッド
     *
     * @type Function void callback(Jeeel.Net.Ajax.Response response, Object jsonHeader)
     * @private
     */
    _success: null,
    
    /**
     * 中止メソッド
     *
     * @type Function void callback(Jeeel.Net.Ajax.Response response, Object jsonHeader)
     * @private
     */
    _abort: null,
    
    /**
     * タイムアウトメソッド
     * 
     * @type Function void callback(Jeeel.Net.Ajax.Response response, Object jsonHeader)
     * @private
     */
    _timeout: null,

    /**
     * 失敗メソッド
     *
     * @type Function void callback(Jeeel.Net.Ajax.Response response, Object jsonHeader)
     * @private
     */
    _failure: null,

    /**
     * 部分受信メソッド
     *
     * @type Function void callback(Jeeel.Net.Ajax.Response response, Object jsonHeader)
     * @private
     */
    _interactive: null,

    /**
     * 送信準備完了メソッド
     *
     * @type Function void callback(Jeeel.Net.Ajax.Response response, Object jsonHeader)
     * @private
     */
    _loaded: null,

    /**
     * コネクションオープンメソッド
     *
     * @type Function void callback(Jeeel.Net.Ajax.Response response, Object jsonHeader)
     * @private
     */
    _loading: null,

    /**
     * XMLHttpRequest生成メソッド
     *
     * @type Function void callback(Jeeel.Net.Ajax.Response response, Object jsonHeader)
     * @private
     */
    _uninitialized: null,

    /**
     * 例外メソッド
     *
     * @type Function void callback(Jeeel.Net.Ajax.Request request, Error error)
     * @private
     */
    _exception: null,
    
    /**
     * 内部通信完了メソッド
     * 
     * @type Jeeel.Function.Callback
     * @private
     */
    _innerComplete: null,
    
    /**
     * リクエスト
     *
     * @type Jeeel.Net.Ajax.Request
     * @private
     */
    _request: null,

    /**
     * 戻り値
     *
     * @type Jeeel.Net.Ajax.Response
     * @private
     */
    _response: null,

    /**
     * エラー
     *
     * @type Error
     * @private
     */
    _error: null,
    
    /**
     * Ajax対象のURLを取得する
     * 
     * @return {String} URL
     */
    getUrl: function () {
        return this._url;
    },

    /**
     * Ajax対象URLの設定
     *
     * @param {String} url Ajax対象URL
     * @return {Jeeel.Net.Ajax} 自身のインスタンス
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
     * HTTPメソッドの取得を行う
     * 
     * @return {String} HTTPメソッド
     */
    getMethod: function () {
        return this._method;
    },

    /**
     * HTTPメソッドの設定
     *
     * @param {String} method HTTPメソッド(getまたはpost、大文字小文字は問わない)
     * @return {Jeeel.Net.Ajax} 自身のインスタンス
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
     * 非同期通信化どうかを返す
     *
     * @return {Boolean} 自身のインスタンス
     */
    getAsynchronous: function () {
        return this._asynchronous;
    },

    /**
     * 非同期通信化どうかの設定
     *
     * @param {Boolean} asynchronous 非同期通信かどうか
     * @return {Jeeel.Net.Ajax} 自身のインスタンス
     */
    setAsynchronous: function (asynchronous) {
        this._asynchronous = !!asynchronous;

        return this;
    },
    
    /**
     * リトライの設定を行う<br />
     * リトライを行った際は本来呼ばれるメソッドは呼ばれなくなる
     * 
     * @param {Integer} limit リトライ回数(0で無制限、-1で無効)
     * @param {Integer} [delayTime] 遅延秒数(ミリ秒、デフォルトでは30000ミリ秒)
     * @param {Function} [callback] リトライ時に呼ばれるメソッド<br />
     *                               コールバックメソッドに渡される引数は存在しない<br />
     *                               void callback()
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.Net.Ajax} 自身のインスタンス
     */
    setRetry: function (limit, delayTime, callback, thisArg) {
      
        if (limit < 0) {
            this._retry = null;
            
            return this;
        }
        
        this._retry = {
            count: 0,
            limit: +limit,
            delayTime: delayTime || 30000,
            callback: callback && {func: callback, thisArg: thisArg}
        };
        
        return this;
    },
    
    /**
     * 非同期通信時のタイムアウトまでの時間を取得する
     * 
     * @return {Integer} タイムアウト時間、0で無制限(ミリ秒)
     */
    getTimeoutTime: function () {
        return this._timeoutTime;
    },
    
    /**
     * 非同期通信時のタイムアウトまでの時間を設定する
     * 
     * @param {Integer} time タイムアウト時間、0で無制限(ミリ秒)
     * @return {Jeeel.Net.Ajax} 自身のインスタンス
     */
    setTimeoutTime: function (time) {
        this._timeoutTime = +time || 0;
        
        return this;
    },
    
    /**
     * コリジョンポリシーを取得する
     * 
     * @return {String} コリジョンポリシー
     */
    getCollisionPolicy: function () {
        return this._collisionPolicy;
    },
    
    /**
     * 並列リクエストをした場合の動作を設定する
     * 
     * @param {Integer} collisionPolicy コリジョンポリシー
     * @return {Jeeel.Net.Ajax} 自身のインスタンス
     * @see Jeeel.Net.Ajax.CollisionPolicy
     */
    setCollisionPolicy: function (collisionPolicy) {
        if (isNaN(collisionPolicy)) {
            collisionPolicy = this.constructor.CollisionPolicy.IGNORE;
        }
        
        switch (collisionPolicy) {
            case this.constructor.CollisionPolicy.IGNORE:
            case this.constructor.CollisionPolicy.CHANGE:
            case this.constructor.CollisionPolicy.ENQUEUE:
                break;
                
            default:
                collisionPolicy = this.constructor.CollisionPolicy.IGNORE;
                break;
        }
        
        this._collisionPolicy = collisionPolicy;
        
        return this;
    },

    /**
     * 作成メソッドの登録
     *
     * @param {Function} callback 作成メソッド<br />
     *                             コールバックメソッドに渡される引数はレスポンス, X-JSONオブジェクトとなる<br />
     *                             void callback(Jeeel.Net.Ajax.Response response, Object jsonHeader)
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.Net.Ajax} 自身のインスタンス
     */
    setCreateMethod: function (callback, thisArg) {
        this._create = {func: callback, thisArg: thisArg};

        return this;
    },

    /**
     * 完了メソッドの登録
     *
     * @param {Function} callback 完了メソッド<br />
     *                             コールバックメソッドに渡される引数はレスポンス, X-JSONオブジェクトとなる<br />
     *                             void callback(Jeeel.Net.Ajax.Response response, Object jsonHeader)
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.Net.Ajax} 自身のインスタンス
     */
    setCompleteMethod: function (callback, thisArg) {
        this._complete = {func: callback, thisArg: thisArg};

        return this;
    },

    /**
     * 成功メソッドの登録
     *
     * @param {Function} callback 成功メソッド<br />
     *                             コールバックメソッドに渡される引数はレスポンス, X-JSONオブジェクトとなる<br />
     *                             void callback(Jeeel.Net.Ajax.Response response, Object jsonHeader)
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.Net.Ajax} 自身のインスタンス
     */
    setSuccessMethod: function (callback, thisArg) {
        this._success = {func: callback, thisArg: thisArg};

        return this;
    },
    
    /**
     * アボートメソッドの登録
     *
     * @param {Function} callback アボートメソッド<br />
     *                             コールバックメソッドに渡される引数はレスポンス, X-JSONオブジェクトとなる<br />
     *                             void callback(Jeeel.Net.Ajax.Response response, Object jsonHeader)
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.Net.Ajax} 自身のインスタンス
     */
    setAbortMethod: function (callback, thisArg) {
        this._abort = {func: callback, thisArg: thisArg};

        return this;
    },

    /**
     * タイムアウトメソッドの登録(アボートメソッドが最後に呼ばれう)
     *
     * @param {Function} callback タイムアウトメソッド<br />
     *                             コールバックメソッドに渡される引数はレスポンス, X-JSONオブジェクトとなる<br />
     *                             void callback(Jeeel.Net.Ajax.Response response, Object jsonHeader)
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.Net.Ajax} 自身のインスタンス
     */
    setTimeoutMethod: function (callback, thisArg) {
        this._timeout = {func: callback, thisArg: thisArg};

        return this;
    },
    
    /**
     * 失敗メソッドの登録
     *
     * @param {Function} callback 失敗メソッド<br />
     *                             コールバックメソッドに渡される引数はレスポンス, X-JSONオブジェクトとなる<br />
     *                             void callback(Jeeel.Net.Ajax.Response response, Object jsonHeader)
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.Net.Ajax} 自身のインスタンス
     */
    setFailureMethod: function (callback, thisArg) {
        this._failure = {func: callback, thisArg: thisArg};

        return this;
    },

    /**
     * 部分受信メソッドの登録
     *
     * @param {Function} callback 部分受信メソッド<br />
     *                             コールバックメソッドに渡される引数はレスポンス, X-JSONオブジェクトとなる<br />
     *                             void callback(Jeeel.Net.Ajax.Response response, Object jsonHeader)
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.Net.Ajax} 自身のインスタンス
     */
    setInteractiveMethod: function (callback, thisArg) {
        this._interactive = {func: callback, thisArg: thisArg};

        return this;
    },

    /**
     * 送信準備完了メソッドの登録
     *
     * @param {Function} callback 送信準備完了メソッド<br />
     *                             コールバックメソッドに渡される引数はレスポンス, X-JSONオブジェクトとなる<br />
     *                             void callback(Jeeel.Net.Ajax.Response response, Object jsonHeader)
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.Net.Ajax} 自身のインスタンス
     */
    setLoadedMethod: function (callback, thisArg) {
        this._loaded = {func: callback, thisArg: thisArg};

        return this;
    },

    /**
     * コネクションオープンメソッドの登録
     *
     * @param {Function} callback コネクションオープンメソッド<br />
     *                             コールバックメソッドに渡される引数はレスポンス, X-JSONオブジェクトとなる<br />
     *                             void callback(Jeeel.Net.Ajax.Response response, Object jsonHeader)
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.Net.Ajax} 自身のインスタンス
     */
    setLoadingMethod: function (callback, thisArg) {
        this._loading = {func: callback, thisArg: thisArg};

        return this;
    },

    /**
     * XMLHttpRequest生成メソッドの登録
     *
     * @param {Function} callback XMLHttpRequest生成メソッド<br />
     *                             コールバックメソッドに渡される引数はレスポンス, X-JSONオブジェクトとなる<br />
     *                             void callback(Jeeel.Net.Ajax.Response response, Object jsonHeader)
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.Net.Ajax} 自身のインスタンス
     */
    setUninitializedMethod: function (callback, thisArg) {
        this._uninitialized = {func: callback, thisArg: thisArg};

        return this;
    },

    /**
     * 例外メソッドの登録
     *
     * @param {Function} callback 例外メソッド<br />
     *                             コールバックメソッドに渡される引数はリクエスト, エラーとなる<br />
     *                             void callback(Jeeel.Net.Ajax.Request request, Error error)
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.Net.Ajax} 自身のインスタンス
     */
    setExceptionMethod: function (callback, thisArg) {
        this._exception = {func: callback, thisArg: thisArg};

        return this;
    },
    
    /**
     * レスポンスフィールドパラメータの全取得
     *
     * @return {Hash} 値リスト
     */
    getFieldAll: function () {
        return this._fields.getAll();
    },

    /**
     * レスポンスフィールドパラメータの取得
     *
     * @param {String} key キー
     * @param {Mixied} [defaultValue] デフォルト値
     * @return {Mixied} 値
     */
    getField: function (key, defaultValue) {
        return this._fields.get(key, defaultValue);
    },

    /**
     * レスポンスフィールドパラメータを総入れ替えする
     *
     * @param {Hash} vals 値リスト
     * @return {Jeeel.Net.Ajax} 自身のインスタンス
     * @throws {Error} valsが配列式でない場合に起こる
     */
    setFieldAll: function (vals) {
        if ( ! Jeeel.Type.isHash(vals)) {
            throw new Error('valsが配列・連想配列ではありあせん。');
        }

        this._fields.setAll(vals);

        return this;
    },

    /**
     * レスポンスフィールドパラメータの設定
     *
     * @param {String} key キー
     * @param {Mixied} val 値
     * @return {Jeeel.Net.Ajax} 自身のインスタンス
     */
    setField: function (key, val) {
        this._fields.set(key, val);

        return this;
    },

    /**
     * レスポンスフィールドの指定キーの値を破棄する
     *
     * @param {String} key キー
     * @return {Jeeel.Net.Ajax} 自インスタンス
     */
    unsetField: function (key) {
        this._fields.unset(key);

        return this;
    },

    /**
     * レスポンスフィールドの指定キーの値を保持しているかどうかを返す
     *
     * @param {String} key キー
     * @return {Boolean} 値を保持していたらtrueそれ以外はfalseを返す
     */
    hasField: function (key) {
        return this._fields.has(key);
    },
    
    /**
     * 通信中かどうかを取得する
     * 
     * @return {Boolean} 通信中かどうか
     */
    isExecuting: function () {
        return this._executing || !!this._requestQueue.length;
    },
    
    /**
     * 通信に使用したリクエストを取得する
     * 
     * @return {Jeeel.Net.Ajax.Request} リクエスト
     */
    getRequest: function () {
        return this._request;
    },
    
    /**
     * 前回の通信のレスポンスを取得する
     * 
     * @return {Jeeel.Net.Ajax.Response} レスポンス
     */
    getResponse: function () {
        return this._response;
    },
    
    /**
     * 通信中のエラーを取得する
     * 
     * @return {Error} エラー
     */
    getError: function () {
        return this._error;
    },

    /**
     * 実際にAjaxを実行する
     *
     * @return {Jeeel.Net.Ajax} 自インスタンス
     */
    execute: function () {
        
        if (Jeeel.Acl && Jeeel.Acl.isDenied(this._url, '*', 'Url')) {
            Jeeel.Acl.throwError('Access Error', 404);
        }
        
        if ( ! this.isValid()) {
            throw new Error('There is an error in the submission.');
        }
        
        // 通信中だった場合コリジョンポリシーに基づき動作を変える
        if (this._executing) {
            
            switch (this._collisionPolicy) {
                case this.constructor.CollisionPolicy.IGNORE:
                    return this;
                    break;
                
                case this.constructor.CollisionPolicy.CHANGE:
                    this.abort();
                    break;
                    
                case this.constructor.CollisionPolicy.ENQUEUE:
                    var ajax = this.clone();
                    this._requestQueue.push(ajax);
                    (this._requestQueue[this._requestQueue.length - 2] || this)._innerComplete = Jeeel.Function.Callback.create('_onRequestComplete', this);
                    return this;
                    break;
            }
        }
        
        if (this._retry && this._retry.retrying) {
            var callback = this._retry.callback;
            
            if (callback) {
                callback.func.call(callback.thisArg || this);
            }
            
            this._retry.retrying = false;
        }
        
        var self = this;
        
        this._request = new this.constructor.Request(this._url, {
            method: this._method,
            parameters: this._params.toQueryString(),
            fields: this._fields.getAll(),
            asynchronous: this._asynchronous,
            timeout: this._timeoutTime,
            onCreate: function (response, jsonHeader) {
                self._callMethod('_create', [response, jsonHeader]);

                self._response  = null;
                self._executing = true;
            },
            onComplete: function (response, jsonHeader) {
                self._callMethod('_complete', [response, jsonHeader]);

                self._response  = response;
                self._executing = false;
                
                if ( ! (self._retry && self._retry.retrying) && self._innerComplete) {
                    self._innerComplete.call();
                }
            },
            onSuccess: function (response, jsonHeader){
                self._callMethod('_success', [response, jsonHeader]);
            },
            onFailure: function (response, jsonHeader){
                if (self._retry && ( ! self._retry.limit || (self._retry.count < self._retry.limit))) {
                    self._retry.retrying = true;
                    self._retry.count++;
                    
                    Jeeel.Deferred.next(self.execute, self, self._retry.delayTime);
                } else {
                    if (self._failure) {
                        self._callMethod('_failure', [response, jsonHeader]);
                    } else {
                        Jeeel.errorHtmlDump('Failure', response.statusText + '(' + response.status + ')', response.responseText);
                    }
                }
            },
            onAbort: function (response, jsonHeader) {
                self._callMethod('_abort', [response, jsonHeader]);
            },
            onTimeout: function (response, jsonHeader) {
                if (self._retry && ( ! self._retry.limit || (self._retry.count < self._retry.limit))) {
                    self._retry.retrying = true;
                    self._retry.count++;
                    
                    Jeeel.Deferred.next(self.execute, self, self._retry.delayTime);
                } else {
                    self._callMethod('_timeout', [response, jsonHeader]);
                }
            },
            onInteractive: function (response, jsonHeader) {
                self._callMethod('_interactive', [response, jsonHeader]);
            },
            onLoaded: function (response, jsonHeader) {
                self._callMethod('_loaded', [response, jsonHeader]);
            },
            onLoading: function (response, jsonHeader) {
                self._callMethod('_loading', [response, jsonHeader]);
            },
            onUninitialized: function (response, jsonHeader) {
                self._callMethod('_uninitialized', [response, jsonHeader]);
            },
            onException: function (request, error) {
                self._error     = error;
                self._executing = false;
                
                if (self._exception) {
                    self._callMethod('_exception', [request, error]);
                } else if ( ! Jeeel.errorHtmlDump('Exception', error.name, error.fileName + '(' + error.lineNumber + ')', error.message, request.transport.responseText)) {
                    throw error;
                }
            }
        });
        
        return this;
    },
    
    /**
     * 通信を中止する
     * 
     * @return {Jeeel.Net.Ajax} 自インスタンス
     */
    abort: function () {
        if (this._request && this._executing) {
            this._request.abort();
            this._executing = false;
        }
        
        return this;
    },
    
    /**
     * インスタンスの複製を作成する
     * 
     * @return {Jeeel.Net.Ajax} 複製インスタンス
     */
    clone: function () {
        var ajax = new this.constructor(this._url, this._method);
        
        for (var key in this) {
            if (this.hasOwnProperty(key)) {
                
                // 状態変数や一時変数は複製すべきではない
                switch (key) {
                    case '_requestQueue':
                    case '_innerComplete':
                    case '_executing':
                    case '_request':
                    case '_response':
                    case '_error':
                        continue;
                        break;
                }
                
                if (Jeeel.Type.isArray(this[key])) {
                    ajax[key] = this[key].concat();
                } else if (this[key] instanceof Jeeel.Parameter) {
                    ajax[key] = this[key].clone();
                } else {
                    ajax[key] = this[key];
                }
            }
        }
        
        return ajax;
    },
    
    /**
     * コンストラクタ
     * 
     * @param {String} url Ajax対象URLの文字列
     * @param {String} [method] HTTPメソッド(getまたはpost、大文字小文字は問わない、初期値はPOST)
     * @constructor
     */
    constructor: Jeeel.Net.Ajax,
    
    /**
     * メソッドを呼び出す
     * 
     * @param {String} name メソッド名
     * @param {Array} [args] メソッドに引き渡す引数の配列
     */
    _callMethod: function (name, args) {
        if ( ! this[name]) {
            return;
        }
        
        this[name].func.apply(this[name].thisArg || this, args || []);
    },
    
    /**
     * _innerCompleteに対して登録するコールバック
     */
    _onRequestComplete: function () {
        
        switch (this._collisionPolicy) {
            case this.constructor.CollisionPolicy.ENQUEUE:
                var ajax = this._requestQueue.shift();
                
                if (ajax) {
                    ajax.execute();
                }
                break;
        }
    }
};

Jeeel.Class.extend(Jeeel.Net.Ajax, Jeeel.Net.Abstract);

Jeeel.file.Jeeel.Net.Ajax = ['Request', 'Response', 'CollisionPolicy'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Net.Ajax, Jeeel.file.Jeeel.Net.Ajax);
