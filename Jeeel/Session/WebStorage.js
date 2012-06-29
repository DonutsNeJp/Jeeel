
/**
 * コンストラクタ<br />
 * コンストラクタを直接使用した場合はロードは行われない
 *
 * @class Cookieを使用しないセッションを扱うクラス(但しサーバー側には干渉しない、またドメイン・プロトコル・ポート番号で制御されるため異なるドメイン間等ではデータのやりとりは出来ない)<br />なおこのクラスはwindow.localStorage, sessionStorageを使用している
 * @augments Jeeel.Session.Abstract
 * @param {Boolean} [isPersistent] データの永続化をするかどうか(ブラウザを閉じてもアクセス出来るか)
 * @param {String} [name] 保存名を明示的に指定する場合に指定
 * @example
 * // 基本的にな使い方はJeeel.Session.Cookieと殆ど変らない
 * // 但し、window.nameを使用しているためグローバルにnameの名前の変数名を定義すると動作出来なくなる
 * var storage = Jeeel.Session.WebStorage.create(true); //インスタンスを作成し、同時にwindow.localStorageの読み込みも行う(#loadも同時に行っている)
 * storage.getAll(); //値を全て取得する
 * storage.set('test', [1, 2, 34, 5, 7]); //値を設定する(設定する値はなんでも良い: 複雑なインスタンスは除く)
 * storage.setAll({test2: 111, test3: 'str'})
 * storage.save(); //現在のインスタンス内部の値をwindow.localStorageに保存する
 * 
 * // saveを行った後のwindow.nameのイメージは以下のような感じになる
 * // window.localStorage == "{test:[1, 2, 34, 5, 7], test2:111; test3:'str'}"
 * 
 * // パス、保存期間などを設定する場合は以下の設定を行ってから#saveメソッドを呼ぶ必要がある
 * // 但し既に保存されているものとパス等がが違った場合上書きではなく新規になるので注意
 * // 更に詳しく知る場合はJeeel.Session.Abstractのメソッド一覧を参照
 * storage.setDomain('www.test.com'); //この設定はこのクラスにおいて無意味である(window.localStorageがそもそもクロスドメインを許可していないため)
 * storage.setPath('/test/index/'); //デフォルトでは現在のパスになる
 * storage.setExpires(172800); //デフォルトではブラウザを閉じるまで(擬似)
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
        var tmp = this._session.params;
        this._session.params = this._changedValues;
        
        (this._isPersistent ? Jeeel._global.localStorage : Jeeel._global.sessionStorage).setItem(this._sessionName, this._session.serialize((this._isPersistent ? Jeeel._global.localStorage : Jeeel._global.sessionStorage).getItem(this._sessionName)));

        this._session.params = tmp;
        this._changedValues = {};

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
        this._changedValues = {};

        return this;
    }
};

Jeeel.Class.extend(Jeeel.Session.WebStorage, Jeeel.Session.Abstract);
