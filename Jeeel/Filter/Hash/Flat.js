
/**
 * コンストラクタ
 *
 * @class 配列の階層を減らすフィルター
 * @augments Jeeel.Filter.Abstract
 * @param {Integer} from 階層を減らす階層の深さの始め
 * @param {Integer} length 階層を減らす回数
 * @throws {Error} fromが整数でない場合に起こる
 * @throws {Error} lengthが整数でない場合に起こる
 */
Jeeel.Filter.Hash.Flat = function (from, length) {

    Jeeel.Filter.Abstract.call(this);
    
    if ( ! Jeeel.Type.isInteger(from)) {
        throw new Error('fromは整数でなければなりません。');
    }

    if ( ! Jeeel.Type.isInteger(length)) {
        throw new Error('lengthは整数でなければなりません。');
    }

    this._from = from;
    this._length = length;
};

/**
 * インスタンスの作成
 *
 * @param {Integer} from 階層を減らす階層の深さの始め
 * @param {Integer} length 階層を減らす回数
 * @return {Jeeel.Filter.Hash.Flat} 作成したインスタンス
 */
Jeeel.Filter.Hash.Flat.create = function (from, length) {
    return new this(from, length);
};

Jeeel.Filter.Hash.Flat.prototype = {
    
    /**
     * 階層を減らす階層の深さの始め
     * 
     * @type Integer
     * @private
     */
    _from: 0,
    
    /**
     * 階層を減らす回数
     * 
     * @type Integer
     * @private
     */
    _length: 0,
    
    /**
     * @private
     */
    _filter: function () {
        throw new Error('このフィルターは配列式が使えないオブジェクトには対応していません。');
    },

    /**
     * @private
     */
    _filterEach: function (rows) {
        var result = this._arrayWhile(0, rows);

        return result;
    },
    
    /**
     * @private
     */
    _push: function (hash, value) {
        var cnt = 0;

        while (true) {
            if ( ! (cnt in hash)) {
                hash[cnt] = value;
                break;
            }

            cnt++;
        }
    },

    /**
     * @private
     */
    _arrayWhile: function (count, array) {

        if ( ! Jeeel.Type.isHash(array) || this._length === (count - this._from)) {
            return array;
        }

        if (count >= this._from) {
            var res = {};

            Jeeel.Hash.forEach(array,
                function (val) {
                    if (Jeeel.Type.isHash(val)) {
                        res = Jeeel.Hash.merge(res, this._arrayWhile(count + 1, val));
                    } else {
                        this._push(res, val);
                    }
                }, this
            );

            array = res;
        } else {
            Jeeel.Hash.forEach(array,
                function (val, key) {
                    if (Jeeel.Type.isHash(val)) {
                        array[key] = this._arrayWhile(count + 1, val);
                    }
                }, this
            );
        }

        return array;
    }
};

Jeeel.Class.extend(Jeeel.Filter.Hash.Flat, Jeeel.Filter.Abstract);
