
/**
 * コンストラクタ
 *
 * @abstractClass セッションクラスを作る際の抽象クラス
 */
Jeeel.Session.Abstract = function () {
    this._session = Jeeel.Session.Core.create({});
};

Jeeel.Session.Abstract.prototype = {

    /**
     * セッションの必要値の保存領域
     * 
     * @type Jeeel.Session.Core
     * @protected
     */
    _session: null,

    /**
     * パラメータを取得する
     *
     * @param {String} key 保存する値を示すキー
     * @param {Mixied} [defaultValue] デフォルト値
     * @return {Mixed} 保存されていた値
     */
    get: function (key, defaultValue) {
        return (key in this._session.params ? this._session.params[key] : defaultValue);
    },

    /**
     * パラメータを全て取得する
     *
     * @return {Hash} 保存されていた値の連想配列
     */
    getAll: function () {
        return this._session.params;
    },

    /**
     * パラメータを設定する
     *
     * @param {String} key 保存する値を示すキー
     * @param {Mixed} value 保存する値
     * @return {Jeeel.Session.Abstract} 自インスタンス
     */
    set: function (key, value) {
        this._session.params[key] = value;

        return this;
    },

    /**
     * パラメータを設定する
     *
     * @param {Hash} values 保存する値の連想配列
     * @return {Jeeel.Session.Abstract} 自インスタンス
     */
    setAll: function (values) {

        if ( ! Jeeel.Type.isHash(values)) {
            throw new Error('valuesがHashではありません。');
        }

        this._session.params = values;

        return this;
    },

    /**
     * 指定したキーの値を破棄する
     *
     * @param {String} key キー
     * @return {Jeeel.Session.Abstract} 自インスタンス
     */
    unset: function (key) {
        this._session.params[key] = undefined;

        return this;
    },

    /**
     * 指定したキーの値を保持しているかどうかを返す
     *
     * @param {String} key キー
     * @return {Boolean} 値を保持していたらtrueそれ以外はfalseを返す
     */
    has: function (key) {
        return key in this._session.params;
    },

    /**
     * パラメータを全て破棄する
     *
     * @return {Jeeel.Session.Abstract} 自インスタンス
     */
    clear: function () {
        this._session.params = {};
        
        return this;
    },

    /**
     * Sessionの保存期間を取得する
     *
     * @return {Integer} 保存期間(秒)
     */
    getExpires: function () {
        return this._session.expires;
    },

    /**
     * Sessionの保存期間を設定する<br />
     * マイナスを指定すると無制限になる
     *
     * @param {Integer} expires 保存期間(秒)
     * @return {Jeeel.Session.Abstract} 自インスタンス
     */
    setExpires: function (expires) {

        if ( ! Jeeel.Type.isInteger(expires)) {
            throw new Error('expiresが整数ではありません。');
        }

        this._session.expires = expires;

        return this;
    },

    /**
     * Sessionの読み込み許可をするドメインを取得する
     *
     * @return {String} 読み込み可能ドメイン
     */
    getDomain: function () {
        return this._session.domain;
    },

    /**
     * Sessionの読み込み許可をするドメインを設定する
     *
     * @param {String} domain 読み込み可能ドメイン
     * @return {Jeeel.Session.Abstract} 自インスタンス
     */
    setDomain: function (domain) {

        if ( ! Jeeel.Type.isString(domain)) {
            throw new Error('domainが文字列ではありません。');
        }

        this._session.domain = domain;

        return this;
    },

    /**
     * Sessionの読み込み可能パスを取得する
     *
     * @return {String} 読み込み可能パス
     */
    getPath: function () {
        return this._session.path;
    },

    /**
     * Sessionの読み込み可能パスを設定する
     *
     * @param {String} path 読み込み可能パス
     * @return {Jeeel.Session.Abstract} 自インスタンス
     */
    setPath: function (path) {

        if ( ! Jeeel.Type.isString(path)) {
            throw new Error('pathが文字列ではありません。');
        }

        this._session.path = path;

        return this;
    }
};