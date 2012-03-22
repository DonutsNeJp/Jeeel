
/**
 * 指定した文字列に対してbsse64エンコードを行う
 * 
 * @param {String} str エンコード対象文字列
 * @return {String} bsse64文字列
 */
Jeeel.String.Hash.Base64.encode = function (str) {
    
    str = '' + str;
    
    var out, i, len;
    var c1, c2, c3;

    len = str.length;
    i = 0;
    out = [];
    
    while(i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        
        if (i == len) {
            out[out.length] = this.ENCODE_CHARS.charAt(c1 >> 2);
            out[out.length] = this.ENCODE_CHARS.charAt((c1 & 0x3) << 4);
            out[out.length] = "==";
            break;
        }
        
        c2 = str.charCodeAt(i++);
        
        if (i == len) {
            out[out.length] = this.ENCODE_CHARS.charAt(c1 >> 2);
            out[out.length] = this.ENCODE_CHARS.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
            out[out.length] = this.ENCODE_CHARS.charAt((c2 & 0xF) << 2);
            out[out.length] = "=";
            break;
        }
        
        c3 = str.charCodeAt(i++);
        
        out[out.length] = this.ENCODE_CHARS.charAt(c1 >> 2);
        out[out.length] = this.ENCODE_CHARS.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
        out[out.length] = this.ENCODE_CHARS.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
        out[out.length] = this.ENCODE_CHARS.charAt(c3 & 0x3F);
    }
    
    return out.join('');
};
