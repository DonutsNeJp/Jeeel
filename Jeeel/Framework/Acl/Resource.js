Jeeel.directory.Jeeel.Framework.Acl.Resource = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Framework.Acl + 'Resource/';
    }
};

/**
 * @namespace リソースに関するネームスペース
 */
Jeeel.Framework.Acl.Resource = {
    
    /**
     * コンストラクタ
     *
     * @abstractClass リソースクラスを作る際の抽象クラス
     */
    Abstract: function () {
        this._permissions = [];
    }
};

Jeeel.Framework.Acl.Resource.Abstract.prototype = {
    
    /**
     * 権限リスト
     * 
     * @type String[]
     * @private
     */
    _permissions: [],
    
    /**
     * リソースに対しての権限を追加する
     * 
     * @param {String} permission 権限
     * @return {Jeeel.Framework.Acl.Resource.Abstract} 自インスタンス
     */
    addAuthorization: function (permission) {
        this._permissions.push(permission);
        
        return this;
    },
    
    /**
     * 権限一覧を取得する
     * 
     * @return {String} 権限一覧
     */
    getAuthorizations: function () {
        return this._permissions;
    },
    
    /**
     * リソースの種類を取得する
     * 
     * @return {String} リソース種類
     */
    getResourceType: function () {
        throw new Error('This method does not always have to override.');
    },
    
    /**
     * このリソースを示すIDを取得する
     * 
     * @return {String} リソースID
     */
    getResourceId: function () {
        throw new Error('This method does not always have to override.');
    },
    
    /**
     * 指定したリソースがこのリソースと同等かどうかを返す<br />
     * 場合によってはオーバーライドして挙動を変えることが可能
     * 
     * @param {String} resourceId 比較リソースID
     * @param {Boolean} [strict] 厳密に判定するかどうか
     * @return {Boolean} 同等かどうか
     */
    isMatch: function (resourceId, strict) {
        return resourceId === this.getResourceId();
    },
    
    /**
     * コンストラクタ
     * 
     * @constructor
     */
    constructor: Jeeel.Framework.Acl.Resource.Abstract
};

Jeeel.file.Jeeel.Framework.Acl.Resource = ['Url', 'Manager'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Framework.Acl.Resource, Jeeel.file.Jeeel.Framework.Acl.Resource);