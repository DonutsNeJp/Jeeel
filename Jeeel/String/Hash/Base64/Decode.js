
/**
 * bsse64エンコードされた文字列を復元する
 * 
 * @param {String} str base64文字列
 * @return {String} 復元した文字列
 */
Jeeel.String.Hash.Base64.decode = function (str) {
    str = '' + str;
    
    var c1, c2, c3, c4;
    var i, len, out;

    len = str.length;
    i = 0;
    out = [];
    
    while(i < len) {
        /* c1 */
        do {
            c1 = this.DECODE_CHARS[str.charCodeAt(i++) & 0XFF];
        } while(i < len && c1 == -1);
        
        if (c1 == -1) {
            break;
        }

        /* c2 */
        do {
            c2 = this.DECODE_CHARS[str.charCodeAt(i++) & 0XFF];
        } while(i < len && c2 == -1);
        
        if (c2 == -1) {
            break;
        }

        out[out.length] = String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

        /* c3 */
        do {
            c3 = str.charCodeAt(i++) & 0XFF;
            
            if (c3 == 61) {
                return out.join('');
            }
            
            c3 = this.DECODE_CHARS[c3];
        } while(i < len && c3 == -1);
        
        if (c3 == -1) {
            break;
        }

        out[out.length] = String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

        /* c4 */
        do {
            c4 = str.charCodeAt(i++) & 0XFF;
            
            if (c4 == 61) {
                return out.join('');
            }
            
            c4 = this.DECODE_CHARS[c4];
        } while(i < len && c4 == -1);
        
        if (c4 == -1) {
            break;
        }
        
        out[out.length] = String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    
    return out.join('');
};
