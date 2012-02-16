
/**
 * 数字を千単位でグループ化してフォーマットする
 * 
 * @param {Number} number 対象の数値
 * @param {String} [separator] 千単位を区切る文字列(デフォルトは , )
 * @param {String} [prefix] 接頭辞
 * @param {String} [suffix] 接尾辞
 * @return {String} 変換後の値
 */
Jeeel.Number.format = function (number, separator, prefix, suffix) {
    var str = (+number || 0).toString();
    var dpi = str.indexOf('.');
    var moi = str.indexOf('-') + 1;
    
    if (dpi < 0) {
        dpi = str.length;
    }
    
    var indexArr = [];

    for (var i = dpi - 3; i > moi; i -= 3) {
        indexArr[indexArr.length] = i;
    }

    return (prefix || '') + Jeeel.String.multiInsert(str, indexArr, separator || ',') + (suffix || '');
};