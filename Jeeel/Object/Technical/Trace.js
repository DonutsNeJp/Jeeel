
/**
 * コンストラクタ
 *
 * @class メソッドのトレースを保持する構造体
 * @param {Function} func 対象の関数
 */
Jeeel.Object.Technical.Trace = function (func) {
    var self = this;
    self.args = func.arguments && Array.prototype.slice.call(func.arguments, 0, func.arguments.length) || [];
    self.name = (func[Jeeel.Debug.Debugger.INFORMATION_NAME] || {}).name || func.name;
    self.func = func;
};

Jeeel.Object.Technical.Trace.prototype = {

    /**
     * 引数配列
     *
     * @type Array
     */
    args: [],

    /**
     * 関数名
     *
     * @type String
     */
    name: '',

    /**
     * 関数詳細
     *
     * @type Function
     */
    func: null,
    
    /**
     * 文字列に変換する
     * 
     * @return {String} 文字列
     */
    toString: function () {
        return this.name;
    }
};
