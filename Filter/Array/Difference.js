
/**
 * コンストラクタ
 * 
 * @class 配列の差分を取得するフィルター
 * @param {Hash} baseArray 比較元のHash
 */
Jeeel.Filter.Array.Difference = function (baseArray) {
    Jeeel.Filter.Abstract.call(this);
    
    this._baseArray = new Jeeel.Hash(baseArray);
};

/**
 * インスタンスの作成を行う
 * 
 * @param {Hash} baseArray 比較元のHash
 * @return {Jeeel.Filter.Array.Difference} 作成したインスタンス
 */
Jeeel.Filter.Array.Difference.create = function (baseArray) {
    return new this(baseArray);
};

Jeeel.Filter.Array.Difference.prototype = {
  
    /**
     * @type Jeeel.Hash
     * @private
     */
    _baseArray: null,
    
    /**
     * 対象のHashと比較を行い結果を返す
     * 
     * @param {Hash} targetArray 比較先のHash
     * @return {Object} 差分結果(baseに比較元にしか存在しない値、targetに比較先にしか存在しない値)
     */
    filter: function (targetArray) {
        return this._super.filter.call(this, targetArray);
    },
    
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
      
        array = new Jeeel.Hash(array);

        var res = {base: {}, target: {}};
        
        this._baseArray.forEach(
            function (val, key) {
                if (array.search(val, true) === null) {
                    res.base[key] = val;
                }
            }
        );

        array.forEach(
            function (val, key) {
                if (this._baseArray.search(val, true) === null) {
                    res.target[key] = val;
                }
            }, this
        );

        return res;
    }
};

Jeeel.Class.extend(Jeeel.Filter.Array.Difference, Jeeel.Filter.Abstract);
