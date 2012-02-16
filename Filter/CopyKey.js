
/**
 * コンストラクタ
 * 
 * @class フィルタ対象の配列の指定キーの値を他のキーにコピーする
 * @augments Jeeel.Filter.Abstract
 * @param {Hash} [copyMap] コピーマップ
 */
Jeeel.Filter.CopyKey = function (copyMap) {
    Jeeel.Filter.Abstract.call(this);
  
    this._copyMap = copyMap || {};
};

/**
 * インスタンスを作成して返す
 *
 * @param {Hash} [copyMap] コピーマップ
 * @return {Jeeel.Filter.CopyKey} 作成したインスタンス
 */
Jeeel.Filter.CopyKey.create = function (copyMap) {
    return new this(copyMap);
};

Jeeel.Filter.CopyKey.prototype = {
  
    /**
     * コピーマップ
     * 
     * @type Hash
     * @private
     */
    _copyMap: {},
    
    /**
     * コピーマップを取得する
     * 
     * @return {Hash} コピーマップ
     */
    getCopyMap: function () {
        return this._copyMap;
    },

    /**
     * コピーマップを設定する
     * 
     * @param {Hash} copyMap コピーマップ
     * @return {Jeeel.Filter.CopyKey} 自インスタンス
     */
    setCopyMap: function (copyMap) {
        this._copyMap = copyMap;

        return this;
    },

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
        var map = this.getCopyMap();

        Jeeel.Hash.forEach(vals,
            function (val, key) {

                if ( ! (key in res)) {
                    res[key] = val;
                }

                if (key in map) {
                    if ( ! Jeeel.Type.isHash(map[key])) {
                        map[key] = [map[key]];
                    }

                    Jeeel.Hash.forEach(map[key],
                        function (copyKey) {
                            res[copyKey] = val;
                        }
                    );
                }
            }
        );

        return res;
    }
};

Jeeel.Class.extend(Jeeel.Filter.CopyKey, Jeeel.Filter.Abstract);
