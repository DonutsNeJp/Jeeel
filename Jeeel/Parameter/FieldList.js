
/**
 * コンストラクタ
 * 
 * @class フィールドを管理するクラス
 */
Jeeel.Parameter.FieldList = function () {
    this._fields = {};
};

Jeeel.Parameter.FieldList.prototype = {
    
    /**
     * フィールドリスト
     * 
     * @type Hash
     * @private
     */
    _fields: {},
    
    /**
     * フィールドを追加する
     * 
     * @param {Jeeel.Parameter.Field} field 追加フィールド
     * @return {Jeeel.Parameter.FieldList} 自インスタンス
     */
    addField: function (field) {
        this._fields[field.getName()] = field;
        
        return this;
    },
    
    /**
     * フィールドを取得する
     * 
     * @param {String} name フィールド名
     * @return {Jeeel.Parameter.Field} フィールド
     */
    getField: function (name) {
        return this.hasField(name) ? this._fields[name] : null;
    },
    
    /**
     * フィールドを削除する
     * 
     * @param {String} name フィールド名
     * @return {Jeeel.Parameter.FieldList} 自インスタンス
     */
    removeField: function (name) {
        delete this._fields[name];
        
        return this;
    },

    /**
     * フィールドを全て取得する
     * 
     * @return {Hash} フィールドリスト
     */
    getFieldAll: function () {
        return this._fields;
    },

    /**
     * フィールドを保持しているかどうかを取得する
     * 
     * @param {String} name フィールド名
     * @return {Boolean} 保持しているかどうか
     */
    hasField: function (name) {
        if (name === '*') {
            for (var key in this._fields) {
                return true;
            }
            
            return false;
        }
        
        return !!this._fields[name];
    },
    
    /**
     * ハッシュに変換する
     * 
     * @return {Hash} 変換後のハッシュ
     */
    toHash: function () {
        var res = {};
        
        for (var key in this._fields) {
            res[key] = this._fields[key];
        }
        
        return res;
    }
};
