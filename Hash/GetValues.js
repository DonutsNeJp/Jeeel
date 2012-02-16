/**
 * 指定したHashの値を全て返す
 *
 * @param {Hash} hash 配列・連想配列
 * @return {Array} 値のリスト
 * @throws {Error} hashが配列式でない場合に起こる
 */
Jeeel.Hash.getValues = function (hash) {

    if ( ! Jeeel.Type.isHash(hash)) {
        throw new Error('hashが配列・連想配列ではありません');
    }

    if (Jeeel.Type.isArray(hash) || Jeeel.Type.isArguments(hash)) {
        return Array.prototype.slice.call(hash, 0, hash.length);
    }

    var res = [];

    for (var key in hash) {
        res[res.length] = hash[key];
    }

    return res;
};
