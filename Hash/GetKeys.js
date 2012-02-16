/**
 * 指定したHashからキーのリストを取得する
 *
 * @param {Hash} hash 配列・連想配列(キーを保持する全てを許可する)
 * @param {Mixied} [value] キーの取得条件値
 * @param {Boolean} [strict] 厳密な検索を行うかどうか
 * @return {String[]} キーのリスト
 * @throws {Error} hashが配列式でない場合に起こる
 */
Jeeel.Hash.getKeys = function (hash, value, strict) {

    if (Jeeel.Type.isEmpty(hash)) {
        throw new Error('hashが配列・連想配列ではありません');
    }
    
    var valSet = Jeeel.Type.isSet(value);
    var res = [];

    if (Jeeel.Type.isArray(hash) || Jeeel.Type.isArguments(hash) || Jeeel.Type.isElementCollection(hash) || Jeeel.Type.isNodeList(hash)) {
        for (var i = 0, l = hash.length; i < l; i++) {
            
            if (valSet) {
                if (strict && value !== hash[i]) {
                    continue;
                } else if ( ! strict && value != hash[i]) {
                    continue;
                }
            }

            res[res.length] = '' + i;
        }
    } else {
        for (var key in hash) {

            if (valSet) {
                if (strict && value !== hash[key]) {
                    continue;
                } else if ( ! strict && value != hash[key]) {
                    continue;
                }
            }

            res[res.length] = key;
        }
    }

    return res;
};

