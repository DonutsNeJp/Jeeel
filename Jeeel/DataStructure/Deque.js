
/**
 * コンストラクタ
 * 
 * @class デックを扱うクラス
 */
Jeeel.DataStructure.Deque = function () {
    this._deque = [];
};

/**
 * インスタンスの作成を行う
 * 
 * @return {Jeeel.DataStructure.Deque} 作成したインスタンス
 */
Jeeel.DataStructure.Deque.create = function () {
    return new this();
};

Jeeel.DataStructure.Deque.prototype = {
    
    /**
     * 内部デック
     * 
     * @type Array
     * @private
     */
    _deque: [],
    
    /**
     * デックの前方に値を入れる
     *
     * @param {Mixied} data 入れる値
     * @return {Jeeel.DataStructure.Deque} 自インスタンス
     */
    pushFront: function (data) {
        this._deque.unshift(data);

        return this;
    },
    
    /**
     * デックの後方に値を入れる
     *
     * @param {Mixied} data 入れる値
     * @return {Jeeel.DataStructure.Deque} 自インスタンス
     */
    pushBack: function (data) {
        this._deque.push(data);

        return this;
    },

    /**
     * デックの前方から値を取りだす
     *
     * @return {Mixied} 取りだした値
     */
    popFront: function () {
        if (this._deque.length === 0) {
            return null;
        }
        
        return this._deque.shift();
    },

    /**
     * デックの後方から値を取りだす
     *
     * @return {Mixied} 取りだした値
     */
    popBack: function () {
        if (this._deque.length === 0) {
            return null;
        }
        
        return this._deque.pop();
    },
    
    /**
     * デックに入っている値を全て削除する
     * 
     * @return {Jeeel.DataStructure.Deque} 自インスタンス
     */
    clear: function () {
        this._deque = [];
        
        return this;
    },
    
    /**
     * デックのサイズを取得する
     * 
     * @return {Integer} サイズ
     */
    getSize: function () {
        return this._deque.length;
    }
};
