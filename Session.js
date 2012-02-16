Jeeel.directory.Jeeel.Session = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel + 'Session/';
    }
};

/**
 * Session関連のネームスペース
 */
Jeeel.Session = {

    /**
     * Sessionの保存期間の初期値を取得する
     *
     * @return {Integer} 保存期間(秒)
     */
    getExpires: function () {
        return Jeeel.Session.Core.expires;
    },

    /**
     * Sessionの保存期間の初期値を設定する<br />
     * マイナスを指定すると無制限になる
     *
     * @param {Integer} expires 保存期間(秒)
     * @return {Jeeel.Session} 自オブジェクト
     */
    setExpires: function (expires) {

        if ( ! Jeeel.Type.isInteger(expires)) {
            throw new Error('expiresが整数ではありません。');
        }

        Jeeel.Session.Core.expires = expires;

        return this;
    },

    /**
     * Sessionの読み込み許可をするドメインの初期値を取得する
     *
     * @return {String} 読み込み可能ドメイン
     */
    getDomain: function () {
        return Jeeel.Session.Core.domain;
    },

    /**
     * Sessionの読み込み許可をするドメインの初期値を設定する
     *
     * @param {String} domain 読み込み可能ドメイン
     * @return {Jeeel.Session} 自オブジェクト
     */
    setDomain: function (domain) {

        if ( ! Jeeel.Type.isString(domain)) {
            throw new Error('domainが文字列ではありません。');
        }

        Jeeel.Session.Core.domain = domain;

        return this;
    },

    /**
     * Sessionの読み込み可能パスの初期値を取得する
     *
     * @return {String} 読み込み可能パス
     */
    getPath: function () {
        return Jeeel.Session.Core.path;
    },

    /**
     * Sessionの読み込み可能パスの初期値を設定する
     *
     * @param {String} path 読み込み可能パス
     * @return {Jeeel.Session} 自オブジェクト
     */
    setPath: function (path) {

        if ( ! Jeeel.Type.isString(path)) {
            throw new Error('pathが文字列ではありません。');
        }

        Jeeel.Session.Core.path = path;

        return this;
    }
};

Jeeel.file.Jeeel.Session = ['Core', 'Abstract', 'Cookie', 'Name'];

if (Jeeel._extendMode.WebStorage && Jeeel._global && Jeeel._global.sessionStorage && Jeeel._global.localStorage) {
    Jeeel.file.Jeeel.Session[Jeeel.file.Jeeel.Session.length] = 'WebStorage';
}

Jeeel._autoImports(Jeeel.directory.Jeeel.Session, Jeeel.file.Jeeel.Session);
