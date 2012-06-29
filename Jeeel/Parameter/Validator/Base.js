
/**
 * コンストラクタ
 * 
 * @class 基本となるバリデータクラス
 * @augments Jeeel.Parameter.Validator.Abstract
 */
Jeeel.Parameter.Validator.Base = function () {
    Jeeel.Parameter.Validator.Abstract.call(this);
};

Jeeel.Parameter.Validator.Base.prototype = {
    
    /**
     * 必須項目のバリデートを行う
     * 
     * @param {Mixed} value バリデート値
     * @return {Boolean} 空じゃなかったかどうか(null, undefined以外が通過)
     */
    validateRequired: function (value) {
        return ! Jeeel.Type.isEmpty(value);
    },
    
    /**
     * 列挙体のバリデートを行う
     * 
     * @param {Mixed} value バリデート値
     * @param {Array} enums 列挙体
     * @param {Boolean} strict 値比較の際に型まで比較するかどうか
     * @return {Boolean} 指定した列挙体中の値だったかどうか
     */
    validateEnum: function (value, enums, strict) {
        return ! this.validateRequired(value) || Jeeel.Hash.inHash(value, enums || [], strict);
    },
    
    /**
     * 数値が下限以上かのバリデートを行う
     * 
     * @param {String|Number} value 数値
     * @param {Number} min 下限
     * @return {Boolean} 数値が下限以上かどうか
     */
    validateNumericMin: function (value, min) {
        return ! this.validateRequired(value) || (+min <= +value);
    },
    
    /**
     * 数値が上限以下かのバリデートを行う
     * 
     * @param {String|Number} value 数値
     * @param {Number} max 上限
     * @return {Boolean} 数値が上限以下かどうか
     */
    validateNumericMax: function (value, max) {
        return ! this.validateRequired(value) || (+value <= +max);
    },
    
    /**
     * 数値が範囲内かのバリデートを行う
     * 
     * @param {String|Number} value 数値
     * @param {Number} min 下限
     * @param {Number} max 上限
     * @return {Boolean} 数値が範囲内かどうか
     */
    validateBetween: function (value, min, max) {
        if ( ! this.validateRequired(value)) {
            return true;
        }
        
        value = +value;
        
        return (+min <= value && value <= +max);
    },
    
    /**
     * 文字列の長さの下限のバリデートを行う
     * 
     * @param {String} str 文字列
     * @param {Integer} min 長さの下限
     * @return {Boolean} 長さが下限以上かどうか
     */
    validateMinLength: function (str, min) {
        if ( ! this.validateRequired(str)) {
            return true;
        }
        
        str = '' + str;
        min = Math.floor(+min);
        
        return min <= str.length;
    },
    
    /**
     * 文字列の長さの上限のバリデートを行う
     * 
     * @param {String} str 文字列
     * @param {Integer} max 長さの上限
     * @return {Boolean} 長さが上限以下かどうか
     */
    validateMaxLength: function (str, max) {
        if ( ! this.validateRequired(str)) {
            return true;
        }
        
        str = '' + str;
        max = Math.floor(+max);
        
        return str.length <= max;
    },

    /**
     * 文字列の長さのバリデートを行う
     * 
     * @param {String} str 文字列
     * @param {Integer} min 長さの下限
     * @param {Integer} max 長さの上限
     * @return {Boolean} 長さが範囲以内かどうか
     */
    validateLength: function (str, min, max) {
        if ( ! this.validateRequired(str)) {
            return true;
        }
        
        str = '' + str;
        min = Math.floor(+min);
        max = Math.floor(+max);
        
        return min <= str.length && str.length <= max;
    },
    
    /**
     * 半角英数字のバリデートを行う
     * 
     * @param {String} alnum 半角英数字
     * @return {Boolean} 半角英数字かどうか
     */
    validateAlnum: function (alnum) {
        return ! this.validateRequired(alnum) || /^[a-z0-9]*$/ig.test(alnum);
    },
    
    /**
     * 半角英字のバリデートを行う
     * 
     * @param {String} alpha 半角英字
     * @return {Boolean} 半角英字かどうか
     */
    validateAlpha: function (alpha) {
        return ! this.validateRequired(alpha) || /^[a-z]*$/ig.test(alpha);
    },
    
    /**
     * 数値のバリデートを行う
     * 
     * @param {String|Number} digits 数値
     * @return {Boolean} 数値かどうか
     */
    validateDigits: function (digits) {
        return ! this.validateRequired(digits) || /^[0-9]+$/ig.test(digits);
    },
    
    /**
     * 半角のバリデートを行う
     * 
     * @param {String} str 文字列
     * @return {Boolean} 半角かどうか
     */
    validateHalfWidth: function (str) {
        return  ! this.validateRequired(str) || /^[\u0000-\u007E]*$/ig.test(str);
    },
    
    /**
     * 全角のバリデートを行う
     * 
     * @param {String} str 文字列
     * @return {Boolean} 半角かどうか
     */
    validateFullWidth: function (str) {
        return  ! this.validateRequired(str) || /^[^\u0020-\u007E]*$/ig.test(str);
    },
    
    /**
     * ひらがなのバリデートを行う
     * 
     * @param {String} str 文字列
     * @return {Boolean} ひらがなかどうか
     */
    validateHiragana: function (str) {
        return ! this.validateRequired(str) || /^[\u3001\u3002\u3041-\u3096　]*$/ig.test(str);
    },
    
    /**
     * カタカナのバリデートを行う
     * 
     * @param {String} str 文字列
     * @return {Boolean} カタカナかどうか
     */
    validateKatakana: function (str) {
        return ! this.validateRequired(str) || /^[\u30A0-\u30FC\u31F0-\u31FF　]*$/ig.test(str);
    },
    
    /**
     * 半角カタカナのバリデートを行う
     * 
     * @param {String} str 文字列
     * @return {Boolean} 半角カタカナかどうか
     */
    validateHalfWidthKana: function (str) {
        return  ! this.validateRequired(str) || /^[\uFF65-\uFF9F ]*$/ig.test(str);
    },
    
    /**
     * 真偽値のバリデートを行う
     * 
     * @param {Boolean|Integer|String} bool 真偽値
     * @return {Boolean} 真偽値かどうか
     */
    validateBool: function (bool) {
        if ( ! this.validateRequired(bool)) {
            return true;
        }
        
        return bool === true || bool === false
            || bool === 1    || bool === 0
            || bool === '1'  || bool === '0';
    },

    /**
     * Emailのバリデートを行う
     * 
     * @param {String} email Email
     * @return {Boolean} Emailかどうか
     */
    validateEmail: function (email) {
        if ( ! this.validateRequired(email)) {
            return true;
        }
        
        var reg = /^(?:(?:(?:(?:[a-zA-Z0-9_!#\$\%&'*+\/=?\^`{}~|\-]+)(?:\.(?:[a-zA-Z0-9_!#\$\%&'*+\/=?\^`{}~|\-]+))*)|(?:"(?:\\[^\r\n]|[^\\"])*")))\@(?:(?:(?:(?:[a-zA-Z0-9_!#\$\%&'*+\/=?\^`{}~|\-]+)(?:\.(?:[a-zA-Z0-9_!#\$\%&'*+\/=?\^`{}~|\-]+))*)|(?:\[(?:\\\S|[\x21-\x5a\x5e-\x7e])*\])))$/;
        
        return reg.test(email);
    },

    /**
     * URLのバリデートを行う
     * 
     * @param {String} url URL
     * @return {Boolean} URLかどうか
     */
    validateUrl: function (url) {
        var reg = /^(https?|ftp):\/\/(?:([^@:]+)(?::([^@]+))?@)?([^:\/]+)(?::([0-9]+))?(\/[^?]*)?(?:\?([^#]*))?(?:#(.*))?$/;
        
        return ! this.validateRequired(url) || reg.test(url);
    },
    
    /**
     * IPのバリデートを行う
     * 
     * @param {String} ip IP
     * @return {Boolean} IPかどうか
     */
    validateIp: function (ip) {
        if ( ! this.validateRequired(ip)) {
            return true;
        }
        
        ip = '' + ip;
        
        var ips, reg;
        
        // IPv4の場合(IPv6未対応)
        if (ip.indexOf('.') >= 0) {
            ips = ip.split('.');
            
            if (ips.length !== 4) {
                return false;
            }
            
            reg = /^0|[1-9][0-9]*$/g;
            
            for (var i = ips.length; i--;) {
                if ( ! ips[i].match(reg)) {
                    return false;
                }
                
                ips[i] = +ips[i];
                
                if ( ! (0 <= ips[i] && ips[i] <= 255)) {
                    return false;
                }
            }
            
            return true;
        }
        
        return false;
    },

    /**
     * 文字列の正規表現でのバリデートを行う
     * 
     * @param {String} value 検証文字列
     * @param {String} pattern 正規表現
     * @return bool 正規表現にマッチするかどうか
     */
    validateRegex: function (value, pattern) {
        return ! this.validateRequired(value) 
            || !!('' + value).match(new RegExp(Jeeel.String.escapeRegExp(pattern)));
    }
};

Jeeel.Class.extend(Jeeel.Parameter.Validator.Base, Jeeel.Parameter.Validator.Abstract);

Jeeel.Parameter.addDefaultValidator(new Jeeel.Parameter.Validator.Base());
