
/**
 * コンストラクタ
 * 
 * @class セッション内のデータのやり取りを提供するコアクラス
 * @param {Hash} params リスト化したい値を保持するキー
 * @param {Integer} [expires] Sessionの保存期限(秒)<br />
 *                             マイナスを指定すると無制限になる
 * @param {String} [domain] 許可ドメイン
 * @param {String} [path] 許可パス
 */
Jeeel.Session.Core = function (params, expires, domain, path, id) {
    if ( ! Jeeel.Type.isHash(params)) {
        throw new Error('paramsがHashではありません。');
    }

    this.params  = params;
    this.created = (arguments[5] ? new Date(arguments[5]) : new Date());
    this.expires = (Jeeel.Type.isInteger(expires) ? expires : 0);
    this.path    = (Jeeel.Type.isString(path) ? path : '/');
    this.domain  = (Jeeel.Type.isString(domain) ? domain : Jeeel.UserAgent.getHostname());
    
    if (id) {
        this.id = id;
    }
};

/**
 * インスタンスの作成を行う
 *
 * @param {Hash} params リスト化したい値を保持するキー
 * @return {Jeeel.Session.Core} 作成したインスタンス
 */
Jeeel.Session.Core.create = function (params) {
    return new this(params, this.expires, this.domain, this.path);
};

/**
 * Sessionオブジェクトかどうかを返す
 *
 * @param {Mixied} val 判定値
 * @return {Boolean} 判定結果
 */
Jeeel.Session.Core.isSessionObject = function (val) {
    if ( ! Jeeel.Type.isObject(val)) {
        return false;
    }
    else if ( ! Jeeel.Type.isHash(val.params)) {
        return false;
    }
    else if ( ! Jeeel.Type.isString(val.created)) {
        return false;
    }
    else if ( ! Jeeel.Type.isInteger(val.expires)) {
        return false;
    }
    else if ( ! Jeeel.Type.isString(val.domain)) {
        return false;
    }
    else if ( ! Jeeel.Type.isString(val.path)) {
        return false;
    }
    else if ( ! Jeeel.Type.isString(val.id)) {
        return false;
    }

    return true;
};

/**
 * 現在のドメインが許可されているのかどうかを調べる
 *
 * @param {String} target 対象のドメイン
 * @return {Boolean} 許可されたドメインならばtrueそれ以外はfalseを返す
 */
Jeeel.Session.Core.isAllowDomain = function (target) {
    var domain = Jeeel.UserAgent.getHostname();

    var reg = new RegExp('^'+target.replace('.', '\\.'));

    if (domain.match(reg)) {
        return true;
    }

    return false;
};

/**
 * 現在アクセスしているパスが許可されているのかどうか調べる
 *
 * @param {String} target 対象のパス
 * @return {Boolean} 許可されたパスならばtrueそれ以外はfalseを返す
 */
Jeeel.Session.Core.isAllowPath = function (target) {
    var path = Jeeel.UserAgent.getPath();

    var reg = new RegExp('^'+target+(target.charAt(target.length-1) == '/' ? '' : '(/|$)'));

    if (path.match(reg)) {
        return true;
    }

    return false;
};

/**
 * シリアライズされてオブジェクトの復元を行う
 *
 * @param {String} serializeObj シリアライズされているオブジェクト
 * @return {Jeeel.Session.Core} 復元したインスタンス
 */
Jeeel.Session.Core.unserialize = function (serializeObj) {
    var session;

    try {
        session = Jeeel.Json.decode(decodeURIComponent(serializeObj));
    } catch(e) {
        session = {};
    }
    
    if ( ! Jeeel.Type.isHash(session)) {
        return this.create({});
    }

    var res = {};

    for (var domain in session) {

        if ( ! this.isAllowDomain(domain)) {
            continue;
        }

        for (var path in session[domain]) {

            if ( ! this.isAllowPath(path)) {
                continue;
            }

            var val = session[domain][path];

            if ( ! this.isSessionObject(val)) {
                val = this.create({});
            } else {
                val = new this(val.params, val.expires, val.domain, val.path, val.id, val.created);
            }

            if (val.isTimeOver()) {
                val = this.create({});
            }

            res = Jeeel.Hash.merge(res, val.params);
        }

        break;
    }

    session = this.create(res);

    return session;
};

/**
 * クッキーの内容をロードする
 *
 * @param {String} cookieObj document.cookie内部の値
 * @return {Jeeel.Session.Core} 作成したインスタンス
 */
Jeeel.Session.Core.loadCookie = function (cookieObj) {
    var objs = cookieObj.split('; ');

    var params = {};

    for (var i = 0, l = objs.length; i < l; i++) {
        var pair = objs[i].split('=');

        var session = decodeURIComponent(pair[1]);

        try {
            session = Jeeel.Json.decode(session);
        } catch (e) {}

        params[pair[0]] = session;
    }

    return this.create(params);
};

/**
 * Sessionの保存期限の初期値(秒)<br />
 * 0を指定でブラウザを閉じるまでで(cookieのみ)、<br />
 * マイナスを指定すると無制限になる
 *
 * @type Integer
 */
Jeeel.Session.Core.expires = 0;

/**
 * Sessionの読み込み可能ドメインの初期値
 *
 * @type String
 */
Jeeel.Session.Core.domain = Jeeel.UserAgent.getHostname();

if (Jeeel.Session.Core.domain === 'localhost') {
    Jeeel.Session.Core.domain = '';
}

/**
 * Sessionの読み込み可能パスの初期値
 *
 * @type String
 */
Jeeel.Session.Core.path = Jeeel.UserAgent.getPath();

Jeeel.Session.Core.prototype = {
    
    /**
     * Sessionに保存するパラメータ
     *
     * @type Hash
     */
    params: {},

    /**
     * Sessionを作成した時刻
     *
     * @type Date
     */
    created: null,

    /**
     * Sessionの保存期限(秒)<br />
     * 0を指定でブラウザを閉じるまでで(cookieのみ)、<br />
     * マイナスを指定すると無制限になる
     *
     * @type Integer
     */
    expires: 0,

    /**
     * Sessionの読み込み可能パス
     *
     * @type String
     */
    path: '',

    /**
     * Sessionの読み込み可能ドメイン
     *
     * @type String
     */
    domain: '',
    
    /**
     * Sessionが作成されたID
     * 
     * @type String
     */
    id: Jeeel.UNIQUE_ID,
    
    /**
     * シリアライズが可能なオブジェクトを返す
     *
     * @return {Object} シリアライズ可能オブジェクト
     */
    getSerializeableObject: function () {
        return {
            params:  this.params,
            created: this.created.toGMTString(),
            expires: this.expires,
            domain:  this.domain,
            path:    this.path,
            id:      Jeeel.UNIQUE_ID
        };
    },

    /**
     * Sessionオブジェクトをシリアライズする
     *
     * @param {String} windowName window.nameの値
     * @return {String} シリアライズされたSessionオブジェクト
     */
    serialize: function (windowName) {
        var sessionOwner;

        try {
            sessionOwner = Jeeel.Json.decode(decodeURIComponent(windowName));
        } catch(e) {
            sessionOwner = {};
        }

        if ( ! Jeeel.Type.isObject(sessionOwner)) {
            sessionOwner = {};
        }

        if ( ! (this.domain in sessionOwner)) {
            sessionOwner[this.domain] = {};
        }

        if ( ! this.constructor.isSessionObject(sessionOwner[this.domain][this.path])) {
            sessionOwner[this.domain][this.path] = this.getSerializeableObject();
        } else {

            var selfObj = this.getSerializeableObject();

            delete selfObj.params;

            sessionOwner[this.domain][this.path] = Jeeel.Hash.merge(sessionOwner[this.domain][this.path], selfObj);

            for (var key in this.params) {
                sessionOwner[this.domain][this.path].params[key] = this.params[key];

                if ( ! Jeeel.Type.isSet(sessionOwner[this.domain][this.path].params[key])) {
                    delete sessionOwner[this.domain][this.path].params[key];
                }
            }
        }

        return encodeURIComponent(Jeeel.Json.encode(sessionOwner));
    },

    /**
     * Session情報をクッキーに保存できる形式に変換して返す
     *
     * @return {String[]} クッキー保存形式の文字列
     */
    getCookies: function () {
        var expires = new Date(this.created.toString());

        expires.setSeconds(expires.getSeconds() + (this.expires < 0 ? Math.pow(2, 32) : this.expires));
        expires = expires.toGMTString();

        var res = [];
        var ext = (this.expires === 0 ? '' : ';expires=' + expires) + (this.domain == '' ? '' : ';domain=' + this.domain) + ';path=' + this.path + ';';
        var rmExt = new Date();
        
        rmExt.setDate(rmExt.getDate() - 1);
        rmExt = ';expires=' + rmExt.toGMTString() + (this.domain == '' ? '' : ';domain=' + this.domain) + ';path=' + this.path + ';';

        for (var key in this.params) {
            if (Jeeel.Type.isUndefined(this.params[key])) {
                res[res.length] = key + '=null' + rmExt;
            } else if (Jeeel.Type.isString(this.params[key])) {
                res[res.length] = key + '=' + encodeURIComponent(this.params[key]) + ext;
            } else {
                res[res.length] = key + '=' + encodeURIComponent(Jeeel.Json.encode(this.params[key])) + ext;
            }
        }

        return res;
    },

    /**
     * このSessionオブジェクトの期限が切れていないかどうかを調べる
     *
     * @return {Boolean} 期限切れならばtrueそれ以外はfalseを返す
     */
    isTimeOver: function () {

        if (this.expires < 0) {
            return false;
        } else if (this.expires === 0) {
            this.expires = 86400;
        }

        var expires = new Date(this.created.toString());

        expires.setSeconds(expires.getSeconds() + this.expires);

        var now = new Date();

        if (now.getTime() > expires.getTime()) {
            return true;
        }

        return false;
    },

    /**
     * 現在のドメインが許可されているのかどうかを調べる
     *
     * @return {Boolean} 許可されたドメインならばtrueそれ以外はfalseを返す
     */
    isAllowDomain: function () {
        var domain = Jeeel.UserAgent.getHostname();

        var reg = new RegExp('^' + this.domain.replace('.', '\\.'));

        if (domain.match(reg)) {
            return true;
        }

        return false;
    },

    /**
     * 現在アクセスしているパスが許可されているのかどうか調べる
     *
     * @return {Boolean} 許可されたパスならばtrueそれ以外はfalseを返す
     */
    isAllowPath: function () {
        var path = Jeeel.UserAgent.getPath();

        var reg = new RegExp('^' + this.path+(this.path.charAt(this.path.length-1) == '/' ? '' : '(/|$)'));

        if (path.match(reg)) {
            return true;
        }

        return false;
    },
    
    /**
     * コンストラクタ
     * 
     * @param {Hash} params リスト化したい値を保持するキー
     * @param {Integer} [expires] Sessionの保存期限(秒)<br />
     *                             マイナスを指定すると無制限になる
     * @param {String} [domain] 許可ドメイン
     * @param {String} [path] 許可パス
     * @constructor
     */
    constructor: Jeeel.Session.Core
};
