
/**
 * コンストラクタ
 *
 * @class 配列値をhiddenタグのHTML文字列に加工するフィルター
 * @augments Jeeel.Filter.Abstract
 * @param {String} [key] 特定のキーとしてまとめ上げたい場合に指定する
 */
Jeeel.Filter.Html.HiddenString = function (key) {
    Jeeel.Filter.Abstract.call(this);
    
    this._key = key || null;
};

/**
 * インスタンスの作成を行う
 *
 * @param {String} [key] 特定のキーとしてまとめ上げたい場合に指定する
 * @return {Jeeel.Filter.Html.HiddenString} 作成したインスタンス
 */
Jeeel.Filter.Html.HiddenString.create = function (key) {
    return new this(key);
};

Jeeel.Filter.Html.HiddenString.prototype = {
    _key: null,
    
    _mFilter: Jeeel.Filter.Chain.create().add(new Jeeel.Filter.Url.Escape())
                                       .add(new Jeeel.Filter.Html.Escape()),
  
    _filter: function (vals) {

        if (this._key) {
            return this._makeHiddenString(this._key, vals);
        }
        
        throw new Error('keyを作成時に指定せずに配列式が使えない値に対しては対応していません。');
    },

    _filterEach: function (vals) {

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

        var res = [];

        Jeeel.Hash.forEach(a,
            function (v0, k0) {

                var key = origKey + '[' + k0 + ']';

                if ( ! Jeeel.Type.isHash(v0)) {
                    res[res.length] = this._makeHiddenString(key, v0);
                    return;
                }

                var val = this._scanArray(key, v0);

                Jeeel.Hash.forEach(val,
                    function (v1) {
                        res[res.length] = v1;
                    }, self
                );
            }, self
        );

        return res;
    },

    _makeHiddenString: function (key, val) {
        val = this._mFilter.filter(val);
        return '<input type="hidden" name="' + key + '" value="' + val + '" />';
    }
};

Jeeel.Class.extend(Jeeel.Filter.Html.HiddenString, Jeeel.Filter.Abstract);

if (Jeeel._auto) {
    Jeeel._tmp();
}