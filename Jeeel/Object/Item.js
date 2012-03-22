
/**
 * コンストラクタ
 *
 * @class キーと値のペアを保持するクラス
 * @param {String} key キー
 * @param {Mixied} value 値
 */
Jeeel.Object.Item = function (key, value) {

    /**
     * キー
     *
     * @type String
     */
    this.key = key;

    /**
     * 値
     * 
     * @type Mixied
     */
    this.value = value;
};

Jeeel.Object.Item.prototype = {

    /**
     * 複製を行う
     *
     * @return {Jeeel.Object.Item} 複製したインスタンス
     */
    clone: function () {
        return new Jeeel.Object.Item(this.key, this.value);
    },

    /**
     * 内部比較を行い結果を返す
     *
     * @param {Jeeel.Object.Item} item 比較オブジェクト
     * @return {Boolean} 判定結果
     */
    equals: function (item) {
        return this.key === item.key
            && this.value === item.value;
    },

    /**
     * 文字列に変換する
     *
     * @return {String} 文字列に変換した自インスタンス
     */
    toString: function () {
        return this.key + '=' + this.value;
    }
};
