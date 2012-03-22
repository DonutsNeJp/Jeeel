
/**
 * コンストラクタ
 *
 * @class 配列値をhiddenタグに加工するフィルター
 * @augments Jeeel.Filter.Abstract
 * @param {String} [key] 特定のキーとしてまとめ上げたい場合に指定する
 */
Jeeel.Filter.Html.Hidden = function (key) {

    Jeeel.Filter.Abstract.call(this);
    
    this._key = key || null;
};

/**
 * インスタンスの作成を行う
 *
 * @param {String} [key] 特定のキーとしてまとめ上げたい場合に指定する
 * @return {Jeeel.Filter.Html.Hidden} 作成したインスタンス
 */
Jeeel.Filter.Html.Hidden.create = function (key) {
    return new this(key);
};

Jeeel.Filter.Html.Hidden.prototype = {
    _key: null,
    
    _sFilter: new Jeeel.Filter.Url.Escape(),
    
    _filter: function (vals) {

        if (this._key) {
            return this._makeHiddenString(this._key, vals);
        }

        throw new Error('keyを作成時に指定せずに配列式が使えない値に対しては対応していません。');
    },

    _filterArray: function (vals) {

        if (this._key) {
            return this._scanArray(this._key, vals);
        }
        
        var res = [];

        var self = this;

        Jeeel.Hash.forEach(vals,
            function (val, key) {
                val = this._scanArray(key, val);

                Jeeel.Hash.forEach(val,
                    function (v) {
                        res[res.length] = v;
                    }, self
                );
            }, self
        );

        return res;
    },

    _scanArray: function (origKey, a) {
        if ( ! Jeeel.Type.isHash(a)) {
            return [this._makeHiddenString(origKey, a)];
        }

        var self = this;

        var result = [];

        Jeeel.Hash.forEach(a,
            function (v0, k0) {

                var key = origKey + '[' + k0 + ']';

                if ( ! Jeeel.Type.isHash(v0)) {
                    result[result.length] = this._makeHiddenString(key, v0);
                    return;
                }

                var val = this._scanArray(key, v0);

                Jeeel.Hash.forEach(val,
                    function (v1) {
                        result[result.length] = v1;
                    }, self
                );
            }, self
        );

        return result;
    },

    _makeHiddenString: function (key, val) {
        var hidden = Jeeel.Document.createElement('input');

        hidden.type  = 'hidden';
        hidden.name  = key;
        hidden.value = this._sFilter.filter(val);

        return hidden;
    }
};

Jeeel.Class.extend(Jeeel.Filter.Html.Hidden, Jeeel.Filter.Abstract);
