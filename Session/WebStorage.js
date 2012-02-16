
/**
 * コンストラクタ<br />
 * コンストラクタを直接使用した場合はロードは行われない
 *
 * @class Cookieを使用しないセッションを扱うクラス(但しサーバー側には干渉しない、またドメイン・プロトコル・ポート番号で制御されるため異なるドメイン間等ではデータのやりとりは出来ない)<br />なおこのクラスはwindow.localStorageを使用している
 * @augments Jeeel.Session.Abstract
 * @param {Boolean} [isPersistent] データの永続化をするかどうか(ブラウザを閉じてもアクセス出来るか)
 * @param {String} [name] 保存名を明示的に指定する場合に指定
 */
Jeeel.Session.WebStorage = function (isPersistent, name) {
  
    Jeeel.Session.Abstract.call(this);

    /**
     * 保存データを永続化するかどうか
     * 
     * @type Boolean
     * @private
     */
    this._isPersistent = !!isPersistent;
    
    /**
     * 保存する際に使用するキー
     *
     * @type String
     * @private
     */
    this._sessionName = name || Jeeel.Session.WebStorage.STORAGE_NAME;
};

/**
 * インスタンスの作成を行う<br />
 * さらにロードも同時に行う
 *
 * @param {Boolean} [isPersistent] データの永続化をするかどうか(ブラウザを閉じてもアクセス出来るか)
 * @param {String} [name] 保存名を明示的に指定する場合に指定
 * @return {Jeeel.Session.WebStorage} 作成したインスタンス
 */
Jeeel.Session.WebStorage.create = function (isPersistent, name) {
    return (new this(isPersistent, name)).load();
};

/**
 * localStorageに保存する際のキー
 * 
 * @type String
 * @constant
 */
Jeeel.Session.WebStorage.STORAGE_NAME = 'Jeeel-Session-WebStorage-Name';

Jeeel.Session.WebStorage.prototype = {
    
    /**
     * 設定した値をセッションに保存する<br />
     * なおセーブ時は前に保持していた値は削除された後保存されるので、<br />
     * 注意して行う必要がある。
     *
     * @return {Jeeel.Session.WebStorage} 自インスタンス
     */
    save: function () {
        (this._isPersistent ? Jeeel._global.localStorage : Jeeel._global.sessionStorage).setItem(this._sessionName, this._session.serialize((this._isPersistent ? Jeeel._global.localStorage : Jeeel._global.sessionStorage).getItem(this._sessionName)));

        return this;
    },
    
    /**
     * セッションに保存されていた値を読み込む<br/>
     * なお、現在保持している値は全て削除される
     *
     * @return {Jeeel.Session.WebStorage} 自インスタンス
     */
    load: function () {
        this._session = Jeeel.Session.Core.unserialize((this._isPersistent ? Jeeel._global.localStorage : Jeeel._global.sessionStorage).getItem(this._sessionName));

        return this;
    }
};

Jeeel.Class.extend(Jeeel.Session.WebStorage, Jeeel.Session.Abstract);
