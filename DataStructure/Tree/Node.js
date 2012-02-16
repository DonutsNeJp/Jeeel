
/**
 * コンストラクタ
 * 
 * @class ツリー内のノードを扱うクラス
 * @param {Mixied} data ノードデータ
 * @param {Jeeel.DataStructure.Tree.Node} [parent] 親ノード
 */
Jeeel.DataStructure.Tree.Node = function (data, parent) {
    this._data = data;
    this._children = [];
    this._parent = parent || null;
};

/**
 * インスタンスの作成を行う
 * 
 * @param {Mixied} data ノードデータ
 * @param {Jeeel.DataStructure.Tree.Node} [parent] 親ノード
 * @return {Jeeel.DataStructure.Tree.Node} 作成したインスタンス
 */
Jeeel.DataStructure.Tree.Node.create = function (data, parent) {
    return new this(data, parent);
};

Jeeel.DataStructure.Tree.Node.prototype = {
  
    /**
     * 親ノード
     * 
     * @type Jeeel.DataStructure.Tree.Node
     * @private
     */
    _parent: null,
    
    /**
     * 子ノードリスト
     * 
     * @type Jeeel.DataStructure.Tree.Node[]
     * @private
     */
    _children: [],
    
    /**
     * データ
     * 
     * @type Mixied
     * @private
     */
    _data: null,
    
    /**
     * データを取得する
     * 
     * @return {Mixied} データ
     */
    getData: function () {
        return this._data;
    },
    
    /**
     * 親ノードを取得する
     * 
     * @return {Jeeel.DataStructure.Tree.Node} 親ノード
     */
    getParent: function () {
        return this._parent;
    },
    
    /**
     * 子ノードリストを取得する
     * 
     * @return {Jeeel.DataStructure.Tree.Node[]} 子ノードリスト
     */
    getChildren: function () {
        return this._children;
    },
    
    /**
     * 最初に追加した子ノードを取得する
     * 
     * @return {Jeeel.DataStructure.Tree.Node} 最初の子ノード
     */
    getFirstChild: function () {
        return this._children[0] || null;
    },
    
    /**
     * 最後に追加した1子ノードを取得する
     * 
     * @return {Jeeel.DataStructure.Tree.Node} 最後の子ノード
     */
    getLastChild: function () {
        return this._children[this._children.length - 1] || null;
    },
    
    /**
     * データを追加する
     * 
     * @param {Mixied} data 追加データ
     * @return {Jeeel.DataStructure.Tree.Node} 自インスタンス
     */
    appendData: function (data) {
        this._children[this._children.length] = new this.constructor(data, this);
        
        return this;
    },
    
    /**
     * 子ノードの数を取得する
     * 
     * @return {Integer} 子ノードの数
     */
    getDegree: function () {
        return this._children.length;
    },
    
    /**
     * このノードに紐づく全てのデータ数を取得する
     * 
     * @return {Integer} データ数
     */
    getSize: function () {
        var size = 1;
        
        for (var i = this._children.length; i--;) {
            size += this._children[i].getSize();
        }
        
        return size;
    },
    
    /**
     * コンストラクタ
     * 
     * @param {Mixied} data ノードデータ
     * @param {Jeeel.DataStructure.Tree.Node} [parent] 親ノード
     * @constructor
     */
    constructor: Jeeel.DataStructure.Tree.Node,
    
    /**
     * ノード内のデータを返す
     * 
     * @return {Mixied} データ
     */
    valueOf: function () {
        return this._data;
    },
    
    /**
     * ノード内のデータを文字列変換して返す
     * 
     * @return {String} データ文字列
     */
    toString: function () {
        return (this._data || '' + this._data).toString();
    }
};