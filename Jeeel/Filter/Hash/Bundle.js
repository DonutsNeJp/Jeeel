
/**
 * コンストラクタ
 * 
 * @class 多次元配列をあるキーで纏めるフィルター
 * @augments Jeeel.Filter.Abstract
 * @param {String} key バンドルするキー
 */
Jeeel.Filter.Hash.Bundle = function (key) {
    Jeeel.Filter.Abstract.call(this);
    
    this._key = key;
};

/**
 * インスタンスの作成
 *
 * @param {String} key バンドルするキー
 * @return {Jeeel.Filter.Hash.Bundle} 作成したインスタンス
 */
Jeeel.Filter.Hash.Bundle.create = function (key) {
    return new this(key);
};

Jeeel.Filter.Hash.Bundle.prototype = {
    
    /**
     * バンドルキー
     * 
     * @type String
     * @private
     */
    _key: null,
    
    /**
     * @private
     */
    _filter: function (array) {
        throw new Error('このフィルターは配列式が使えないオブジェクトには対応していません。');
    },

    /**
     * @private
     */
    _filterEach: function (array) {
        var res = {};
        
        Jeeel.Hash.forEach(array,
            function (val, arrayKey) {
                if ( ! (this._key in val)) {
                    throw new Error('valには' + this._key + '要素がありません');
                }

                if ( ! (res[val[this._key]])) {
                    res[val[this._key]] = {};
                }
                
                res[val[this._key]][arrayKey] = val;
            }, this
        );

        return res;
    }
};

Jeeel.Class.extend(Jeeel.Filter.Hash.Bundle, Jeeel.Filter.Abstract);
