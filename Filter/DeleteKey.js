
/**
 * コンストラクタ
 * 
 * @class フィルタ対象の配列内の指定したキーを削除する
 * @augments Jeeel.Filter.Abstract
 * @param {String[]} [deleteKeys] 削除キーのリスト
 */
Jeeel.Filter.DeleteKey = function (deleteKeys) {
    Jeeel.Filter.Abstract.call(this);
  
    this._deleteKeys = deleteKeys || [];
};

/**
 * インスタンスを作成して返す
 *
 * @param {String[]} [deleteKeys] 削除キーのリスト
 * @return {Jeeel.Filter.DeleteKey} 作成したインスタンス
 */
Jeeel.Filter.DeleteKey.create = function (deleteKeys) {
    return new this(deleteKeys);
};

Jeeel.Filter.DeleteKey.prototype = {
  
    /**
     * 削除キーリスト
     * 
     * @type String[]
     * @private
     */
    _deleteKeys: [],
    
    /**
     * @private
     */
    _filter: function () {
        throw new Error('valは配列・連想配列でなければなりません。');
    },

    /**
     * @private
     */
    _filterArray: function (vals) {
        var res = {};

        Jeeel.Hash.forEach(vals,
            function (val, key) {

                if ( ! Jeeel.Type.inArray(key, this._deleteKeys)) {
                    res[key] = val;
                }
            }, this
        );

        return res;
    }
};

Jeeel.Class.extend(Jeeel.Filter.DeleteKey, Jeeel.Filter.Abstract);
