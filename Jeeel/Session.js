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
 * @namespace Session関連のネームスペース
 * @example
 * Sessionネームスペース以下はセッション、擬似セッションを管理する機能を保持する
 * 以下にようなクラスが存在する
 * Jeeel.Session.Cookie
 * Jeeel.Session.Name
 * Jeeel.Session.WebStorage
 * 
 * Jeeel.Session.Cookie
 * クッキーを扱うクラス
 * 制御可能なのは読み込み、書き込み、クッキーの寿命、有効パス、有効ドメインとなる
 * 
 * 
 * 例：
 * document.cookieの中身を以下とする
 * "sid=aabbggsshhyy; aa=555"
 * 
 * var cookie = Jeeel.Session.Cookie.create(); // new Jeeel.Session.Cookie()だとクッキーの読み込みを行わない
 * cookie.load(); // 現在の値を破棄して新しくクッキーを読み込み解析する
 * cookie.getAll(); // 現在のクッキーの値を連想配列にして返す、{sid: 'aabbggsshhyy', aa: 555}
 * cookie.set('b', [12, 55, {a: 'y', v: true}]); // 現在の保持値に値を設定する
 * cookie.save(); // 実際にクッキーに値を書き込む、変更された箇所のみ書き込まれる
 *                // 実際のクッキーの値は以下のようになる
 *                // "sid=aabbggsshhyy; aa=555; b=%5B12%2C55%2C%7B%22a%22%3A%22y%22%2C%22v%22%3Atrue%7D%5D"
 *                // bの値は複雑な値になるのでこのクラスか類似した機能下でしか復元できない
 *                // 実際に保存されている値はJSON化した後encodeURIComponentでエスケープした状態である
 * cookie.setExpires(360); // 今から保存するクッキーの有効期限を6分間とする(インスタンスを作成した時点ではブラウザを閉じるまで)
 * cookie.set('c', 55).save(); // ここで保存したcに対して有効期限が設定される
 * 
 * 
 * Jeeel.Session.Name
 * window.nameを使用して擬似的にセッションを作り出すクラス
 * 使用するためにはグローバル変数にnameが無いこと、window.nameを使用したスクリプトが動いていないことが条件になる
 * また別画面、別ドメインに遷移しても値が消えないため重要なデータを保存するとデータ漏えいが起こる可能性もある
 * 
 * 例：
 * window.nameは空とする
 * 基本的な操作はJeeel.Session.Cookieと同じである
 * 違うのはデフォルトの有効期限と保存時の形式くらいである
 * 
 * var winName = Jeeel.Session.Name.create();
 * winName.setExpires(360); // 今から保存する値の有効期限を6分間とする(インスタンスを作成した時点では1日)
 * winName.getDomain('test.co.jp'); // 今から保存する値の有効ドメインを指定する(インスタンス作成時は現在のドメイン)
 * winName.set('test', 888);
 * winName.save();
 * 
 * Jeeel.Session.WebStorage
 * localStorage, sessionStorageを使用して擬似的にセッションを作り出すクラス
 * storageを使用するので他のクラスよりも大容量のデータを保存出来セキュリティも高い
 * また永続保存する媒体として適している
 * 
 * 例：
 * var storage = Jeeel.Session.WebStorage.create(true, 'test'); // このクラスはlocalStorage, sessionStorageの使い分けをするため1つめの引数で永続保存(localStorageを使用するかどうか)をするかどうかを指定する
 *                                                              // また2つめの引数では任意にstorageに保存する際の名前を指定できる
 * 
 * storage.setExpires(1800); // 今から保存する値の有効期限を1時間とする(インスタンスを作成した時点では1日)
 * storage.setPath('/test/index/'); // 今から保存する値の有効パスを指定する(インスタンスを作成した時点ではルートパス: "/")
 * storage.set('test', 888);
 * storage.save();
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
