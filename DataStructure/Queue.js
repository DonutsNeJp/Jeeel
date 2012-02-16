
/**
 * コンストラクタ
 * 
 * @class キューを扱うクラス
 */
Jeeel.DataStructure.Queue = function () {
    this._queue = [];
};

/**
 * インスタンスの作成を行う
 * 
 * @return {Jeeel.DataStructure.Queue} 作成したインスタンス
 */
Jeeel.DataStructure.Queue.create = function () {
    return new this();
};

Jeeel.DataStructure.Queue.prototype = {
    
    /**
     * 内部キュー
     * 
     * @type Array
     * @private
     */
    _queue: [],
    
    /**
     * キューに値を入れる
     * 
     * @param {Mixied} data 入れる値
     * @return {Jeeel.DataStructure.Queue} 自インスタンス
     */
    enqueue: function (data) {
        this._queue.push(data);
        
        return this;
    },
    
    /**
     * キューから値を取りだす
     * 
     * @return {Mixied} 取りだした値
     */
    dequeue: function () {
        return (+this._queue.length ? this._queue.shift() : null);
    },
    
    /**
     * キューに入っている値を全て削除する
     * 
     * @return {Jeeel.DataStructure.Queue} 自インスタンス
     */
    clear: function () {
        this._queue = [];
        
        return this;
    },
    
    /**
     * キューのサイズを取得する
     * 
     * @return {Integer} サイズ
     */
    getSize: function () {
        return this._queue.length;
    }
};
