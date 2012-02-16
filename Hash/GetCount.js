/**
 * 指定したHashから配列の長さを返す
 *
 * @param {Hash} hash 配列・連想配列
 * @return {Integer} キーの数
 * @throws {Error} hashが配列式でない場合に起こる
 */
Jeeel.Hash.getCount = function (hash) {
    if ( ! Jeeel.Type.isHash(hash)) {
        throw new Error('hashが配列・連想配列ではありません');
    }

    if (Jeeel.Type.hasLength(hash)) {
        return hash.length;
    }

    var count = 0;

    for (var key in hash) {
        count++;
    }

    return count;
};
