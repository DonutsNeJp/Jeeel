
/**
 * コンストラクタ
 * 
 * @class ACL用のカスタムエラー
 * @param {String} [message] エラーメッセージ
 * @param {Integer} [code] エラーコード
 * @param {Integer} [nestCount] このエラーメッセージを本来投げるべき箇所以外で作成した場合に指定
 */
Jeeel.Framework.Acl.Error = function (message, code, nestCount) {
    if ( ! (nestCount > 0)) {
        nestCount = 1;
    } else {
        nestCount++;
    }
    
    Jeeel.Error.call(this, message, code, nestCount);
};

Jeeel.Framework.Acl.Error.prototype = {
    
    /**
     * Error名
     * 
     * @type String
     */
    name: 'AclError',
    
    /**
     * コンストラクタ
     * 
     * @param {String} [message] エラーメッセージ
     * @param {Integer} [code] エラーコード
     * @constructor
     */
    constructor: Jeeel.Framework.Acl.Error
};

Jeeel.Class.extend(Jeeel.Framework.Acl.Error, Jeeel.Error);