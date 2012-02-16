Jeeel.directory.Jeeel.Storage = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel + 'Storage/';
    }
};

/**
 * ストレージ関連のネームスペース
 */
Jeeel.Storage = {

    /**
     * コンストラクタ
     *
     * @class ストレージクラスを作る際の抽象クラス
     */
    Abstract: function () {}
};

Jeeel.Storage.Abstract.prototype = {

    /**
     * ストレージにパラメータの保存を行う
     *
     * @param {Mixed} params 保存値
     * @return {Jeeel.Storage.Abstract} 自インスタンス
     * @throws {Error} メソッドが実装されていない場合に発生
     * @abstract
     */
    save: function (params) {
        throw new Error('saveメソッドが実装されていません。');
    },

    /**
     * ストレージからパラメータの読み込みを行う
     *
     * @return {Mixed} 読み込み値
     * @return {Jeeel.Storage.Abstract} 自インスタンス
     * @throws {Error} メソッドが実装されていない場合に発生
     * @abstract
     */
    load: function () {
        throw new Error('loadメソッドが実装されていません。');
    }
};

Jeeel.file.Jeeel.Storage = ['Session', 'Object'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Storage, Jeeel.file.Jeeel.Storage);
