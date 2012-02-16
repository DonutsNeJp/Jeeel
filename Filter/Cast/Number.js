
/**
 * コンストラクタ
 * 
 * @class Numberにキャストするフィルター
 * @augments Jeeel.Filter.Abstract
 */
Jeeel.Filter.Cast.Number = function () {
    Jeeel.Filter.Abstract.call(this);
};

/**
 * インスタンスの作成を行う
 * 
 * @return {Jeeel.Filter.Cast.Number} 作成したインスタンス
 */
Jeeel.Filter.Cast.Number.create = function () {
    return new this();
};

Jeeel.Filter.Cast.Number.prototype = {
  
    /**
     * @private
     */
    _filter: function (val) {
        return +val;
    }
};

Jeeel.Class.extend(Jeeel.Filter.Cast.Number, Jeeel.Filter.Abstract);
