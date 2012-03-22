Jeeel.directory.Jeeel.Dom.Style.Animation.Custom = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Dom.Style.Animation + 'Custom/';
    }
};

(function () {
    
    var instance;
    
    /**
     * コンストラクタ
     * 
     * @class カスタムスタイルに対して操作を行うクラス
     */
    Jeeel.Dom.Style.Animation.Custom = function () {
      
        if (instance) {
            return instance;
        }
        
        if ( ! (this instanceof this.constructor)) {
            return new Jeeel.Dom.Style.Animation.Custom();
        }
        
        instance = this;
    };
    
    /**
     * インスタンスを取得する
     * 
     * @return {Jeeel.Dom.Style.Animation.Custom} インスタンス
     */
    Jeeel.Dom.Style.Animation.Custom.getInstance = function () {
        if (instance) {
            return instance;
        }
        
        return new this();
    };
})();

/**
 * カスタムスタイルを登録する
 * 
 * @param {String} name 
 * @param {Function} get 
 */
Jeeel.Dom.Style.Animation.Custom.register = function (name, get) {
    if (typeof get !== 'function') {
        throw new Error('フックではありません。');
    }
    
    this.prototype[name] = get;
};

Jeeel.Dom.Style.Animation.Custom.prototype = {
    
    /**
     * コンストラクタ
     * 
     * @param {Style} style 操作スタイル
     */
    constructor: Jeeel.Dom.Style.Animation.Custom
};

Jeeel.file.Jeeel.Dom.Style.Animation.Custom = ['Default'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Dom.Style.Animation.Custom, Jeeel.file.Jeeel.Dom.Style.Animation.Custom);