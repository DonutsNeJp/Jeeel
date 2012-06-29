
/**
 * コンストラクタ
 *
 * @class あるキーについて調べ、そのキーの値が指定値以外だった場合排除するフィルター
 * @augments Jeeel.Filter.Abstract
 * @param {String} key キー
 * @param {Hash} allowList 許可値リスト
 * @throws {Error} allowListが配列式でない場合に起こる
 */
Jeeel.Filter.Hash.Key = function (key, allowList) {

    Jeeel.Filter.Abstract.call(this);
    
    if ( ! Jeeel.Type.isHash(allowList)) {
        throw new Error('allowListは配列式でなければなりません。');
    }

    this._key = key;
    this._allowList = allowList;
};

/**
 * インスタンスの作成
 *
 * @param {String} key キー
 * @param {Hash} allowList 許可値リスト
 * @return {Jeeel.Filter.Hash.Key} 作成したインスタンス
 */
Jeeel.Filter.Hash.Key.create = function (key, allowList) {
    return new this(key, allowList);
};

Jeeel.Filter.Hash.Key.prototype = {
    
    /**
     * キー
     * 
     * @type String
     * @private
     */
    _key: null,
    
    /**
     * 許可値リスト
     * 
     * @type Hash
     * @private
     */
    _allowList: [],
    
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

        var res = {};

        Jeeel.Hash.forEach(array,
            function (row, rowKey) {

                var allow = false;

                if ( ! (this._key in row)) {
                    throw new Error("この配列には " + this._key + " が含まれていません。");
                }

                Jeeel.Hash.forEach(row,
                    function (val, key) {
                        if (key === this._key) {
                            allow = Jeeel.Hash.inHash(val, this._allowList);
                           return Jeeel.Hash.FOR_EACH_EXIT;
                        }
                    }, this
                );

                if (allow) {
                    res[rowKey] = row;
                }
            }, this
        );

        return res;
    }
};

Jeeel.Class.extend(Jeeel.Filter.Hash.Key, Jeeel.Filter.Abstract);