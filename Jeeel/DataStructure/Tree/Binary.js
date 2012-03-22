Jeeel.directory.Jeeel.DataStructure.Tree.Binary = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.DataStructure.Tree + 'Binary/';
    }
};

/**
 * コンストラクタ
 * 
 * @class 二分木を扱うクラス
 * @augments Jeeel.DataStructure.Tree
 */
Jeeel.DataStructure.Tree.Binary = function () {
    Jeeel.DataStructure.Tree.call(this);
};

/**
 * インスタンスの作成を行う
 * 
 * @return {Jeeel.DataStructure.Tree.Binary} 作成したインスタンス
 */
Jeeel.DataStructure.Tree.Binary.create = function () {
    return new this();
};

Jeeel.DataStructure.Tree.Binary.prototype = {
    
    /**
     * データを追加する
     * 
     * @param {Integer} order オーダー
     * @param {Mixied} data 追加データ
     * @return {Jeeel.DataStructure.Tree.Binary} 自インスタンス
     */
    appendData: function (order, data) {
        if ( ! this._root) {
            this._root = new this.constructor.Node(order, data);
            
            return this;
        }
        
        this._root.appendData(order, data);
        
        return this;
    },
    
    /**
     * オーダーからノードを検索する
     * 
     * @param {Integer} order オーダー
     * @return {Jeeel.DataStructure.Tree.Node} 取得ノード
     */
    search: function (order) {
        return this._root && this._root.search(order);
    },
    
    /**
     * オーダーからデータを検索する
     * 
     * @param {Integer} order オーダー
     * @return {Mixied} 取得データ
     */
    searchData: function (order) {
        return this._root && this._root.searchData(order);
    }
};

Jeeel.Class.extend(Jeeel.DataStructure.Tree.Binary, Jeeel.DataStructure.Tree);

Jeeel.file.Jeeel.DataStructure.Tree.Binary = ['Node', 'Order'];

Jeeel._autoImports(Jeeel.directory.Jeeel.DataStructure.Tree.Binary, Jeeel.file.Jeeel.DataStructure.Tree.Binary);
