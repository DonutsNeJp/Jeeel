
/**
 * コンストラクタ
 * 
 * @class フィルターを配列の各要素にそれぞれ掛けるためのフィルター
 * @augments Jeeel.Filter.Abstract
 * @param {Jeeel.Filter.Abstract} innerFilter 内部フィルター
 * @param {String[]} [keys] 操作許可キーリスト(初期値は全て)
 */
Jeeel.Filter.Each = function (innerFilter, keys) {
  
    Jeeel.Filter.Abstract.call(this);
    
    if (keys && ! Jeeel.Type.isArray(keys)) {
        keys = [keys];
    }
    
    this._innerFilter = innerFilter;
    this._keys = keys || null;
};

/**
 * インスタンスを作成して返す
 *
 * @param {Jeeel.Filter.Abstract} innerFilter 内部フィルター
 * @param {String[]} [keys] 操作許可キーリスト(初期値は全て)
 * @return {Jeeel.Filter.Each} 作成したインスタンス
 */
Jeeel.Filter.Each.create = function (innerFilter, keys) {
    return new this(innerFilter, keys);
};

Jeeel.Filter.Each.prototype = {
  
    /**
     * 操作対象キーリスト
     * 
     * @type String[]
     * @private
     */
    _keys: null,
    
    /**
     * 内部フィルター
     * 
     * @type Jeeel.Filter.Abstract
     * @private
     */
    _innerFilter: null,
    
    /**
     * 内部フィルターを取得する
     * 
     * @return {Jeeel.Filter.Abstract} innerFilter 内部フィルター
     */
    getInnerFilter: function () {
        return this._innerFilter;
    },

    /**
     * 内部フィルターをセットする
     *
     * @param {Jeeel.Filter.Abstract} innerFilter 内部フィルター
     * @return {Jeeel.Filter.Each} 自身のインスタンス
     */
    setInnerFilter: function (innerFilter) {
        this._innerFilter = innerFilter;

        return this;
    },

    /**
     * @private
     */
    _filter: function (params) {
        throw new Error('このフィルターは配列式が使えないオブジェクトには対応していません。');
    },

    /**
     * @private
     */
    _filterArray: function (params) {
        var result = {};
        var filter = this.getInnerFilter();

        Jeeel.Hash.forEach(params,
            function (val, key) {

                if ( ! this._keys || Jeeel.Type.inArray(key, this._keys)) {
                    result[key] = filter.filter(val);
                }
                else {
                    result[key] = val;
                }
            }
        );

        return result;
    }
};

Jeeel.Class.extend(Jeeel.Filter.Each, Jeeel.Filter.Abstract);
