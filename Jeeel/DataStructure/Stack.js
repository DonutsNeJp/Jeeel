
/**
 * コンストラクタ
 * 
 * @class スタックを扱うクラス
 */
Jeeel.DataStructure.Stack = function () {
    this._stack = [];
};

/**
 * インスタンスの作成を行う
 * 
 * @return {Jeeel.DataStructure.Stack} 作成したインスタンス
 */
Jeeel.DataStructure.Stack.create = function () {
    return new this();
};

Jeeel.DataStructure.Stack.prototype = {
    
    /**
     * 内部スタック
     * 
     * @type Array
     * @private
     */
    _stack: [],
    
    /**
     * スタックに値を入れる
     * 
     * @param {Mixied} data 入れる値
     * @return {Jeeel.DataStructure.Stack} 自インスタンス
     */
    push: function (data) {
        this._stack.push(data);
        
        return this;
    },
    
    /**
     * スタックから値を取りだす
     * 
     * @return {Mixied} 取りだした値
     */
    pop: function () {
        return (+this._stack.length ? this._stack.pop() : null);
    },
    
    /**
     * スタックに入っている値を全て削除する
     * 
     * @return {Jeeel.DataStructure.Stack} 自インスタンス
     */
    clear: function () {
        this._stack = [];
        
        return this;
    },
    
    /**
     * スタックのサイズを取得する
     * 
     * @return {Integer} サイズ
     */
    getSize: function () {
        return this._stack.length;
    }
};
