Jeeel.directory.Jeeel.Database.Relation.Table = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Database.Relation + 'Table/';
    }
};

/**
 * コンストラクタ
 *
 * @class テーブルを管理するクラス
 * @param {String} name テーブル名
 */
Jeeel.Database.Relation.Table = function (name) {
    this._name = name;
    this._columns = {};
    this._keys = [];
};

/**
 * インスタンスの作成を行う
 *
 * @param {String} name テーブル名
 * @return {Jeeel.Database.Relation.Table} 作成したインスタンス
 */
Jeeel.Database.Relation.Table.create = function (name) {
    return new this(name);
};

Jeeel.Database.Relation.Table.prototype = {

    /**
     * テーブル名
     *
     * @type String
     * @private
     */
    _name: '',

    /**
     * テーブルに定義されているカラムのHash
     *
     * @type Hash
     * @private
     */
    _columns: {},

    /**
     * 主キー
     *
     * @type Jeeel.Database.Relation.Table.Key
     * @private
     */
    _primary: null,

    /**
     * ユニークキー・インデックスキー
     *
     * @type Jeeel.Database.Relation.Table.Key[]
     * @private
     */
    _keys: [],

    /**
     * カラムを新規で作成する
     *
     * @param {String} name カラム名
     * @param {String} type カラムの型
     * @param {Boolean} [allowNull] NULL値を許可するかどうか
     * @param {String} [defaultValue] 初期値
     * @param {String} [extra] 追加情報(AUTO_INCREMENT等)
     * @param {String} [comment] カラムの説明
     * @return {Jeeel.Database.Relation.Table.Column} 追加したカラムインスタンス
     */
    createColumn: function (name, type, allowNull, defaultValue, extra, comment) {
        var column = new Jeeel.Database.Relation.Table.Column(name, type);

        if (Jeeel.Type.isBoolean(allowNull)) {
            column.setNull(allowNull);
        }

        if (defaultValue) {
            column.setDefault(defaultValue);
        }

        if (extra) {
            column.setExtra(extra);
        }

        if (comment) {
            column.setComment(comment);
        }

        this.addColumn(column);

        return column;
    },

    /**
     * カラムの追加を行う
     *
     * @param {Jeeel.Database.Relation.Table.Column} column カラムインスタンス
     * @return {Jeeel.Database.Relation.Table} 自インスタンス
     */
    addColumn: function (column) {
        this._columns[column.getName()] = column;

        return this;
    },

    /**
     * 主キーの設定を行う
     *
     * @param {String} var_args 主キーに使用するカラム名を複数引き渡す
     * @return {Jeeel.Database.Relation.Table} 自インスタンス
     */
    setPrimaryKey: function (var_args) {

        if (arguments.length == 0) {
            throw new Error('キーは少なくとも1つは指定してください。');
        }

        var primary = new Jeeel.Database.Relation.Table.Key(Jeeel.Database.Relation.Table.Key.Type.PRIMARY);

        primary.setName('primary_' + arguments[0]);

        for (var i = 0; i < arguments.length; i++) {
            if (arguments[i] in this._columns) {
                primary.addKey(arguments[i]);
            }
            else {
                throw new Error('存在しないカラムを指定しています。');
            }
        }

        this._primary = primary;

        return this;
    },

    /**
     * ユニークキーを追加する
     *
     * @param {String} var_args ユニークキーに使用するカラム名を複数引き渡す
     * @return {Jeeel.Database.Relation.Table} 自インスタンス
     */
    addUniqueKey: function (var_args) {
      
        if (arguments.length == 0) {
            throw new Error('キーは少なくとも1つは指定してください。');
        }
        
        var uniqueKey = new Jeeel.Database.Relation.Table.Key(Jeeel.Database.Relation.Table.Key.Type.UNIQUE);

        uniqueKey.setName('unique_' + arguments[0] + '_' + this._keys.length);

        for (var i = 0; i < arguments.length; i++) {
            if (arguments[i] in this._columns) {
                uniqueKey.addKey(arguments[i]);
            }
            else {
                throw new Error('存在しないカラムを指定しています。');
            }
        }

        this._keys[this._keys.length] = uniqueKey;

        return this;
    },

    /**
     * インデックスキーを追加する
     *
     * @param {String} var_args インデックスキーに使用するカラム名を複数引き渡す
     * @return {Jeeel.Database.Relation.Table} 自インスタンス
     */
    addIndexKey: function (var_args) {
        if (arguments.length == 0) {
            throw new Error('キーは少なくとも1つは指定してください。');
        }

        var indexKey = new Jeeel.Database.Relation.Table.Key(Jeeel.Database.Relation.Table.Key.Type.INDEX);

        indexKey.setName('index_' + arguments[0] + '_' + this._keys.length);

        for (var i = 0; i < arguments.length; i++) {
            if (arguments[i] in this._columns) {
                indexKey.addKey(arguments[i]);
            }
            else {
                throw new Error('存在しないカラムを指定しています。');
            }
        }

        this._keys[this._keys.length] = indexKey;

        return this;
    },

    /**
     * テーブルを作成する際のSQLに変換する
     * 
     * @param {Boolean} [ignore] テーブルが存在する際にSQL文を無視するかどうか
     * @return {String} SQL文字列
     */
    toSql: function (ignore) {
        return this.toString(ignore);
    },

    /**
     * このインスタンスを示すSQLを返す
     * 
     * @param {Boolean} [ignore] テーブルが存在する際にSQL文を無視するかどうか
     * @return {String} SQL文字列
     */
    toString: function (ignore) {
        var sql = 'CREATE TABLE ' + (ignore ? 'IF NOT EXISTS ' : '') + '`' + this._name + '` (';

        for (var columnName in this._columns) {
            sql += ',\n  ' + this._columns[columnName].toSql();
        }

        var keys = Jeeel.Method.clone(this._keys);

        if (this._primary) {
            keys.unshift(this._primary);
        }

        for (var j = 0; j < keys.length; j++) {
            sql += ',\n  ' + keys[j].toSql();
        }

        return sql + '\n);';
    }
};

Jeeel.file.Jeeel.Database.Relation.Table = ['Column', 'Key'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Database.Relation.Table, Jeeel.file.Jeeel.Database.Relation.Table);
