
/**
 * コンストラクタ
 *
 * @class HTML要素のリストから指定した属性の値をリスト化する
 * @augments Jeeel.Filter.Abstract
 */
Jeeel.Filter.Html.ElementAttributeReduce = function (attribute) {
    Jeeel.Filter.Abstract.call(this);
    
    this._attribute = attribute;
};

/**
 * インスタンスの作成を行う
 *
 * @return {Jeeel.Filter.Html.ElementAttributeReduce} 作成したインスタンス
 */
Jeeel.Filter.Html.ElementAttributeReduce.create = function (attribute) {
    return new this(attribute);
};

Jeeel.Filter.Html.ElementAttributeReduce.prototype = {
    _attribute: null,
    
    /**
     * @private
     */
    _filter: function () {
        throw new Error('このフィルターは配列形式のオブジェクトにしか対応していません。');
    },

    /**
     * @private
     */
    _filterArray: function (vals) {

        var result = [];

        Jeeel.Hash.forEach(vals,
            function (val) {
                
                if ( ! Jeeel.Type.isElement(val)) {
                    throw new Error('このフィルターはHTML要素のリストのみにしか対応していません。');
                }

                var attr = val.getAttribute(this._attribute);

                result.push(attr);
            }, this
        );

        return result;
    }
};

Jeeel.Class.extend(Jeeel.Filter.Html.ElementAttributeReduce, Jeeel.Filter.Abstract);

if (Jeeel._auto) {
    Jeeel._tmp();
}