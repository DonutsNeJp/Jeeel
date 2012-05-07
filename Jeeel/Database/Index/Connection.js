
/**
 * コンストラクタ
 * 
 * @class 1つのデータベースとの接続を維持するクラス
 * @param {String} dbName データベース名
 * @param {String} [description] データベースの説明
 */
Jeeel.Database.Index.Connection = function (dbName, description) {
    this._request = this.constructor.indexedDB.open(dbName, description);
    this._request.onsuccess = Jeeel.Function.simpleBind(this._succeedOpen, this);
    this._request.onerror = Jeeel.Function.simpleBind(this._failedOpen, this);
};

(function (global) {
    if ( ! global) {
        return;
    }
    
    var indexDB = global.indexedDB
               || global.webkitIndexedDB
               || global.mozIndexedDB
               || global.moz_indexedDB
               || global.msIndexedDB
               || global.oIndexedDB;
    
    if (indexDB) {
        Jeeel.Database.Index.Connection.indexedDB = indexDB;
    }
    
    indexDB = null;
})(Jeeel._global);

Jeeel.Database.Index.Connection.prototype = {
    
    _request: null,
    
    _db: null,
    
    /**
     * コンストラクタ
     * 
     * @constructor
     */
    constructor: Jeeel.Database.Index.Connection,
    
    _succeedOpen: function (e) {
        this._db = e.result;
    },
    
    _failedOpen: function (e) {
        
    }
};