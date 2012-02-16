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
     */
    _lineCount: null,
    
    /**
     * 改行部分のインデックス配列
     * 
     * @type Integer[]
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
        this._str = Jeeel.Filter.Html.Escape.create(replaceSpaceAndLineFeed).filter(this._str);
        
        return this._reset();
    },
    
    /**
     * エスケープされたHtml文字列を元に戻す
     * 
     * @param {Boolean} [replaceSpaceAndLineFeed] 改行とスペースを置き換えるかどうか(デフォルトは置き換えない)
     * @return {Jeeel.String} 自インスタンス
     */
    unescapeHtml: function (replaceSpaceAndLineFeed) {
        this._str = Jeeel.Filter.Html.Unescape.create(replaceSpaceAndLineFeed).filter(this._str);
        
        return this._reset();
    },
    
    /**
     * RegExpに使用するメタ文字をエスケープする
     * 
     * @return {Jeeel.String} 自インスタンス
     */
    escapeRegExp: function () {
        this._str = Jeeel.Filter.RegularExpressionEscape.create().filter(this._str);
        
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
     * 文字列をキャメルケースに変更する
     * 
     * @return {Jeeel.String} 自インスタンス
     */
    camelCase: function () {
        this._str = this.constructor.toCamelCase(this._str);
        
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
    toQueryParameters: function () {
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

Jeeel.file.Jeeel.String = ['StripTags', 'Trim', 'ToCamelCase', 'ToSnakeCase', 'ToHyphenation', 'Insert', 'MultiInsert', 'Sprintf', 'Hash'];

Jeeel._autoImports(Jeeel.directory.Jeeel.String, Jeeel.file.Jeeel.String);
