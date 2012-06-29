
/**
 * コンストラクタ
 *
 * @class URL解析クラス
 * @augments Jeeel.Filter.Abstract
 */
Jeeel.Filter.Url.Parser = function () {
    Jeeel.Filter.Abstract.call(this);
};

/**
 * インスタンスの作成を行う
 *
 * @return {Jeeel.Filter.Url.Parser} 作成したインスタンス
 */
Jeeel.Filter.Url.Parser.create = function () {
    return new this();
};

Jeeel.Filter.Url.Parser.prototype = {
    
    /**
     * URLをパースするための正規表現
     * 
     * @type RegExp
     * @private
     */
    _parseReg: /^(https?|ftp):\/\/(?:([^@:]+)(?::([^@]+))?@)?([^:\/]+)(?::([0-9]+))?(\/[^?]*)?(?:\?([^#]*))?(?:#(.*))?$/,
    
    /**
     * URLを解析して返す
     * 
     * @param {String} url URL
     * @return {Hash} 連想配列(URL以外を指定された場合はnullを返す)
     */
    parse: function (url) {
        return this.filter(url);
    },
  
    /**
     * @private
     */
    _filter: function (val) {
        var match = ('' + val).match(this._parseReg);
        
        if ( ! match) {
            return null;
        }
        
        return {
            scheme: match[1],
            user: match[2] || '',
            pass: match[3] || '',
            host: match[4],
            port: +match[5] || null,
            path: match[6] || '',
            query: match[7] || '',
            fragment: match[8] || ''
        };
    }
};

Jeeel.Class.extend(Jeeel.Filter.Url.Parser, Jeeel.Filter.Abstract);
