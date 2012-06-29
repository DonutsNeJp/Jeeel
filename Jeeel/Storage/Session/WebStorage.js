
/**
 * コンストラクタ
 *
 * @class ウェブストレージのセッションを扱ってストレージを模すクラス(但しサーバー側には干渉しない、またドメイン・プロトコル・ポート番号で制御されるため異なるドメイン間等ではデータのやりとりは出来ない)<br />なおこのクラスはwindow.localStorageを使用している
 * @augments Jeeel.Storage.Session.Abstract
 * @param {String} name 読み込み・保存時の名前
 * @param {Boolean} [isPersistent] データの永続化をするかどうか(ブラウザを閉じてもアクセス出来るか)
 * @throws {Error} nameを文字列で指定しなかった場合に発生
 * @see Jeeel.Storage.Session.Abstract
 */
Jeeel.Storage.Session.WebStorage = function (name, isPersistent) {

    if ( ! Jeeel.Type.isString(name)) {
        throw new Error('nameは必ず指定しなければなりません。');
    }
    
    Jeeel.Storage.Session.Abstract.call(this);
    
    this._session = Jeeel.Session.WebStorage.create(isPersistent, Jeeel.Storage.Session.WebStorage.STORAGE_NAME);
    this._name = name;
};

/**
 * インスタンスの作成を行う
 *
 * @param {String} name 読み込み・保存時の名前
 * @param {Boolean} [isPersistent] データの永続化をするかどうか(ブラウザを閉じてもアクセス出来るか)
 * @return {Jeeel.Storage.Session.WebStorage} 作成したインスタンス
 */
Jeeel.Storage.Session.WebStorage.create = function (name, isPersistent) {
    return new this(name, isPersistent);
};

/**
 * localStorageに保存する際のキー
 *
 * @type String
 * @constant
 */
Jeeel.Storage.Session.WebStorage.STORAGE_NAME = 'Jeeel-Storage-Session-WebStorage-Name';

Jeeel.Storage.Session.WebStorage.prototype = {
  
    /**
     * 値を保存する
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
     * 保存した値を読み込む
     *
     * @return {Hash} 読み込んだ結果値
     */
    load: function () {
        var params = this._session.get(this._name);

        if ( ! Jeeel.Type.isSet(params)) {
            params = {};
        }

        if ( ! Jeeel.Type.isHash(params)) {
            params = [params];
        }

        return params;
    }
};

Jeeel.Class.extend(Jeeel.Storage.Session.WebStorage, Jeeel.Storage.Session.Abstract);
