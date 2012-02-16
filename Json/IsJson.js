
/**
 * 完全なJson形式であるかどうかを返す(メソッド等が入っていた場合は不可)
 *
 * @param {String} json 検査対象の文字列
 * @return {Boolean} Json形式であるかどうか
 */
Jeeel.Json.isJson = function (json) {

    if ( ! Jeeel.Type.isString(json)) {
        throw new TypeError('jsonが文字列ではありません。');
    }

    if (json.match(/^\s*$/)) {
        return false;
    }
    
    return !(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(json.replace(/"(\\.|[^"\\])*"/g, ' ')));
};
