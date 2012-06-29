
/**
 * コンストラクタ
 * 
 * @class ロール管理クラス
 */
Jeeel.Framework.Acl.Role.Manager = function () {
    this._roles = {};
};

Jeeel.Framework.Acl.Role.Manager.prototype = {
    
    /**
     * ロール
     * 
     * @type Jeeel.Framework.Acl.Role.Abstract[]
     * @private
     */
    _roles: {},
    
    /**
     * 現在のロール
     * 
     * @type Jeeel.Framework.Acl.Role.Abstract
     * @private
     */
    _currentRole: null,
    
    /**
     * ロールを追加する
     * 
     * @param {Jeeel.Framework.Acl.Role.Abstract} role ロール
     * @return {Jeeel.Framework.Acl.Role.Manager} 自クラス
     */
    addRole: function (role) {
        if ( ! (role instanceof Jeeel.Framework.Acl.Role.Abstract)) {
            throw new Error('Argument role is not instance of Jeeel.Framework.Acl.Role.Abstract.');
        }
        
        var type = role.getRoleType();

        if (this.getRole(type, role.getRoleId())) {
            return this;
        }
        
        if ( ! this._roles[type]) {
            this._roles[type] = [];
        }
        
        this._roles[type].push(role);
        
        if ( ! this._currentRole) {
            this._currentRole = role;
        }
        
        return this;
    },
    
    /**
     * ロールを取得する
     * 
     * @param {String} roleType ロールタイプ
     * @param {String} roleId ロールID
     * @return {Jeeel.Framework.Acl.Role.Abstract} ロール
     */
    getRole: function (roleType, roleId) {
        if ( ! this._roles[roleType]) {
            return null;
        }
        
        for (var i = this._roles[roleType].length; i--;) {
            var role = this._roles[roleType][i];
            
            if (role.isMatch(roleId, true)) {
                return role;
            }
        }
        
        return null;
    },
    
    /**
     * ロールを保持しているかどうかを取得する
     * 
     * @param {String} roleType ロールタイプ
     * @param {String} roleId ロールID
     * @return {Boolean} 保持しているかどうか
     */
    hasRole: function (roleType, roleId) {
        
        if ( ! this._roles[roleType]) {
            return false;
        }
        
        for (var i = this._roles[roleType].length; i--;) {
            var role = this._roles[roleType][i];
            
            if (role.isMatch(roleId, true)) {
                return true;
            }
        }
        
        return false;
    },
    
    /**
     * 現在のロールを取得する
     * 
     * @return {Jeeel.Framework.Acl.Role.Abstract} ロール
     */
    getCurrentRole: function () {
        return this._currentRole;
    },
    
    /**
     * 現在のロールを切り替える
     * 
     * @param {String} roleType ロールタイプ
     * @param {String} roleId ロールID
     * @return {Jeeel.Framework.Acl.Role.Manager} 自クラス
     */
    switchRole: function (roleType, roleId) {
        
        var role = this.getRole(roleType, roleId);
        
        if (role) {
            this._currentRole = role;
        }
        
        return this;
    }
};
