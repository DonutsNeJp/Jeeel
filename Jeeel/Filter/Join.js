
/**
 * コンストラクタ
 *
 * @class 対象のHashの各要素を連結して文字列にするフィルター
 * @augments Jeeel.Filter.Abstract
 * @param {String} [separator] 連結時の区切り文字列
 * @param {String[]} [keys] 連結するキーのリスト
 */
Jeeel.Filter.Join = function (separator, keys) {
    Jeeel.Filter.Abstract.call(this);

    this._separator = (separator ? '' + separator : '');
    this._keys = keys || null;
};

/**
 * インスタンスの作成
 *
 * @param {String} [separator] 連結時の区切り文字列
 * @param {String[]} [keys] 連結するキーのリスト
 * @return {Jeeel.Filter.Join} 作成したインスタンス
 */
Jeeel.Filter.Join.create = function (separator, keys) {
    return new this(separator, keys);
};

Jeeel.Filter.Join.prototype = {
    
    /**
     * 連結時の区切り文字列
     * 
     * @type String
     * @private
     */
    _separator: '',
    
    /**
     * 連結するキーリスト
     * 
     * @type String[]
     * @private
     */
    _keys: null,
    
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
        var keys = this._keys || Jeeel.Hash.getKeys(array);

        var params = Jeeel.Parameter.create(array)
                                  .getSubset(keys)
                                  .getAll();

        var res = [];

        Jeeel.Hash.forEach(params,
            function (val) {
                res[res.length] = '' + val;
            }
        );

        return res.join(this._separator);
    }
};

Jeeel.Class.extend(Jeeel.Filter.Join, Jeeel.Filter.Abstract);
