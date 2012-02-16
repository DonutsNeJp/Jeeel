
/**
 * コンストラクタ
 *
 * @class 指定した内部キーの値をリストの固有キーにする
 * @augments Jeeel.Filter.Abstract
 * @param {String} key キー
 */
Jeeel.Filter.Array.KeySpecify = function (key) {
  
    Jeeel.Filter.Abstract.call(this);

    this._key = key;
};

/**
 * インスタンスの作成
 *
 * @param {String} key キー
 * @return {Jeeel.Filter.Array.KeySpecify} 作成したインスタンス
 */
Jeeel.Filter.Array.KeySpecify.create = function (key) {
    return new this(key);
};

Jeeel.Filter.Array.KeySpecify.prototype = {
    
    /**
     * キー
     * 
     * @type String
     * @private
     */
    _key: null,
    
    /**
     * @private
     */
    _filter: function () {
        throw new Error('このフィルターは配列式が使えないオブジェクトには対応していません。');
    },

    /**
     * @private
     */
    _filterArray: function (array) {

        var res = {};

        Jeeel.Hash.forEach(array,
            function (row) {
                res[row[this._key]] = row;
            }, this
        );

        return res;
    }
};

Jeeel.Class.extend(Jeeel.Filter.Array.KeySpecify, Jeeel.Filter.Abstract);
