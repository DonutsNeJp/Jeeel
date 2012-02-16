
/**
 * コンストラクタ
 * 
 * @class ツリー内のノードを扱うクラス
 * @param {Integer} order オーダー
 * @param {Mixied} data ノードデータ
 * @param {Jeeel.DataStructure.Tree.Binary.Node} [parent] 親ノード
 */
Jeeel.DataStructure.Tree.Binary.Node = function (order, data, parent) {
    Jeeel.DataStructure.Tree.Node.call(this, data, parent);
    
    this._order = order;
};

/**
 * インスタンスの作成を行う
 * 
 * @param {Integer} order オーダー
 * @param {Mixied} data ノードデータ
 * @param {Jeeel.DataStructure.Tree.Binary.Node} [parent] 親ノード
 * @return {Jeeel.DataStructure.Tree.Binary.Node} 作成したインスタンス
 */
Jeeel.DataStructure.Tree.Binary.Node.create = function (order, data, parent) {
    return new this(order, data, parent);
};

Jeeel.DataStructure.Tree.Binary.Node.prototype = {
    
    /**
     * 検索及びデータ追加に使用するオーダー
     * 
     * @type Integer
     * @private
     */
    _order: 0,
    
    /**
     * 右の子ノードを取得する
     * 
     * @return {Jeeel.DataStructure.Tree.Binary.Node} 右の子ノード
     */
    getRightChild: function () {
        return this._children[1] || null;
    },
    
    /**
     * 左の子ノードを取得する
     * 
     * @return {Jeeel.DataStructure.Tree.Binary.Node} 左の子ノード
     */
    getLeftChild: function () {
        return this._children[0] || null;
    },
    
    /**
     * データを追加する
     * 
     * @param {Integer} order オーダー
     * @param {Mixied} data 追加データ
     * @return {Jeeel.DataStructure.Tree.Node} 自インスタンス
     */
    appendData: function (order, data) {

        if (order < this._order) {
            if (this._children[0]) {
                this._children[0].appendData(order, data);
            } else {
                this._children[0] = new this.constructor(order, data, this);
            }
        } else {
            if (this._children[1]) {
                this._children[1].appendData(order, data);
            } else {
                this._children[1] = new this.constructor(order, data, this);
            }
        }

        return this;
    },
    
    /**
     * オーダーからノードを検索する
     * 
     * @param {Integer} order オーダー
     * @return {Jeeel.DataStructure.Tree.Node} 取得ノード
     */
    search: function (order) {
        if (this._order === order) {
            return this;
        } else if (this._order < order) {
            return this._children[0] && this._children[0].search(order) || null;
        } else {
            return this._children[1] && this._children[1].search(order) || null;
        }
    },
    
    /**
     * オーダーからデータを検索する
     * 
     * @param {Integer} order オーダー
     * @return {Mixied} 取得データ
     */
    searchData: function (order) {
        var node = this.search(order);
        
        return node && node.getData();
    }
};

Jeeel.Class.extend(Jeeel.DataStructure.Tree.Binary.Node, Jeeel.DataStructure.Tree.Node);
