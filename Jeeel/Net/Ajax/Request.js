
/**
 * コンストラクタ
 *
 * @class 実際にAjax通信を行うクラス
 * @param {String} url 対象URL
 * @param {Hash} options オプション
 */
Jeeel.Net.Ajax.Request = function (url, options) {
    var self = this;

    self.options = Jeeel.Hash.merge(self.options, options || {});

    self.options.method = self.options.method.toLowerCase();

    if (Jeeel.Type.isString(self.options.parameters)) {
        self.options.parameters = Jeeel.Filter.Url.QueryParameter.create().filter(self.options.parameters);
    }

    self.transport = Jeeel.Net.Ajax.createXMLHttpRequest();
    self.request(url);
};

/**
 * イベントを表す定数のリスト
 * 
 * @type String[]
 */
Jeeel.Net.Ajax.Request.Events = ['Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete'];

/**
 * 現在アクティブなRequestの数
 *
 * @type Integer
 */
Jeeel.Net.Ajax.Request.activeRequestCount = 0;

/**
 * レスポンスを処理するモジュール<br />
 * 追加登録することでデバッグ等を行える
 */
Jeeel.Net.Ajax.Request.responder = {

    /**
     * Requestが作成された場合に呼ばれる
     */
    onCreate: function () {
        Jeeel.Net.Ajax.Request.activeRequestCount++;
    },

    /**
     * Requestが終了した場合に呼ばれる
     */
    onComplete: function () {
        Jeeel.Net.Ajax.Request.activeRequestCount--;
    }
};

/**
 * レスポンスモジュールを呼び出す
 *
 * @param {String} methodName メソッド名
 * @param {Jeeel.Net.Ajax.Request} request アクセス中のRequest
 * @param {XMLHttpRequest} transport 基となるXMLHttpRequestオブジェクト
 * @param {Mixied} json Jsonを解析した後のオブジェクト
 */
Jeeel.Net.Ajax.Request.dispatch = function (methodName, request, transport, json) {
    var obj = Jeeel.Net.Ajax.Request.responder;

    if (Jeeel.Type.isFunction(obj[methodName])) {

        obj[methodName].call(obj, request, transport, json);
    }
};

Jeeel.Net.Ajax.Request.prototype = {

    /**
     * アクセスが終了したかどうか
     * 
     * @type Boolean
     */
    _complete: false,
    
    /**
     * タイムアウトID
     * 
     * @type Integer
     */
    _timeoutId: 0,
    
    /**
     * 作成時刻
     * 
     * @type Date 
     */
    createTimestamp: null,

    /**
     * ベースに使用するXMLHttpRequestオブジェクト
     *
     * @type XMLHttpRequest
     */
    transport: null,

    /**
     * アクセス時に使用するオプション
     *
     * @type Hash
     */
    options: {
        method:       'post',
        asynchronous: true,
        contentType:  'application/x-www-form-urlencoded',
        encoding:     'UTF-8',
        parameters:   '',
        evalJSON:     true,
        evalJS:       true,
        fields:       {},
        timeout:      0
    },

    /**
     * 現在のステータスを取得する
     *
     * @return {Integer} ステータス
     */
    getStatus: function () {
        try {
            return this.transport.status || 0;
        } catch (e) {
            return 0;
        }
    },

    /**
     * ヘッダを取得する
     *
     * @param {String} name ヘッダ名
     * @return {String} ヘッダ情報
     */
    getHeader: function (name) {
        try {
            return this.transport.getResponseHeader(name) || null;
        } catch (e) {
            return null;
        }
    },

    /**
     * レスポンスをJsonと見立ててオブジェクトに変換する
     *
     * @return {Mixied} 変換後のオブジェクト
     */
    evalResponse: function () {
        var json = this.transport.responseText || '';
        json = decodeURIComponent(json);
        try {
            return Jeeel.Json.decode(json);
        } catch (e) {
            this.dispatchException(e);
        }
    },

    /**
     * 実際にサーバーにアクセスを行う
     *
     * @param {String} url アクセスURL
     */
    request: function (url) {
        this.url = url;
        this.method = this.options.method;
        var params = Jeeel.Method.clone(this.options.parameters);

        if ( ! Jeeel.Hash.inHash(this.method, ['get', 'post'])) {
            params['_method'] = this.method;
            this.method = 'post';
        }

        this.parameters = params;

        params = Jeeel.Parameter.create(params).toQueryString();

        if (params) {
            if (this.method == 'get') {
                this.url += (this.url.indexOf('?') > -1 ? '&' : '?') + params;
            } else if (/Konqueror|Safari|KHTML/.test(navigator.userAgent)) {
                params += '&_=';
            }
        }

        try {
            var response = new Jeeel.Net.Ajax.Response(this);

            if (this.options.onCreate){
                this.options.onCreate(response);
            }
            
            this.createTimestamp = new Date();

            Jeeel.Net.Ajax.Request.dispatch('onCreate', this, response);

            if (this.options.user && this.options.password) {
                this.transport.open(this.method.toUpperCase(), this.url, this.options.asynchronous, this.options.user, this.options.password);
            } else {
                this.transport.open(this.method.toUpperCase(), this.url, this.options.asynchronous);
            }

            if (this.options.asynchronous) {
                if (this.options.timeout) {
                    var self = this;
                    
                    this._timeoutId = setTimeout(function () {
                            var response = new Jeeel.Net.Ajax.Response(self);
                            
                            self.options.onTimeout(response, response.headerJSON);
                            self.abort();
                        }, this.options.timeout
                    );
                }
                
                Jeeel.Function.create(this.readyStateChange).bind(this).delay(1)();
            }

            this.transport.onreadystatechange = Jeeel.Function.create(this.onStateChange).bind(this);
            this.setRequestHeaders();

            this.body = (this.method == 'post' ? (this.options.postBody || params) : null);
            this.transport.send(this.body);

            /* Force Firefox to handle ready state 4 for synchronous requests */
            if ( ! this.options.asynchronous && this.transport.overrideMimeType) {
                this.onStateChange();
            }

        }
        catch (e) {
            this.dispatchException(e);
        }
    },
    
    /**
     * アクセスを中止する
     */
    abort: function () {
        
        if (this._complete) {
            return;
        }
        
        this.transport.abort();

        if (this.options.onAbort) {
            var response = new Jeeel.Net.Ajax.Response(this);
            this.options.onAbort(response, response.headerJSON);
        }
        
        clearTimeout(this._timeoutId);
    },

    /**
     * ステータスが変化されるたびに呼ばれるメソッド
     */
    onStateChange: function () {
        var readyState = this.transport.readyState;
        
        if (readyState > 1 && !((readyState == 4) && this._complete)) {
            this.readyStateChange(this.transport.readyState);
        }
    },
    
    /**
     * 通信が成功したかどうかを返す
     *
     * @return {Boolean} 通信が成功したかどうか
     */
    isSuccess: function () {
        var status = this.getStatus();
        return !status || (status >= 200 && status < 300);
    },

    /**
     * ステータスが変化するたびに呼ばれる
     * 
     * @param {String} readyState 現在のステートを表す文字列
     */
    readyStateChange: function (readyState) {
        
        try {
            var state = Jeeel.Net.Ajax.Request.Events[readyState];
            var response = new Jeeel.Net.Ajax.Response(this);

            if (state == 'Complete') {
                this._complete = true;
                (this.options['on' + response.status] ||
                this.options['on' + (this.isSuccess() ? 'Success' : 'Failure')] ||
                Jeeel.Function.Template.EMPTY)(response, response.headerJSON);

                var contentType = response.getHeader('Content-type');

                if (this.options.evalJS == 'force'
                    || (this.options.evalJS && this.isSameOrigin() && contentType
                        && contentType.match(/^\s*(text|application)\/(x-)?(java|ecma)script(;.*)?\s*$/i)))
                {
                    this.evalResponse();
                }
            }

            (this.options['on' + state] || Jeeel.Function.Template.EMPTY)(response, response.headerJSON);
            Jeeel.Net.Ajax.Request.dispatch('on' + state, this, response, response.headerJSON);

            if (state == 'Complete') {
                this.transport.onreadystatechange = Jeeel.Function.Template.EMPTY;
                clearTimeout(this._timeoutId);
            }
        } catch (e) {
            this.dispatchException(e);
        }
    },

    /**
     * ヘッダをセットする
     */
    setRequestHeaders: function () {
        var headers = {
            'X-Requested-With': 'XMLHttpRequest',
            'X-Jeeel-Version': Jeeel.VERSION,
            'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
        };

        if (this.method === 'post') {
            headers['Content-type'] = this.options.contentType +
            (this.options.encoding ? '; charset=' + this.options.encoding : '');

            if (this.transport.overrideMimeType &&
                (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0,2005])[1] < 2005)
            {
                headers['Connection'] = 'close';
            }
        }

        if (typeof this.options.requestHeaders === 'object') {
            var extras = this.options.requestHeaders;

            if (Jeeel.Type.isFunction(extras.push)) {
                for (var i = 0, length = extras.length; i < length; i += 2) {
                    headers[extras[i]] = extras[i+1];
                }
            }
            else {
                for (var key in extras) {
                    headers[key] = extras[key];
                }
            }
        }

        for (var name in headers) {
            this.transport.setRequestHeader(name, headers[name]);
        }
    },

    /**
     * 現在のアクセスドメインと同等の場所へのアクセスかどうかを返す
     *
     * @return {Boolean} 現ドメインと同じプロトコル・ドメイン・ポートへのアクセスかどうか
     */
    isSameOrigin: function () {
        var m = this.url.match(/^\s*https?:\/\/[^\/]*/);
        return !m || (m[0] == (location.protocol + '//' + Jeeel._doc.domain + (location.port ? ':' + location.port : '')));
    },

    /**
     * エラーが発生した場合に処理するメソッド
     * 
     * @param {Error} error エラーオブジェクト
     */
    dispatchException: function (error) {

        if (this.options.onException) {
            this.options.onException(this, error);
        } else {
            throw error;
        }
    },
    
    /**
     * コンストラクタ
     * 
     * @constructor
     * @param {String} url 対象URL
     * @param {Hash} options オプション
     */
    constructor: Jeeel.Net.Ajax.Request
};
