
/**
 * 指定した値をHash内で検索し、見つかった場合は対応するキーを返す
 *
 * @param {Mixied} value 検索する値
 * @param {Hash} hash 配列・連想配列
 * @param {Boolean} [strict] 厳密な検索を行うかどうか
 * @return {String} 見つかった値の対応するキー(見つからなかった場合はnull)
 * @throws {Error} hashが配列式でない場合に起こる
 */
Jeeel.Hash.search = function (value, hash, strict) {
    if ( ! Jeeel.Type.isHash(hash)) {
        throw new Error('hashが配列・連想配列ではありません');
    }
    
    var _key = null;

    Jeeel.Hash.forEach(hash,
        function (val, key) {
            if (strict && value === val) {
                _key = key;
                return Jeeel.Hash.FOR_EACH_EXIT;
            } else if ( ! strict && value == val) {
                _key = key;
                return Jeeel.Hash.FOR_EACH_EXIT;
            }
        }
    );

    return _key;
};
