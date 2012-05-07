
Jeeel.Database.Relation.Transaction = function (transaction) {
    this._transaction = transaction;
};

Jeeel.Database.Relation.Transaction.prototype = {
    /**
     * トランザクション
     * 
     * @type SQLTransaction
     * @private
     */
    _transaction: null,

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
    
    _errorInfo: null,

    setSuccessMethod: function (callback) {
        this._successMethod = callback;

        return this;
    },

    setErrorMethod: function (callback) {
        this._errorMethod = callback;

        return this;
    },

    query: function (sql, bind) {
      
        var trace = (Jeeel._debugMode ? Jeeel.Debug.Debugger.getTrace() : null);
      
        var self = this;

        this._transaction.executeSql(
            sql,
            bind || [],
            function (transaction, result) {
                if (self._successMethod) {
                    self._successMethod.call(this, self, new Jeeel.Database.Relation.Result(result));
                }
            },
            function (transaction, error) {
                if (trace) {
                    var message = 'Caller:\n' + trace[0].name + '\n\n'
                                + 'Sql:\n' + sql + '\n\n'
                                + 'Bind:\n[' + (bind || []).join(', ') + ']\n\n'
                                + 'BaseError:\n' + error.message;
                    
                    self._errorInfo = {
                        message: message,
                        caller: trace[0].func
                    };
                }
                
                if (self._errorMethod) {
                    self._errorMethod.call(this, self, error);
                } else {
                    throw error;
                }
            }
        );

        return this;
    },

    /**
     * レコードの挿入を行う
     * 
     * @param {String} table テーブル名
     * @param {Hash} bind 挿入するレコード内容のキーと値のペアリスト
     * @return {Jeeel.Database.Relation.Transaction} 自インスタンス
     */
    insertRecord: function (table, bind) {
        var sql = 'INSERT INTO `' + table + '` ';
        var cols = [];
        var vals = [];
        var len = 0;
        
        for (var key in bind) {
            cols[len] = key;
            vals[len] = bind[key];
            len++;
        }
        
        vals = this.quote(vals);
        
        sql += '(`' + cols.join('`, `') + '`)'
             + 'VALUES(' + vals.join(', ') + ');';
           
        return this.query(sql);
    },

    updateRecord: function (table, bind, where) {

    },

    deleteRecord: function (table, bind, where) {
        
    },

    /**
     * SQLインジェクションを防ぐためのクォートを行う
     *
     * @param {Mixied} value クォートする値
     * @return {Mixied} クォート後の値
     */
    quote: function (value) {
        return Jeeel.Database.Relation.quote(value);
    }
};
