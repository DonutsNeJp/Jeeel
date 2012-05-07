
/**
 * コンストラクタ
 * 
 * @class ユーザーに対してのロールを扱うクラス
 * @augments Jeeel.Framework.Acl.Role.Abstract
 * @param {String} roleName ロール名
 */
Jeeel.Framework.Acl.Role.User = function (roleName) {
    Jeeel.Framework.Acl.Role.Abstract.call(this);
    
    this._roleName = roleName;
};

/**
 * インスタンスの作成を行う
 * 
 * @param {String} roleName ロール名
 * @return {Jeeel.Framework.Acl.Role.User} 作成したインスタンス
 */
Jeeel.Framework.Acl.Role.User.create = function (roleName) {
    return new this(roleName);
};

Jeeel.Framework.Acl.Role.User.prototype = {
    
    _roleName: '',
    
    /**
     * ロールの種類を取得する
     * 
     * @return {String} ロール種類
     */
    getRoleType: function () {
        return 'User';
    },
    
    /**
     * このロールを示す名前を取得する
     * 
     * @return {String} ロールURL
     */
    getRoleId: function () {
        return this._roleName;
    }
};

Jeeel.Class.extend(Jeeel.Framework.Acl.Role.User, Jeeel.Framework.Acl.Role.Abstract);