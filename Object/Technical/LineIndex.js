
/**
 * コンストラクタ
 *
 * @class Jeeel.Stringで行数とインデックスを表す構造体
 * @param {Hash} lineIndex
 * @param {Integer} lineIndex.line
 * @param {Integer} lineIndex.index
 */
Jeeel.Object.Technical.LineIndex = function (lineIndex) {
    var self = this;

    self.line  = lineIndex.line;
    self.index = lineIndex.index;
};

Jeeel.Object.Technical.LineIndex.prototype = {
  
    /**
     * 行番号
     *
     * @type Integer
     */
    line : false,

    /**
     * 行文字列のインデックス
     *
     * @type Integer
     */
    index : false
};
