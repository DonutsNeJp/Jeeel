
/**
 * コンストラクタ
 *
 * @class 座標を扱うクラス
 * @param {Integer} x X座標
 * @param {Integer} y Y座標
 */
Jeeel.Object.Point = function (x, y) {

    /**
     * X座標
     *
     * @type Integer
     */
    this.x = x;

    /**
     * Y座標
     *
     * @type Integer
     */
    this.y = y;
};

Jeeel.Object.Point.prototype = {

    /**
     * 複製を行う
     *
     * @return {Jeeel.Object.Point} 複製したインスタンス
     */
    clone: function () {
        return new Jeeel.Object.Point(this.x, this.y);
    },

    /**
     * 内部比較を行い結果を返す
     *
     * @param {Jeeel.Object.Point} point 比較オブジェクト
     * @return {Boolean} 判定結果
     */
    equals: function (point) {
        return this.x === point.x
            && this.y === point.y;
    },

    /**
     * 文字列に変換する
     *
     * @return {String} 文字列に変換した自インスタンス
     */
    toString: function () {
        return '(' + this.x + ', ' + this.y + ')';
    }
};
