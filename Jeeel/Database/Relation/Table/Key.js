Jeeel.directory.Jeeel.Database.Relation.Table.Key = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Database.Relation.Table + 'Key/';
    }
};

/**
 * コンストラクタ
 * 
 * @class キーを管理するクラス
 * @param {String} type キーの種類を示す文字列
 * @see Jeeel.Database.Relation.Table.Key.Type
 */
Jeeel.Database.Relation.Table.Key = function (type) {
    if ( ! Jeeel.Hash.inHash(type, Jeeel.Database.Relation.Table.Key.Type, true)) {
        throw new Error('キーの種類が間違っています。');
    }

    this._type = type;
    this._keys = [];
};

Jeeel.Database.Relation.Table.Key.prototype = {

    /**
     * キーの名前
     *
     * @type String
     * @private
     */
    _name: '',

    /**
     * キーの種類
     *
     * @type String
     * @private
     */
    _type: '',

    /**
     * キーの対象のカラムリスト
     *
     * @type String[]
     * @private
     */
    _keys: [],

    /**
     * 名前を取得する
     *
     * @return {String} 名前
     */
    getName: function () {
        return this._name;
    },

    /**
     * 名前を設定する
     *
     * @param {String} name 名前
     * @return {Jeeel.Database.Relation.Table.Key} 自インスタンス
     */
    setName: function (name) {
        this._name = name;

        return this;
    },

    /**
     * キーの種類を取得する
     *
     * @return {String} キーの種類
     */
    getType: function () {
        return this._type;
    },

    /**
     * キーの種類を設定する
     *
     * @param {String} type キーの種類
     * @return {Jeeel.Database.Relation.Table.Key} 自インスタンス
     */
    setType: function (type) {
        if ( ! Jeeel.Hash.inHash(type, Jeeel.Database.Relation.Table.Key.Type, true)) {
            throw new Error('キーの種類が間違っています。');
        }

        this._type = type;

        return this;
    },

    /**
     * 対象のカラムリストを取得する
     * 
     * @return {String[]} 対象のカラムリスト
     */
    getKeys: function () {
        return this._keys;
    },

    /**
     * 対象のカラムを追加する
     *
     * @param {String} key カラム名
     * @return {Jeeel.Database.Relation.Table.Key} 自インスタンス
     */
    addKey: function (key) {
        this._keys.push(key);

        return this;
    },

    /**
     * カラム名のリストを空にする
     * 
     * @return {Jeeel.Database.Relation.Table.Key} 自インスタンス
     */
    clearKeys: function () {
        this._keys = [];

        return this;
    },

    /**
     * このキーを示すSQL文字列に変換する
     *
     * @return {String} SQL文字列
     */
    toSql: function () {
        return this.toString();
    },

    /**
     * このキーを示すSQL文字列に変換する
     *
     * @return {String} SQL文字列
     */
    toString: function () {
      
        var sql = this._type
                + (this._type != Jeeel.Database.Relation.Table.Key.Type.PRIMARY && this._name ? ' `' + this._name + '`' : '') + ' (';

        for (var i = 0; i < this._keys.length; i++) {
            if (i > 0) {
                sql += ', ';
            }

            sql += '`' + this._keys[i] + '`';
        }

        sql += ')';

        return sql;
    }
};

Jeeel.file.Jeeel.Database.Relation.Table.Key = ['Type'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Database.Relation.Table.Key, Jeeel.file.Jeeel.Database.Relation.Table.Key);
