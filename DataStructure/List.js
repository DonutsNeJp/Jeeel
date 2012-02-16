Jeeel.directory.Jeeel.DataStructure.List = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.DataStructure + 'List/';
    }
};

/**
 * コンストラクタ
 * 
 * @class リストを扱うクラス
 */
Jeeel.DataStructure.List = function () {
    this._dummyNode = new this.constructor.Node(null);
    
    this._dummyNode._prev = this._dummyNode;
    this._dummyNode._next = this._dummyNode;
};

/**
 * インスタンスの作成を行う
 * 
 * @return {Jeeel.DataStructure.List} 作成したインスタンス
 */
Jeeel.DataStructure.List.create = function () {
    return new this();
};

Jeeel.DataStructure.List.prototype = {
    
    /**
     * 番兵ノード
     * 
     * @type Jeeel.DataStructure.List.Node
     * @private
     */
    _dummyNode: null,
    
    /**
     * データサイズ
     * 
     * @type Integer
     * @private
     */
    _size: 0,
    
    /**
     * 先頭ノードを取得する
     * 
     * @return {Jeeel.DataStructure.List.Node} 先頭ノード
     */
    getFirst: function () {
        return this._size && this._dummyNode._next || null;
    },

    /**
     * 後方ノードを取得する
     * 
     * @return {Jeeel.DataStructure.List.Node} 後方ノード
     */
    getLast: function () {
        return this._size && this._dummyNode._prev || null;
    },
    
    /**
     * 指定ノードの後に新しいノードを挿入する
     * 
     * @param {Jeeel.DataStructure.List.Node} node 起点ノード
     * @param {Jeeel.DataStructure.List.Node} newNode 追加ノード
     * @return {Jeeel.DataStructure.List} 自インスタンス
     */
    insertAfter: function (node, newNode) {
        if ( ! node) {
            node = this._dummyNode;
        }
        
        newNode._next = node._next;
        newNode._prev = node;
        newNode._next._prev = newNode;
        node._next = newNode;
        
        this._size++;
        
        return this;
    },
    
    /**
     * 指定ノードの前に新しいノードを挿入する
     * 
     * @param {Jeeel.DataStructure.List.Node} node 起点ノード
     * @param {Jeeel.DataStructure.List.Node} newNode 追加ノード
     * @return {Jeeel.DataStructure.List} 自インスタンス
     */
    insertBefore: function (node, newNode) {
        if ( ! node) {
            node = this._dummyNode;
        }
        
        newNode._next = node;
        newNode._prev = node._prev;
        newNode._prev._next = newNode;
        node._prev = newNode;
        
        this._size++;
        
        return this;
    },
    
    /**
     * ノードを追加する
     * 
     * @param {Jeeel.DataStructure.List.Node} node 追加ノード
     * @return {Jeeel.DataStructure.List} 自インスタンス
     */
    appendNode: function (node) {
        return this.insertBefore(null, node);
    },
    
    /**
     * ノードを削除する
     * 
     * @param {Jeeel.DataStructure.List.Node} node 削除ノード
     * @return {Jeeel.DataStructure.List} 自インスタンス
     */
    removeNode: function (node) {
        var prev = node._prev;
        var next = node._next;
        
        prev._next = next;
        next._prev = prev;
        
        delete node;
        
        this._size--;
        
        return this;
    },
    
    /**
     * データを追加する
     * 
     * @param {Mixied} data 追加データ
     * @return {Jeeel.DataStructure.List} 自インスタンス
     */
    appendData: function (data) {
        return this.insertBefore(null, new this.constructor.Node(data));
    },
    
    /**
     * 指定された関数を各要素に一度ずつ実行する
     *
     * @param {Function} callback void callback(Mixied data, Jeeel.DataStructure.List.Node node, Jeeel.DataStructure.List list)
     * @param {Mixied} [thisArg] callback内でthisに相当する値
     * @return {Jeeel.DataStructure.List} 自インスタンス
     */
    forEach: function (callback, thisArg) {
        var node = this._dummyNode._next;
        
        if ( ! Jeeel.Type.isSet(thisArg)) {
            thisArg = this;
        }
        
        while(node !== this._dummyNode) {
            callback.call(thisArg, node.getData(), node, this);
            
            node = node._next;
        }

        return this;
    },
    
    /**
     * インスタンスを配列に変換する
     * 
     * @return {Array} 変換後の配列
     */
    toArray: function () {
        var node = this._dummyNode._next;
        var arr  = [];
        
        while (node !== this._dummyNode) {
            arr[arr.length] = node.getData();
            
            node = node._next;
        }
        
        return arr;
    },
    
    /**
     * インスタンスを反転配列に変換する
     * 
     * @return {Array} 変換後の配列
     */
    toReverseArray: function () {
        var node = this._dummyNode._prev;
        var arr  = [];
        
        while (node !== this._dummyNode) {
            arr[arr.length] = node.getData();
            
            node = node._prev;
        }
        
        return arr;
    },
    
    /**
     * リストに入っている値を全て削除する
     * 
     * @return {Jeeel.DataStructure.List} 自インスタンス
     */
    clear: function () {
        var node = this._dummyNode._next;
        
        // GCに必ず回収されるように全ての参照を切る
        while (node !== this._dummyNode) {
            delete node._prev;
            node = node._next;
        }
        
        this._dummyNode._prev = this._dummyNode;
        this._dummyNode._next = this._dummyNode;
        this._size = 0;
        
        return this;
    },
    
    /**
     * リストのサイズを取得する
     * 
     * @return {Integer} サイズ
     */
    getSize: function () {
        return this._size;
    },
   
    /**
     * コンストラクタ
     * 
     * @constructor
     */
    constructor: Jeeel.DataStructure.List
};

Jeeel.file.Jeeel.DataStructure.List = ['Node'];

Jeeel._autoImports(Jeeel.directory.Jeeel.DataStructure.List, Jeeel.file.Jeeel.DataStructure.List);