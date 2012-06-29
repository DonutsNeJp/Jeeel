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
 * @staticClass ブラウザの情報を判別するためのクラス
 * @example
 * このクラスはブラウザ情報からURL情報まで一括で管理するクラスである
 * ブラウザ毎に正確に挙動を分けたい場合やURLのクエリなどを取得したい際に使用する
 * 
 * 例：
 * Jeeel.UserAgent.isInternetExplorer(); // ブラウザがIEの場合にtrue
 * Jeeel.UserAgent.isInternetExplorer(6); // 引数にバージョンを指定して、ブラウザがIE6の場合にtrueになる
 * Jeeel.UserAgent.getVersion(); // ブラウザの正確なバージョン情報を返す、Chromeなら"19.0.1084.56"など
 * Jeeel.UserAgent.getBrowserName(); // ブラウザの正確な名前を返す、Firefoxなら"Mozilla Firefox"など
 * Jeeel.UserAgent.getQuery(); // URLのクエリ文字列を解析した連想配列を取得する
 * 
 * 他にも以下のメソッド等が良く使われる
 * 
 * Jeeel.UserAgent.isFirefox(4); // Firefoxかどうかを判定する、引数でバージョンを指定
 * Jeeel.UserAgent.isChrome(); // Chromeかどうかを判定する、引数でバージョンを指定
 * Jeeel.UserAgent.isOpera();  // Opearaかどうかを判定する、引数でバージョンを指定
 * Jeeel.UserAgent.isSafari(); // Safariかどうかを判定する、引数でバージョンを指定
 * Jeeel.UserAgent.isIPhone(); // iPhoneかどうかを判定する
 * Jeeel.UserAgent.isAndroid(); // Androidかどうかを判定する
 */
Jeeel.UserAgent = {

    /**
     * ユーザーエージェントの文字列情報
     *
     * @type String
     * @private
     */
    _ua: Jeeel._global.navigator && Jeeel._global.navigator.userAgent || '',
    
    /**
     * ブラウザのバージョン文字列
     * 
     * @type String
     * @private
     */
    _browserVersion: '0',
    
    /**
     * スキーム文字列
     * 
     * @type String
     * @private
     */
    _scheme: Jeeel._global.location && Jeeel._global.location.protocol && Jeeel._global.location.protocol.replace(':', '') || '',
    
    /**
     * クエリ文字列
     * 
     * @type String
     * @private
     */
    _query: Jeeel._global.location && Jeeel._global.location.search && Jeeel._global.location.search.replace(/^\?/, '') || '',
    
    /**
     * クエリフィルター
     * 
     * @type Jeeel.Filter.Url.QueryParameter
     * @private
     */
    _queryFilter: new Jeeel.Filter.Url.QueryParameter(),
        
    /**
     * ブラウザがInternetExplorerかどうかを返す
     *
     * @param {Integer|String} [version] バージョンを指定したい場合に指定する(例: 6)
     * @return {Boolean} InternetExplorerかどうか
     */
    isInternetExplorer: function (version) {},

    /**
     * ブラウザがFirefoxかどうかを返す
     *
     * @param {Integer|String} [version] バージョンを指定したい場合に指定する(例: 3)
     * @return {Boolean} FireFoxかどうか
     */
    isFirefox: function (version) {},
    
    /**
     * ブラウザがChromeかどうかを返す
     *
     * @param {Integer|String} [version] バージョンを指定したい場合に指定する(例: 13)
     * @return {Boolean} Chromeかどうか
     */
    isChrome: function (version) {},
    
    /**
     * ブラウザがSafariかどうかを返す
     *
     * @param {Integer|String} [version] バージョンを指定したい場合に指定する(例: 5)
     * @return {Boolean} Safariかどうか
     */
    isSafari: function (version) {},

    /**
     * ブラウザがOperaかどうかを返す
     *
     * @param {Integer|String} [version] バージョンを指定したい場合に指定する(例: 10)
     * @return {Boolean} Operaかどうか
     */
    isOpera: function (version) {},

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
     * Workerとして動作しているかどうかを返す
     * 
     * @return {Boolean} Workerかどうか
     */
    isWorker: function () {},

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
     * ブラウザのバージョンを取得する
     *
     * @return {String} ブラウザのバージョン
     */
    getVersion: function () {
        return this._browserVersion || navigator.appVersion;
    },

    /**
     * ブラウザのユーザエージェントを取得する
     *
     * @return {String} ブラウザのユーザエージェント
     */
    getUserAgent: function () {
        return this._ua;
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
        var lang = navigator.userLanguage || navigator.browserLanguage || navigator.language;
        
        return lang && lang.substr(0, 2) || Jeeel.Language.getDefaultLocale();
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
     * 現在のベースURLを取得する
     * 
     * @return {String} ベースURL
     */
    getBaseUrl: function () {
        var port = this.getPort();
        
        return this.getScheme()
             + '://'
             + this.getHostname()
             + (port && ':' + port);
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
        if (Jeeel.Acl && Jeeel.Acl.isDenied(url, '*', 'Url')) {
            Jeeel.Acl.throwError('Access Error', 404);
        }
        
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
     * 現在のスキームを取得する
     * 
     * @return {String} スキーム
     */
    getScheme: function () {
        return this._scheme;
    },

    /**
     * 現在のホストを取得する(host = hostname + port)
     *
     * @return {String} ホスト
     */
    getHost: function () {
        return location.host;
    },

    /**
     * 現在のホスト名を取得する
     *
     * @return {String} ホスト名
     */
    getHostname: function () {
        return location.hostname;
    },

    /**
     * 現在のURLパラメータを示す文字列を取得する<br />
     * 先頭に?は付かない
     *
     * @return {String} Urlパラメータを示す文字列
     */
    getQueryString: function () {
        return this._query;
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
    getQuery: function (overwriteName) {
        return (overwriteName ? new Jeeel.Filter.Url.QueryParameter(overwriteName) : this._queryFilter).filter(this._query);
    },
    
    /**
     * リファラを取得する
     * 
     * @return {String} リファラ
     */
    getReferrer: function () {
        return Jeeel._doc.referrer;
    },
    
    /**
     * 現在のURLを解析して結果を返す
     * 
     * @return {Hash} URL解析結果の連想配列
     */
    parseUrl: function () {
        var parser = Jeeel.Filter.Url.Parser.create();
        
        return parser.parse(this.getUrl());
    },
    
    /**
     * 現在のURLの履歴を残さずに次のURLに移行する
     * 
     * @param {String} url 移行先URL
     */
    redirect: function (url) {
        if (Jeeel.Acl && Jeeel.Acl.isDenied(url, '*', 'Url')) {
            Jeeel.Acl.throwError('Access Error', 404);
        }
        
        location.replace(url);
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

                    self._tag = Jeeel.Loader.addStyle(style);
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
    
    /**
     * @ignore
     */
    _init: function () {
        
        var uao = this._ua;

        if ( ! uao) {
            delete this._init;
            return;
        }
        
        var trueF  = Jeeel.Function.Template.RETURN_TRUE;
        var falseF = Jeeel.Function.Template.RETURN_FALSE;
        
        this.isSecure = (this._scheme === 'https' ? trueF : falseF);
        
        if ( ! this._query) {
            this.getQuery = Jeeel.Function.Template.RETURN_EMPTY_HASH;
        }

        var idx;
        
        this.isIPhone = (uao.indexOf("(iPhone;") !== -1 ? trueF : falseF);
        this.isIPad = (uao.indexOf("(iPad;") !== -1 ? trueF : falseF);
        this.isIPod = (uao.indexOf("(iPod;") !== -1 ? trueF : falseF);
        this.isMobile = (uao.indexOf("Mobile") !== -1 ? trueF : falseF);
        this.isAndroid = (uao.indexOf("Android") !== -1 ? trueF : falseF);
        
        this.isWorker = (Jeeel._global && Jeeel._global.importScripts ? trueF : falseF);

        idx = uao.indexOf("Firefox");
        
        if (idx !== -1) {
            
            this._browserVersion = uao.substring(idx + 8, uao.length);
            
            /**
             * @ignore
             */
            this.isFirefox = function (version) {
                if (version) {
                    return this._ua.indexOf("Firefox/" + version + '.') !== -1;
                }
                
                return true;
            };
            
            /**
             * @ignore
             */
            this.getBrowserName = function () {
                return 'Mozilla Firefox';
            };
        } else {
            this.isFirefox = falseF;
        }
        
        idx = uao.indexOf("MSIE");
        
        if (idx !== -1) {
            
            this._browserVersion = uao.substring(idx + 5, uao.indexOf(';', idx));
            
            /**
             * @ignore
             */
            this.isInternetExplorer = function (version) {
                if (version) {
                    return this._ua.indexOf("MSIE " + version + '.') !== -1;
                }
                
                return true;
            };
            
            /**
             * @ignore
             */
            this.getBrowserName = function () {
                return 'Microsoft Internet Explorer';
            };
        } else {
            this.isInternetExplorer = falseF;
        }
        
        idx = uao.indexOf("Chrome");
        
        if (idx !== -1) {
            this._browserVersion = uao.substring(idx + 7, uao.indexOf(' ', idx));
            
            /**
             * @ignore
             */
            this.isChrome = function (version) {
                if (version) {
                    return this._ua.indexOf("Chrome/" + version + '.') !== -1;
                }
                
                return true;
            };
            
            /**
             * @ignore
             */
            this.getBrowserName = function () {
                return 'Google Chrome';
            };
        } else {
            this.isChrome = falseF;
        }
        
        if (uao.indexOf("Safari") !== -1 && idx === -1) {
            idx = uao.indexOf("Version");
            
            this._browserVersion = uao.substring(idx + 8, uao.indexOf(' ', idx));
            
            /**
             * @ignore
             */
            this.isSafari = function (version) {
                if (version) {
                    return this._ua.indexOf("Version/" + version + '.') !== -1;
                }
                
                return true;
            };
            
            /**
             * @ignore
             */
            this.getBrowserName = function () {
                return 'Apple Safari';
            };
        } else {
            this.isSafari = falseF;
        }
        
        if (uao.indexOf("Opera") !== -1) {
            idx = uao.indexOf("Version");
            
            this._browserVersion = uao.substring(idx + 8, uao.length);
            
            /**
             * @ignore
             */
            this.isOpera = function (version) {
                if (version) {
                    return this._ua.indexOf("Version/" + version + '.') !== -1;
                }
                
                return true;
            };
            
            /**
             * @ignore
             */
            this.getBrowserName = function () {
                return 'ASA Opera';
            };
        } else {
            this.isOpera = falseF;
        }
        
        this.isTridentEngine = (this.isInternetExplorer() || uao.indexOf("Trident/") !== -1 ? trueF : falseF);
        this.isGeckoEngine = (uao.indexOf("Gecko/") !== -1 ? trueF : falseF);
        this.isWebkitEngine = (uao.indexOf("AppleWebKit/") !== -1 ? trueF : falseF);
        this.isPrestoEngine = (uao.indexOf("Presto/") !== -1 ? trueF : falseF);
        
        delete this._init;
    }
};

Jeeel.UserAgent._init();

// 初期のロケールを設定
if (Jeeel.UserAgent.isWorker()) {
    Jeeel.Language.setLocale(Jeeel.UserAgent.getQuery().lang || Jeeel.Language.getDefaultLocale());
} else {
    Jeeel.Language.setLocale(Jeeel.UserAgent.getLanguage());
}

Jeeel.file.Jeeel.UserAgent = [];

if (Jeeel._extendMode.Geolocation && Jeeel._global.navigator && Jeeel._global.navigator.geolocation) {
    Jeeel.file.Jeeel.UserAgent[Jeeel.file.Jeeel.UserAgent.length] = 'Geolocation';
}

Jeeel._autoImports(Jeeel.directory.Jeeel.UserAgent, Jeeel.file.Jeeel.UserAgent);
