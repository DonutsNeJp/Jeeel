
/**
 * 配列・連想配列に対して各要素にアクセスするメソッド<br />
 * 配列の場合は初期化していない要素にはアクセスしない
 * 
 * @param {Hash} hash 配列・連想配列
 * @param {Function} callback void callBack(Mixied value, String key, Hash hash)<br />
 *                             引数は左から要素,キー,配列となる(戻り値に指定定数を返すとbreakする)
 * @param {Mixied} [thisArg] コールバックメソッド中のthisに変わるオブジェクト(初期値はhashになる)
 * @throws {Error} hashが配列式でない場合に起こる
 * @see Jeeel.Hash.FOR_EACH_EXIT
 */
Jeeel.Hash.forEach = function (hash, callback, thisArg) {
    if ( ! Jeeel.Type.isHash(hash)) {
        throw new Error('hashが配列・連想配列ではありません');
    }
    
    if ( ! Jeeel.Type.isSet(thisArg)) {
        thisArg = hash;
    }

    var tmp, length;
    var exit = Jeeel.Hash.FOR_EACH_EXIT;

    if (Jeeel.Type.hasLength(hash)) {
        length = hash.length;

        for (var i = 0; i < length; i++) {

            if (i in hash) {

                tmp = callback.call(thisArg, hash[i], i, hash);

                if (tmp === exit) {
                    break;
                }
            }
        }
    } else {
        for (var key in hash) {
            
            tmp = callback.call(thisArg, hash[key], key, hash);

            if (tmp === exit) {
                break;
            }
        }
    }
};
