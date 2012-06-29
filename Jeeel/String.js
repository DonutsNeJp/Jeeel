Jeeel.directory.Jeeel.String = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel + 'String/';
    }
};

/**
 * コンストラクタ
 * 
 * @class 文字列の複雑な処理をするクラス
 * @param {String} [string] 基となる文字列
 * @example
 * 文字列に対して複雑な処理を行うことが出来るクラス
 * sprintfを使用したりキャメルケース、スネークケース等の変換からHTMLとして文字列を埋め込んだ際の幅や高さの取得まで幅広い文字列操作を行うことが出来る
 * インスタンス化して使用する事も可能だがインスタンス化する必要があることは殆ど無い
 * 
 * 例：
 * var str = '  test-case-sort  ';
 * str = Jeeel.String.trim(str); // 前後の余分は空白等を取り除く
 * str = Jeeel.String.toCamelCase(str); // スネークケース、ハイフネーションをキャメルケースに変換する
 * str = Jeeel.String.padLeft(str, 15, '*'); // 左側を15文字になるまで*で埋める
 * 
 * // str => '***testCaseSort'
 * 
 * 他にも以下のような機能が良く使われる
 * 
 * Jeeel.String.escapeRegExp('$hoge'): // 正規表現で使用するメタ文字をエスケープする
 * Jeeel.String.escapeHtml('<p>tag</p>'); // HTMLで使用する特殊文字(<, >, "など)をエスケープする
 * Jeeel.String.stripTags('<p>test</p>'); // HTMLタグを全て取り除く
 * Jeeel.String.toSnakeCase('test-hyphen'); // キャメルケース、ハイフネーションをスネークケースに変換する
 * Jeeel.String.toHyphenation('test_snake'); // キャメルケース、スネークケースをハイフネーションに変換する
 * Jeeel.String.toTitleCase('test case'); // 単語の頭文字を全て大文字に変換する
 * Jeeel.String.sprintf('%02d:%02d', 1, 22); // C言語でお馴染みのsprintf関数を再現したものである
 * Jeeel.String.Hash.md5('678'); // 指定された文字列のMD5を取得する
 * Jeeel.String.Hash.Base64.encode('654'); // 指定された文字列に対してBASE64エンコードを行う
 * Jeeel.String.Hash.Base64.decode('NjU0'); // 指定されたBASE64に対してデコードを行い元の文字列に戻す
 */
Jeeel.String = function (string) {
    
    if ( ! Jeeel.Type.isSet(string)) {
        string = '';
    }
    
    this._str = ('' + string).replace(/\r\n/g, '\n');
};

/**
 * インスタンスの作成を行う
 * 
 * @param {String} [string] 基となる文字列
 * @return {Jeeel.String} 作成したインスタンス
 */
Jeeel.String.create = function (string) {
    return new this(string);
};

/**
 * バイナリコードよりインスタンスの作成を行う<br />
 * 多バイトには対応していない
 *
 * @param {String|String[]} binary 連結したバイナリコードまたはバイナリコード配列
 * @return {Jeeel.String} 作成したインスタンス
 * @throws {Error} binaryがバイナリコード・バイナリコード配列で無い場合に発生する
 */
Jeeel.String.fromBinary = function (binary) {
    var tmp = [];
    var i, l = binary.length;

    if (Jeeel.Type.isString(binary)) {
        for (i = 0; i < l; i += 2) {
            tmp[tmp.length] = '0x' + binary.slice(i, i + 2);
        }
    } else if (Jeeel.Type.isArray(binary)) {
        for (i = 0; i < l; i++) {
            tmp[i] = '0x' + binary[i];
        }
    } else {
        throw new Error('binaryはバイナリコードまたはバイナリコード配列でなければなりません。');
    }

    return new this(String.fromCharCode.apply(null, tmp));
};

/**
 * 正規表現のメタ文字をエスケープする
 * 
 * @param {String} string 対象文字列
 * @return {String} エスケープ後の文字列
 */
Jeeel.String.escapeRegExp = function (string) {
    var reg = /([\/()\[\]{}|*+-.,\^$?\\])/g;
    
    return ('' + string).replace(reg, '\\$1');
};

/**
 * HTML内で使用できない文字を特殊文字にエスケープする
 * 
 * @param {String} html 対象文字列
 * @param {Boolean} [replaceSpaceAndLineFeed] 改行とスペースを置き換えるかどうか(デフォルトは置き換えない)
 * @return {String} エスケープ後の文字列
 */
Jeeel.String.escapeHtml = function (html, replaceSpaceAndLineFeed) {
    html = '' + html;

    html = html.replace(/&/g, '&amp;')
               .replace(/"/g, '&quot;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;');

    if (replaceSpaceAndLineFeed) {

        // IEではスペースが入らない改行後に文字が入らないとその改行を無視するのでスペースを挿入
        if (Jeeel.UserAgent.isInternetExplorer()) {
            html = html.replace(/ /g, '&nbsp;')
                       .replace(/\r\n/g, '\n')
                       .replace(/\n\n/g, '<br />&nbsp;<br />')
                       .replace(/\n/g, '<br />');
        } else {
            html = html.replace(/ /g, '&nbsp;')
                       .replace(/\n/g, '<br />');
        }
    }

    return html;
};

/**
 * HTML内の特殊文字にを元に戻す(但し対象はHTML内でテキストとして存在出来ない文字列のみである)
 * 
 * @param {String} txt 対象文字列
 * @param {Boolean} [replaceNbspAndBr] brタグとスペース特殊文字を置き換えるかどうか(デフォルトは置き換えない)
 * @return {String} エスケープ後の文字列
 */
Jeeel.String.unescapeHtml = function (txt, replaceNbspAndBr) {
    txt = '' + txt;

    txt = txt.replace(/&amp;|&#38;|&#x26;/g, '&')
             .replace(/&quot;|&#34;|&#x22;/g, '"')
             .replace(/&lt;|&#60;|&#x3C;/g, '<')
             .replace(/&gt;|&#62;|&#x3E;/g, '>');

    if (replaceNbspAndBr) {
        txt = txt.replace(/&nbsp;|&#160;|&#xA0;/g, ' ')
                 .replace(/<br *(\/)?>/g, '\n');
    }

    return txt;
};

/**
 * HTML文字列からタグ文字を全て取り除く
 *
 * @param {String} html HTML文字列
 * @return {String} タグを取り除いた文字列
 */
Jeeel.String.stripTags = function (html) {

//    return html.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, '');

    var nodes = {childNodes: Jeeel.Document.createNodeList(html)};

    var res = [];
    var txt = Jeeel.Dom.Node.TEXT_NODE;

    function _search(target) {
        if (target.nodeType === txt) {
            res[res.length] = target.data;
        }

        for (var i = 0, l = target.childNodes.length; i < l; i++) {
            _search(target.childNodes[i]);
        }
    }

    _search(nodes);

    return res.join('');
};

/**
 * 文字列の前後から空白を取り除く
 *
 * @param {String} str 対象の文字列(文字列以外を入れた場合は文字列に変換された後に値を返す)
 * @return {String} 空白を取り除いた後の値
 */
Jeeel.String.trim = function (str) {
    if ( ! str) {
        return '';
    }
    
    str = str.toString();
    
    if (str.trim) {
        return str.trim();
    }

    var trimLeft  = /^\s+/;
    var trimRight = /\s\s*$/;

    return str.replace(trimLeft, '').replace(trimRight, '');
};

/**
 * 文字列を反転させる
 *
 * @param {String} str 対象の文字列
 * @return {String} 反転させた後の値
 */
Jeeel.String.reverse = function (str) {
    return ('' + str).split('').reverse().join('');
};

/**
 * 指定した文字列を指定した長さになるまで左側を空白もしくは指定文字列で埋める<br />
 * 但し、必要とされる埋める文字数がpadStrの長さで均等に分割出来ない場合割り切れる一番長い数まで行い終了する
 * 
 * @param {String} str 対象文字列
 * @param {Integer} length 処理後の文字列の長さ
 * @param {String} [padStr] 空白以外を使用したい時に指定
 * @return {String} 処理後の文字列
 */
Jeeel.String.padLeft = function (str, length, padStr) {
    str = '' + str;
    padStr = '' + (padStr || ' ');
    
    var padLength = padStr.length;

    while ((str.length + padLength) <= length) {
        str = padStr + str;
    }
    
    return str;
};

/**
 * 指定した文字列を指定した長さになるまで右側を空白もしくは指定文字列で埋める<br />
 * 但し、必要とされる埋める文字数がpadStrの長さで均等に分割出来ない場合割り切れる一番長い数まで行い終了する
 * 
 * @param {String} str 対象文字列
 * @param {Integer} length 処理後の文字列の長さ
 * @param {String} [padStr] 空白以外を使用したい時に指定
 * @return {String} 処理後の文字列
 */
Jeeel.String.padRight = function (str, length, padStr) {
    str = '' + str;
    padStr = '' + (padStr || ' ');
    
    var padLength = padStr.length;

    while ((str.length + padLength) <= length) {
        str += padStr;
    }
    
    return str;
};

/**
 * 対象文字列をキャメルケースに変更する(パスカルケースではない)<br />
 * 変換対象はパスカルケース、ハイフネーションまたはスネークケースが対象となる
 * 
 * @param {String} str 対象文字列
 * @return {String} 変換後の文字列
 */
Jeeel.String.toCamelCase = function (str) {
    str = ('' + str).replace(/(?:-|_)([a-z])/g, function (str, p){return p.toUpperCase();});
    return str.replace(/^[A-Z]/, function (chr) {return chr.toLowerCase();});
};

/**
 * 対象文字列をパスカルケースに変更する<br />
 * 変換対象はハイフネーションまたはスネークケースが対象となる
 * 
 * @param {String} str 対象文字列
 * @return {String} 変換後の文字列
 */
Jeeel.String.toPascalCase = function (str) {
    return ('' + str).replace(/(?:^|-|_)([a-z])/g, function (str, p){return p.toUpperCase();});
};

/**
 * 対象文字列をスネークケースに変更する<br />
 * 変換対象はハイフネーションまたはキャメルケースが対象となる
 * 
 * @param {String} str 対象文字列
 * @return {String} 変換後の文字列
 */
Jeeel.String.toSnakeCase = function (str) {
    return ('' + str).replace(/([A-Z])/g, '_$1').replace(/-/g, '_').toLowerCase();
};

/**
 * 対象文字列をハイフネーションに変更する<br />
 * 変換対象はスネークケースまたはキャメルケースが対象となる
 * 
 * @param {String} str 対象文字列
 * @return {String} 変換後の文字列
 */
Jeeel.String.toHyphenation = function (str) {
    return ('' + str).replace(/([A-Z])/g, '-$1').replace(/_/g, '-').toLowerCase();
};

/**
 * 対象文字列の単語の先頭をだけを大文字にする
 * 
 * @param {String} str 対象文字列
 * @return {String} 変換後の文字列
 */
Jeeel.String.toTitleCase = function (str) {
    return ('' + str).toLowerCase().replace(/(^|\b)([a-z])/g, function (str, p1, p2){return p1 + p2.toUpperCase();});
};

/**
 * 全角文字を半角文字に変換する<br />
 * 対象となる文字は英数字、スペース、記号となる
 * 
 * @param {String} str 対象文字列
 * @return {String} 変換後の文字列
 */
Jeeel.String.toHalfWidth = function (str) {
    return ('' + str).replace(/[！＃-＆（-／０-９：-＠Ａ-Ｚ［-｀ａ-ｚ｛-～　]+/g, function (chars) {

        var res = [];

        for (var i = chars.length; i--;) {
            var code = chars[i].charCodeAt(0);

            // 全角スペースは特殊なので個別に変換
            if (code === 12288) {
                code = 32;
            } else {
                code -= 65248;
            }

            res[i] = code;
        }

        return String.fromCharCode.apply(null, res);
    });
};

/**
 * 半角文字を全角文字に変換する<br />
 * 対象となる文字は英数字、スペース、記号となる
 * 
 * @param {String} str 対象文字列
 * @return {String} 変換後の文字列
 */
Jeeel.String.toFullWidth = function (str) {
    return ('' + str).replace(/[!#-&(-/0-9:-@A-Z\[-`a-z{-~ ]+/g, function (chars) {

        var res = [];

        for (var i = chars.length; i--;) {
            var code = chars[i].charCodeAt(0);

            // 半角スペースは特殊なので個別に変換
            if (code === 32) {
                code = 12288;
            } else {
                code += 65248;
            }

            res[i] = code;
        }

        return String.fromCharCode.apply(null, res);
    });
};

/**
 * 文字列の指定箇所に指定文字列を挿入する
 *
 * @param {String} str 対象の文字列(文字列以外を入れた場合は文字列に変換された後に値を返す)
 * @param {Integer} index 挿入箇所のインデックス(マイナスのインデックスの場合は先頭に、インデックスをオーバーしたら末尾に挿入文字列が付けられる)
 * @param {String} insertStr 挿入文字列
 * @return {String} 挿入後の文字列
 */
Jeeel.String.insert = function (str, index, insertStr) {
    if ( ! str) {
        return insertStr;
    }
    
    str = '' + str;
    
    var leftStr = str.substring(0, index);
    var rightStr = str.substring(index, str.length);

    return leftStr + insertStr + rightStr;
};

/**
 * Jeeel.String.insertの複数版
 *
 * @param {String} str 対象の文字列(文字列以外を入れた場合は文字列に変換された後に値を返す)
 * @param {Integer[]} indexArr 挿入箇所のインデックス配列(マイナスのインデックスの場合は先頭に、インデックスをオーバーしたら末尾に挿入文字列が付けられる)<br />
 *                              もしもこの配列内のインデックスの並びが昇順ではない場合、insertStrArrの配列のインデックスとずれるので注意
 * @param {String|String[]} insertStrArr 挿入文字列もしくは挿入文字列配列(配列にした場合はインデックスの配列と数が一致しなければならない)
 * @return {String} 挿入後の文字列
 * @throws {Error} insertStrArrが配列でindexArrとinsertStrArrの配列の要素数が一致しない場合に起こる
 */
Jeeel.String.multiInsert = function (str, indexArr, insertStrArr) {
    if ( ! Jeeel.Type.isArray(indexArr)) {
        indexArr = [indexArr];
    }
    
    str = '' + str;
    
    var res = [];
    var insertStrIsArray = Jeeel.Type.isArray(insertStrArr);
    var insertStr;
    
    if (insertStrIsArray && indexArr.length != insertStrArr.length) {
        throw new Error('インデックスの配列と挿入文字の配列の数が違います。');
    }
    
    indexArr.sort(function (a, b) {return a - b});

    indexArr.unshift(0);
    
    if (insertStrIsArray) {
        insertStrArr.unshift('');
    }
    
    for (var i = 1, l = indexArr.length; i < l; i++) {
        if (insertStrIsArray) {
            insertStr = insertStrArr[i];
        } else {
            insertStr = insertStrArr;
        }
        
        res[res.length] = str.substring(indexArr[i - 1], indexArr[i]);
        res[res.length] = insertStr;
    }
    
    res[res.length] = str.substring(indexArr[l - 1], str.length);
    
    return res.join('');
};

/**
 * テキストのサイズを取得する
 * 
 * @param {String} text サイズを知りたいテキスト
 * @param {Hash} [styleList] スタイルのキーと値のリスト
 * @return {Jeeel.Object.Size} ピクセル単位のテキストのサイズ
 */
Jeeel.String.getTextSize = function (text, styleList) {
    var span;
    
    if (this.getTextWidth._span) {
        span = this.getTextWidth._span;
    } else {
        span = Jeeel.Document.createElement('span');
        span.style.cssText = 'display: inline; position: absolute; top: 0px; margin: 0; white-space: nowrap; border: none; visibility: hidden;';
        
        Jeeel.Document.appendToBody(span);
        
        span = new Jeeel.Dom.Element(span);
        
        this.getTextWidth._span = span;
    }
    
    if ( ! styleList) {
        styleList = {};
    }
    
    delete styleList.visibility;
    delete styleList.position;
    
    span.setStyleList(styleList);
    
    if (text.charAt(text.length - 1) === '\n') {
        text += ' ';
    }
    
    span.setText(text);
    
    return span.getSize();
};

/**
 * テキストの幅を取得する
 * 
 * @param {String} text 幅を知りたいテキスト
 * @param {Hash} [styleList] スタイルのキーと値のリスト
 * @return {Integer} ピクセル単位のテキストの幅
 */
Jeeel.String.getTextWidth = function (text, styleList) {
    return this.getTextSize(text, styleList).width;
};

/**
 * テキストの高さを取得する
 * 
 * @param {String} text 高さを知りたいテキスト
 * @param {Hash} [styleList] スタイルのキーと値のリスト
 * @return {Integer} ピクセル単位のテキストの高さ
 */
Jeeel.String.getTextHeight = function (text, styleList) {
    return this.getTextSize(text, styleList).height;
};

Jeeel.String.prototype = {
  
    /**
     * 元の文字列
     * 
     * @type String
     * @private
     */
    _str: '',
    
    /**
     * 行数
     * 
     * @type Integer
     * @private
     */
    _lineCount: null,
    
    /**
     * 改行部分のインデックス配列
     * 
     * @type Integer[]
     * @private
     */
    _lineIndex: null,
    
    /**
     * 内部文字列を取得する
     * 
     * @return {String} 文字列
     */
    getString: function () {
        return this._str;
    },
    
    /**
     * 文字列の行数を取得する
     * 
     * @return {Integer} 行数
     */
    getLineCount: function () {
        if (this._lineCount) {
            return this._lineCount;
        }
        
        return this._lineCount = this._str.length - this._str.replace(/\n/g, '').length + 1;
    },
    
    /**
     * 指定した行の文字列を得る
     *
     * @param {Integer} [line] 行インデックス(範囲以外の数や文字を入れると全ての文字列が返ってくる)
     * @return {String} 指定行の文字列
     */
    getLine: function (line) {
      
        this._createLineIndex();

        var first = (line <= 0 ? 0 : this._lineIndex[line-1] + 1);
        var last  = this._lineIndex[line];
        
        return this._str.slice(first, last);
    },
    
    /**
     * 文字列のサイズを取得する
     * 
     * @param {Hash} [styleList] スタイルのキーと値のリスト
     * @return {Jeeel.Object.Size} ピクセル単位のテキストのサイズ
     */
    getTextSize: function (styleList) {
        return this.constructor.getTextSize(this._str, styleList);
    },
    
    /**
     * 文字列の幅を取得する
     * 
     * @param {Hash} [styleList] スタイルのキーと値のリスト
     * @return {Integer} ピクセル単位のテキストの幅
     */
    getTextWidth: function (styleList) {
        return this.constructor.getTextWidth(this._str, styleList);
    },
    
    /**
     * 文字列の高さを取得する
     * 
     * @param {Hash} [styleList] スタイルのキーと値のリスト
     * @return {Integer} ピクセル単位のテキストの高さ
     */
    getTextHeight: function (styleList) {
        return this.constructor.getTextHeight(this._str, styleList);
    },
    
    /**
     * 指定した文字列が最初に見つかった行インデックスとその行でのインデックスを取得する
     *
     * @param {String} search 検索文字列
     * @return {Jeeel.Object.Technical.LineIndex} 行数とその行でのインデックスを保持する構造体
     */
    lineIndexOf: function (search) {
        this._createLineIndex();
        
        var idx = this._str.indexOf(search);

        var line = 0;
        var tmp  = 0;

        for (var i = 0, l = this._lineIndex.length; i < l; i++) {
            if (tmp < idx && idx < this._lineIndex[i]) {
                line += i;
                idx  -= tmp + 1;
                break;
            }

            tmp = this._lineIndex[i];
        }

        return new Jeeel.Object.Technical.LineIndex({line: line, index: idx});
    },
    
    /**
     * Bsse64エンコードを行う
     * 
     * @return {Jeeel.String} 自インスタンス
     */
    encodeBase64: function () {
        this._str = this.toBase64();
        
        return this._reset();
    },
    
    /**
     * Bsse64デコードを行う
     * 
     * @return {Jeeel.String} 自インスタンス
     */
    decodeBase64: function () {
        this._str = this.constructor.Hash.Base64.decode(this._str);
        
        return this._reset();
    },
    
    /**
     * MD5エンコードを行う
     * 
     * @return {Jeeel.String} 自インスタンス
     */
    encodeMd5: function () {
        this._str = this.toMd5();
        
        return this._reset();
    },
    
    /**
     * Jsonエンコードを行う
     * 
     * @return {Jeeel.String} 自インスタンス
     */
    encodeJson: function () {
        this._str = Jeeel.Json.encode(this._str);
        
        return this._reset();
    },
    
    /**
     * Html文字列にあたる部分をエスケープする
     * 
     * @param {Boolean} [replaceSpaceAndLineFeed] 改行とスペースを置き換えるかどうか(デフォルトは置き換えない)
     * @return {Jeeel.String} 自インスタンス
     */
    escapeHtml: function (replaceSpaceAndLineFeed) {
        this._str = this.constructor.escapeHtml(this._str, replaceSpaceAndLineFeed);
        
        return this._reset();
    },
    
    /**
     * エスケープされたHtml文字列を元に戻す
     * 
     * @param {Boolean} [replaceNbspAndBr] brタグとスペース特殊文字を置き換えるかどうか(デフォルトは置き換えない)
     * @return {Jeeel.String} 自インスタンス
     */
    unescapeHtml: function (replaceNbspAndBr) {
        this._str = this.constructor.unescapeHtml(this._str, replaceNbspAndBr);
        
        return this._reset();
    },
    
    /**
     * RegExpに使用するメタ文字をエスケープする
     * 
     * @return {Jeeel.String} 自インスタンス
     */
    escapeRegExp: function () {
        this._str = this.constructor.escapeRegExp(this._str);
        
        return this._reset();
    },
    
    /**
     * 文字列からHTMLタグ文字を全て取り除く
     *
     * @return {Jeeel.String} 自インスタンス
     */
    stripTags: function () {
        this._str = this.constructor.stripTags(this._str);
        
        return this._reset();
    },
    
    /**
     * 文字列の前後から空白を取り除く
     *
     * @return {Jeeel.String} 自インスタンス
     */
    trim: function () {
        this._str = this.constructor.trim(this._str);
        
        return this._reset();
    },
    
    /**
     * 文字列を反転させる
     *
     * @return {Jeeel.String} 自インスタンス
     */
    reverse: function () {
        this._str = this.constructor.reverse(this._str);
        
        return this._reset();
    },
    
    /**
     * 文字列を指定した長さになるまで左側を空白もしくは指定文字列で埋める<br />
     * 但し、必要とされる埋める文字数がpadStrの長さで均等に分割出来ない場合割り切れる一番長い数まで行い終了する
     * 
     * @param {Integer} length 処理後の文字列の長さ
     * @param {String} [padStr] 空白以外を使用したい時に指定
     * @return {Jeeel.String} 自インスタンス
     */
    padLeft: function (length, padStr) {
        this._str = this.constructor.padLeft(this._str, length, padStr);
        
        return this._reset();
    },
    
    /**
     * 文字列を指定した長さになるまで右側を空白もしくは指定文字列で埋める<br />
     * 但し、必要とされる埋める文字数がpadStrの長さで均等に分割出来ない場合割り切れる一番長い数まで行い終了する
     * 
     * @param {Integer} length 処理後の文字列の長さ
     * @param {String} [padStr] 空白以外を使用したい時に指定
     * @return {String} 処理後の文字列
     */
    padRight: function (length, padStr) {
        this._str = this.constructor.padRight(this._str, length, padStr);
        
        return this._reset();
    },
    
    /**
     * 文字列をキャメルケースに変更する
     * 
     * @return {Jeeel.String} 自インスタンス
     */
    camelCase: function () {
        this._str = this.constructor.toCamelCase(this._str);
        
        return this._reset();
    },
    
    /**
     * 文字列をパスカルケースに変更する
     * 
     * @return {Jeeel.String} 自インスタンス
     */
    pascalCase: function () {
        this._str = this.constructor.toPascalCase(this._str);
        
        return this._reset();
    },
    
    /**
     * 文字列をスネークケースに変更する
     * 
     * @return {Jeeel.String} 自インスタンス
     */
    snakeCase: function () {
        this._str = this.constructor.toSnakeCase(this._str);
        
        return this._reset();
    },
    
    /**
     * 文字列をハイフネーションに変更する
     * 
     * @return {Jeeel.String} 自インスタンス
     */
    hyphenation: function () {
        this._str = this.constructor.toHyphenation(this._str);
        
        return this._reset();
    },
    
    /**
     * 文字列をタイトルケースに変更する
     * 
     * @return {Jeeel.String} 自インスタンス
     */
    titleCase: function () {
        this._str = this.constructor.toTitleCase(this._str);
        
        return this._reset();
    },
    
    /**
     * 文字列に対して指定箇所に文字列を挿入する
     * 
     * @param {Integer} index 挿入箇所のインデックス(マイナスのインデックスの場合は先頭に、インデックスをオーバーしたら末尾に挿入文字列が付けられる)
     * @param {String} insertStr 挿入文字列
     * @return {Jeeel.String} 自インスタンス
     */
    insert: function (index, insertStr) {
        this._str = this.constructor.insert(this._str, index, insertStr);
        
        return this._reset();
    },
    
    /**
     * 文字列に対して指定箇所に文字列を挿入する
     * 
     * @param {Integer[]} indexArr 挿入箇所のインデックス配列(マイナスのインデックスの場合は先頭に、インデックスをオーバーしたら末尾に挿入文字列が付けられる)<br />
     *                              もしもこの配列内のインデックスの並びが昇順ではない場合、insertStrArrの配列のインデックスとずれるので注意
     * @param {String|String[]} insertStrArr 挿入文字列もしくは挿入文字列配列(配列にした場合はインデックスの配列と数が一致しなければならない)
     * @return {Jeeel.String} 自インスタンス
     */
    multiInsert: function (indexArr, insertStrArr) {
        this._str = this.constructor.multiInsert(this._str, indexArr, insertStrArr);
        
        return this._reset();
    },
    
    /**
     * Query形式の文字列を連想配列に変換する
     * 
     * @return {Hash} 変換後の連想配列
     */
    toQuery: function () {
        return Jeeel.Filter.Url.QueryParameter.create().filter(this._str);
    },
    
    /**
     * Json形式の文字列を変換する
     * 
     * @return {Mixied} 変換後の値
     */
    parseJson: function () {
        return Jeeel.Json.decode(this._str);
    },
    
    /**
     * Base64文字列に変換する
     * 
     * @return {String} Base64文字列
     */
    toBase64: function () {
        return this.constructor.Hash.Base64.encode(this._str);
    },
    
    /**
     * MD5文字列に変換する
     * 
     * @return {String} MD5文字列
     */
    toMd5: function () {
        return this.constructor.Hash.md5(this._str);
    },
    
    /**
     * 文字単位バイナリコードに変換して返す
     *
     * @param {String} [prefix] 16進数を示す接頭辞(デフォルトはなし)
     * @return {String} バイナリコード
     */
    toBinary: function (prefix) {
        return this.toBinaryArray(prefix).join('');
    },

    /**
     * 文字単位バイナリコード配列に変換して返す
     *
     * @param {String} [prefix] 16進数を示す接頭辞(デフォルトはなし)
     * @return {String[]} バイナリコード配列
     */
    toBinaryArray: function (prefix) {
        if ( ! Jeeel.Type.isString(prefix)) {
            prefix = '';
        }

        var res = [];

        for (var i = 0, l = this._str.length; i < l; i++) {
            var tmp = this._str.charCodeAt(i);
            tmp = tmp.toString(16);

            if (tmp.length & 1) {
                tmp = '0' + tmp;
            }

            res[i] = prefix + tmp;
        }

        return res;
    },
    
    /**
     * インスタンスを文字列に変換する
     * 
     * @return {String} 文字列
     */
    toString: function () {
        return this._str;
    },
    
    /**
     * インスタンスを文字列に変換する
     * 
     * @return {String} 文字列
     */
    valueOf: function () {
        return this._str;
    },
    
    /**
     * コンストラクタ
     * 
     * @param {String} [str] 基となる文字列
     * @constructor
     */
    constructor: Jeeel.String,
    
    _createLineIndex: function () {
        if (this._lineIndex) {
            return;
        }
        
        this._lineIndex = [];
        
        var tmp = 0;

        while (1) {
            tmp = this._str.indexOf('\n', tmp);

            if (tmp < 0) {
                break;
            }

            this._lineIndex[this._lineIndex.length] = tmp;
            tmp++;
        }
    },
    
    _reset: function () {
        this._lineCount = null;
        this._lineIndex = null;
        
        return this;
    }
};

Jeeel._Object.JeeelString = {

};

Jeeel.file.Jeeel.String = ['Sprintf', 'Hash'];

Jeeel._autoImports(Jeeel.directory.Jeeel.String, Jeeel.file.Jeeel.String);
