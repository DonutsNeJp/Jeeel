
/**
 * 文字列の前後から空白を取り除く
 *
 * @param {String} str 対象の文字列(文字列以外を入れた場合は文字列に変換された後に値を返す)
 * @return {String} 空白を取り除いた後の値
 */
Jeeel.String.trim = function (str) {
    if ( ! str) {
        return '';
    }

    var trimLeft  = /^\s+/;
    var trimRight = /\s+$/;

    return str.toString().replace(trimLeft, '').replace(trimRight, '');
};
