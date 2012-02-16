
/**
 * Hash形式のオブジェクトを配列に修正して返す
 *
 * @param {Hash} hash 配列・連想配列
 * @return {Array} 配列に修正したHashの値リスト(hashのキーが数字の部分を優先し、その後ろからキーが文字列のものを入れていく)
 * @throws {Error} hashが配列式でない場合に起こる
 */
Jeeel.Hash.toArray = function (hash) {
    if ( ! Jeeel.Type.isHash(hash)) {
        throw new Error('hashが配列・連想配列ではありません');
    }

    if (Jeeel.Type.isArray(hash)) {
        return Jeeel.Method.clone(hash);
    }
    else if (Jeeel.Type.isArguments(hash)) {
        return (hash.length === 1 ? [hash[0]] : Array.apply(null, hash));
    }
    else if (Jeeel.Type.isElementCollection(hash) || Jeeel.Type.isNodeList(hash)) {
        var arr = [];

        for (var i = 0, l = hash.length; i < l; i++) {
            arr[i] = hash[i];
        }

        return arr;
    }

    var key, num, nums = [];
    var res = [];
    var max = -1;
    
    for (key in hash) {
        num = +key;
        
        if (Jeeel.Type.isInteger(num)) {
            nums[nums.length] = num;
            
            res[num] = hash[num];
            
            if (max < num) {
                max = num;
            }
        }
    }

    for (key in hash) {
        if ( ! Jeeel.Type.isInteger(+key)) {
            res[++max] = hash[key];
        }
    }

    return res;
};
