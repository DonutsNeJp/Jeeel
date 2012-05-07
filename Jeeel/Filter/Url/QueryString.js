
/**
 * コンストラクタ
 *
 * @class 連想配列をGetパラメータ用の形式にするフィルター(先頭の?はつかない)
 * @augments Jeeel.Filter.Abstract
 */
Jeeel.Filter.Url.QueryString = function () {
    Jeeel.Filter.Abstract.call(this);
};

/**
 * インスタンスの作成を行う
 *
 * @return {Jeeel.Filter.Url.QueryString} 作成したインスタンス
 */
Jeeel.Filter.Url.QueryString.create = function () {
    return new this();
};

Jeeel.Filter.Url.QueryString.prototype = {
    _sFilter: Jeeel.Filter.Url.Escape.create(true),
    
    _filter: function () {
        throw new Error('valは配列式でなければなりません。');
    },

    _filterEach: function (params) {
        var tmp, res = [];

        for (var key in params) {
            tmp = this._getParams(key, params[key], res.length === 0);
            
            if (tmp) {
                res[res.length] = tmp;
            }
        }

        return res.join('');
    },
    
    _getParams: function (parent, vals, first) {
        if ( ! Jeeel.Type.isHash(vals)) {
            return (first ? '' : '&') + parent + '=' + this._sFilter.filter(vals);
        }

        var tmp, res = [];

        Jeeel.Hash.forEach(vals,
            function (val, key) {
                var nextParent;

                if (parent) {
                    nextParent = parent + '[' + key + ']';
                } else {
                    nextParent = key;
                }
                
                tmp = this._getParams(nextParent, val, first);

                if (tmp) {
                    res[res.length] = tmp;

                    first = false;
                }
            }, this
        );

        return res.join('');
    }
};

Jeeel.Class.extend(Jeeel.Filter.Url.QueryString, Jeeel.Filter.Abstract);
