
/**
 * 対象文字列をスネークケースに変更する<br />
 * 変換対象はハイフネーションまたはキャメルケースが対象となる
 * 
 * @param {String} str 対象文字列
 * @return {String} 変換後の文字列
 */
Jeeel.String.toSnakeCase = function (str) {
    return ('' + str).replace(/([A-Z])/g, '_$1').replace(/-/g, '_').toLowerCase();
};