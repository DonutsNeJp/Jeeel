
/**
 * 数値を百分率にして返す
 * 
 * @param {Number} number 対象の数値
 * @return {String} 百分率表記の文字列(後ろに%が付く)
 */
Jeeel.Number.percentage = function (number) {
    return number * 100 + '%';
};