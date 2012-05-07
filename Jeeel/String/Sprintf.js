/**
 * sprintfのJS版<br />
 * 書式: %[フラグ][フィールド幅].[精度][型指定子]<br />
 * フラグ: -, +, 空白, 0, #<br />
 * 型指定子: b, c, d, e, E, u, f, g, G, o, s, x, X<br />
 * 正規表現を使用するのっでIEでの多用はお勧めしない
 *
 * @param {String} format フォーマット
 * @param {Mixied} var_args フォーマットに対して割り当てる値
 */
Jeeel.String.sprintf = function (format, var_args) {
    format = '' + format;
  
    var ch, res = [];
    var plCnt = 0;
    var len = format.length;
    var args = Array.prototype.slice.call(arguments, 1, arguments.length);
    var JeeelString = Jeeel._Object.JeeelString;
    var tmp = {
        length: 1
    };
    
    for (var i = 0; i < len; i++) {
        ch = format.charAt(i);
        
        // %が出るまで数値を進めて%が出たらプレースホルダ―毎変換する
        switch (ch) {
            case '%':
                if (format.charAt(i + 1) === '%') {
                    res[res.length] = '%';
                    i++;
                } else {
                    res[res.length] = JeeelString.convertPlaceholder(format.slice(i, len), args[plCnt++], tmp);
                    
                    i += tmp.length - 1;
                }
                break;
                
            default:
                res[res.length] = ch;
                break;
        }
    }
    
    return res.join('');
};

/**
 * @ignore
 */
Jeeel._Object.JeeelString.PLACEHOLDER_REGS = /%([+\-# 0]*)?([1-9][0-9]*)?(?:\.(|[0-9]*))?([^0-9]|$)/;

/**
 * @ignore
 */
Jeeel._Object.JeeelString.PLACEHOLDERS = {
    
    /**
     * 二進数に変換
     * 
     * @param {Hash} op オプション
     * @param {Mixied} value 値
     * @return {String} 変換後の値
     */
    b: function (op, value) {
        return this.cnvRadix(op, value, 2);
    },
    
    /**
     * 文字に変換
     * 
     * @param {Hash} op オプション
     * @param {Mixied} value 値
     * @return {String} 変換後の値
     */
    c: function (op, value) {
        return String.fromCharCode(+value);
    }, 
    
    /**
     * 整数に変換
     * 
     * @param {Hash} op オプション
     * @param {Mixied} value 値
     * @return {String} 変換後の値
     */
    d: function (op, value) {
        return this.cnvInt(op, value);
    }, 
    
    /**
     * 指数表記に変換
     * 
     * @param {Hash} op オプション
     * @param {Mixied} value 値
     * @return {String} 変換後の値
     */
    e: function (op, value) {
        return this.cnvExponential(op, value);
    }, 
    
    /**
     * 指数表記の大文字に変換
     * 
     * @param {Hash} op オプション
     * @param {Mixied} value 値
     * @return {String} 変換後の値
     */
    E: function (op, value) {
        return this.cnvExponential(op, value, true);
    }, 
    
    /**
     * 符号なし整数に変換
     * 
     * @param {Hash} op オプション
     * @param {Mixied} value 値
     * @return {String} 変換後の値
     */
    u: function (op, value) {
        return this.cnvInt(op, value, true);
    },
    
    /**
     * 数値に変換(double)<br />
     * 実際には
     * 
     * @param {Hash} op オプション
     * @param {Mixied} value 値
     * @return {String} 変換後の値
     */
    f: function (op, value) {
        return this.cnvFloat(op, value);
    },
    
    /**
     * 数値に変換(float)
     * 
     * @param {Hash} op オプション
     * @param {Mixied} value 値
     * @return {String} 変換後の値
     */
    F: function (op, value) {
        return this.cnvFloat(op, value);
    },
    
    /**
     * 有効桁数から指数表記もしくは数値に変換
     * 
     * @param {Hash} op オプション
     * @param {Mixied} value 値
     * @return {String} 変換後の値
     */
    g: function (op, value) {
        
        var valid = false;
        
        if (op.accur === null || op.accur >= (+value).toString().length) {
            op.accur = null;
            valid = true;
        }

        return valid ? this.cnvFloat(op, value) : this.cnvExponential(op, value);
    },
    
    /**
     * 有効桁数から指数表記もしくは数値の大文字に変換
     * 
     * @param {Hash} op オプション
     * @param {Mixied} value 値
     * @return {String} 変換後の値
     */
    G: function (op, value) {
      
        var valid = false;
        
        if (op.accur === null || op.accur >= (+value).toString().length) {
            op.accur = null;
            valid = true;
        }
        
        return valid ? this.cnvFloat(op, value) : this.cnvExponential(op, value, true);
    },
    
    /**
     * 八進数に変換
     * 
     * @param {Hash} op オプション
     * @param {Mixied} value 値
     * @return {String} 変換後の値
     */
    o: function (op, value) {
        return this.cnvRadix(op, value, 8);
    },
    
    /**
     * 文字列に変換
     * 
     * @param {Hash} op オプション
     * @param {Mixied} value 値
     * @return {String} 変換後の値
     */
    s: function (op, value) {
        value = '' + value;
        var width = (+op.width || 0) - value.length;
        
        if (width <= 0) {
            return value;
        }
        
        var pad = op.pad;
        
        if (op.right) {
            value += Array(width + 1).join(pad);
        } else {
            value = Array(width + 1).join(pad) + value;
        }
        
        return value;
    },
    
    /**
     * 十六進数に変換
     * 
     * @param {Hash} op オプション
     * @param {Mixied} value 値
     * @return {String} 変換後の値
     */
    x: function (op, value) {
        return this.cnvRadix(op, value, 16);
    },
    
    /**
     * 十六進数大文字に変換
     * 
     * @param {Hash} op オプション
     * @param {Mixied} value 値
     * @return {String} 変換後の値
     */
    X: function (op, value) {
        return this.cnvRadix(op, value, 16, true);
    },
    
    /**
     * N進数に変換
     * 
     * @param {Hash} op オプション
     * @param {Mixied} value 値
     * @param {Integer} radix 何進数に変換するか
     * @param {Boolean} [toUpper] 大文字にするかどうか
     * @return {String} 変換後の値
     */
    cnvRadix: function (op, value, radix, toUpper) {
        value = +value;
        
        var isPlus = value >= 0;
      
        value = Math.floor(isPlus && value || -value).toString(radix);
        
        var prf = ! isPlus && '-' || '';
        
        if (op.accur !== null) {
            value = prf = '';
        }
        
        if (toUpper) {
            value = value.toUpperCase();
        }
        
        if (value && op.sp) {
            switch (radix) {
                case 8:
                    prf = prf + '0';
                    break;
                    
                case 16:
                    prf = prf + '0x';
                    break;
            }
        }
        
        var width = (+op.width || 0) - value.length - prf.length;
        
        if (width <= 0) {
            return prf + value;
        }
        
        var pad = op.pad;
        
        if (op.right) {
            value += Array(width + 1).join(pad);
        } else {
            value = Array(width + 1).join(pad) + value;
        }

        return prf + value;
    },
    
    /**
     * 整数に変換
     * 
     * @param {Hash} op オプション
     * @param {Mixied} value 値
     * @param {Boolean} [unsigned] 符号を付けないかどうか
     * @return {String} 変換後の値
     */
    cnvInt: function (op, value, unsigned) {
        value = unsigned ? Math.abs(+value) : +value;
        
        var isPlus = value >= 0;
        
        value = Math.floor(isPlus && value || -value).toString(10);

        var prf = isPlus && op.plus && '+' || ! isPlus && '-' || '';
        
        var width = (+op.width || 0) - value.length - prf.length;
        
        if (width <= 0) {
            return prf + value;
        }
        
        var pad = op.pad;
        
        if (op.right) {
            value += Array(width + 1).join(pad);
        } else {
            value = Array(width + 1).join(pad) + value;
        }
        
        return prf + value;
    },
    
    /**
     * 数値に変換
     * 
     * @param {Hash} op オプション
     * @param {Mixied} value 値
     * @return {String} 変換後の値
     */
    cnvFloat: function (op, value) {
        value = +value;
        
        var isPlus = value >= 0;
        var accur = op.accur;
        
        if (accur !== null) {
            value = (isPlus && value || -value).toFixed(accur);
        } else {
            value = (isPlus && value || -value).toString(10);
        }

        var prf = isPlus && op.plus && '+' || ! isPlus && '-' || '';
        
        var width = (+op.width || 0) - value.length - prf.length;
        
        if (width <= 0) {
            return prf + value;
        }
        
        var pad = op.pad;
        
        if (op.right) {
            value += Array(width + 1).join(pad);
        } else {
            value = Array(width + 1).join(pad) + value;
        }
        
        return prf + value;
    },
    
    /**
     * 指数に変換
     * 
     * @param {Hash} op オプション
     * @param {Mixied} value 値
     * @param {Boolean} [toUpper] 大文字にするかどうか
     * @return {String} 変換後の値
     */
    cnvExponential: function (op, value, toUpper) {
        value = +value;
        
        var isPlus = value >= 0;
        var accur = op.accur;
        
        if (accur !== null) {
            value = (isPlus && value || -value).toExponential(accur);
        } else {
            value = (isPlus && value || -value).toExponential();
        }
        
        var prf = isPlus && op.plus && '+' || ! isPlus && '-' || '';
        
        var width = (+op.width || 0) - value.length - prf.length;
        
        if (width <= 0) {
            return prf + value;
        }
        
        var pad = op.pad;
        
        if (op.right) {
            value += Array(width + 1).join(pad);
        } else {
            value = Array(width + 1).join(pad) + value;
        }
        
        if (toUpper) {
            value = value.toUpperCase();
        }
        
        return prf + value;
    }
};

/**
 * @ignore
 */
Jeeel._Object.JeeelString.convertPlaceholder = function (placeholder, value, res) {
  
    placeholder = placeholder.match(this.PLACEHOLDER_REGS);
    
    res.length = placeholder[0].length;

    var plPrms = {};
    
    // プレースホルダ―の型指定子が一致しなかったら丸ごと消す
    if ( ! this.PLACEHOLDERS[placeholder[4]]) {
        return '';
    }
    
    var flg = placeholder[1] && placeholder[1].split('');
    
    plPrms.width = placeholder[2] || 0;
    plPrms.accur = (placeholder[3] || placeholder[3] === '') ? +placeholder[3] : null;
    
    if (flg) {
        
        for (var i = flg.length; i--;) {
            
            switch (flg[i]) {
                case '-':
                    plPrms.right = true;
                    break;
                    
                case '+':
                    plPrms.plus = true;
                    break;
                    
                case '#':
                    plPrms.sp = true;
                    break;
                    
                case ' ':
                case '0':
                    if ( ! plPrms.pad) {
                        plPrms.pad = flg[i];
                    }
                    break;
            }
        }
    }
    
    // パディング文字がなかった場合は空白をデフォ値にする
    if ( ! plPrms.pad) {
        plPrms.pad = ' ';
    }
    
    return this.PLACEHOLDERS[placeholder[4]](plPrms, value);
};
