/**
 * 指定したHashのキーと値のペアを全て返す<br />
 * 配列等に関しても全て返す
 *
 * @param {Hash} hash 配列・連想配列
 * @param {Boolean} [enableChainKey] プロトタイプチェーンのキーを全て参照するかどうか(__proto__が定義されていないブラウザには意味がない)
 * @return {Jeeel.Object.Item[]} キーと値のリスト(valueはセキュリティ系のエラーの場合、値ではなくエラーオブジェクトを代入する)
 * @throws {Error} hashが配列式でない場合に起こる
 */
Jeeel.Hash.getPairs = function (hash, enableChainKey) {
    
    if (Jeeel.Type.isEmpty(hash)) {
        throw new Error('hashが配列・連想配列ではありません');
    }

    var type = Jeeel.Type.getType(hash);
    var list = Jeeel.Type.getKeys(type);

    var pair = [];

    for (var key in hash) {

        if ( ! enableChainKey && (hash.__proto__ || Object.getPrototypeOf) && hash.hasOwnProperty && ! hash.hasOwnProperty(key)) {
            continue;
        }

        var val;

        try {
            val = hash[key];
        } catch (e) {
            val = e;
        }

        pair[pair.length] = new Jeeel.Object.Item(key, val);

        var searchKey = Jeeel.Hash.search(key, list, true);

        if ( ! Jeeel.Type.isEmpty(searchKey)) {
            list.splice(searchKey, 1);
        }
    }
    
    for (var i = 0, l = list.length; i < l; i++) {
        if (list[i] !== '__proto__' && ! enableChainKey && (hash.__proto__ || Object.getPrototypeOf) && hash.hasOwnProperty && ! hash.hasOwnProperty(list[i])) {
            continue;
        }
        
        if ( ! (list[i] in hash)) {
            continue;
        }
        
        try {
            pair[pair.length] = new Jeeel.Object.Item(list[i], hash[list[i]]);
        } catch (e) {
            pair[pair.length] = new Jeeel.Object.Item(list[i], e);
        }
    }
    
    if ( ! ('__proto__' in hash) && Object.getPrototypeOf) {
        pair[pair.length] = new Jeeel.Object.Item('__proto__', Object.getPrototypeOf(hash));
    }

    return pair;
};

