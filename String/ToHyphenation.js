
/**
 * 対象文字列をハイフネーションに変更する<br />
 * 変換対象はスネークケースまたはキャメルケースが対象となる
 * 
 * @param {String} str 対象文字列
 * @return {String} 変換後の文字列
 */
Jeeel.String.toHyphenation = function (str) {
    return ('' + str).replace(/([A-Z])/g, '-$1').replace(/_/g, '-').toLowerCase();
};