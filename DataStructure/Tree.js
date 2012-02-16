Jeeel.directory.Jeeel.DataStructure.Tree = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.DataStructure + 'Tree/';
    }
};

/**
 * コンストラクタ
 * 
 * @class 木構造を扱うクラス
 * @ignore 未完成
 */
Jeeel.DataStructure.Tree = function () {
    
};

/**
 * インスタンスの作成を行う
 * 
 * @return {Jeeel.DataStructure.Tree} 作成したインスタンス
 */
Jeeel.DataStructure.Tree.create = function () {
    return new this();
};

Jeeel.DataStructure.Tree.prototype = {
  
    /**
     * ルートノード
     * 
     * @type Jeeel.DataStructure.Tree.Node
     * @private
     */
    _root: null,
    
    /**
     * ルートノードを取得する
     * 
     * @return {Jeeel.DataStructure.Tree.Node} ルートノード
     */
    getRoot: function () {
        return this._root;
    },
    
    /**
     * データを追加する
     * 
     * @param {Mixied} data 追加データ
     * @return {Jeeel.DataStructure.Tree} 自インスタンス
     */
    appendData: function (data) {
        if ( ! this._root) {
            this._root = new this.constructor.Node(data);
            
            return this;
        }
        
        this._root.appendData(data);
        
        return this;
    },
    
    /**
     * ツリーのサイズを取得する
     * 
     * @return {Integer} サイズ
     */
    getSize: function () {
        return this._root.getSize();
    },
    
    /**
     * コンストラクタ
     * 
     * @constructor
     */
    constructor: Jeeel.DataStructure.Tree
};

Jeeel.file.Jeeel.DataStructure.Tree = ['Node', 'Binary'];

Jeeel._autoImports(Jeeel.directory.Jeeel.DataStructure.Tree, Jeeel.file.Jeeel.DataStructure.Tree);