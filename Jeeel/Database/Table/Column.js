
/**
 * コンストラクタ
 * 
 * @class カラムを扱うクラス
 * @param {String} name カラム名
 * @param {String} type カラムの型
 */
Jeeel.Database.Table.Column = function (name, type) {
    this._name = name;
    this._type = type;
};

/**
 * インスタンスの作成を行う
 *
 * @param {String} name カラム名
 * @param {String} type カラムの型
 * @return {Jeeel.Database.Table.Column} 作成したインスタンス
 */
Jeeel.Database.Table.Column.create = function (name, type) {
    return new this(name, type);
};

Jeeel.Database.Table.Column.prototype = {
    _name: '',
    _type: '',
    _null: true,
    _default: 'NULL',
    _extra: '',
    _comment: '',

    getName: function () {
        return this._name;
    },

    getType: function () {
        return this._type;
    },

    getNull: function () {
        return this._null;
    },

    setNull: function (allowNull) {
        this._null = !!allowNull;

        return this;
    },

    getDefault: function () {
        return this._default;
    },

    setDefault: function (defaultValue) {
        this._default = '' + defaultValue;

        return this;
    },

    getExtra: function () {
        return this._extra;
    },

    setExtra: function (extra) {
        this._extra = '' + extra;

        return this;
    },

    getComment: function () {
        return this._comment;
    },

    setComment: function (comment) {
        this._comment = '' + comment;

        return this;
    },

    /**
     * このカラムを示すSQL文字列に変換する
     *
     * @return {String} SQL文字列
     */
    toSql: function () {
        return this.toString();
    },

    /**
     * このカラムを示すSQL文字列に変換する
     *
     * @return {String} SQL文字列
     */
    toString: function () {
        var sql = '`' + this._name + '` ' + this._type
                + (this._null ? '' : ' NOT NULL')
                + (this._default == 'NULL' ? '' : ' DEFAULT ' + this._default)
                + (this._extra ? ' ' + this._extra : '')
                + (this._comment ? ' COMMENT ' + this._comment : '');

        return sql;
    }
};
