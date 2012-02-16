
/**
 * コンストラクタ
 * 
 * @class 1つのデータベースとの接続を管理するクラス
 */
Jeeel.Database.Connection = function (dbName, dbVersion, displayName, estimatedSize) {
    this._db = openDatabase(dbName, dbVersion, displayName, estimatedSize);
};

Jeeel.Database.Connection.prototype = {
    /**
     * 基となるデータベース
     * 
     * @type Database
     */
    _db: null,

    /**
     * 成功時のメソッド
     *
     * @type Function
     * @private
     */
    _successMethod: null,

    /**
     * エラー時のメソッド
     *
     * @type Function
     * @private
     */
    _errorMethod: null,

    /**
     * 成功時のメソッドの登録を行う
     *
     * @param {Function} callback 登録メソッド
     * @return {Jeeel.Database.Connection} 自インスタンス
     */
    setSuccessMethod: function (callback) {
        this._successMethod = callback;

        return this;
    },

    /**
     * 失敗時のメソッドの登録を行う
     *
     * @param {Function} callback 登録メソッド
     * @return {Jeeel.Database.Connection} 自インスタンス
     */
    setErrorMethod: function (callback) {
        this._errorMethod = callback;

        return this;
    },

    /**
     * トランザクション処理を行う
     *
     * @param {Function} execute 実行トランザクション
     * @return {Jeeel.Database.Connection} 自インスタンス
     */
    transaction: function (execute) {
        var self = this;

        this._db.transaction(
            function (tx) {
                execute.call(this, new Jeeel.Database.Transaction(tx));
            },

            function (error) {
                if (self._errorMethod) {
                    self._errorMethod.apply(this, arguments);
                } else {
                    Jeeel.errorDump('TransactionError ', error.message + '(' + error.code + ')');
                }
            },
            
            function () {
                if (self._successMethod) {
                    self._successMethod.apply(this, arguments);
                }
            }
        );

        return this;
    },
    
    /**
     * トランザクション処理を行う<br />
     * 但しこのトランザクション内部では参照しかできない
     *
     * @param {Function} execute 実行トランザクション
     * @return {Jeeel.Database.Connection} 自インスタンス
     */
    readTransaction: function (execute) {
        var self = this;

        this._db.readTransaction(
            function (tx) {
                execute.call(this, new Jeeel.Database.Transaction(tx));
            },

            function (error) {
                if (self._errorMethod) {
                    self._errorMethod.apply(this, arguments);
                } else {
                    Jeeel.errorDump('TransactionError ', error.message + '(' + error.code + ')');
                }
            },
            
            function () {
                if (self._successMethod) {
                    self._successMethod.apply(this, arguments);
                }
            }
        );

        return this;
    },

    /**
     * テーブルの作成を行う
     * 
     * @param {Jeeel.Database.Table} table 作成するテーブル情報をもったオブジェクト
     * @param {Boolean} [ignore] テーブルが存在した場合無視するかどうか
     * @return {Jeeel.Database.Connection} 自インスタンス
     */
    createTable: function (table, ignore) {
      
        return this.transaction(
            function (tx) {
                tx.query(table.toSql(ignore));
            }
        );
    },

    /**
     * テーブルの削除を行う
     * 
     * @param {String} table テーブル名
     * @param {Boolean} [ignore] テーブルが存在しなかった場合無視するかどうか
     * @return {Jeeel.Database.Connection} 自インスタンス
     */
    dropTable: function (table, ignore) {
        var sql = 'DROP TABLE ' + (ignore ? 'IF EXISTS ' : '') + '`' + table + '`;';

        return this.transaction(
            function (tx) {
                tx.query(sql);
            }
        );
    }
};