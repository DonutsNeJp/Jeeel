
/**
 * コンストラクタ
 *
 * @class AjaxのResponseを表すクラス
 * @param {Jeeel.Net.Ajax.Request} request リクエスト
 */
Jeeel.Net.Ajax.Response = function (request) {

    var self = this;

    self.request = request;
    self.fields  = request.options.fields;
    var transport = self.transport = request.transport;
    var readyState = self.readyState = transport.readyState;

    if ((readyState > 2 && ! Jeeel.UserAgent.isInternetExplorer()) || readyState == 4) {
        self.status       = self.getStatus();
        self.statusText   = self.getStatusText();
        self.responseText = (transport.responseText ? transport.responseText : '');
        self.headerJSON   = self._getHeaderJSON();
    }

    if (readyState == 4) {
        var xml = transport.responseXML;
        self.responseXML  = Jeeel.Type.isUndefined(xml) ? null : xml;
        self.responseJSON = self._getResponseJSON();
    }
};

Jeeel.Net.Ajax.Response.prototype = {

    /**
     * 現在の状態でのステータス
     *
     * @type Integer
     */
    status: 0,

    /**
     * 現在のステータスを示す文字列
     *
     * @type String
     */
    statusText: '',

    /**
     * テキストの戻り値
     *
     * @type String
     */
    responseText: null,

    /**
     * XMLの戻り値
     * 
     * @type XMLDocument
     */
    responseXML: null,

    /**
     * Jsonの戻り値
     *
     * @type Mixied
     */
    responseJSON: null,

    /**
     * リクエスト時に渡したフィールドパラメータ
     *
     * @type Hash
     */
    fields: null,
    
    /**
     * レスポンスフィールドパラメータの全取得
     *
     * @return {Hash} 値リスト
     */
    getFieldAll: function () {
        return this.fields;
    },

    /**
     * レスポンスフィールドパラメータの取得
     *
     * @param {String} key キー
     * @param {Mixied} [defaultValue] デフォルト値
     * @return {Mixied} 値
     */
    getField: function (key, defaultValue) {
        return Jeeel.Type.isSet(this.fields[key]) ? this.fields[key] : defaultValue;
    },

    /**
     * ヘッダを取得する<br />
     * エラーが起こった場合や存在しない場合はnullを返す
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
     * ヘッダをそのまま取得する
     *
     * @param {String} name ヘッダ名
     * @return {String} ヘッダ情報
     */
    getResponseHeader: function (name) {
        return this.transport.getResponseHeader(name);
    },

    /**
     * ヘッダを全て取得する<br />
     * エラーが起こった場合や存在しない場合はnullを返す
     *
     * @return {String} ヘッダ情報
     */
    getAllHeaders: function () {
        try {
            return this.getAllResponseHeaders();
        } catch (e) {
            return null;
        }
    },

    /**
     * ヘッダを全てをそのまま取得する
     *
     * @return {String} ヘッダ情報
     */
    getAllResponseHeaders: function () {
        return this.transport.getAllResponseHeaders();
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
     * 現在のステータスを示す文字列を取得する
     *
     * @return {Integer} ステータス文字列
     */
    getStatusText: function () {
        try {
            return this.transport.statusText || '';
        } catch (e) {
            return '';
        }
    },

    /**
     * 戻り値を強制的にJsonに変換して取得する<br />
     * 変換できなかった場合は空の連想配列になる
     *
     * @return {Mixied} 変換後のJsonオブジェクト(連想配列)
     */
    getResponseJSON: function () {
        var res;
        
        var options = this.request.options;
        
        try {
            res = Jeeel.Json.decode(decodeURIComponent(this.responseText), ! options.sanitizeJSON && this.request.isSameOrigin());
        } catch (e) {
            res = {};
        }

        return res;
    },
    
    /**
     * 戻り値を強制的にXMLに変換して取得する<br />
     * 変換できなかった場合はnullになる
     *
     * @return {Jeeel.Dom.Xml} 変換後のXMLインスタンス
     */
    getResponseXML: function () {
        var res;

        try {
            res = new Jeeel.Dom.Xml(this.responseXML || this.responseText);
        } catch (e) {
            res = null;
        }

        return res;
    },
    
    /**
     * headerJsonを取得する
     *
     * @return {Mixied} Jsonを変換した後のオブジェクト
     * @protected
     */
    _getHeaderJSON: function () {
        var json = this.getHeader('X-JSON');
        
        if ( ! json) {
            return null;
        }

        json = decodeURIComponent(json);

        try {
            return Jeeel.Json.decode(json);
        } catch (e) {
            this.request.dispatchException(e);
        }
    },

    /**
     * 戻り値のJsonを取得する<br />
     * ただしヘッダにjson情報が書き込まれている必要がある
     *
     * @return {Mixied} Jsonを変換した後のオブジェクト
     * @protected
     */
    _getResponseJSON: function () {
        var options = this.request.options;

        if (!options.evalJSON || (options.evalJSON != 'force' &&
            (this.getHeader('Content-type') || '').indexOf('application/json') < 0) || this.responseText.match(/^\s*$/)) {
            return null;
        }

        try {
            return Jeeel.Json.decode(decodeURIComponent(this.responseText), ! options.sanitizeJSON && this.request.isSameOrigin());
        } catch (e) {
            this.request.dispatchException(e);
        }
    }
};
