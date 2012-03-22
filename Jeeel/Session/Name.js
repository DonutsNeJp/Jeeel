
/**
 * コンストラクタ<br />
 * コンストラクタを直接使用した場合はロードは行われない
 *
 * @class Cookieを使用しないセッションを扱うクラス(但しサーバー側には干渉しない、またドメインが変わっても参照できるため重要な情報保持には向かない)<br />なおこのクラスはwindow.nameを使用している
 * @augments Jeeel.Session.Abstract
 */
Jeeel.Session.Name = function () {
    Jeeel.Session.Abstract.call(this);
};

/**
 * インスタンスの作成を行う<br />
 * さらにロードも同時に行う
 *
 * @return {Jeeel.Session.Name} 作成したインスタンス
 */
Jeeel.Session.Name.create = function () {
    return (new this()).load();
};

Jeeel.Session.Name.prototype = {
  
    /**
     * 設定した値をセッションに保存する<br />
     * なおセーブ時は前に保持していた値は削除された後保存されるので、<br />
     * 注意して行う必要がある。
     *
     * @return {Jeeel.Session.Name} 自インスタンス
     */
    save: function () {
        Jeeel._global.name = this._session.serialize(Jeeel._global.name);

        return this;
    },
    
    /**
     * セッションに保存されていた値を読み込む<br/>
     * なお、現在保持している値は全て削除される
     *
     * @return {Jeeel.Session.Name} 自インスタンス
     */
    load: function () {
        this._session = Jeeel.Session.Core.unserialize(Jeeel._global.name);

        return this;
    }
};

Jeeel.Class.extend(Jeeel.Session.Name, Jeeel.Session.Abstract);
