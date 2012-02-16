
/**
 * 対象文字列をキャメルケースに変更する(パスカルケースではない)<br />
 * 変換対象はハイフネーションまたはスネークケースが対象となる
 * 
 * @param {String} str 対象文字列
 * @return {String} 変換後の文字列
 */
Jeeel.String.toCamelCase = function (str) {
    return ('' + str).replace(/(-|_)([a-z])/g, function (str, p1, p2){return p2.toUpperCase();});
};
