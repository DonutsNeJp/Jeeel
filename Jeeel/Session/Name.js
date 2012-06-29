
/**
 * コンストラクタ<br />
 * コンストラクタを直接使用した場合はロードは行われない
 *
 * @class Cookieを使用しないセッションを扱うクラス(但しサーバー側には干渉しない、またドメインが変わっても参照できるため重要な情報保持には向かない)<br />
 *         なおこのクラスはwindow.nameを使用している(グローバル変数nameが存在する場合やwindow.nameを他の用途に使用している場合は使用できない)
 * @augments Jeeel.Session.Abstract
 * @example
 * // 基本的にな使い方はJeeel.Session.Cookieと殆ど変らない
 * // 但し、window.nameを使用しているためグローバルにnameの名前の変数名を定義すると動作出来なくなる
 * // また保存もwindowが閉じられると無効になったり、サーバー側には送信しなかったり、どのページに遷移しても読み込むことが出来たりなどセキュリティが低く制限も多い
 * var sname = Jeeel.Session.Name.create(); //インスタンスを作成し、同時にwindow.nameの読み込みも行う(#loadも同時に行っている)
 * sname.getAll(); //値を全て取得する
 * sname.set('test', [1, 2, 34, 5, 7]); //値を設定する(設定する値はなんでも良い: 複雑なインスタンスは除く)
 * sname.setAll({test2: 111, test3: 'str'})
 * sname.save(); //現在のインスタンス内部の値をwindow.nameに保存する
 * 
 * // saveを行った後のwindow.nameのイメージは以下のような感じになる
 * // window.name == "{test:[1, 2, 34, 5, 7], test2:111; test3:'str'}"
 * 
 * // ドメインやパス、保存期間などを設定する場合は以下の設定を行ってから#saveメソッドを呼ぶ必要がある
 * // 但し既に保存されているものとパス等がが違った場合上書きではなく新規になるので注意
 * // 更に詳しく知る場合はJeeel.Session.Abstractのメソッド一覧を参照
 * sname.setDomain('www.test.com'); //デフォルトで現在のドメインになる(localhostは除く)
 * sname.setPath('/test/index/'); //デフォルトでは現在のパスになる
 * sname.setExpires(172800); //デフォルトではブラウザを閉じるまで(擬似)
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
        var tmp = this._session.params;
        this._session.params = this._changedValues;
        
        Jeeel._global.name = this._session.serialize(Jeeel._global.name);
        
        this._session.params = tmp;
        this._changedValues = {};

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
        this._changedValues = {};

        return this;
    }
};

Jeeel.Class.extend(Jeeel.Session.Name, Jeeel.Session.Abstract);
