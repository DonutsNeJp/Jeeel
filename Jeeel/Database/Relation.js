
Jeeel.directory.Jeeel.Database.Relation = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Database + 'Relation/';
    }
};

/**
 * @staticClass リレーショナルデータベースのDBMSに相当するStaticクラス
 *
 * @ignore 未完
 */
Jeeel.Database.Relation = {
  
    /**
     * デフォルトで使用するDBのVersion
     *
     * @type String
     * @private
     */
    _defaultDbVersion: '',

    /**
     * デフォルトで使用するDBの最大サイズ<br />
     * デフォルトで512MB
     *
     * @type Integer
     * @private
     */
    _defaultEstimatedSize: 1024 * 1024 * 512,
    
    /**
     * @type Hash
     * @private
     */
    _dbList: {},

    /**
     * データベースへの接続を行う
     * 
     * @param {String} dbName 対象データベース名
     * @param {String} [displayName] 表示データベース名
     * @return {Jeeel.Database.Relation.Connection} データベースとの接続インスタンス
     */
    connectDatabase: function (dbName, displayName) {

        if ( ! Jeeel.Type.isString(dbName) || dbName.length <= 0) {
            throw new Error('データベース名が不正です。');
        }

        if ( ! Jeeel.Type.isString(displayName) || displayName.length <= 0) {
            displayName = dbName;
        }

        if ( ! (dbName in this._dbList)) {
            this._dbList[dbName] = new this.Connection(
                                       dbName,
                                       this._defaultDbVersion,
                                       displayName,
                                       this._defaultEstimatedSize
                                   );
        }

        return this._dbList[dbName];
    },

    /**
     * SQLインジェクションを防ぐためのクォートを行う
     *
     * @param {Mixied} value クォートする値
     * @return {Mixied} クォート後の値
     */
    quote: function (value) {
        if (Jeeel.Type.isHash(value)) {
            var res = {};
            
            Jeeel.Hash.forEach(value,
                function (val, key) {
                    res[key] = this.quote(val);
                }, this
            );
              
            return res;
        }
        else if ( ! Jeeel.Type.isPrimitive(value)) {
            throw new Error('対応していない型');
        }

        if (Jeeel.Type.isEmpty(value)) {
            return 'NULL';
        }
        else if (Jeeel.Type.isNumber(value)) {
            return value;
        }
        else if (Jeeel.Type.isBoolean(value)) {
            return value.toString();
        }

        value = '' + value;

        return "'"
             + value.replace(/(\\|'|")/, "\\$1")
                    .replace(/\000/, "\\000")
                    .replace(/\n/, "\\n")
                    .replace(/\r/, "\\r")
                    .replace(/\032/, "\\032")
             + "'";
    }
};

Jeeel.file.Jeeel.Database.Relation = ['Connection', 'Transaction', 'Result', 'Table'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Database.Relation, Jeeel.file.Jeeel.Database.Relation);
