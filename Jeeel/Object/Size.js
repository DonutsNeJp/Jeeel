
/**
 * コンストラクタ
 *
 * @class サイズを扱うクラス
 * @param {Integer} width 幅
 * @param {Integer} height 高さ
 */
Jeeel.Object.Size = function (width, height) {

    /**
     * 幅
     *
     * @type Integer
     */
    this.width = width;

    /**
     * 高さ
     *
     * @type Integer
     */
    this.height = height;
};

Jeeel.Object.Size.prototype = {

    /**
     * 複製を行う
     *
     * @return {Jeeel.Object.Size} 複製したインスタンス
     */
    clone: function () {
        return new Jeeel.Object.Size(this.width, this.height);
    },

    /**
     * 内部比較を行い結果を返す
     *
     * @param {Jeeel.Object.Size} size 比較オブジェクト
     * @return {Boolean} 判定結果
     */
    equals: function (size) {
        return this.width === size.width
            && this.height === size.height;
    },

    /**
     * 文字列に変換する
     *
     * @return {String} 文字列に変換した自インスタンス
     */
    toString: function () {
        return this.width + ' × ' + this.height;
    }
};
