
/**
 * コンストラクタ
 * 
 * @class Stringにキャストするフィルター
 * @augments Jeeel.Filter.Abstract
 */
Jeeel.Filter.Cast.String = function () {
    Jeeel.Filter.Abstract.call(this);
};

/**
 * インスタンスの作成を行う
 * 
 * @return {Jeeel.Filter.Cast.String} 作成したインスタンス
 */
Jeeel.Filter.Cast.String.create = function () {
    return new this();
};

Jeeel.Filter.Cast.String.prototype = {
  
    /**
     * @private
     */
    _filter: function (val) {
        return '' + val;
    }
};

Jeeel.Class.extend(Jeeel.Filter.Cast.String, Jeeel.Filter.Abstract);
