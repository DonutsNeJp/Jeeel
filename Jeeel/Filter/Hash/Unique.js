
/**
 * コンストラクタ
 *
 * @class 配列の重複する内部値を削除する
 * @augments Jeeel.Filter.Abstract
 * @param {Boolean} [strict] 厳密な型チェックを行うかどうか
 * @param {Boolean} [toValues] キーを無視して値だけのリストにするかどうか(trueの場合は必ず配列が帰ってくるようになる)
 */
Jeeel.Filter.Hash.Unique = function (strict, toValues) {

    Jeeel.Filter.Abstract.call(this);
    
    this._strict = !!strict;
    this._toValues = !!toValues;
};

/**
 * インスタンスの作成
 *
 * @param {Boolean} [strict] 厳密な型チェックを行うかどうか
 * @param {Boolean} [toValues] キーを無視して値だけのリストにするかどうか(trueの場合は必ず配列が帰ってくるようになる)
 * @return {Jeeel.Filter.Hash.Unique} 作成したインスタンス
 */
Jeeel.Filter.Hash.Unique.create = function (strict, toValues) {
    return new this(strict, toValues);
};

Jeeel.Filter.Hash.Unique.prototype = {
    
    /**
     * 厳密な型チェックを行うかどうか
     * 
     * @type Boolean
     * @private
     */
    _strict: false,
    
    /**
     * キーを無視して値だけのリストにするかどうか
     * 
     * @type Boolean
     * @private
     */
    _toValues: false,
    
    /**
     * @private
     */
    _filter: function () {
        throw new Error('このフィルターは配列式が使えないオブジェクトには対応していません。');
    },

    /**
     * @private
     */
    _filterEach: function (array) {
      
        array = Jeeel.Hash.create(array);

        var res = Jeeel.Hash.create();

        array.forEach(
            function (val, key) {
                if (res.search(val, this._strict) === null) {
                    res.set(key, val);
                }
            }, this
        );

        return (this._toValues ? res.getValues() : res.getHash());
    }
};

Jeeel.Class.extend(Jeeel.Filter.Hash.Unique, Jeeel.Filter.Abstract);
