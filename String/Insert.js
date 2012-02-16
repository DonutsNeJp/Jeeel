
/**
 * 文字列の指定箇所に指定文字列を挿入する
 *
 * @param {String} str 対象の文字列(文字列以外を入れた場合は文字列に変換された後に値を返す)
 * @param {Integer} index 挿入箇所のインデックス(マイナスのインデックスの場合は先頭に、インデックスをオーバーしたら末尾に挿入文字列が付けられる)
 * @param {String} insertStr 挿入文字列
 * @return {String} 挿入後の文字列
 */
Jeeel.String.insert = function (str, index, insertStr) {
    if ( ! str) {
        return insertStr;
    }
    
    str = '' + str;
    
    var leftStr = str.substring(0, index);
    var rightStr = str.substring(index, str.length);

    return leftStr + insertStr + rightStr;
};
