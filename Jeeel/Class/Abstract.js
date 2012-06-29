/**
 * コンストラクタ
 * 
 * @abstractClass 継承時に使用する抽象クラス
 * @param {Function} superClass スーパークラス
 */
Jeeel.Class.Abstract = function (superClass) {
    this._super = superClass.prototype;
};

Jeeel.Class.Abstract.prototype = {
    
    /**
     * 親クラスのプロトタイプ
     * 
     * @type Object
     * @protected
     * @readOnly
     */
    _super: null
};
