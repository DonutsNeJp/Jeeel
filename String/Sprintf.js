/**
 * SprintfのJS版<br />
 * オーダー及びバグ検証・最適化をしていない<br />
 * 多用はお勧めしない
 *
 * @param {String} format フォーマット
 * @param {Mixied} var_args フォーマットに対して割り当てる値
 */
Jeeel.String.sprintf = function (format, var_args) {
    var ch;
    var value;
    var longflag;
    var ljust;
    var len, llen;
    var zpad;
    var p;
    var output;
    var formatIndex, argIndex;
    var argc, argv;
    var specin;
    var method = Jeeel._Object.JeeelString;

    output = '';
    formatIndex = 0;
    argIndex = 1;
    argv = arguments;
    argc = arguments.length;

    while (formatIndex < format.length) {
        ch = format.substr(formatIndex++, 1);

        if (ch != '%' || formatIndex == format.length) {
            output += ch;
        } else {
            // ch == '%'
            ljust = len = zpad = longflag = 0;
            llen = -1;
            p = formatIndex;
            specin = true;

            while (specin) {
                ch = format.substr(formatIndex++, 1);

                switch(ch) {
                    case '-':
                        ljust = 1;
                        continue;

                    case '0':         // set zero padding if len not set
                        if(len == 0) {
                            zpad = 1;
                        }
                    // FALLTHROUGH
                    case '1': case '2': case '3':
                    case '4': case '5': case '6':
                    case '7': case '8': case '9':
                        len = len * 10 + (+ch);
                        continue;

                    case '.':
                        llen = len;
                        len = 0;
                        continue;

                    case '*':
                        if (argIndex < argc) {
                            len = parseInt(argv[argIndex++]);
                        }
                        else {
                            len = 0;
                        }
                        
                        if (len < 0) {
                            ljust = 1;
                            len = -len;
                        }
                        continue;

                    case 'l':
                        longflag = 1;
                        continue;

                    case 'u': case 'U':
                        if (argIndex < argc) {
                            if (longflag) {
                                value = parseInt(argv[argIndex++]);
                            } else {
                                value = parseInt(argv[argIndex++]);
                                value %= 4294967296;
                            }
                        } else {
                            value = 0;
                        }

                        output += method.doprFmtnum(value, 10,0, ljust, len, zpad);
                        break;

                    case 'o': case 'O':
                        if (argIndex < argc) {
                            if (longflag) {
                                value = parseInt(argv[argIndex++]);
                            } else {
                                value = parseInt(argv[argIndex++]);
                                value %= 4294967296;
                            }
                        } else {
                            value = 0;
                        }

                        output += method.doprFmtnum(value, 8,0, ljust, len, zpad);
                        break;

                    case 'd': case 'D':
                        if (argIndex < argc) {
                            if (longflag) {
                                value = parseInt(argv[argIndex++]);
                            } else {
                                value = parseInt(argv[argIndex++]);
                                value %= 4294967296;
                            }
                        } else {
                            value = 0;
                        }

                        output += method.doprFmtnum(value, 10,1, ljust, len, zpad);
                        break;

                    case 'x':
                        if (argIndex < argc) {
                            if (longflag) {
                                value = parseInt(argv[argIndex++]);
                            } else {
                                value = parseInt(argv[argIndex++]);
                                value %= 4294967296;
                            }
                        } else {
                            value = 0;
                        }

                        output += method.doprFmtnum(value, 16,0, ljust, len, zpad);
                        break;

                    case 'X':
                        if (argIndex < argc) {
                            if (longflag) {
                                value = parseInt(argv[argIndex++]);
                            } else {
                                value = parseInt(argv[argIndex++]);
                                value %= 4294967296;
                            }
                        } else {
                            value = 0;
                        }

                        output += method.doprFmtnum(value, -16,0, ljust, len, zpad);
                        break;

                    case 's':
                        if (argIndex < argc) {
                            value = argv[argIndex++];
                            if(value == null)
                                value = "(null)";
                            else
                                value = value + "";	// toString
                        } else {
                            value = '';
                        }

                        output += method.doprFmtstr(value, ljust, len, llen);
                        break;

                    case 'c':
                        if (argIndex < argc) {
                            value = parseInt(argv[argIndex++]);
                        } else {
                            value = 0;
                        }
                        
                        output += method.doprFromCharCode(value);
                        break;

                    case '%':
                        output += '%';
                        break;

                    // Not supported
//                    case 'f': case 'e': case 'E': case 'g': case 'G':
//                      if (argIndex < argc) {
//                        value = argv[argIndex++];
//                      } else {
//                        value = 0.0;
//                      }
//                      output += _dopr_fmtdouble(format.substr(p, formatIndex - p), value);
//                      break;

                    default:
                        if(p + 1 == formatIndex) {
                            output += '%';
                            output += ch;
                        }
                        else {
                        // alert("format error: " + format);
                        }
                        break;
                }
                specin = false;
            }
        }
    }
    return output;
};

Jeeel._Object.JeeelString.doprFmtnum = function (value, base, dosign, ljust, len, zpad) {
    var signvalue = '';
    var uvalue;
    var place = 0;
    var padlen;		// amount to pad
    var caps = 0;
    var convert;
    var output;

    convert = '';
    output = '';

    if(value >= 0) {
        uvalue = value;
    }
    else {
        uvalue = (value % 4294967296) + 4294967296;
    }

    if (dosign) {
        if (value < 0) {
            signvalue = '-';
            uvalue = -value;
        }
    }

    if (base < 0) {
        caps = 1;
        base = -base;
    }

    if(uvalue == 0) {
        convert = '0';
        place = 1;
    } else {
        while (uvalue) {
            if(caps) {
                convert = '0123456789ABCDEF'.substr(uvalue % base, 1) + convert;
            }
            else {
                convert = '0123456789abcdef'.substr(uvalue % base, 1) + convert;
            }
            
            uvalue = Math.floor(uvalue / base);
            place++;
        }
    }

    padlen = len - place;

    if (padlen < 0) {
        padlen = 0;
    }

    if (ljust) {
        padlen = -padlen;
    }

    if (zpad && padlen > 0) {
        if(signvalue) {
            output += signvalue;
            --padlen;
            signvalue = 0;
        }

        while (padlen > 0) {
            output += '0';
            --padlen;
        }
    }

    while (padlen > 0) {
        output += ' ';
        --padlen;
    }

    if (signvalue) {
        output += signvalue;
    }

    output += convert;

    while(padlen < 0) {
        output += ' ';
        ++padlen;
    }
    
    return output;
};

Jeeel._Object.JeeelString.doprFmtstr = function (value, ljust, field_len, llen) {
    var padlen;			// amount to pad
    var slen, truncstr = 0;
    var output = '';

    slen = value.length;

    if (llen != -1) {
        var rlen;

        rlen = field_len;
        
        if (slen > rlen) {
            truncstr = 1;
            slen = rlen;
        }
        
        field_len = llen;
    }
    
    padlen = field_len - slen;

    if (padlen < 0) {
        padlen = 0;
    }
    
    if (ljust) {
        padlen = -padlen;
    }
    
    while (padlen > 0) {
        output += ' ';
        --padlen;
    }
    
    if (truncstr) {
        output += value.substr(0, slen);
    } else {
        output += value;
    }

    while (padlen < 0) {
        output += ' ';
        ++padlen;
    }
    
    return output;
};

// Private function
Jeeel._Object.JeeelString.doprFromCharCodeChars = null;
Jeeel._Object.JeeelString.doprFromCharCode = function (code) {
    if (String.fromCharCode) {
        return String.fromCharCode(code);
    }
    
    if( ! this.doprFromCharCodeChars) {
        this.doprFromCharCodeChars
            = "\000\001\002\003\004\005\006\007\010\011\012\013\014\015\016\017\020"
            + "\021\022\023\024\025\026\027\030\031\032\033\034\035\036\037 !\"#$%&"
            + "'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghi"
            + "jklmnopqrstuvwxyz{|}~\177\200\201\202\203\204\205\206\207\210\211"
            + "\212\213\214\215\216\217\220\221\222\223\224\225\226\227\230\231\232"
            + "\233\234\235\236\237\240\241\242\243\244\245\246\247\250\251\252\253"
            + "\254\255\256\257\260\261\262\263\264\265\266\267\270\271\272\273\274"
            + "\275\276\277\300\301\302\303\304\305\306\307\310\311\312\313\314\315"
            + "\316\317\320\321\322\323\324\325\326\327\330\331\332\333\334\335\336"
            + "\337\340\341\342\343\344\345\346\347\350\351\352\353\354\355\356\357"
            + "\360\361\362\363\364\365\366\367\370\371\372\373\374\375\376\377";
    }

    if(code < 0) {
        return "";
    }

    if(code <= 255) {
        return this.doprFromCharCodeChars.substr(code, 1);
    }
    
    return eval(Jeeel.String.sprintf("\"\\u%04x\"", code));
};
