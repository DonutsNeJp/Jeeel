
/**
 * コンストラクタ
 * 
 * @class URLをリソースとして扱うクラス
 * @augments Jeeel.Framework.Acl.Resource.Abstract
 * @param {String} url リソースのURL
 * @param {Boolean} [includeHierarchy] 下位階層を含むかどうか
 */
Jeeel.Framework.Acl.Resource.Url = function (url, includeHierarchy) {
    Jeeel.Framework.Acl.Resource.Abstract.call(this);
    
    var absUrl = Jeeel.UserAgent.getBaseUrl() + url;
    
    var suffix;
    
    if (includeHierarchy) {
        suffix = '(?:[?\\/]|$)';
    } else {
        suffix = '\\/?(?:\\?[^#]*)?(?:#.*)?$';
    }
    
    this._url = url;
    this._reg = new RegExp('^' + Jeeel.String.escapeRegExp(this._url) + suffix, 'i');
    this._regFull = new RegExp('^' + Jeeel.String.escapeRegExp(absUrl) + suffix, 'i');
    
    // URLのリソースはアクセス以外に権限がない
    this.addAuthorization('Access');
};

/**
 * インスタンスの作成を行う
 * 
 * @param {String} url リソースのURL
 * @param {Boolean} [includeHierarchy] 下位階層を含むかどうか
 * @return {Jeeel.Framework.Acl.Resource.Url} 作成したインスタンス
 */
Jeeel.Framework.Acl.Resource.Url.create = function (url, includeHierarchy) {
    return new this(url, includeHierarchy);
};

Jeeel.Framework.Acl.Resource.Url.prototype = {
    
    _url: '',
    _reg: null,
    _regFull: null,
    
    /**
     * リソースの種類を取得する
     * 
     * @return {String} リソース種類
     */
    getResourceType: function () {
        return 'Url';
    },
    
    /**
     * このリソースを示すURLを取得する
     * 
     * @return {String} リソースURL
     */
    getResourceId: function () {
        return this._url;
    },
    
    /**
     * 指定したリソースがこのリソースと同等かどうかを返す
     * 
     * @param {String} resourceId 比較リソースID
     * @param {Boolean} [strict] 継承関係を無視して厳密に判定するかどうか
     * @return {Boolean} 同等かどうか
     */
    isMatch: function (resourceId, strict) {
        if (strict) {
            return this._url === resourceId;
        }
        
        return this._reg.test(resourceId) || this._regFull.test(resourceId);
    }
};

Jeeel.Class.extend(Jeeel.Framework.Acl.Resource.Url, Jeeel.Framework.Acl.Resource.Abstract);
