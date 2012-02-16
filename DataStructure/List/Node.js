
/**
 * コンストラクタ
 * 
 * @class リスト内のノードを扱うクラス
 * @param {Mixied} data ノードが扱うデータ
 * @param {Jeeel.DataStructure.List.Node} [prev] 前方のノード
 * @param {Jeeel.DataStructure.List.Node} [next] 後方のノード
 */
Jeeel.DataStructure.List.Node = function (data, prev, next) {
    this._data = data;
    this._prev = prev || null;
    this._next = next || null;
};

/**
 * インスタンスの作成を行う
 * 
 * @param {Mixied} data ノードが扱うデータ
 * @param {Jeeel.DataStructure.List.Node} [prev] 前方のノード
 * @param {Jeeel.DataStructure.List.Node} [next] 後方のノード
 * @return {Jeeel.DataStructure.List.Node} 作成したインスタンス
 */
Jeeel.DataStructure.List.Node.create = function (data, prev, next) {
    return new this(data, prev, next);
};

Jeeel.DataStructure.List.Node.prototype = {
  
    /**
     * 前方ノード
     * 
     * @type Jeeel.DataStructure.List.Node
     * @private
     */
    _prev: null,
    
    /**
     * 後方ノード
     * 
     * @type Jeeel.DataStructure.List.Node
     * @private
     */
    _next: null,
    
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
     * 前方ノードを取得する
     * 
     * @return {Jeeel.DataStructure.List.Node} 前方ノード
     */
    getPrevious: function () {
        return this._prev;
    },
    
    /**
     * 後方ノードを取得する
     * 
     * @return {Jeeel.DataStructure.List.Node} 後方ノード
     */
    getNext: function () {
        return this._next;
    },
      
    /**
     * コンストラクタ
     * 
     * @param {Mixied} data ノードが扱うデータ
     * @param {Jeeel.DataStructure.List.Node} [prev] このノードの前のノード
     * @param {Jeeel.DataStructure.List.Node} [next] このノードの次のノード
     * @constructor
     */
    constructor: Jeeel.DataStructure.List.Node,
    
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