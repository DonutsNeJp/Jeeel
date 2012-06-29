
Jeeel.directory.Jeeel.Parameter.Validator = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Parameter + 'Validator/';
    }
};

/**
 * @namespace バリデータクラスのためのネームスペース
 */
Jeeel.Parameter.Validator = {
    
    /**
     * インターフェース
     * 
     * @interface バリデートクラスを作る際のインターフェース
     */
    Interface: {
        /**
         * バリデートメソッドが呼べるかどうかを返す
         * 
         * @param {String} name バリデート名
         * @return {Boolean} バリデートメソッドが呼べるかどうか
         */
        hasValidation: function (name) {},
        
        /**
         * バリデートメソッドを取得する
         * 
         * @param {String} name バリデート名
         * @return {Jeeel.Function.Callback} コールバック
         */
        getValidation: function (name) {}
    },
    
    /**
     * コンストラクタ
     * 
     * @abstractClass バリデータクラスを作る際の抽象クラス
     * @implements Jeeel.Parameter.Validator.Interface
     */
    Abstract: function () {}
};

Jeeel.Parameter.Validator.Interface = Jeeel.Class.Interface.register('Jeeel.Parameter.Validator.Interface', Jeeel.Parameter.Validator.Interface);

Jeeel.Parameter.Validator.Abstract.prototype = {
    
    /**
     * バリデートを行う
     * 
     * @param {String} name バリデート名
     * @param {Mixed} value バリデート対象
     * @param {Array} [args] 引数リスト
     * @return {Boolean} バリデート結果
     */
    validate: function(name, value, args) {
        
        args = args || [];
        
        args.unshift(value);
        
        name = "validate" + Jeeel.String.toPascalCase(name);
        
        return this[name].apply(this, args);
    },
    
    /**
     * バリデートメソッドが呼べるかどうかを返す
     * 
     * @param {String} name バリデート名
     * @return {Boolean} バリデートメソッドが呼べるかどうか
     */
    hasValidation: function (name) {
        name = "validate" + Jeeel.String.toPascalCase(name);
        
        return !!(this[name] && typeof this[name] === 'function');
    },
    
    /**
     * バリデートメソッドを取得する
     * 
     * @param {String} name バリデート名
     * @return {Jeeel.Function.Callback} コールバック
     */
    getValidation: function (name) {
        name = "validate" + Jeeel.String.toPascalCase(name);
        
        return this[name] && typeof this[name] === 'function' && new Jeeel.Function.Callback(name, this) || null;
    }
};

Jeeel.Parameter.Validator.Abstract = Jeeel.Class.implement(Jeeel.Parameter.Validator.Abstract, Jeeel.Parameter.Validator.Interface);

Jeeel.file.Jeeel.Parameter.Validator = ['Base', 'Error'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Parameter.Validator, Jeeel.file.Jeeel.Parameter.Validator);
