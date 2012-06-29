/**
 * コンストラクタ
 * 
 * @class 配列もしくは連想配列について複雑な処理をするクラス<br />
 *         そのままの連想配列やJeeel.Parameterよりも高速に連想配列にアクセス出来るが、初期化にかなりのロスを伴う
 * @param {Hash} [hash] 基となるHash
 * @example
 * 配列・連想配列に対して様々な処理を行うクラス
 * インスタンス化すると連想配列を配列の様に扱い高速アクセスや配列に備わっているメソッドを使用できるようにする
 * 
 * 例：
 * var hash = Jeeel.Hash.create({a: 55, b: 777});
 * hash.getValues(); // 値のリストを取得する、[55, 777]
 * hash.getKeys(); // キーのリストを取得する、['a', 'b']
 * hash.search(777); // 内部の値を検索してヒットしたらキーを返しヒットしなかったらnullを返す
 * 
 * 他にも以下のようなメソッドが良く使用される
 * 
 * Jeeel.Hash.merge({a: 55, b: 888}, {b: 66, c: 45}); // 2つ配列、連想配列を混合して新しく連想配列を生成する
 * Jeeel.Hash.forEach(function (val, key) {  // 配列・連想配列に対してその要素に順次アクセスを行う
 *     console.log(key + ': ' + val);
 * }, {a: 1, b: 2, c: 3});
 */
Jeeel.Hash = function (hash) {
    this._init(hash);
};

/**
 * インスタンスの作成を行う
 * 
 * @param {Hash} [hash] 基となるHash
 * @return {Jeeel.Hash} 作成したインスタンス
 */
Jeeel.Hash.create = function (hash) {
    return new this(hash);
};

/**
 * Jeeel.Hash.forEachを途中で終了するための定数
 *
 * @type Object
 * @constant
 */
Jeeel.Hash.FOR_EACH_EXIT = {
    exit: true
};

/**
 * 指定したキーが配列式型に存在するかどうかを返す
 *
 * @param {String|Integer} key 判定値
 * @param {Hash} hash 配列式型
 * @return {Boolean} 判定結果
 * @throws {TypeError} arrayが配列式でない場合に起こる
 */
Jeeel.Hash.keyExists = function (key, hash) {
    return key in hash;
};

/**
 * 指定した値が配列式型の中に存在するかどうかを返す
 *
 * @param {Mixied} val 判定値
 * @param {Hash} hash 配列式型
 * @param {Boolean} [strict] 厳密に型のチェックをするかどうか
 * @return {Boolean} 判定結果
 * @throws {Error} arrayが配列式でない場合に起こる
 */
Jeeel.Hash.inHash = function (val, hash, strict) {
    var check = false;

    Jeeel.Hash.forEach(hash,
        function (elm) {
            if (( ! strict && val == elm) || (strict && val === elm)) {
                check = true;
                return Jeeel.Hash.FOR_EACH_EXIT;
            }
        }
    );

    return check;
};

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

    if (Jeeel.Type.isArray(hash) || Jeeel.Type.isArguments(hash) || Jeeel.Type.isHtmlCollection(hash) || Jeeel.Type.isNodeList(hash)) {
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
    
    var res;

    if (Jeeel.Type.isArray(hash) || Jeeel.Type.isArguments(hash)) {
        return Array.prototype.slice.call(hash, 0, hash.length);
    } else if (Jeeel.Type.isHtmlCollection(hash) || Jeeel.Type.isNodeList(hash)) {
        res = [];
        
        for (var i = hash.length; i--;) {
            res[i] = hash[i];
        }
        
        return res;
    }

    res = [];

    for (var key in hash) {
        res[res.length] = hash[key];
    }

    return res;
};

/**
 * 指定したHashのキーと値のペアを全て返す<br />
 * 配列等に関しても全て返す
 *
 * @param {Hash} hash 配列・連想配列
 * @param {Boolean} [sort] ソートするかどうか
 * @param {Boolean} [enableChainKey] プロトタイプチェーンのキーを全て参照するかどうか(__proto__が定義されていないブラウザには意味がない)
 * @return {Jeeel.Object.Item[]} キーと値のリスト(valueはセキュリティ系のエラーの場合、値ではなくエラーオブジェクトを代入する)
 * @throws {Error} hashが配列式でない場合に起こる
 */
Jeeel.Hash.getPairs = function (hash, sort, enableChainKey) {
    
    if (Jeeel.Type.isEmpty(hash)) {
        throw new Error('hashが配列・連想配列ではありません');
    }

    var type = Jeeel.Type.getType(hash);
    var list = Jeeel.Type.getKeys(type);
    var ownConstructor = hash.constructor && (Object.prototype.hasOwnProperty && ! Object.prototype.hasOwnProperty.call(hash, 'constructor') || hash.constructor !== Object);
    var retryWhere = !!( ! enableChainKey && (hash.__proto__ || Object.getPrototypeOf || ownConstructor) && Object.prototype.hasOwnProperty);
    var pair = [], key;

    for (key in hash) {

        if (retryWhere && ! Object.prototype.hasOwnProperty.call(hash, key)) {
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
        key = list[i];
        
        if (key !== '__proto__' && retryWhere && ! Object.prototype.hasOwnProperty.call(hash, key)) {
            continue;
        }
        
        if ( ! (key in hash)) {
            continue;
        }
        
        try {
            pair[pair.length] = new Jeeel.Object.Item(key, hash[key]);
        } catch (e) {
            pair[pair.length] = new Jeeel.Object.Item(key, e);
        }
    }
    
    if (retryWhere &&  ! ('__proto__' in hash)) {
        if (Object.getPrototypeOf) {
            pair[pair.length] = new Jeeel.Object.Item('__proto__', Object.getPrototypeOf(hash));
        } else if (ownConstructor && Object.prototype.hasOwnProperty && ! Object.prototype.hasOwnProperty.call(hash, 'constructor')) {
            pair[pair.length] = new Jeeel.Object.Item('__proto__', hash.constructor.prototype);
        } else if (ownConstructor && hash.constructor !== Object) {
            pair[pair.length] = new Jeeel.Object.Item('__proto__', hash._super || Object.prototype);
        }
    }
    
    if (sort) {
        pair.sort(function (a, b) {
            if (a.key > b.key) {
                return 1;
            } else if (a.key < b.key) {
                return -1;
            }
            
            return 0;
        });
    }

    return pair;
};

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
    else if (Jeeel.Type.isHtmlCollection(hash) || Jeeel.Type.isNodeList(hash)) {
        var arr = [];

        for (var i = hash.length; i--;) {
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

Jeeel.Hash.prototype = {

    /**
     * 基のHash
     *
     * @type Hash
     */
    _hash: null,

    /**
     * Hashのキーリスト
     *
     * @type String[]
     */
    _keys: [],

    /**
     * Hashの値リスト
     *
     * @type Array
     */
    _vals: [],

    /**
     * Hashの値を全て数値に変更したリスト
     *
     * @type Number[]
     */
    _nums: null,

    /**
     * Hashの要素数
     *
     * @type Integer
     */
    _length: 0,
    
    /**
     * Hash内のキーの内最大の数値
     * 
     * @type Integer
     */
    _lastIndex: -1,
    
    /**
     * Hashの値を取得する
     * 
     * @param {String} key キー
     * @param {Mixied} [defaultValue] デフォルト値
     * @return {Mixied} 取得した値
     */
    get: function (key, defaultValue) {
        return (key in this._hash ? this._hash[key] : defaultValue);
    },
    
    /**
     * Hashに値を設定する
     * 
     * @param {String} key キー
     * @param {Mixed} val 保存する値
     * @return {Jeeel.Hash} 自インスタンス
     */
    set: function (key, val) {
        var c = ! (key in this._hash);
        
        this._hash[key] = val;
        
        if (c) {
            this._keys[this._length] = key;
            this._vals[this._length] = val;
            this._length++;
            
            this._nums = null;
            
            this._resetLastIndex(key, true);
        }

        return this;
    },
    
    /**
     * Hashの値を削除する
     * 
     * @param {String} key キー
     * @return {Jeeel.Hash} 自インスタンス
     */
    unset: function (key) {
        if (key in this._hash) {
            delete this._hash[key];
            var index, i;
            
            for (i = 0; i < this._length; i++) {
                if (this._keys[i] == key) {
                    index = i;
                    break;
                }
            }
            
            this._keys.splice(index, 1);
            this._vals.splice(index, 1);
            
            this._length--;
            
            this._nums = null;
            
            this._resetLastIndex(key);
        }

        return this;
    },
    
    /**
     * 指定したキーに対応するインデックスを取得する
     * 
     * @param {String} key キー
     * @return {Integer} インデックス
     */
    getIndex: function (key) {
        var index = -1;
        
        for (var i = 0; i < this._length; i++) {
            if (this._keys[i] == key) {
                index = i;
                break;
            }
        }
        
        return index;
    },
    
    /**
     * 指定したインデックスに対応するキーを取得する
     * 
     * @param {Integer} index インデックス
     * @return {String} キー
     */
    getKey: function (index) {
        return this._keys[index];
    },
    
    /**
     * 指定したインデックスに対応する値を取得する
     * 
     * @param {Integer} index インデックス
     * @return {Mixied} 取得した値
     */
    getValue: function (index) {
        return this._vals[index];
    },

    /**
     * Hashの要素数を返す
     *
     * @return {Integer} 要素数
     */
    getLength: function () {
        return this._length;
    },

    /**
     * 最初の値を取得する
     *
     * @return {Mixied} 取得した値
     */
    getFirst: function () {
        return this._vals[0];
    },

    /**
     * 最後の値を取得する
     *
     * @return {Mixied} 取得した値
     */
    getLast: function () {
        return this._vals[this._length - 1];
    },

    /**
     * 基のHashを返す
     *
     * @return {Hash} 基のHash
     */
    getHash: function () {
        return this._hash;
    },

    /**
     * Hashのキーのリストを作成して取得する
     *
     * @return {String[]} キーのリスト
     */
    getKeys: function () {
        return this._keys;
    },

    /**
     * Hashの値のリストを作成して取得する
     *
     * @return {Array} 値のリスト
     */
    getValues: function () {
        return this._vals;
    },
    
    /**
     * Hash内の値を全て数値と見立てて最大値を得る
     *
     * @return {Number} 最大値
     */
    getMax: function () {
        return Math.max.apply(null, this._getNums());
    },

    /**
     * Hash内の値を全て数値と見立てて最小値を得る
     *
     * @return {Number} 最小値
     */
    getMin: function () {
        return Math.min.apply(null, this._getNums());
    },

    /**
     * Hash内の値を全て数値と見立てて合計値を得る
     *
     * @return {Number} 合計値
     */
    getSum: function () {
        var nums = this._getNums();
        var sum  = 0;

        for (var i = nums.length; i--;) {
            sum += nums[i];
        }

        return sum;
    },

    /**
     * Hash内の値を全て数値と見立てて平均値を得る
     *
     * @return {Number} 平均値
     */
    getAvg: function () {
        return this.getSum() / this._length;
    },

    /**
     * 指定された関数を実行し、それらに合格した要素からなる新しいインスタンスを作成する
     *
     * @param {Function} callback Boolean callback(Mixied val, String key, Hash hash)
     * @param {Mixied} [thisArg] callback内でthisに相当する値
     * @return {Jeeel.Hash} 作成したインスタンス
     */
    filter: function (callback, thisArg) {
        var res = {};
        
        if ( ! Jeeel.Type.isSet(thisArg)) {
            thisArg = this;
        }

        for (var i = 0; i < this._length; i++) {
            if (callback.call(thisArg, this._vals[i], this._keys[i], this._hash)) {
                res[this._keys[i]] = this._vals[i];
            }
        }

        return this.constructor.create(res);
    },

    /**
     * 指定された関数を実行し、それらの戻り値から新しいインスタンスを作成する
     *
     * @param {Function} callback Mixied callback(Mixied val, String key, Hash hash)
     * @param {Mixied} [thisArg] callback内でthisに相当する値
     * @return {Jeeel.Hash} 作成したインスタンス
     */
    map: function (callback, thisArg) {
        var res = {};
        
        if ( ! Jeeel.Type.isSet(thisArg)) {
            thisArg = this;
        }

        for (var i = 0; i < this._length; i++) {
            res[this._keys[i]] = callback.call(thisArg, this._vals[i], this._keys[i], this._hash);
        }

        return this.constructor.create(res);
    },

    /**
     * 前の戻り値とHashの値を先頭から1つ引数に取り、<br />
     * 最終的にひとつの値を結果として得る<br />
     * 始めの時の戻り値には初期値もしくは先頭の値が来る(先頭の値の場合は引数に二番目の値が来る)
     * 
     * @param {Function} callback Mixied callback(Mixied tmp, Mixied val, String key, Hash hash)
     * @param {Mixied} [initVal] 初期値(指定しない場合は最初の値を使う)
     * @return {Mixied} 戻り値
     */
    reduce: function (callback, initVal) {
        if ( ! Jeeel.Type.isSet(initVal) && this._length <= 0) {
            throw new Error('空のHashに対して初期値未指定でReduceメソッドは使えません。');
        }

        var val;
        var min = 0;

        if (Jeeel.Type.isSet(initVal)) {
            val = initVal;
        } else {
            val = this._vals[0];
            min++;
        }

        for (var i = min; i < this._length; i++) {
            val = callback(val, this._vals[i], this._keys[i], this._hash);
        }

        return val;
    },

    /**
     * 前の戻り値とHashの値を後尾から1つ引数に取り、<br />
     * 最終的にひとつの値を結果として得る<br />
     * 始めの時の戻り値には初期値もしくは先頭の値が来る(先頭の値の場合は引数に二番目の値が来る)
     *
     * @param {Function} callback Mixied reduce(Mixied tmp, Mixied val, String key, Hash hash)
     * @param {Mixied} [initVal] 初期値(指定しない場合は最初の値を使う)
     * @return {Mixied} 戻り値
     */
    reduceRight: function (callback, initVal) {
        if ( ! Jeeel.Type.isSet(initVal) && this._length <= 0) {
            throw new Error('空のHashに対して初期値未指定でReduceRightメソッドは使えません。');
        }

        var val;
        var max = this._length - 1;

        if (Jeeel.Type.isSet(initVal)) {
            val = initVal;
        } else {
            val = this._vals[max];
            max--;
        }

        for (var i = max; i >= 0; i--) {
            val = callback(val, this._vals[i], this._keys[i], this._hash);
        }

        return val;
    },

    /**
     * 指定された関数を実行し、全ての要素がそれを合格するかどうかを返す
     *
     * @param {Function} callback Boolean callback(Mixied val, String key, Hash hash)
     * @param {Mixied} [thisArg] callback内でthisに相当する値
     * @return {Boolean} 全ての要素が合格したかどうか
     */
    every: function (callback, thisArg) {
        if ( ! Jeeel.Type.isSet(thisArg)) {
            thisArg = this;
        }
        
        for (var i = 0; i < this._length; i++) {
            if ( ! callback.call(thisArg, this._vals[i], this._keys[i], this._hash)) {
                return false;
            }
        }

        return true;
    },

    /**
     * 指定された関数を実行し、それに合格する要素があるかどうかを返す
     *
     * @param {Function} callback Boolean callback(Mixied val, String key, Hash hash)
     * @param {Mixied} [thisArg] callback内でthisに相当する値
     * @return {Boolean} 合格する要素があるかどうか
     */
    some: function (callback, thisArg) {
        if ( ! Jeeel.Type.isSet(thisArg)) {
            thisArg = this;
        }
        
        for (var i = 0; i < this._length; i++) {
            if (callback.call(thisArg, this._vals[i], this._keys[i], this._hash)) {
                return true;
            }
        }

        return false;
    },

    /**
     * 指定された関数を各要素に一度ずつ実行する
     *
     * @param {Function} callback void callback(Mixied val, String key, Hash hash)
     * @param {Mixied} [thisArg] callback内でthisに相当する値
     * @return {Jeeel.Hash} 自インスタンス
     */
    forEach: function (callback, thisArg) {
        if ( ! Jeeel.Type.isSet(thisArg)) {
            thisArg = this;
        }
        
        for (var i = 0; i < this._length; i++) {
            callback.call(thisArg, this._vals[i], this._keys[i], this._hash);
        }

        return this;
    },
    
    /**
     * Hash内の要素が配列もしくはJeeel.Hashインスタンスだった場合は押しつぶして、1次元に変換して新しいインスタンスとして作成する<br />
     * その際キーは失われる
     *
     * @return {Jeeel.Hash} 作成したインスタンス
     */
    flatten: function () {
        var res = [];
        
        var _flatten = function (arr) {
            for (var i = 0, l = arr.length; i < l; i++) {
                
                if (Jeeel.Type.isArray(arr[i])) {
                    _flatten(arr[i]);
                    continue;
                } else if (arr[i] instanceof this.constructor) {
                    _flatten(arr[i].getValues());
                    continue;
                }
                
                res[res.length] = arr[i];
            }
        };
        
        _flatten(this._vals);
        
        return new this.constructor(res);
    },
    
    /**
     * 指定したキー同士の値を交換する
     * 
     * @param {String} keyLeft キー1
     * @param {String} keyRight キー2
     * @return {Jeeel.Hash} 自インスタンス
     */
    swap: function (keyLeft, keyRight) {
        var left, right, both = 0;
        
        for (var i = 0; i < this._length; i++) {
            if (this._keys[i] == keyLeft) {
                left  = i;
                both++;
            } else if (this._keys[i] == keyRight) {
                right = i;
                both++;
            }
            
            if (both === 2) {
                break;
            }
        }
        
        return this.swapValue(left, right);
    },

    /**
     * 指定したインデックス同士の値を交換する
     * 
     * @param {Integer} left インデックス1
     * @param {Integer} right インデックス2
     * @return {Jeeel.Hash} 自インスタンス
     */
    swapValue: function (left, right) {
        if ( ! (0 <= left && left < this._length)) {
            return this;
        }
        else if ( ! (0 <= right && right < this._length)) {
            return this;
        }
        else if (left === right) {
            return this;
        }
        
        var key = this._keys[left];
        var val = this._vals[left];

        this._keys[left] = this._keys[right];
        this._vals[left] = this._vals[right];

        this._keys[right] = key;
        this._vals[right] = val;

        return this;
    },
    
    /**
     * Hash内から最後の要素を取り除き、<br />
     * その値を返す
     *
     * @return {Mixied} 取りだした値
     */
    pop: function () {
        if ( ! this._length) {
            return undefined;
        }
        
        this._length--;

        var key = this._keys.pop();
        var val = this._vals.pop();

        delete this._hash[key];

        this._nums = null;
        
        this._resetLastIndex(key);

        return val;
    },

    /**
     * 引数で受け取った値をHashの最後に挿入する
     *
     * @param {Mixied} var_args 挿入値の可変引数
     * @return {Integer} 挿入後の要素数
     */
    push: function (var_args) {
        var len = arguments.length;
        
        if ( ! len) {
            return this._length;
        }
        
        var max = this._lastIndex + 1;

        for (var i = 0; i < len; i++) {
            this._hash[max] = arguments[i];
            this._vals[this._length] = arguments[i];
            this._keys[this._length] = '' + max;

            max++;
            this._length++;
        }

        this._nums = null;
        this._lastIndex = max - 1;

        return this._length;
    },

    /**
     * Hash内の先頭の要素を取り除き、<br />
     * その値を返す
     *
     * @return {Mixied} 取りだした値
     */
    shift: function () {
        if ( ! this._length) {
            return undefined;
        }
        
        this._length--;

        var key = this._keys.shift();
        var val = this._vals.shift();

        delete this._hash[key];

        this._nums = null;
        
        this._resetLastIndex(key);

        return val;
    },

    /**
     * 引数で受け取った値をHashの先頭に挿入する
     *
     * @param {Mixied} var_args 挿入値の可変引数
     * @return {Integer} 挿入後の要素数
     */
    unshift: function (var_args) {
        var len = arguments.length;
        
        if ( ! len) {
            return this._length;
        }
        
        var li, i, keys = [], vals = [], repKeys = {};
        
        if (this._lastIndex >= 0) {
            for (i = this._lastIndex; i >= 0; i--) {
                if (i in this._hash) {
                    this._hash[i + len] = this._hash[i];
                    
                    repKeys[i] = '' + (i + len);
                    
                    if ( ! li) {
                        li = i + len;
                    }
                }
            }
        } else {
            li = len - 1;
        }
        
        for (i = 0; i < len; i++) {
            this._hash[i] = arguments[i];
            vals[i] = arguments[i];
            keys[i] = '' + i;
        }

        for (i = 0; i < this._length; i++) {
            vals[len + i] = this._vals[i];
            keys[len + i] = repKeys[this._keys[i]] || this._keys[i];
        }
        
        this._keys = keys;
        this._vals = vals;

        this._nums = null;
        
        if (li) {
            this._lastIndex = li;
        }

        return this._length += len;
    },
    
    /**
     * Hashの一部を取り出して新たにインスタンスを作成する
     * 
     * @param {Integer} [start] どこから取り出すかを示すインデックス<br />
     *                           負の数を指定した場合Hashの終わりからのオフセットを示す<br />
     *                           省略時は0
     * @param {Integer} [end] どこまで取りだすかを示すインデックス(この数値は含まない)<br />
     *                         負の数を指定した場合Hashの終わりからのオフセットを示す<br />
     *                         省略時はHashの最後まで
     * @return {Jeeel.Hash} 作成したインスタンス
     */
    slice: function (start, end) {
        if ( ! Jeeel.Type.isInteger(start)) {
            start = 0;
        } else if (start < 0) {
            start = start + this._length;
            
            if (start < 0) {
                start = 0;
            }
        }
        
        if ( ! Jeeel.Type.isSet(end) || end > this._length) {
            end = this._length;
        } else if (end < 0) {
            end = end + this._length + 1;
        }
        
        return this._copy(start, end - 1);
    },

    /**
     * Hash内の古い要素を取り除き、代わりに新しい要素を挿入する
     * 
     * @param {Integer} index 配列を変化させ始めるインデックス
     * @param {Integer} [count] 配列から取り除く要素の数(省略はindex以降全ての要素)
     * @param {Mixied} var_args 追加要素の可変引数
     * @return {Array} 古い要素の配列
     */
    splice: function (index, count, var_args) {
        if ( ! Jeeel.Type.isInteger(index)) {
            return [];
        }
        
        if ( ! Jeeel.Type.isInteger(count)) {
            count = this._length;
        }
        
        var i, idx, ai = 2, li = -1;
        var len = index + count;
        var res = [], keys = [], vals = [];
        
        for (i = 0; i < index; i++) {
            keys[i] = this._keys[i];
            vals[i] = this._vals[i];
            
            idx = +keys[i];
            
            if (Jeeel.Type.isInteger(idx) && li < idx) {
                li = idx;
            }
        }
        
        for (i = index; i < len; i++) {
            res[res.length] = this._vals[i];
            
            if (ai in arguments) {
                keys[i] = this._keys[i];
                vals[i] = arguments[ai];
                
                idx = +keys[i];

                if (Jeeel.Type.isInteger(idx) && li < idx) {
                    li = idx;
                }
                
                this._hash[keys[i]] = vals[i];
                
                ai++;
            } else {
                delete this._hash[this._keys[i]];
            }
        }
        
        for (i = len; i < this._length; i++) {
            keys[keys.length] = this._keys[i];
            vals[vals.length] = this._vals[i];
            
            idx = +keys[i];
            
            if (Jeeel.Type.isInteger(idx) && li < idx) {
                li = idx;
            }
        }
        
        this._keys = keys;
        this._vals = vals;
        
        this._length = this._vals.length;
        
        this._nums = null;
        
        this._lastIndex = li;
        
        return res;
    },

    /**
     * 配列をソートする<br />
     * ソートアルゴリズムはクイックソート
     * 
     * @param {Function} [compareFunction] 比較関数(大きい数値の場合はaを優先、小さい数値の場合はbを優先、0は同値とする)<br />
     *                                      Integer compareFunction(Mixied a, Mixied b)
     * @return {Jeeel.Hash} 自インスタンス
     */
    sort: function (compareFunction) {
        if ( ! compareFunction ) {
          
            /**
             * @ignore
             */
            compareFunction = function (a, b) {
                a = '' + a;
                b = '' + b;
                
                return a > b ? 1 : (a < b ? -1 : 0);
            };
        }
        
        /**
         * @ignore
         */
        var middle = function (h, t) {
            return h + ((t - h) >>> 1);
        };

        var stack = [0, this._length - 1];
        
        while(stack.length) {
            var tail = stack.pop();
            var head = stack.pop();
            var pivot = this._vals[middle(head, tail)];
            var i = head - 1;
            var j = tail + 1;
            
            while (1) {
                while (i < tail && compareFunction(this._vals[++i], pivot) < 0);
                while (j > head && compareFunction(this._vals[--j], pivot) > 0);
                
                if (i >= j) break;
                
                this.swapValue(i, j);
            }
            
            if (head < i - 1) {stack.push(head);stack.push(i - 1);}
            if (j + 1 < tail) {stack.push(j + 1);stack.push(tail);}
        }
        
        return this;
    },

    /**
     * Hash内の要素をシャッフルする
     *
     * @return {Jeeel.Hash} 自インスタンス
     */
    shuffle: function () {
        var i = this._length;

        while(i) {
            var j = Math.floor(Math.random() * i);

            i--;

            if (i == j) {
                continue;
            }

            this.swapValue(i, j);
        }
        
        this._nums = null;

        return this;
    },

    /**
     * Hash内の並びを逆転させる
     *
     * @return {Jeeel.Hash} 自インスタンス
     */
    reverse: function () {

        this._keys.reverse();
        this._vals.reverse();
        this._nums = null;

        return this;
    },

    /**
     * Hashに他のインスタンス・配列や値を結合し新しいインスタンスとして返す<br />
     * その際キーは失われる
     * 
     * @param {Mixied} var_args 接続値の可変引数
     * @return {Jeeel.Hash} 作成したインスタンス
     */
    concat: function (var_args) {
        var i, j, res = [];

        for (i = 0; i < this._length; i++) {
            res[i] = this._vals[i];
        }

        var len = arguments.length;
        var idx = this._length;
        var arg;
        
        for (i = 0; i < len; i++) {
            arg = arguments[i];
            
            if (arg instanceof this.constructor) {
                for (j = 0; j < arg._length; j++) {
                    res[idx++] = arg._vals[j];
                }
            }
            else if (Jeeel.Type.isArray(arg)) {
                for (j = 0; j < arg.length; j++) {
                    res[idx++] = arg[j];
                }
            } 
            else {
                res[idx++] = arg;
            }
        }

        return new this.constructor(res);
    },

    /**
     * Hash内の要素を全て繋げて文字列にする
     *
     * @param {String} [separator] 連結時の区切り文字列
     * @return {String} 連結文字列
     */
    join: function (separator) {
        if ( ! Jeeel.Type.isSet(separator)) {
            separator = ',';
        }

        return this._vals.join(separator);
    },
    
    /**
     * 指定した値をHash内で検索し、見つかった場合は対応するキーを返す
     *
     * @param {Mixied} searchValue 検索する値
     * @param {Boolean} [strict] 厳密な検索を行うかどうか
     * @return {String} 見つかった値に対応するキー(見つからなかった場合はnull)
     */
    search: function (searchValue, strict) {
        var len = this._length;
        
        for (var from = 0; from < len; from++) {
            if (strict && this._vals[from] === searchValue) {
                return this._keys[from];
            } else if ( ! strict && this._vals[from] == searchValue) {
                return this._keys[from];
            }
        }

        return null;
    },

    /**
     * 指定した値をHash内で検索し、見つかった場合は対応するインデックスを返す
     *
     * @param {Mixied} searchValue 検索する値
     * @param {Integer} [fromIndex] 検索を始める初期インデックス
     * @return {Integer} 見つかった値に対応するインデックス(見つからなかった場合は-1)
     */
    indexOf: function (searchValue, fromIndex) {
        var len = this._length;

        var from = Number(fromIndex) || 0;

        from = (from < 0 ? Math.ceil(from) : Math.floor(from));

        if (from < 0) {
            from += len;
        }

        for (; from < len; from++) {
            if (from in this._vals && this._vals[from] === searchValue) {
                return from;
            }
        }

        return -1;
    },
    
    /**
     * 指定した値をHash内で後ろから検索し、見つかった場合は対応するインデックスを返す
     *
     * @param {Mixied} searchValue 検索する値
     * @param {Integer} [fromIndex] 検索を始める初期インデックス
     * @return {Integer} 見つかった値に対応するインデックス(見つからなかった場合は-1)
     */
    lastIndexOf: function (searchValue, fromIndex) {
        var len = this.length;

        var from = Number(fromIndex);
        
        if (isNaN(from)) {
            from = len - 1;
        }
        else {
            from = (from < 0 ? Math.ceil(from) : Math.floor(from));

            if (from < 0) {
                from += len;
            }
            else if (from >= len) {
                from = len - 1;
            }
        }

        for (; from > -1; from--) {
            if (from in this._vals && this._vals[from] === searchValue) {
                return from;
            }
        }
        
        return -1;
    },

    /**
     * HashをGetパラメータ文字列に変換する(先頭に?はつかない)
     *
     * @return {String} Getパラメータ文字列
     */
    toQueryString: function () {
        return Jeeel.Filter.Url.QueryString.create().filter(this._hash);
    },
    
    /**
     * コンストラクタ
     * 
     * @param {Hash} [hash] 基となるHash
     * @constructor
     */
    constructor: Jeeel.Hash,
    
    /**
     * 初期化を行う
     * 
     * @param {Hash} [hash] 基となるHash
     */
    _init: function (hash) {
        if ( ! Jeeel.Type.isHash(hash)) {
            hash = {};
        } else if (hash instanceof this.constructor) {
            hash = hash.getHash();
        } else if (hash instanceof Jeeel.Parameter) {
            hash = hash.getAll();
        }
        
        var keys = [], vals = [];
        
        if ('length' in hash && (Jeeel.Type.isArray(hash) || Jeeel.Type.isArguments(hash) || Jeeel.Type.isHtmlCollection(hash) || Jeeel.Type.isNodeList(hash))) {
            for (var i = 0, l = hash.length; i < l; i++) {
                keys[i] = '' + i;
                vals[i] = hash[i];
            }
            
            this._lastIndex = l - 1;
        } else {
            var max = -1;
            
            for (var key in hash) {
                keys[keys.length] = key;
                vals[vals.length] = hash[key];
                
                key = +key;
                
                if (Jeeel.Type.isInteger(key) && max < key) {
                    max = key;
                }
            }
            
            this._lastIndex = max;
        }

        this._hash = hash;
        this._keys = keys;
        this._vals = vals;
        this._length = vals.length;
    },
    
    _copy: function (from, to) {
        var res = new this.constructor();
        var max = -1;
        
        for (var i = from; i <= to; i++) {
            var key = this._keys[i];
            
            res._keys[res._keys.length] = key;
            res._vals[res._vals.length] = this._vals[i];
            res._hash[key] = this._vals[i];
            
            key = +key;

            if (Jeeel.Type.isInteger(key) && max < key) {
                max = key;
            }
        }
        
        res._lastIndex = max;
        res._length = res._keys.length;
        
        return res;
    },
    
    /**
     * 
     */
    _resetLastIndex: function (key, set) {
        
        if ( ! Jeeel.Type.isSet(key)) {
            key = -1;
            
            for (var i = 0; i < this._length; i++) {
                var tmp = +this._keys[i];
                
                if (Jeeel.Type.isInteger(tmp) && key < tmp) {
                    key = tmp;
                }
            }
            
            this._lastIndex = key;
            
            return;
        }
        
        key = +key;

        if (set && this._lastIndex < key) {
            this._lastIndex = key;
        } else if (this._lastIndex == key) {
            for (var i = key; i >= 0; i--) {
                if (i in this._hash) {
                    this._lastIndex = i;
                    return;
                }
            }

            this._lastIndex = -1;
        }
    },

    /**
     * Hash内の物を全て数値だと仮定してキャストして取得する
     * 
     * @return {Number[]} 数値配列
     */
    _getNums: function () {
        if (this._nums) {
            return this._nums;
        }

        var nums = [];

        for (var i = 0; i < this._length; i++) {
            nums[i] = +this._vals[i];
        }
        
        this._nums = nums;

        return nums;
    }
};
