
/**
 * コンストラクタ
 *
 * @class キーを複数指定し、部分集合を作成するフィルター
 * @augments Jeeel.Filter.Abstract
 * @param {Hash|String} keys 部分集合を表す複数のキー
 * @param {Mixed} [defaultValue] キーが存在しなかった場合のデフォルト値
 */
Jeeel.Filter.Subset = function (keys, defaultValue) {
    Jeeel.Filter.Abstract.call(this);

    if ( ! Jeeel.Type.isHash(keys)) {
        keys = [keys];
    }

    this._keys = keys;
    this._defaultValue = defaultValue;
};

/**
 * インスタンスの作成
 *
 * @param {Hash|String} keys 部分集合を表す複数のキー
 * @param {Mixed} [defaultValue] キーが存在しなかった場合のデフォルト値
 * @return {Jeeel.Filter.Subset} 作成したインスタンス
 */
Jeeel.Filter.Subset.create = function (keys, defaultValue) {
    return new this(keys, defaultValue);
};

Jeeel.Filter.Subset.prototype = {
    
    /**
     * 部分集合を表す複数のキー
     * 
     * @type Hash|String
     * @private
     */
    _keys: [],
    
    /**
     * キーが存在しなかった場合のデフォルト値
     * 
     * @type Mixed
     * @private
     */
    _defaultValue: undefined,
    
    /**
     * @private
     */
    _filter: function (val) {
        throw new Error('このフィルターは配列式が使えないオブジェクトには対応していません。');
    },

    /**
     * @private
     */
    _filterEach: function (array) {

        var globalDefault = null;
        var defaults;

        if (Jeeel.Type.isUndefined(this._defaultValue)) {
            defaults = {};
        }
        else if ( ! Jeeel.Type.isHash(this._defaultValue)) {
            defaults = {'*': this._defaultValue};
        }
        else {
            defaults = this._defaultValue;
        }

        if ('*' in defaults) {
            globalDefault = defaults['*'];
            
            delete defaults['*'];
        }

        var result = {};

        for (var arrayKey in this._keys) {
            var key = this._keys[arrayKey];

            if (key in array) {
                result[key] = array[key];
                
                continue;
            }
            
            if (key in defaults) {
                result[key] = defaults[key];
                
                continue;
            }
            
            if (globalDefault !== null) {
                result[key] = globalDefault;
            }
        }

        return result;
    }
};

Jeeel.Class.extend(Jeeel.Filter.Subset, Jeeel.Filter.Abstract);
