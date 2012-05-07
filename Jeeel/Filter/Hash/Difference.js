
/**
 * コンストラクタ
 * 
 * @class 配列の差分を取得するフィルター
 * @param {Hash} baseHash 比較元のHash
 * @param {Boolean} [toValues] キーを無視して値だけのリストにするかどうか(trueの場合は配列が帰ってくるようになる)
 */
Jeeel.Filter.Hash.Difference = function (baseHash, toValues) {
    Jeeel.Filter.Abstract.call(this);
    
    this._baseHash = new Jeeel.Hash(baseHash);
    this._toValues = !!toValues;
};

/**
 * インスタンスの作成を行う
 * 
 * @param {Hash} baseHash 比較元のHash
 * @param {Boolean} [toValues] キーを無視して値だけのリストにするかどうか(trueの場合は配列が帰ってくるようになる)
 * @return {Jeeel.Filter.Hash.Difference} 作成したインスタンス
 */
Jeeel.Filter.Hash.Difference.create = function (baseHash, toValues) {
    return new this(baseHash, toValues);
};

Jeeel.Filter.Hash.Difference.prototype = {
  
    /**
     * @type Jeeel.Hash
     * @private
     */
    _baseHash: null,
    
    _toValues: false,
    
    /**
     * 対象のHashと比較を行い結果を返す
     * 
     * @param {Hash} targetHash 比較先のHash
     * @return {Object} 差分結果(baseに比較元にしか存在しない値、targetに比較先にしか存在しない値)
     */
    filter: function (targetHash) {
        return this._super.filter.call(this, targetHash);
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
    _filterEach: function (array) {
      
        array = new Jeeel.Hash(array);

        var res = this._toValues ? {base: [], target: []} : {base: {}, target: {}};
        
        this._baseHash.forEach(
            this._toValues ? function (val) {
                if (array.search(val, true) === null) {
                    res.base.push(val);
                }
            } : function (val, key) {
                if (array.search(val, true) === null) {
                    res.base[key] = val;
                }
            }
        );

        array.forEach(
            this._toValues ? function (val) {
                if (this._baseHash.search(val, true) === null) {
                    res.target.push(val);
                }
            } : function (val, key) {
                if (this._baseHash.search(val, true) === null) {
                    res.target[key] = val;
                }
            }, this
        );

        return res;
    }
};

Jeeel.Class.extend(Jeeel.Filter.Hash.Difference, Jeeel.Filter.Abstract);
