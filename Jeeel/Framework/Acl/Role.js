Jeeel.directory.Jeeel.Framework.Acl.Role = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Framework.Acl + 'Role/';
    }
};

/**
 * @namespace ロールに関するネームスペース
 */
Jeeel.Framework.Acl.Role = {
    
    /**
     * コンストラクタ
     *
     * @abstractClass ロールクラスを作る際の抽象クラス
     */
    Abstract: function () {
        this._extends = [];
        this._resourceAllowedAuthorizations = {};
        this._resourceDeniedAuthorizations = {};
    }
};

Jeeel.Framework.Acl.Role.Abstract.prototype = {
    
    /**
     * 継承ロール
     * 
     * @type Jeeel.Framework.Acl.Role.Abstract[]
     * @protected
     */
    _extends: [],
    
    /**
     * リソースに対しての許可権限情報
     */
    _resourceAllowedAuthorizations: {},
    
    /**
     * リソースに対しての拒否権限情報
     */
    _resourceDeniedAuthorizations: {},
    
    /**
     * リソースをデフォルトで許可するかどうか
     * 
     * @type Boolean
     * @protected
     */
    _defaultAuthorizationAllow: false,
    
    /**
     * ロールの継承を行う
     * 
     * @param {Jeeel.Framework.Acl.Role.Abstract} role ロール
     * @return {Jeeel.Framework.Acl.Role.Abstract} 自インスタンス
     */
    extend: function (role) {
        
        if ( ! (role instanceof Jeeel.Framework.Acl.Role.Abstract)) {
            throw new Error('Argument role is not instance of Jeeel.Framework.Acl.Role.Abstract.');
        } else if (role.getRoleType() !== this.getRoleType()) {
            throw new Error('Role type does not match.');
        }
        
        var roleId = role.getRoleId();
        
        for (var i = this._extends.length; i--;) {
            if (this._extends[i].getRoleId() === roleId) {
                return this;
            }
        }
        
        this._extends.push(role);
        
        return this;
    },
    
    /**
     * 権限リストに載っていない権限を許可として扱うようにする
     * 
     * @return {Jeeel.Framework.Acl.Role.Abstract} 自インスタンス
     */
    allowDefaultAuthorization: function () {
        this._defaultAuthorizationAllow = true;
        
        return this;
    },
    
    /**
     * 権限リストに載っていない権限を禁止として扱うようにする
     * 
     * @return {Jeeel.Framework.Acl.Role.Abstract} 自インスタンス
     */
    denyDefaultAuthorization: function () {
        this._defaultAuthorizationAllow = false;
        
        return this;
    },
    
    /**
     * リソースへの権限を許可する
     * 
     * @param {Jeeel.Framework.Acl.Resource.Abstract} resource リソース
     * @param {String|String[]} [authorizations] 許可権限(省略は全権限)
     * @return {Jeeel.Framework.Acl.Role.Abstract} 自インスタンス
     */
    allow: function (resource, authorizations) {
        return this._addAuthorization(resource, authorizations);
    },
    
    /**
     * リソースへの権限の許可を取り消す
     * 
     * @param {Jeeel.Framework.Acl.Resource.Abstract} resource リソース
     * @param {String|String[]} [authorizations] 許可取り消し権限(省略は全権限)
     * @return {Jeeel.Framework.Acl.Role.Abstract} 自インスタンス
     */
    removeAllowance: function (resource, authorizations) {
        return this._removeAuthorization(resource, authorizations);
    },
    
    /**
     * リソースへの権限を禁止する
     * 
     * @param {Jeeel.Framework.Acl.Resource.Abstract} resource リソース
     * @param {String|String[]} [authorizations] 禁止権限(省略は全権限)
     * @return {Jeeel.Framework.Acl.Role.Abstract} 自インスタンス
     */
    deny: function (resource, authorizations) {
        return this._addAuthorization(resource, authorizations, true);
    },
    
    /**
     * リソースへの権限の禁止を取り消す
     * 
     * @param {Jeeel.Framework.Acl.Resource.Abstract} resource リソース
     * @param {String|String[]} [authorizations] 禁止取り消し権限(省略は全権限)
     * @return {Jeeel.Framework.Acl.Role.Abstract} 自インスタンス
     */
    removeDenial: function (resource, authorizations) {
        return this._removeAuthorization(resource, authorizations, true);
    },
    
    /**
     * リソースへの権限が許可されているかどうかを取得する
     * 
     * @param {Jeeel.Framework.Acl.Resource.Abstract} resource リソース
     * @param {String|String[]} [authorizations] 問い合わせ権限(省略は全権限)
     * @return {Boolean} 許可されているかどうか
     */
    isAllowed: function (resource, authorizations) {
        if ( ! (resource instanceof Jeeel.Framework.Acl.Resource.Abstract)) {
            return this._defaultAuthorizationAllow;
        }
        
        if ( ! authorizations) {
            authorizations = '*';
        } else if ( ! Jeeel.Type.isArray(authorizations)) {
            authorizations = [authorizations];
        }
        
        var type = resource.getResourceType();
        var id = resource.getResourceId();
        var i, perm;
        
        var alloweds = this._resourceAllowedAuthorizations[type] && this._resourceAllowedAuthorizations[type][id];
        var denieds = this._resourceDeniedAuthorizations[type] && this._resourceDeniedAuthorizations[type][id];
        
        for (i = this._extends.length; i--;) {
            if (this._extends[i].isAllowed(resource, authorizations)) {
                return true;
            }
        }
        
        perm = [
            alloweds && alloweds.perms || [],
            denieds && denieds.perms || []
        ];
        
        // デフォルトで許可の場合はまず禁止リストを優先する
        if (this._defaultAuthorizationAllow) {
            if (this._isDenied(resource, authorizations, perm[1])) {
                return false;
            }
            
            if (this._isAllowed(resource, authorizations, perm[0])) {
                return true;
            }
        } else {
            if (this._isAllowed(resource, authorizations, perm[0])) {
                return true;
            }
          
            if (this._isDenied(resource, authorizations, perm[1])) {
                return false;
            }
        }

        return this._defaultAuthorizationAllow;
    },
    
    /**
     * リソースへの権限が禁止されているかどうかを取得する
     * 
     * @param {Jeeel.Framework.Acl.Resource.Abstract} resource リソース
     * @param {String|String[]} [authorizations] 問い合わせ権限(省略は全権限)
     * @return {Boolean} 禁止されているかどうか
     */
    isDenied: function (resource, authorizations) {
        return ! this.isAllowed(resource, authorizations);
    },
    
    /**
     * ロールの種類を取得する
     * 
     * @return {String} ロール種類
     */
    getRoleType: function () {
        throw new Error('This method does not always have to override.');
    },
    
    /**
     * このロールを示すIDを取得する
     * 
     * @return {String} ロールID
     */
    getRoleId: function () {
        throw new Error('This method does not always have to override.');
    },
    
    /**
     * 指定したロールがこのロールと同等かどうかを返す<br />
     * 場合によってはオーバーライドして挙動を変えることが可能
     * 
     * @param {String} roleId 比較ロールID
     * @param {Boolean} [strict] 厳密に判定するかどうか
     * @return {Boolean} 同等かどうか
     */
    isMatch: function (roleId, strict) {
        if (roleId === this.getRoleId()) {
            return true;
        } else if (strict) {
            return false;
        }
        
        for (var i = this._extends.length; i--;) {
            if (this._extends[i].isMatch(roleId)) {
                return true;
            }
        }
        
        return false;
    },
    
    /**
     * コンストラクタ
     * 
     * @constructor
     */
    constructor: Jeeel.Framework.Acl.Role.Abstract,
    
    /**
     * @param {Jeeel.Framework.Acl.Resource.Abstract} resource リソース
     * @param {String|String[]} [authorizations] 付与権限(省略は全権限)
     * @param {Boolean} [isDenied] 拒否リストかどうか
     * @return {Jeeel.Framework.Acl.Role.Abstract} 自インスタンス
     */
    _addAuthorization: function (resource, authorizations, isDenied) {
        if ( ! (resource instanceof Jeeel.Framework.Acl.Resource.Abstract)) {
            return this;
        }
        
        if ( ! authorizations) {
            authorizations = ['*'];
        } else if ( ! Jeeel.Type.isArray(authorizations)) {
            authorizations = [authorizations];
        }
        
        var resourcePerms = resource.getAuthorizations();
        var perms = [];
        
        // 実際にリソースに存在する権限かどうかを確認してフィルターをかける
        for (var i = authorizations.length; i--;) {
            if (authorizations[i] === '*' || Jeeel.Type.inArray(authorizations[i], resourcePerms, true)) {
                perms.push(authorizations[i]);
            }
        }
        
        // フィルターをかけた後に追加が必要な場合は追加を実行
        if (perms.length) {
            
            var type = resource.getResourceType();
            var id = resource.getResourceId();

            if (isDenied) {
                authorizations = this._resourceDeniedAuthorizations;
            } else {
                authorizations = this._resourceAllowedAuthorizations;
            }
            
            if ( ! authorizations[type]) {
                authorizations[type] = {};
            }
            
            if ( ! authorizations[type][id]) {
                authorizations[type][id] = {
                    resource: resource,
                    perms: []
                };
            }
            
            // 権限が全ての場合は追加の必要が無いので無視
            if (authorizations[type][id].perms !== '*') {
                
                // 追加権限に*を含んでいた場合は強制的に全権限になる
                if (Jeeel.Type.inArray('*', perms, true)) {
                    authorizations[type][id].perms = '*';
                } else {
                    var tmp = Jeeel.Hash.merge(authorizations[type][id].perms, perms);
                    
                    authorizations[type][id].perms = Jeeel.Filter.Hash.Unique.create(true, true).filter(tmp);
                }
            }
        }
        
        return this;
    },
    
    _removeAuthorization: function (resource, authorizations, isDenied) {
        if ( ! (resource instanceof Jeeel.Framework.Acl.Resource.Abstract)) {
            return this;
        }
        
        if ( ! authorizations) {
            authorizations = ['*'];
        } else if ( ! Jeeel.Type.isArray(authorizations)) {
            authorizations = [authorizations];
        }
        
        var resourcePerms = resource.getAuthorizations();
        var i, perms = [];
        
        // 実際にリソースに存在する権限かどうかを確認してフィルターをかける
        for (i = authorizations.length; i--;) {
            if (authorizations[i] === '*' || Jeeel.Type.inArray(authorizations[i], resourcePerms, true)) {
                perms.push(authorizations[i]);
            }
        }
        
        // フィルターをかけた後に削除が必要な場合は削除を実行
        if (perms.length) {
            
            var type = resource.getResourceType();
            var id = resource.getResourceId();

            if (isDenied) {
                authorizations = this._resourceDeniedAuthorizations;
            } else {
                authorizations = this._resourceAllowedAuthorizations;
            }
            
            if ( ! authorizations[type]) {
                return this;
            }
            
            if ( ! authorizations[type][id]) {
                return this;
            }
            
            var clear = false;
            var tmp;
            
            if (Jeeel.Type.inArray('*', perms, true)) {
                clear = true;
            } else if (authorizations[type][id].perms === '*') {
                tmp = [];
                
                for (i = resourcePerms.length; i--;) {
                    if ( ! Jeeel.Type.inArray(resourcePerms[i], perms, true)) {
                        tmp.push(resourcePerms[i]);
                    }
                }
                
                authorizations[type][id].perms = tmp;
                
                clear = tmp.length === 0;
            } else {
                var tmp = [];
                
                for (i = authorizations[type][id].perms.length; i--;) {
                    if (Jeeel.Type.inArray(authorizations[type][id].perms[i], perms, true)) {
                        tmp.push(authorizations[type][id].perms[i]);
                    }
                }
                
                authorizations[type][id].perms = tmp;
                
                clear = tmp.length === 0;
            }
            
            if (clear) {
                delete authorizations[type][id];
                
                if (Jeeel.Type.isEmptyHash(authorizations[type])) {
                    delete authorizations[type];
                }
            }
        }
        
        return this;
    },
    
    _isAllowed: function (resource, authorizations, alloweds) {
        
        if (alloweds === '*') {
            return true;
        }
        
        var i;
        
        if (authorizations === '*') {
            var rperms = resource.getAuthorizations();
            
            for (i = rperms.length; i--;) {
                if ( ! Jeeel.Type.inArray(rperms[i], alloweds, true)) {
                    return false;
                }
            }
            
            return true;
        }
        
        for (i = alloweds.length; i--;) {

            var tmp = Jeeel.Hash.search(alloweds[i], authorizations, true);

            if (tmp === null) {
                return false;
            } else {
                authorizations.splice(tmp, 1);
            }
        }
        
        return ! authorizations.length;
    },
    
    _isDenied: function (resource, authorizations, denieds) {
        
        if (denieds === '*') {
            return true;
        }
        
        if (authorizations === '*') {
            if (denieds.length) {
                return true;
            }
            
            return false;
        }
        
        for (var i = denieds.length; i--;) {
            if (Jeeel.Type.inArray(denieds[i], authorizations, true)) {
                return true;
            }
        }
        
        return false;
    }
};

Jeeel.file.Jeeel.Framework.Acl.Role = ['User', 'Manager'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Framework.Acl.Role, Jeeel.file.Jeeel.Framework.Acl.Role);