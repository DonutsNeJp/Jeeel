
/**
 * コンストラクタ
 *
 * @class 指定した値を他の値に変換して新たな値を返す
 * @augments Jeeel.Filter.Abstract
 * @param {Function} callback 値を変換するコールバックメソッド(1番目の引数に値、二番目の引数はHash形式の値を対象にした場合のキー)<br />
 *                             Mixied callback(Mixied value, String Key)
 */
Jeeel.Filter.Map = function (callback) {
    Jeeel.Filter.Abstract.call(this);
  
    this._callback = callback;
};

/**
 * インスタンスの作成を行う
 *
 * @param {Function} callback 値を変換するコールバックメソッド(1番目の引数に値、二番目の引数はHash形式の値を対象にした場合のキー)<br />
 *                             Mixied callback(Mixied value, String Key)
 * @return {Jeeel.Filter.Html.Hidden} 作成したインスタンス
 */
Jeeel.Filter.Map.create = function (callback) {
    return new this(callback);
};

Jeeel.Filter.Map.prototype = {
    
    /**
     * 値を変換するコールバックメソッド(1番目の引数に値、二番目の引数はHash形式の値を対象にした場合のキー)
     * 
     * @type Function Mixied callback(Mixied value, String Key)
     */
    _callback: null,
    
    /**
     * @private
     */
    _filter: function (val, key) {
        return this._callback(val, key);
    },
    
    /**
     * @private
     */
    _filterArray: function (vals) {
        var res = {};
        
        Jeeel.Hash.forEach(vals,
            function (val, key) {
                res[key] = this._filter(val, key);
            }, this
        );
          
        return res;
    }
};

Jeeel.Class.extend(Jeeel.Filter.Map, Jeeel.Filter.Abstract);
