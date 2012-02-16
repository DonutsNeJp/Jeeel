
/**
 * コンストラクタ
 *
 * @class Getパラメータの形式の文字列を連想配列に変換するフィルター
 * @augments Jeeel.Filter.Abstract
 * @param {String} [overwriteName] 本来上書きされてしまう要素を取得したい時に使用する名前(内部はJeeel.Object.Item[]になる)
 */
Jeeel.Filter.Url.QueryParameter = function (overwriteName) {
    Jeeel.Filter.Abstract.call(this);
    
    this._overwriteName = overwriteName || null;
};

/**
 * インスタンスの作成を行う
 *
 * @param {String} [overwriteName] 本来上書きされてしまう要素を取得したい時に使用する名前(内部はJeeel.Object.Item[]になる)
 * @return {Jeeel.Filter.Url.QueryParameter} 作成したインスタンス
 */
Jeeel.Filter.Url.QueryParameter.create = function (overwriteName) {
    return new this(overwriteName);
};

Jeeel.Filter.Url.QueryParameter.prototype = {
    
    _overwriteName: null,
    
    _avoidValues: [],
    
    /**
     * @private
     */
    _filter: function (params) {

        if ( ! Jeeel.Type.isString(params) || params.length === 0) {
            return {};
        }

        if (params.charAt(0) === '?') {
            params = params.substring(1, params.length);
        }

        params = params.split('&');
        
        this._avoidValues = [];
        
        var i, l, pair, res = {};
        
        for (i = 0, l = params.length; i < l; i++) {
            pair = params[i].split('=');

            if (pair.length === 2) {
                this._setParams(res, pair[0], pair[1]);
            }
        }
        
        if (this._overwriteName) {
            res[this._overwriteName] = this._avoidValues;
        }

        return res;
    },
    
    _getName: Jeeel._Object.JeeelFilter.getInputName,
    
    _repairName: Jeeel._Object.JeeelFilter.repairInputName,
    
    _repairValue: function (name, hash) {
        if ( ! Jeeel.Type.isHash(hash)) {
            return new Jeeel.Object.Item(name, hash);
        }

        var tmp, res = [];

        for (var key in hash) {
            var nextParent, 
                val = hash[key];

            if (name) {
                nextParent = name + '[' + key + ']';
            } else {
                nextParent = key;
            }

            tmp = this._repairValue(nextParent, val);

            if (tmp) {
                res = res.concat(tmp);
            }
        }

        return res;
    },
    
    _setParams: function (res, name, value) {
        var key, names = this._getName(name);

        for (var i = 0, l = names.length; i < l; i++) {

            if (key) {
                res = res[key];
            }

            key = names[i] || this._getMaxCount(res);

            if (i < l -1) {
                if (typeof res[key] === 'string') {
                    this._avoidValues[this._avoidValues.length] = new Jeeel.Object.Item(this._repairName(names.slice(0, i + 1)), res[key]);
                      
                    res[key] = {};
                } else if ( ! (key in res)) {
                    res[key] = {};
                }
            }
        }
        
        if (key in res) {
            this._avoidValues = this._avoidValues.concat(this._repairValue(name, res[key]));
        }

        res[key] = decodeURIComponent(value);
    },
    
    _getMaxCount: function (res) {
        var cnt = null;

        for (var key in res) {

            var digit = +key;

            if (Jeeel.Type.isInteger(digit) && (cnt === null || digit > cnt)) {
                cnt = digit;
            }
        }

        return (cnt === null ? 0 : cnt + 1);
    }
};

Jeeel.Class.extend(Jeeel.Filter.Url.QueryParameter, Jeeel.Filter.Abstract);
