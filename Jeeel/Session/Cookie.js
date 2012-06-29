
/**
 * コンストラクタ<br />
 * コンストラクタを直接使用した場合はロードは行われない
 *
 * @class Cookieを使用してセッションを扱うクラス(クッキーが使用できるのを前提に動作する)
 * @augments Jeeel.Session.Abstract
 * @example
 * // 通常通りに使用する場合は以下のような形になる
 * var cookie = Jeeel.Session.Cookie.create(); //インスタンスを作成し、同時にクッキーの読み込みも行う(#loadも同時に行っている)
 * cookie.getAll(); //値を全て取得する
 * cookie.set('test', [1, 2, 34, 5, 7]); //値を設定する(設定する値はなんでも良い: 複雑なインスタンスは除く)
 * cookie.setAll({test2: 111, test3: 'str'}); //連想配列の値を個別に保存する
 * cookie.unset('test4'); //test4の値を破棄する(saveを呼ぶとその時設定中のドメイン・パスの値を消去する)
 * cookie.save(); //現在のインスタンス内部の値をクッキーに保存する(変更がなされた箇所のみなのでtest, test2, test3, test4(元々の値があれば)のみとなる)
 * 
 * // saveを行った後のクッキーのイメージは以下のような感じになる
 * // document.cookie == "test=[1, 2, 34, 5, 7]; test2=111; test3='str'"
 * 
 * // ドメインやパス、保存期間などを設定する場合は以下の設定を行ってから#saveメソッドを呼ぶ必要がある
 * // 但し既に保存されているものとパス等がが違った場合上書きではなく新規になるので注意
 * // 更に詳しく知る場合はJeeel.Session.Abstractのメソッド一覧を参照
 * cookie.setDomain('www.test.com'); //デフォルトで現在のドメインになる(localhostは除く)
 * cookie.setPath('/test/index/'); //デフォルトでは現在のパスになる
 * cookie.setExpires(172800); //デフォルトではブラウザを閉じるまで
 */
Jeeel.Session.Cookie = function () {
    Jeeel.Session.Abstract.call(this);
};

/**
 * インスタンスの作成を行う<br />
 * さらにロードも同時に行う
 *
 * @return {Jeeel.Session.Cookie} 作成したインスタンス
 */
Jeeel.Session.Cookie.create = function () {
    return (new this()).load();
};

Jeeel.Session.Cookie.prototype = {
    
    /**
     * 設定した値をセッションに保存する<br >
     * 実際にクッキーに保存するのは変更が加えられた要素のみである
     *
     * @return {Jeeel.Session.Cookie} 自インスタンス
     */
    save: function () {
        var tmp = this._session.params;
        
        this._session.params = this._changedValues;
        
        var cookies = this._session.getCookies();
        
        this._session.params = tmp;
        this._changedValues = {};
        
        for (var i = cookies.length; i--;) {
            Jeeel._doc.cookie = cookies[i];
        }

        return this;
    },
    
    /**
     * セッションに保存されていた値を読み込む<br/>
     * なお、現在保持している値は全て削除される
     *
     * @return {Jeeel.Session.Cookie} 自インスタンス
     */
    load: function () {
        this._session = Jeeel.Session.Core.loadCookie(Jeeel._doc.cookie);
        this._changedValues = {};

        return this;
    }
};

Jeeel.Class.extend(Jeeel.Session.Cookie, Jeeel.Session.Abstract);
