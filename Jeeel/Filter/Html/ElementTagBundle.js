
/**
 * コンストラクタ
 *
 * @class HTML要素のリストをタグ名にて纏め上げる
 * @augments Jeeel.Filter.Abstract
 */
Jeeel.Filter.Html.ElementTagBundle = function () {
    Jeeel.Filter.Abstract.call(this);
};

/**
 * インスタンスの作成を行う
 *
 * @return {Jeeel.Filter.Html.ElementTagBundle} 作成したインスタンス
 */
Jeeel.Filter.Html.ElementTagBundle.create = function () {
    return new this();
};

Jeeel.Filter.Html.ElementTagBundle.prototype = {
  
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

        var res = {};

        Jeeel.Hash.forEach(vals,
            function (val) {
                
                if ( ! Jeeel.Type.isElement(val)) {
                    throw new Error('このフィルターはHTML要素のリストのみにしか対応していません。');
                }

                var name = val.tagName.toLowerCase();

                if ( ! (name in res)) {
                    res[name] = [];
                }

                res[name].push(val);
            }
        );

        return res;
    }
};

Jeeel.Class.extend(Jeeel.Filter.Html.ElementTagBundle, Jeeel.Filter.Abstract);
