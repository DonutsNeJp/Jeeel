
/**
 * コンストラクタ<br />
 * コンストラクタを直接使用した場合はロードは行われない
 *
 * @class Cookieを使用してセッションを扱うクラス(クッキーが使用できるのを前提に動作する)
 * @augments Jeeel.Session.Abstract
 */
Jeeel.Session.Cookie = function () {
    Jeeel.Session.Abstract.call(this);
};

/**
 * インスタンスの作成を行う<br />
 * さらにロードも同時に行う
 *
 * @param {Boolean} [loadsCookie] クッキーのロードを行うかどうか(初期は行わない)
 * @return {Jeeel.Session.Cookie} 作成したインスタンス
 */
Jeeel.Session.Cookie.create = function (loadsCookie) {
    var obj = new this();

    return (loadsCookie ? obj.load() : obj);
};

Jeeel.Session.Cookie.prototype = {
    
    /**
     * 設定した値をセッションに保存する<br >
     * 実際にクッキーに保存するのでログイン状態等に注意
     *
     * @return {Jeeel.Session.Cookie} 自インスタンス
     */
    save: function () {
        Jeeel._doc.cookie = this._session.getCookie();

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

        return this;
    }
};

Jeeel.Class.extend(Jeeel.Session.Cookie, Jeeel.Session.Abstract);
