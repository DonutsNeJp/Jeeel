
/**
 * コンストラクタ
 * 
 * @class 指定したキーのリストを作成する
 * @augments Jeeel.Filter.Abstract
 * @param {String} key リスト化したい値を保持するキー
 * @param {String} [hashKey] リスト化した際のキーに持たせたい値を保持するキー
 */
Jeeel.Filter.Hash.Reduce = function (key, hashKey) {
    Jeeel.Filter.Abstract.call(this);
   
   this._key = key;
   this._hashKey = hashKey;
};

/**
 * インスタンスの作成を行う
 *
 * @param {String} key リスト化したい値を保持するキー
 * @param {String} [hashKey] リスト化した際のキーに持たせたい値を保持するキー
 * @return {Jeeel.Filter.Hash.Reduce} 作成したインスタンス
 */
Jeeel.Filter.Hash.Reduce.create = function (key, hashKey) {
    return new this(key, hashKey);
};

Jeeel.Filter.Hash.Reduce.prototype = {
    
    /**
     * リスト化したい値を保持するキー
     * 
     * @type String
     * @private
     */
    _key: null,
    
    /**
     * リスト化した際のキーに持たせたい値を保持するキー
     * 
     * @type String
     * @private
     */
    _hashKey: null,
    
    /**
     * @private
     */
    _filter: function () {
        throw new Error('valは配列・連想配列でなければなりません。');
    },

    /**
     * @private
     */
    _filterArray: function (val) {
        var res = {};

        Jeeel.Hash.forEach(val,
            function (row, rowKey) {

                if ( ! (this._key in row)) {
                    throw new Error('valには' + this._key + '要素がありません。');
                }

                if (this._hashKey) {
                    if ( ! (this._hashKey in row)) {
                        throw new Error('valには' + this._hashKey + 'がありません。');
                    }

                    res[row[this._hashKey]] = row[this._key];
                    return;
                }

                res[rowKey] = row[this._key];
            }, this
        );

        return res;
    }
};

Jeeel.Class.extend(Jeeel.Filter.Hash.Reduce, Jeeel.Filter.Abstract);
