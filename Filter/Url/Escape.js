
/**
 * コンストラクタ
 *
 * @class 値をGetやPostで送信できる形に変換する(非可逆変換)
 * @augments Jeeel.Filter.Abstract
 * @param {Boolean} [useEncodeURIComponent] encodeURIComponentを使用するかどうか(デフォルトは使用しない)
 */
Jeeel.Filter.Url.Escape = function (useEncodeURIComponent) {

    Jeeel.Filter.Abstract.call(this);
    
    this._useEncodeURIComponent = !!useEncodeURIComponent;
};

/**
 * インスタンスの作成を行う
 *
 * @param {Boolean} [useEncodeURIComponent] encodeURIComponentを使用するかどうか(デフォルトは使用しない)
 * @return {Jeeel.Filter.Url.Escape} 作成したインスタンス
 */
Jeeel.Filter.Url.Escape.create = function (useEncodeURIComponent) {
    return new this(useEncodeURIComponent);
};

Jeeel.Filter.Url.Escape.prototype = {
  
    /**
     * encodeURIComponentを使用するかどうか
     * 
     * @type Boolean
     * @private
     */
    _useEncodeURIComponent: false,
  
    /**
     * @private
     */
    _filter: function (val) {
        var res;

        if (Jeeel.Type.isEmpty(val)) {
            res = '';
        } else if (Jeeel.Type.isBoolean(val)) {
            res = (val ? '1' : '');
        } else if (Jeeel.Type.isNumber(val)) {
            res = val.toString();
        } else {
            res = '' + val;
        }

        if (this._useEncodeURIComponent) {
            res = encodeURIComponent(res);
        }

        return res;
    }
};

Jeeel.Class.extend(Jeeel.Filter.Url.Escape, Jeeel.Filter.Abstract);
