
/**
 * 作成したJsonをデコードする<br />
 * 検証を行い、evalして返す
 *
 * @param {String} json Json形式の文字列
 * @param {Boolean} [isSecure] JSONの中身の安全性が確実な場合にtrueにすると検証なしで動作するため速くなる(また、完全なJSON形式でなくても動作するようになる)
 * @return {Mixied} 変換後の値(空文字の場合はundefinedが返る)
 * @throws {TypeError} jsonが文字列ではないときに発生
 * @throws {SyntaxError} jsonがJson形式でないときに発生
 */
Jeeel.Json.decode = function (json, isSecure) {

    // jsonの中身が空の場合nullではなくundefinedを返す("null"をデコードした時と区別するため)
    if ( ! json) {
        return void 0;
    }
    
    if ( ! Jeeel.Type.isString(json)) {
        throw new TypeError('jsonが文字列ではありません。');
    } else if ( ! isSecure) {
        if (Jeeel._global.JSON) {
            return JSON.parse(json);
        } else if ( ! Jeeel.Json.isJson(json)) {
            throw new SyntaxError('jsonがJson形式になっていません。');
        }
    }

    return eval('(' + json + ')');
};
