Jeeel.directory.Jeeel.Parameter.Filter = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Parameter + 'Filter/';
    }
};

/**
 * @namespace フィルタクラスのためのネームスペース
 */
Jeeel.Parameter.Filter = {
    
    /**
     * DBに対して入れるべきでない事を示す定数<br />
     * この定数をフィルタが返したら検証済みの値のリストにそのフィールドは含んではならない
     * 
     * @type String
     * @constant
     */
    IGNORED_VALUE: '@pbs-form-filter-ignored-value@',
    
    /**
     * インターフェース
     * 
     * @interface フィルタークラスを作る際のインターフェース
     */
    Interface: {
        /**
         * フィルタメソッドが呼べるかどうかを返す
         * 
         * @param {String} name フィルタ名
         * @return {Boolean} フィルタメソッドが呼べるかどうか
         */
        hasFiltration: function (name) {},
        
        /**
         * フィルタメソッドが取得する
         * 
         * @param {String} name フィルタ名
         * @return {Jeeel.Function.Callback} コールバック
         */
        getFiltration: function (name) {}
    },
    
    /**
     * コンストラクタ
     * 
     * @abstractClass フィルタークラスを作る際の抽象クラス
     * @implements Jeeel.Parameter.Filter.Interface
     */
    Abstract: function () {}
};

Jeeel.Parameter.Filter.Interface = Jeeel.Class.Interface.register('Jeeel.Parameter.Filter.Interface', Jeeel.Parameter.Filter.Interface);

Jeeel.Parameter.Filter.Abstract.prototype = {
    
    /**
     * フィルタを行う
     * 
     * @param {String} name フィルタ名
     * @param {Mixed} value フィルタ対象
     * @param {Array} [args] 引数リスト
     * @return {Boolean} フィルタ結果
     */
    filter: function(name, value, args) {
        
        args = args || [];
        
        args.unshift(value);
        
        name = "filter" + Jeeel.String.toPascalCase(name);
        
        return this[name].apply(this, args);
    },
    
    /**
     * フィルタメソッドが呼べるかどうかを返す
     * 
     * @param {String} name フィルタ名
     * @return {Boolean} フィルタメソッドが呼べるかどうか
     */
    hasFiltration: function (name) {
        name = "filter" + Jeeel.String.toPascalCase(name);
        
        return !!(this[name] && typeof this[name] === 'function');
    },
    
    /**
     * フィルタメソッドが取得する
     * 
     * @param {String} name フィルタ名
     * @return {Jeeel.Function.Callback} コールバック
     */
    getFiltration: function (name) {
        name = "filter" + Jeeel.String.toPascalCase(name);
        
        return this[name] && typeof this[name] === 'function' && new Jeeel.Function.Callback(name, this) || null;
    }
};

Jeeel.Parameter.Filter.Abstract = Jeeel.Class.implement(Jeeel.Parameter.Filter.Abstract, Jeeel.Parameter.Filter.Interface);

Jeeel.file.Jeeel.Parameter.Filter = ['Base'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Parameter.Filter, Jeeel.file.Jeeel.Parameter.Filter);
