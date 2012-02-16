
/**
 * Jeeel.String.insertの複数版
 *
 * @param {String} str 対象の文字列(文字列以外を入れた場合は文字列に変換された後に値を返す)
 * @param {Integer[]} indexArr 挿入箇所のインデックス配列(マイナスのインデックスの場合は先頭に、インデックスをオーバーしたら末尾に挿入文字列が付けられる)<br />
 *                              もしもこの配列内のインデックスの並びが昇順ではない場合、insertStrArrの配列のインデックスとずれるので注意
 * @param {String|String[]} insertStrArr 挿入文字列もしくは挿入文字列配列(配列にした場合はインデックスの配列と数が一致しなければならない)
 * @return {String} 挿入後の文字列
 * @throws {Error} insertStrArrが配列でindexArrとinsertStrArrの配列の要素数が一致しない場合に起こる
 */
Jeeel.String.multiInsert = function (str, indexArr, insertStrArr) {
    if ( ! Jeeel.Type.isArray(indexArr)) {
        indexArr = [indexArr];
    }
    
    str = '' + str;
    
    var res = [];
    var insertStrIsArray = Jeeel.Type.isArray(insertStrArr);
    var insertStr;
    
    if (insertStrIsArray && indexArr.length != insertStrArr.length) {
        throw new Error('インデックスの配列と挿入文字の配列の数が違います。');
    }
    
    indexArr.sort(function (a, b) {return a - b});

    indexArr.unshift(0);
    
    if (insertStrIsArray) {
        insertStrArr.unshift('');
    }
    
    for (var i = 1, l = indexArr.length; i < l; i++) {
        if (insertStrIsArray) {
            insertStr = insertStrArr[i];
        } else {
            insertStr = insertStrArr;
        }
        
        res[res.length] = str.substring(indexArr[i - 1], indexArr[i]);
        res[res.length] = insertStr;
    }
    
    res[res.length] = str.substring(indexArr[l - 1], str.length);
    
    return res.join('');
};
