
/**
 * コンストラクタ
 *
 * @abstractClass ストレージセッションクラスを作る際の抽象クラス
 * @augments Jeeel.Storage.Abstract
 */
Jeeel.Storage.Session.Abstract = function () {
    Jeeel.Storage.Abstract.call(this);
};

Jeeel.Storage.Session.Abstract.prototype = {
    
    /**
     * セッションインスタンス
     * 
     * @type Jeeel.Session.Abstract
     * @private
     */
    _session: null,
    
    /**
     * セッション名
     * 
     * @type String
     * @private
     */
    _name: null,

    /**
     * Sessionの保存期間を取得する
     *
     * @return {Integer} 保存期間(秒)
     */
    getExpires: function () {
        return this._session.getExpires();
    },

    /**
     * Sessionの保存期間を設定する<br />
     * マイナスを指定すると無制限になる
     *
     * @param {Integer} expires 保存期間(秒)
     * @return {Jeeel.Storage.Session.Abstract} 自インスタンス
     */
    setExpires: function (expires) {

        this._session.setExpires(expires);

        return this;
    },

    /**
     * Sessionの読み込み許可をするドメインを取得する
     *
     * @return {String} 読み込み可能ドメイン
     */
    getDomain: function () {
        return this._session.getDomain();
    },

    /**
     * Sessionの読み込み許可をするドメインを設定する
     *
     * @param {String} domain 読み込み可能ドメイン
     * @return {Jeeel.Storage.Session.Abstract} 自インスタンス
     */
    setDomain: function (domain) {

        this._session.setDomain(domain);

        return this;
    },

    /**
     * Sessionの読み込み可能パスを取得する
     *
     * @return {String} 読み込み可能パス
     */
    getPath: function () {
        return this._session.getPath();
    },

    /**
     * Sessionの読み込み可能パスを設定する
     *
     * @param {String} path 読み込み可能パス
     * @return {Jeeel.Storage.Session.Abstract} 自インスタンス
     */
    setPath: function (path) {
        this._session.setPath(path);

        return this;
    }
};

Jeeel.Class.extend(Jeeel.Storage.Session.Abstract, Jeeel.Storage.Abstract);