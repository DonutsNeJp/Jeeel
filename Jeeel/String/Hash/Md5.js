
/**
 * 文字列をMD5に変換する
 * 
 * @param {String} data 対象の文字列
 * @return {String} MD5文字列
 */
Jeeel.String.Hash.md5 = function (data) {
    return Jeeel._Object.JeeelStringHash.Md5.hexHash('' + data);
};

/**
 * @ignore
 */
Jeeel._Object.JeeelStringHash.Md5 = {
  
    /**
     * 16進数に使用する文字列
     * 
     * @type String
     * @constant
     */
    HEX_TEXT: "0123456789abcdef",
    
    /**
     * 16進数に使用する文字列
     * 
     * @type Integer[]
     * @constant
     */
    T: [],

    round: [],
    
    pack: function (n32) {
        return String.fromCharCode(n32 & 0xFF) 
             + String.fromCharCode((n32 >>> 8) & 0xFF) 
             + String.fromCharCode((n32 >>> 16) & 0xFF) 
             + String.fromCharCode((n32 >>> 24) & 0xFF);
    },

    unpack: function (s4) {
        return (s4.charCodeAt(0))
             | (s4.charCodeAt(1) <<  8) 
             | (s4.charCodeAt(2) << 16) 
             | (s4.charCodeAt(3) << 24);
    },

    number: function (n) {
        while (n < 0) {
            n += 4294967296;
        }
        
        while (n > 4294967295) {
            n -= 4294967296;
        }
        
        return n;
    },

    applyRound: function (x, s, f, abcd, r) {
        var a, b, c, d;
        var kk, ss, ii;
        var t, u;

        a = abcd[0];
        b = abcd[1];
        c = abcd[2];
        d = abcd[3];
        kk = r[0];
        ss = r[1];
        ii = r[2];

        u = f(s[b], s[c], s[d]);
        t = s[a] + u + x[kk] + this.T[ii];
        t = this.number(t);
        t = ((t<<ss) | (t>>>(32-ss)));
        t += s[b];
        s[a] = this.number(t);
    },
    
    hash: function (data) {
        this.init();
        
        var abcd, x, state, s;
        var len, index, padLen, f, r;
        var i, j, k;
        var tmp;

        state = [0X67452301, 0XEFCDAB89, 0X98BADCFE, 0X10325476];
        
        len = data.length;
        index = len & 0x3f;
        
        padLen = (index < 56) ? (56 - index) : (120 - index);
        
        if (padLen > 0) {
            data += "\x80";
            
            for (i = 0; i < padLen - 1; i++) {
                data += "\x00";
            }
        }
        
        data += this.pack(len * 8);
        data += this.pack(0);
        len  += padLen + 8;
        
        abcd = [0, 1, 2, 3];
        x    = [];
        s    = [];

        for (k = 0; k < len; k += 64) {
            for (i = 0, j = k; i < 16; i++, j += 4) {
                x[i] = (data.charCodeAt(j))
                     | (data.charCodeAt(j + 1) <<  8) 
                     | (data.charCodeAt(j + 2) << 16) 
                     | (data.charCodeAt(j + 3) << 24);
            }
            
            for (i = 0; i < 4; i++) {
                s[i] = state[i];
            }
            
            for (i = 0; i < 4; i++) {
                f = this.round[i][0];
                r = this.round[i][1];
                
                for (j = 0; j < 16; j++) {
                    this.applyRound(x, s, f, abcd, r[j]);
                    
                    tmp = abcd[0];
                    abcd[0] = abcd[3];
                    abcd[3] = abcd[2];
                    abcd[2] = abcd[1];
                    abcd[1] = tmp;
                }
            }

            for (i = 0; i < 4; i++) {
              state[i] += s[i];
              state[i] = this.number(state[i]);
            }
        }

        return this.pack(state[0]) 
             + this.pack(state[1]) 
             + this.pack(state[2]) 
             + this.pack(state[3]);
    },
    
    hexHash: function (data) {
        var i, out, c;
        var bit128;

        bit128 = this.hash(data);
        out = [];
        
        for (i = 0; i < 16; i++) {
            c = bit128.charCodeAt(i);
            
            out[out.length] = this.HEX_TEXT.charAt((c>>4) & 0xF);
            out[out.length] = this.HEX_TEXT.charAt(c & 0xF);
        }
        
        return out.join('');
    },
    
    init: function () {
        if (this.init.ignore) {
            return;
        }
        
        this.init.ignore = true;
        
        var merge = {
            T: [
                0X00000000, 0XD76AA478, 0XE8C7B756, 0X242070DB,
                0XC1BDCEEE, 0XF57C0FAF, 0X4787C62A, 0XA8304613,
                0XFD469501, 0X698098D8, 0X8B44F7AF, 0XFFFF5BB1,
                0X895CD7BE, 0X6B901122, 0XFD987193, 0XA679438E,
                0X49B40821, 0XF61E2562, 0XC040B340, 0X265E5A51,
                0XE9B6C7AA, 0XD62F105D, 0X02441453, 0XD8A1E681,
                0XE7D3FBC8, 0X21E1CDE6, 0XC33707D6, 0XF4D50D87,
                0X455A14ED, 0XA9E3E905, 0XFCEFA3F8, 0X676F02D9,
                0X8D2A4C8A, 0XFFFA3942, 0X8771F681, 0X6D9D6122,
                0XFDE5380C, 0XA4BEEA44, 0X4BDECFA9, 0XF6BB4B60,
                0XBEBFBC70, 0X289B7EC6, 0XEAA127FA, 0XD4EF3085,
                0X04881D05, 0XD9D4D039, 0XE6DB99E5, 0X1FA27CF8,
                0XC4AC5665, 0XF4292244, 0X432AFF97, 0XAB9423A7,
                0XFC93A039, 0X655B59C3, 0X8F0CCC92, 0XFFEFF47D,
                0X85845DD1, 0X6FA87E4F, 0XFE2CE6E0, 0XA3014314,
                0X4E0811A1, 0XF7537E82, 0XBD3AF235, 0X2AD7D2BB,
                0XEB86D391
            ],

            round1: [
                [ 0, 7, 1], [ 1,12, 2],
                [ 2,17, 3], [ 3,22, 4],
                [ 4, 7, 5], [ 5,12, 6],
                [ 6,17, 7], [ 7,22, 8],
                [ 8, 7, 9], [ 9,12,10],
                [10,17,11], [11,22,12],
                [12, 7,13], [13,12,14],
                [14,17,15], [15,22,16]
            ],

            round2: [
                [ 1, 5,17], [ 6, 9,18],
                [11,14,19], [ 0,20,20],
                [ 5, 5,21], [10, 9,22],
                [15,14,23], [ 4,20,24],
                [ 9, 5,25], [14, 9,26],
                [ 3,14,27], [ 8,20,28],
                [13, 5,29], [ 2, 9,30],
                [ 7,14,31], [12,20,32]
            ],

            round3: [
                [ 5, 4,33], [ 8,11,34],
                [11,16,35], [14,23,36],
                [ 1, 4,37], [ 4,11,38],
                [ 7,16,39], [10,23,40],
                [13, 4,41], [ 0,11,42],
                [ 3,16,43], [ 6,23,44],
                [ 9, 4,45], [12,11,46],
                [15,16,47], [ 2,23,48]
            ],

            round4: [
                [ 0, 6,49], [ 7,10,50],
                [14,15,51], [ 5,21,52],
                [12, 6,53], [ 3,10,54],
                [10,15,55], [ 1,21,56],
                [ 8, 6,57], [15,10,58],
                [ 6,15,59], [13,21,60],
                [ 4, 6,61], [11,10,62],
                [ 2,15,63], [ 9,21,64]
            ],

            /**
             * @ignore
             */
            F: function (x, y, z) {return (x & y) | (~x & z);},
            
            /**
             * @ignore
             */
            G: function (x, y, z) {return (x & z) | (y & ~z);},
            
            /**
             * @ignore
             */
            H: function (x, y, z) {return x ^ y ^ z;},
            
            /**
             * @ignore
             */
            I: function (x, y, z) {return y ^ (x | ~z);}
        };
    
        this.T = merge.T;
        this.round = [
            [merge.F, merge.round1],
            [merge.G, merge.round2],
            [merge.H, merge.round3],
            [merge.I, merge.round4]
        ];
    }
};