Jeeel.directory.Jeeel.UserAgent = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel + 'UserAgent/';
    }
};

/**
 * ブラウザの情報を判別するためのクラス
 */
Jeeel.UserAgent = {

    /**
     * ユーザーエージェントの文字列情報
     *
     * @type String
     * @private
     */
    _info: navigator.userAgent,
    
    /**
     * ブラウザがSafariかどうかを返す
     *
     * @return {Boolean} Safariかどうか
     */
    isSafari: function () {},

    /**
     * ブラウザがFireFoxかどうかを返す
     *
     * @return {Boolean} FireFoxかどうか
     */
    isFireFox: function () {},

    /**
     * ブラウザがOperaかどうかを返す
     *
     * @return {Boolean} Operaかどうか
     */
    isOpera: function () {},

    /**
     * ブラウザがNetscapeかどうかを返す
     *
     * @return {Boolean} Netscapeかどうか
     */
    isNetscape: function () {},
    
    /**
     * ブラウザがNetscape.4かどうかを返す
     *
     * @return {Boolean} Netscape.4かどうか
     */
    isNetscape4: function () {},

    /**
     * ブラウザがInternetExplorerかどうかを返す
     *
     * @return {Boolean} InternetExplorerかどうか
     */
    isInternetExplorer: function () {},

    /**
     * ブラウザがInternetExplorer6かどうかを返す
     *
     * @return {Boolean} InternetExplorer6かどうか
     */
    isInternetExplorer6: function () {},
    
    /**
     * iPhoneかどうかを返す
     * 
     * @return {Boolean} iPhoneかどうか
     */
    isIPhone: function () {},
    
    /**
     * iPadかどうかを返す
     * 
     * @return {Boolean} iPadかどうか
     */
    isIPad: function () {},
    
    /**
     * iPod touchかどうかを返す
     * 
     * @return {Boolean} iPhoneかどうか
     */
    isIPod: function () {},
    
    /**
     * Androidかどうかを返す
     * 
     * @return {Boolean} Androidかどうか
     */
    isAndroid: function () {},
    
    /**
     * Mobileかどうかを返す(現在スマートフォンのみ考慮)
     * 
     * @return {Boolean} Mobileかどうか
     */
    isMobile: function () {},

    /**
     * ブラウザのレンダリングエンジンがTridentかどうかを返す
     *
     * @return {Boolean} Tridentかどうか
     */
    isTridentEngine: function () {},

    /**
     * ブラウザのレンダリングエンジンがGeckoかどうかを返す
     *
     * @return {Boolean} Geckoかどうか
     */
    isGeckoEngine: function () {},

    /**
     * ブラウザのレンダリングエンジンがWebkitかどうかを返す
     *
     * @return {Boolean} Webkitかどうか
     */
    isWebkitEngine: function () {},

    /**
     * ブラウザのレンダリングエンジンがPrestoかどうかを返す
     *
     * @return {Boolean} Prestoかどうか
     */
    isPrestoEngine: function () {},
    
    /**
     * ブラウザ名を取得する
     *
     * @return {String} ブラウザ名
     */
    getBrowserName: function () {
        return navigator.appName;
    },

    /**
     * ブラウザのコードネームを取得する
     *
     * @return {String} ブラウザのコードネーム
     */
    getCodeName: function () {
        return navigator.appCodeName;
    },

    /**
     * ブラウザのバージョンを取得する
     *
     * @return {String} ブラウザのバージョン
     */
    getVersion: function () {
        return navigator.appVersion;
    },

    /**
     * ブラウザのユーザエージェントを取得する
     *
     * @return {String} ブラウザのユーザエージェント
     */
    getUserAgent: function () {
        return this._info;
    },

    /**
     * ユーザーのOSプラットフォームを取得する
     *
     * @return {String} ユーザーのOSプラットフォーム
     */
    getPlatform: function () {
        return navigator.platform;
    },

    /**
     * ブラウザの使用言語を取得する
     *
     * @return {String} ブラウザの使用言語
     */
    getLanguage: function () {
        return navigator.language;
    },

    /**
     * 現在のパスを取得する
     *
     * @return {String} パス
     */
    getPath: function () {
        return location.pathname;
    },

    /**
     * 現在のURLを取得する
     *
     * @return {String} URL
     */
    getUrl: function () {
        return location.href;
    },

    /**
     * 現在のURLを設定する(ページ遷移する)
     *
     * @param {String} url 遷移対象URL
     */
    setUrl: function (url) {
        location.href = url;
    },
    
    /**
     * 現在のURLをパラメータやフラグメントの付いていない状態で返す。
     * 
     * @return {String} URL
     */
    getUrlPath: function () {
        return location.href.replace(/\?.+$/, '');
    },
    
    /**
     * 現在のフラグメントを取得する
     * 
     * @return {String} フラグメント
     */
    getFragment: function () {
        return location.hash.replace('#', '');
    },

    /**
     * 現在のポートを取得する
     *
     * @return {String} ポート
     */
    getPort: function () {
        return location.port;
    },

    /**
     * 現在のプロトコルを取得する
     *
     * @return {String} プロトコル
     */
    getProtocol: function () {},
    
    /**
     * 現在のスキーマを取得する
     * 
     * @return {String} スキーマ
     */
    getSchema: function () {},

    /**
     * 現在のホストを取得する
     *
     * @return {String} ホスト
     */
    getHost: function () {
        return location.host;
    },

    /**
     * 現在のドメインを取得する
     *
     * @return {String} ドメイン
     */
    getDomain: function () {
        return location.hostname;
    },

    /**
     * 現在のURLパラメータを示す文字列を取得する<br />
     * 先頭に?は付かない
     *
     * @return {String} Urlパラメータを示す文字列
     */
    getQueryString: function () {
        return '';
    },

    /**
     * 現在のURLパラメータを取得する<br />
     * URLパラメータは連想配列でもよいが、<br />
     * 正しく記述されている必要がある<br />
     * 以下は正しく取得できない可能性のある例である
     *
     * <pre>
     * ?a[&]=2&a[2]=3   //配列の添え字に&が入っている
     * ?a[=]=2&a[2]=3   //配列の添え字に=が入っている
     * ?a[[1]]=2&a[2]=3 //配列の添え字に[]のいずれかが入っている
     * ?a[1][=2&a[2]=3  //配列の形式が途中で途切れている
     * ?a[]=2&a[]=3     //配列の添え字がない
     * </pre>
     *
     * @param {String} [overwriteName] 本来上書きされてしまう要素を取得したい時に使用する名前(内部はJeeel.Object.Item[]になる)
     * @return {Hash} URLパラメータの連想配列
     */
    getQueryParameters: function (overwriteName) {
        return {};
    },

    /**
     * クッキーが有効かどうかを返す
     *
     * @return {Boolean} クッキーが有効かどうか
     */
    isCookieEnabled: function () {
        return navigator.cookieEnabled;
    },

    /**
     * 現在のページが暗号化されているかどうかを返す
     *
     * @return {Boolean} 暗号化されているかどうか
     */
    isSecure: function () {},
    
    /**
     * ブラウザの対応MIMEタイプの一覧を取得する
     * 
     * @return {Hash} MimeTypeリスト(キーがタイプになる)
     */
    getMimeTypes: function () {
        var res = {};
        
        for (var i = 0, l = navigator.mimeTypes.length; i < l; i++) {
            res[navigator.mimeTypes[i].type] = navigator.mimeTypes[i];
        }
        
        return res;
    },
    
    /**
     * VMLの有効・無効化を行う(IE限定: それ以外のブラウザでは何も起こらない)
     * 
     * @param {Boolean} enable 有効にするかどうか
     */
    enableVml: function (enable) {
        if ( ! Jeeel._doc.uniqueID) {
            return;
        }
        
        var root = Jeeel.Document.getDocumentElement();

        root = Jeeel.Dom.Element.create(root);

        if (enable) {
            if ( ! root.hasAttribute('xmlns:v')) {
                root.setAttribute('xmlns:v', 'urn:schemas-microsoft-com:vml');
            }
            
            if ( ! arguments.callee._tag) {
                var self = arguments.callee;
                
                Jeeel.Timer.setTimeout(function () {
                    var style = 'v\\:* { behavior: url(#default#VML); }';

                    self._tag = Jeeel.Import.addStyle(style);
                }, 1);
            }
        } else {
            if (root.hasAttribute('xmlns:v')) {
                root.removeAttribute('xmlns:v');
            }
            
            if (arguments.callee._tag) {
                Jeeel.Dom.Element.create(arguments.callee._tag).remove();
                
                delete arguments.callee._tag;
            }
        }
    },
    
    _init: function () {
        
        var uao = navigator && navigator.userAgent;
        var ua = navigator && navigator.userAgent && navigator.userAgent.toLowerCase();
        
        if ( ! ua) {
            delete this._init;
            return;
        }
        
        var trueF = function () {
            return true;
        };
        
        var falseF = function () {
            return false;
        };
        
        var pro = location && location.protocol && location.protocol.replace(':', '');
        var scm = pro && (pro + '://');
        var qs  = location && location.search && location.search.replace(/^\?/, '');
        var qsf = new Jeeel.Filter.Url.QueryParameter();
        
        this.isSafari = (ua.indexOf("safari") !== -1 ? trueF : falseF);
        this.isFireFox = (ua.indexOf("firefox") !== -1 ? trueF : falseF);
        this.isOpera = (ua.indexOf("opera") !== -1 ? trueF : falseF);
        this.isNetscape = (ua.indexOf("netscape") !== -1 ? trueF : falseF);
        this.isNetscape4 = (ua.indexOf("mozilla/4") !== -1 ? trueF : falseF);
        this.isInternetExplorer = (ua.indexOf("msie") !== -1 ? trueF : falseF);
        this.isInternetExplorer6 = (ua.indexOf("msie 6") !== -1 ? trueF : falseF);
        this.isIPhone = (uao.indexOf("(iPhone;") !== -1 ? trueF : falseF);
        this.isIPad = (uao.indexOf("(iPad;") !== -1 ? trueF : falseF);
        this.isIPod = (uao.indexOf("(iPod;") !== -1 ? trueF : falseF);
        this.isMobile = (uao.indexOf("Mobile") !== -1 ? trueF : falseF);
        this.isAndroid = (uao.indexOf("Android") !== -1 ? trueF : falseF);
        
        this.isTridentEngine = (this.isInternetExplorer() || ua.indexOf("trident/") !== -1 ? trueF : falseF);
        this.isGeckoEngine = (ua.match(/gecko\/(\d{4})/) !== -1 ? trueF : falseF);
        this.isWebkitEngine = (ua.indexOf("applewebkit/") !== -1 ? trueF : falseF);
        this.isPrestoEngine = (ua.indexOf("presto/") !== -1 ? trueF : falseF);

        if (pro) {
            this.isSecure = (pro === 'https' ? trueF : falseF);
            this.getProtocol = function () {
                return pro;
            };
            this.getSchema = function () {
                return scm;
            };
        }
        
        if (qs) {
            this.getQueryString = function () {
                return qs;
            };
            
            this.getQueryParameters = function (overwriteName) {
                return (overwriteName ? new Jeeel.Filter.Url.QueryParameter(overwriteName) : qsf).filter(qs);
            };
        }
        
        delete this._init;
    }
};

Jeeel.UserAgent._init();

Jeeel.file.Jeeel.UserAgent = [];

if (Jeeel._extendMode.Geolocation && typeof navigator !== 'undefined' && navigator.geolocation) {
    Jeeel.file.Jeeel.UserAgent[Jeeel.file.Jeeel.UserAgent.length] = 'Geolocation';
}

Jeeel._autoImports(Jeeel.directory.Jeeel.UserAgent, Jeeel.file.Jeeel.UserAgent);
