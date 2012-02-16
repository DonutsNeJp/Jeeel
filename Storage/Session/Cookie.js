
/**
 * コンストラクタ
 *
 * @class クッキーのセッションを扱ってストレージを模すクラス
 * @augments Jeeel.Storage.Session.Abstract
 * @param {String} name 読み込み・保存時の名前
 * @throws {Error} nameを文字列で指定しなかった場合に発生
 */
Jeeel.Storage.Session.Cookie = function (name) {

    if ( ! Jeeel.Type.isString(name)) {
        throw new Error('nameは必ず指定しなければなりません。');
    }
    
    Jeeel.Storage.Session.Abstract.call(this);
    
    this._name = name;
    this._session = Jeeel.Session.Cookie.create();
};

/**
 * インスタンスの作成を行う
 *
 * @param {String} name 読み込み・保存時の名前
 * @return {Jeeel.Storage.Session.Cookie} 作成したインスタンス
 */
Jeeel.Storage.Session.Cookie.create = function (name) {
    return new this(name);
};

Jeeel.Storage.Session.Cookie.prototype = {
    
    /**
     * クッキーに値を保存する
     *
     * @param {Hash} params 保存する値のリスト
     */
    save: function (params) {

        if ( ! Jeeel.Type.isHash(params)) {
            params = [params];
        }

        this._session.set(this._name, params).save();
    },
    
    /**
     * クッキーの値を読み込む
     *
     * @return {Hash} 読み込んだ結果値
     */
    load: function () {
        var params = this._session.load().get(this._name);

        if ( ! Jeeel.Type.isSet(params)) {
            params = {};
        }

        if ( ! Jeeel.Type.isHash(params)) {
            params = [params];
        }

        return params;
    }
};

Jeeel.Class.extend(Jeeel.Storage.Session.Cookie, Jeeel.Storage.Session.Abstract);
