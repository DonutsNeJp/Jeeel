Jeeel.directory.Jeeel.Framework.Acl = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Framework + 'Acl/';
    }
};

/**
 * コンストラクタ
 * 
 * @class ロールベースアクセス制御を管理するクラス
 */
Jeeel.Framework.Acl = function () {
    this._roleManager = new this.constructor.Role.Manager();
    this._resourceManager = new this.constructor.Resource.Manager();
};

/**
 * インスタンスの作成を行う
 * 
 * @return {Jeeel.Framework.Acl} 作成したインスタンス
 */
Jeeel.Framework.Acl.create = function () {
    return new this();
};

Jeeel.Framework.Acl.prototype = {
    
    /**
     * デフォルトのロールタイプ
     * 
     * @type String
     * @private
     */
    _defaultRoleType: 'User',
    
    /**
     * デフォルトのリソースタイプ
     * 
     * @type String
     * @private
     */
    _defaultResourceType: 'Url',
    
    /**
     * ロール管理インスタンス
     * 
     * @type Jeeel.Framework.Acl.Role.Manager
     * @private
     */
    _roleManager: null,
    
    /**
     * リソース管理インスタンス
     * 
     * @type Jeeel.Framework.Acl.Resource.Manager
     * @private
     */
    _resourceManager: null,
    
    /**
     * デフォルトのロールの種類を設定する
     * 
     * @param {String} roleType ロールの種類
     * @return {Jeeel.Framework.Acl} 自インスタンス
     */
    setDefaultRoleType: function (roleType) {
        this._defaultRoleType = roleType;
        
        return this;
    },
    
    /**
     * デフォルトのリソースの種類を設定する
     * 
     * @param {String} resourceType リソースの種類
     * @return {Jeeel.Framework.Acl} 自インスタンス
     */
    setDefaultResourceType: function (resourceType) {
        this._defaultResourceType = resourceType;
        
        return this;
    },

    /**
     * ロールを追加する
     * 
     * @param {Jeeel.Framework.Acl.Role.Abstract} role ロール
     * @return {Jeeel.Framework.Acl} 自インスタンス
     */
    addRole: function (role) {
        this._roleManager.addRole(role);
        
        return this;
    },
    
    /**
     * リソースを追加する
     * 
     * @param {Jeeel.Framework.Acl.Resource.Abstract} resource リソース
     * @return {Jeeel.Framework.Acl} 自インスタンス
     */
    addResource: function (resource) {
        this._resourceManager.addResource(resource);
        
        return this;
    },
    
    /**
     * ロールを取得する
     * 
     * @param {String} roleId ロールID
     * @param {String} [roleType] ロールタイプ
     * @return {Jeeel.Framework.Acl.Role.Abstract} 取得したロール
     */
    getRole: function (roleId, roleType) {
        if ( ! roleType) {
            roleType = this._defaultRoleType;
        }
        
        return this._roleManager.getRole(roleType, roleId);
    },
    
    /**
     * リソースを取得する
     * 
     * @param {String} resourceId リソースID
     * @param {String} [resourceType] リソースタイプ
     * @return {Jeeel.Framework.Acl.Resource.Abstract} 取得したリソース
     */
    getResource: function (resourceId, resourceType) {
        if ( ! resourceType) {
            resourceType = this._defaultResourceType;
        }
        
        return this._resourceManager.getResource(resourceType, resourceId);
    },
    
    /**
     * 現在のロールを取得する
     * 
     * @return {Jeeel.Framework.Acl.Role.Abstract} 取得したロール
     */
    getCurrentRole: function () {
        return this._roleManager.getCurrentRole();
    },
    
    /**
     * 現在のロールを切り替える
     * 
     * @param {String} roleId ロールID
     * @param {String} [roleType] ロールタイプ
     * @return {Jeeel.Framework.Acl} 自インスタンス
     */
    switchRole: function (roleId, roleType) {
        
        if ( ! roleType) {
            roleType = this._defaultRoleType;
        }
        
        this._roleManager.switchRole(roleType, roleId);
        
        return this;
    },
    
    /**
     * 現在のロールに対してリソースへの権限を許可する
     * 
     * @param {String} resourceId リソースID
     * @param {String|String[]} [authorizations] 問い合わせ権限(省略は全権限)
     * @param {String} [resourceType] リソースタイプ
     * @return {Jeeel.Framework.Acl} 自インスタンス
     */
    allow: function (resourceId, authorizations, resourceType) {
        var role = this._roleManager.getCurrentRole();
        var resource = (resourceId instanceof Jeeel.Framework.Acl.Resource.Abstract) ? resourceId : this.getResource(resourceId, resourceType);
        
        if (role && resource) {
            role.allow(resource, authorizations);
        }
        
        return this;
    },
    
    /**
     * 現在のロールに対してリソースへの権限を禁止する
     * 
     * @param {String} resourceId リソースID
     * @param {String|String[]} [authorizations] 問い合わせ権限(省略は全権限)
     * @param {String} [resourceType] リソースタイプ
     * @return {Jeeel.Framework.Acl} 自インスタンス
     */
    deny: function (resourceId, authorizations, resourceType) {
        var role = this._roleManager.getCurrentRole();
        var resource = (resourceId instanceof Jeeel.Framework.Acl.Resource.Abstract) ? resourceId : this.getResource(resourceId, resourceType);
        
        if (role && resource) {
            role.deny(resource, authorizations);
        }
        
        return this;
    },
    
    /**
     * 現在のロールが指定したリソースに対して権限か許可されているどうかを返す
     * 
     * @param {String} resourceId リソースID
     * @param {String|String[]} [authorizations] 問い合わせ権限(省略は全権限)
     * @param {String} [resourceType] リソースタイプ
     * @return {Boolean} 許可されているかどうか
     */
    isAllowed: function (resourceId, authorizations, resourceType) {
        var role = this._roleManager.getCurrentRole();
        var resource = (resourceId instanceof Jeeel.Framework.Acl.Resource.Abstract) ? resourceId : this.getResource(resourceId, resourceType);
        
        if ( ! role) {
            throw new Error('Role does not exist.');
        }
        
        return role.isAllowed(resource, authorizations);
    },
    
    /**
     * 現在のロールが指定したリソースに対して権限か禁止されているどうかを返す
     * 
     * @param {String} resourceId リソースID
     * @param {String|String[]} [authorizations] 問い合わせ権限(省略は全権限)
     * @param {String} [resourceType] リソースタイプ
     * @return {Boolean} 禁止されているかどうか
     */
    isDenied: function (resourceId, authorizations, resourceType) {
        return ! this.isAllowed(resourceId, authorizations, resourceType);
    },
    
    /**
     * コンストラクタ
     * 
     * @constructor
     */
    constructor: Jeeel.Framework.Acl
};

Jeeel.file.Jeeel.Framework.Acl = ['Role', 'Resource', 'Error'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Framework.Acl, Jeeel.file.Jeeel.Framework.Acl);