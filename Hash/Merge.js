
/**
 * 配列・連想配列をマージする
 *
 * @param {Hash} hash1 配列・連想配列
 * @param {Hash} hash2 配列・連想配列
 * @return {Hash} mergeした後の連想配列
 * @throws {Error} hashが配列式でない場合に起こる
 */
Jeeel.Hash.merge = function (hash1, hash2) {
    if ( ! Jeeel.Type.isHash(hash1) || ! Jeeel.Type.isHash(hash2)) {
        throw new Error('hash1・hash2が配列・連想配列ではありません');
    }

    var res = {};

    var digit, count = 0;

    Jeeel.Hash.forEach(hash1,
        function (val, key) {

            digit = +key;

            if (Jeeel.Type.isInteger(digit) && digit > count) {
                count = digit;
            }

            res[key] = val;
        }
    );

    Jeeel.Hash.forEach(hash2,
        function (val, key) {

            if (Jeeel.Type.isInteger(+key)) {
                res[++count] = val;
            } else {
                res[key] = val;
            }
        }
    );
   
    return res;
};
