
(function () {
    var defaultName = '@JEEEL@';
    var index = 1;
    var instances = {};
    
    /**
     * コンストラクタ
     * 
     * @class Objectストレージ、Objectに対して疑似的に保存を行うクラス(Jeeel.Parameterと合わせても使えるが基本単独で使う)
     * @augments Jeeel.Storage.Abstract
     * @param {Object} object 疑似保存対象のObject(IEでElement指定の場合は何も無いが、その他の場合はプロパティが拡張させるので注意、その際のキーはJeeel.UNIQUE_IDが使用される)
     * @param {String} [name] ネームスペースを指定する場合に指定
     * @see Jeeel.UNIQUE_ID
     */
    Jeeel.Storage.Object = function (object, name) {
        
        var uniqueId = object.uniqueID || object[Jeeel.UNIQUE_ID];
        
        if ( ! uniqueId) {
            object[Jeeel.UNIQUE_ID] = uniqueId = index++;
        }
        
        if ( ! name) {
            name = defaultName;
        }
        
        if (instances[name] && instances[name][uniqueId]) {
            return instances[name][uniqueId];
        } else if ( ! (this instanceof Jeeel.Storage.Object)) {
            return new Jeeel.Storage.Object(object, name);
        }
        
        Jeeel.Storage.Abstract.call(this);
        
        if ( ! instances[name]) {
            instances[name] = {};
        }
        
        instances[name][uniqueId] = this;
        this._params = {};
    };
})();

/**
 * インスタンスの作成を行う
 * 
 * @param {Object} object 疑似保存対象のObject(IEでElement指定の場合は何も無いが、その他の場合はプロパティが拡張させるので注意、その際のキーはJeeel.UNIQUE_IDが使用される)
 * @param {String} [name] ネームスペースを指定する場合に指定
 * @return {Jeeel.Storage.Object} 作成したインスタンス
 * @see Jeeel.UNIQUE_ID
 */
Jeeel.Storage.Object.create = function (object, name) {
    return new this(object, name);
};

Jeeel.Storage.Object.prototype = {

    /**
     * Domの疑似保存先ストレージ
     * 
     * @type Hash
     * @private
     */
    _params: {},
    
    /**
     * データの保存を行う
     * 
     * @param {Hash} params 保存データ
     * @return {Jeeel.Storage.Object} 自インスタンス
     */
    save: function (params) {
        if ( ! Jeeel.Type.isHash(params)) {
            params = [params];
        }
        
        for (var key in params) {
            this._params[key] = params[key];
        }
        
        return this;
    },

    /**
     * データの読み込みを行う
     * 
     * @return {Hash} 読み込んだデータ
     */
    load: function () {
        var key, res = {};
        
        for (key in this._params) {
            res[key] = this._params[key];
        }
        
        return res;
    },
    
    /**
     * データを一つだけ保存する
     * 
     * @param {String} key 保存キー
     * @param {Mixed} value 保存値
     * @return {Jeeel.Storage.Object} 自インスタンス
     */
    saveData: function (key, value) {
        this._params[key] = value;
        
        return this;
    },
    
    /**
     * データを一つだけ読み込む
     * 
     * @param {String} key 読み込みキー
     * @return {Mixed} 読み込んだデータ
     */
    loadData: function (key) {
        return this._params[key];
    },
    
    /**
     * データを全て破棄する
     * 
     * @return {Jeeel.Storage.Object} 自インスタンス
     */
    clear: function () {
        this._params = {};
        
        return this;
    }
};

Jeeel.Class.extend(Jeeel.Storage.Object, Jeeel.Storage.Abstract);
