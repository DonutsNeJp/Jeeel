/**
 * コンストラクタ
 * 
 * @class テンプレートを解析して文字列の置換やスクリプトの実行を行うクラス(所謂JSのテンプレートエンジン)<br />
 *         実行時にevalを使用するのでセキュアコード以外は実行するべきではない<br />
 *         また正規表現を多用しているのでIE等の貧弱なブラウザでは実行に時間が掛る可能性も高い
 *         <ul>
 *           <li> {+JS+}: JS実行して戻り値を表示する</li>
 *           <li> {!JS!}: JSを実行する{++}との違いは表示が行われない事と複数行の実行も可能なこと</li>
 *           <li> {?fetch ATTRIBUTES?}: 他のテンプレートを読み込み出力を行う。この際テンプレート変数を属性に付けて引き渡せる。file='test.tpl'[, var='tpl']などの形式でファイルURLを渡す。その際にvarを渡すと代わりに変数に代入する。</li>
 *           <li> {?if JS?}, {?elseif JS?}, {?else?}, {?if?}: JSを評価して条件に応じて分岐させる</li>
 *           <li> {?for JS;JS;JS?}, {?for JS in JS?}, {?/for?}: JSを実行しながらfor繰り返しを行う</li>
 *           <li> {?while JS?}, {?/while?}: JSを実行しながらwhile繰り返しを行う</li>
 *           <li> {?capture NAME?}, {?/capture?}: タグで囲まれたテンプレートの出力を出力せずにNAMEで指定した変数に格納する</li>
 *           <li> {?function NAME?}TEMPLATE{?/function?}: タグで囲まれたテンプレート部分を解析せずに保持し、NAME(Hash args)で呼び出した際に動的に解析を行う argsは内部で使用する変数のリスト</li>
 *           <li> {?strip?}, {?/strip?}: タグで囲まれたテンプレートの出力の空白・タブ・改行を全て取り除いて表示する</li>
 *           <li> {?escape?}, {?/escape?}: タグで囲まれたテンプレートの出力のHTMLタグ等を全てエスケープして表示する</li>
 *           <li> {#COMMENT#}: 表示も実行もされないコメント</li>
 *         </ul>
 * @example
 * Smartyの様なテンプレートエンジンとして使用することが出来るクラス
 * 
 * 例：
 * ------------------------------------------------------------------------------------------
 * {#キャプチャを行う#}
 * {?capture 'hoge'?}
 *   Pop Up
 * {?/capture?}
 * {#通常出力#}
 * <h1>{+Jeeel.VERSION+}</h1>
 * {?function 'title'?}{?strip?}
 *   <li>タイトル-{+i+}</li>
 *   {?if Math.random() < 0.5?}
 *     {#再帰呼び出し#}
 *     Recall {+title({i: Math.random()})+}
 *   {?/if?}
 * {?/strip?}{?/function?}
 * <footer>
 *   {#JSの実行#}
 *   {!
 *     var tpl = '';
 *     tpl += '<h2>';
 *     tpl += 'hoge';
 *     tpl += Math.random();
 *     tpl += '</h2>';
 *     
 *     var j = 10;
 *   !}
 *   {#whileループ#}
 *   {?while j--?}
 *     {#if分岐#}
 *     {?if parseInt(Math.random() * 2) % 2?}
 *       <div>
 *         {#HTMLのエスケープ#}
 *         {?escape?}
 *           {+tpl+}
 *         {?/escape?}
 *       </div>
 *     {?else?}
 *       失敗
 *     {?/if?}
 *   {?/while?}
 *   {+pot+}{+foot+}
 * </footer>
 * ------------------------------------------------------------------------------------------
 * 
 * 以上のようなファイルが/test/js-templateに存在した場合に以下の文を実行する事が出来る
 * 
 * var template = Jeeel.Template.create();
 * template.assign('foot', '777'); // footの名前のテンプレート変数を定義する
 * template.fetchFile('/test/js-template'); // 先のファイルを読み込んでコンパイルし実行する
 * 
 * 上記をサンプルにするとHTMLタグ以外にSmartyに似たタグが混じっているのが分かる
 * {#と#}に挟まれた箇所はコメントとなる 例、{#ここはコメント#}
 * {+と+}に挟まれた箇所は実行＋表示になる 例、{+Math.random()+}
 * {!と!}に挟まれた箇所は複数行の実行になる 例、{! var a = 10; a += 50; a -= 30 !}
 * {?と?}に挟まれた箇所は制御構文にある 例、{?if a > 50?}<div>テスト</div>{?/if?}
 * これらを組み合わせることでテンプレート変数を動的に割り当てHTML文字列を作成することを主とする
 * 
 * シンプルな例
 * ----------------------------------------------
 * <table>
 *   <tr>
 *     <th>名前</th>
 *     <th>コメント</th>
 *   </tr>
 *   {?for var i = 0; i < list.length; i++?}
 *     <tr>
 *       <td>{+list[i].name+}</td>
 *       <td>{+list[i].comment+}</td>
 *     </tr>
 *   {?/for?}
 * </table>
 * ----------------------------------------------
 * 上記のような文字列が変数strに入っているとする
 * 
 * var tpl = Jeeel.Template.create();
 * tpl.assign('list', [{name: 'a', 'Aです'}, {name: 'b', 'Bです'}]);
 * var res = tpl.fetchTemplate(str);
 * 
 * 上記を実行した場合は結果resは以下になる
 * ----------------------------------------------
 * <table>
 *   <tr>
 *     <th>名前</th>
 *     <th>コメント</th>
 *   </tr>
 *     <tr>
 *       <td>a</td>
 *       <td>Aです</td>
 *     </tr>
 *     <tr>
 *       <td>b</td>
 *       <td>Bです</td>
 *     </tr>
 * </table>
 * ----------------------------------------------
 * 
 * ファイルと通信するとあまり効率が良くないので、予めテンプレート文字列をJS側に定義しておくか引き渡しておくと効率が良い
 */
Jeeel.Template = function () {
    this._params = {};
    this._caches = {};
};

/**
 * インスタンスの作成を行う
 *
 * @return {Jeeel.Template} 作成したインスタンス
 */
Jeeel.Template.create = function () {
    return new this();
};

/**
 * @namespace テンプレート解析のためのパターンリスト
 */
Jeeel.Template.PATTERNS = {
    
    /**
     * 属性として扱うパターン
     * 
     * @type RegExp
     * @constant
     */
    ATTRIBUTE: /([a-zA-Z_\-\$]+)\s*=\s*(?:([a-zA-Z_\-\$]+)|(("|')[\s\S]+?[^\\]\4))/g,
    
    /**
     * コメントとして扱うパターン{#COMMENT#}
     * 
     * @type RegExp
     * @constant
     */
    COMMENT: /\{#[\s\S]+?#\}/g,
    
    /**
     * 出力として扱うパターン{+OUTPUT_CODE+}
     * 
     * @type RegExp
     * @constant
     */
    OUTPUT: /\{\+\s*([\s\S]+?)\s*\+\}/g,
    
    /**
     * コード実行として扱うパターン{!SCRIPT!}
     * 
     * @type RegExp
     * @constant
     */
    SCRIPT: /\{!\s*([\s\S]+?)\s*!\}/g,
    
    /**
     * 別ファイルをインライン展開するパターン{?fetch ATTRIBUTES?}<br />
     * 必須属性: file='ファイル名'
     * 任意属性: var='変数名'
     * 
     * @type RegExp
     * @constant
     */
    FETCH: /\{\?fetch\s+([\s\S]+?)\?\}/g,
    
    /**
     * if分岐として扱うパターン{?if BOOLEAN?}
     * 
     * @type RegExp
     * @constant
     */
    IF: /\{\?if\s+([\s\S]+?)\?\}/g,
    
    /**
     * elseif分岐として扱うパターン{?elseif BOOLEAN?}
     * 
     * @type RegExp
     * @constant
     */
    ELSE_IF: /\{\?elseif\s+([\s\S]+?)\?\}/g,
    
    /**
     * else分岐として扱うパターン{?else?}
     * 
     * @type RegExp
     * @constant
     */
    ELSE: /\{\?else\?\}/g,
    
    /**
     * if分岐の終了タグとして扱うパターン{?/if?}
     * 
     * @type RegExp
     * @constant
     */
    END_IF: /\{\?\/if\?\}/g,
    
    /**
     * forループとして扱うパターン{?for A;B;C?}
     * 
     * @type RegExp
     * @constant
     */
    FOR: /\{\?for\s+([^;]*);([^;]*);([\s\S]*?)\?\}/g,
    
    /**
     * for-inループとして扱うパターン{?for A in B?}
     * 
     * @type RegExp
     * @constant
     */
    FOREACH: /\{\?for\s+([\s\S]*?)\s+in\s+([\s\S]*?)\?\}/g,
    
    /**
     * forループの終了タグとして扱うパターン{?/for?}
     * 
     * @type RegExp
     * @constant
     */
    END_FOR: /\{\?\/for\?\}/g,
    
    /**
     * whileループとして扱うパターン{?while BOOLEAN?}
     * 
     * @type RegExp
     * @constant
     */
    WHILE: /\{\?while\s+([\s\S]+?)\?\}/g,
    
    /**
     * whileループの終了タグとして扱うパターン{?/while?}
     * 
     * @type RegExp
     * @constant
     */
    END_WHILE: /\{\?\/while\?\}/g,
    
    /**
     * テンプレート内容を変数に格納するcaptureとして扱うパターン{?capture NAME?}
     * 
     * @type RegExp
     * @constant
     */
    CAPTURE: /\{\?capture\s+("|')([\s\S]+)\1\?\}/g,
    
    /**
     * captureの終了タグとして扱うパターン{?/capture?}
     * 
     * @type RegExp
     * @constant
     */
    END_CAPTURE: /\{\?\/capture\?\}/g,
    
    /**
     * テンプレート内容を動的に解析するfunctionのタグとして扱うパターン{?function?}{?/function?}
     * 
     * @type RegExp
     * @constant
     */
    FUNCTION: /\{\?function\s+("|')([\s\S]+)\1\?\}([\s\S]*?)\{\?\/function\?\}/g,
    
    /**
     * 空白や改行を取り除くstripタグとして扱うパターン{?strip?}
     * 
     * @type RegExp
     * @constant
     */
    STRIP: /\{\?strip\?\}/g,
    
    /**
     * stripの終了タグとして扱うパターン{?/strip?}
     * 
     * @type RegExp
     * @constant
     */
    END_STRIP: /\{\?\/strip\?\}/g,
    
    /**
     * HTMLタグのエスケープを行うescapeとして扱うパターン{?escape?}
     * 
     * @type RegExp
     * @constant
     */
    ESCAPE: /\{\?escape\?\}/g,
    
    /**
     * escapeの終了タグとして扱うパターン{?/escape?}
     * 
     * @type RegExp
     * @constant
     */
    END_ESCAPE: /\{\?\/escape\?\}/g
};

Jeeel.Template.prototype = {
    
    /**
     * 現在テンプレートを解析中かどうか
     * 
     * @type Boolean
     * @private
     */
    _fetching: false,
    
    /**
     * 現在解析中のテンプレートのキャッシュキー
     * 
     * @type String
     * @private
     */
    _cacheKey: null,
    
    /**
     * 実行する際に必要な変数名と値のペアリスト
     * 
     * @type Hash
     * @private
     */
    _params: {},
    
    /**
     * functionタグのキャッシュを格納する変数
     * 
     * @type Hash
     * @private
     */
    _functions: {},
    
    /**
     * テンプレートファイルのキャッシュ
     * 
     * @type Hash
     * @private
     */
    _caches: {},
    
    /**
     * include等を行う際に使用する内部インスタンス
     * 
     * @type Jeeel.Template
     * @private
     */
    _fetcher: null,

    /**
     * 実行する際に使用する変数をセットする
     *
     * @param {String} key 変数名
     * @param {Mixed} value 変数の値
     * @return {Jeeel.Template} 自インスタンス
     */
    assign: function (key, value) {
        this._params[key] = value;

        return this;
    },

    /**
     * 指定した連想配列のキーを変数名として全てassignする
     *
     * @param {Hash} values 変数名と変数値のペアリスト
     * @return {Jeeel.Template} 自インスタンス
     */
    assignAll: function (values) {
        if ( ! Jeeel.Type.isHash(values)) {
            throw new Error('valuesは必ず配列式でなければなりません。');
        }

        for (var key in values) {
            this.assign(key, values[key]);
        }

        return this;
    },

    /**
     * セットされた変数の値を破棄する
     *
     * @param {String} key 変数名
     * @return {Jeeel.Template} 自インスタンス
     */
    unassign: function (key) {
        delete this._params[key];

        return this;
    },

    /**
     * セットされた変数の値をすべて破棄する
     *
     * @return {Jeeel.Template} 自インスタンス
     */
    unassignAll: function () {
        this._params = {};

        return this;
    },
    
    /**
     * 指定したキャッシュを消去する
     * 
     * @param {String} cacheKey キャッシュキー
     * @return {Jeeel.Template} 自インスタンス
     */
    clearCache: function (cacheKey) {
        delete this._caches[cacheKey];
        
        return this;
    },
    
    /**
     * キャッシュを全て消去する
     * 
     * @return {Jeeel.Template} 自インスタンス
     */
    clearCacheAll: function () {
        this._caches = {};
        
        return this;
    },
    
    /**
     * 指定したファイル内容を解析し、文字列置換して返す
     *
     * @param {String} url ファイルを示すURL
     * @param {String} [cacheKey] キャッシュするキーを明示的に指定したい場合に使用する<br />
     *                             また明示的にnullを渡すとキャッシュなしで動作する
     * @return {String} 解析後の文字列
     * @throws {Error} ファイルが見当たらないかサーバーエラー時に発生する
     */
    fetchFile: function (url, cacheKey) {
        this._fetching = true;
        
        if (cacheKey === null) {
            this._cacheKey = null;
        } else {
            this._cacheKey = cacheKey || url;
        }
        
        var res;
        
        if ( ! this._caches[this._cacheKey]) {
            res = Jeeel.Net.Ajax.serverResponse(url);

            if ( ! Jeeel.Type.isString(res)) {
                this._fetching = false;
                this._cacheKey = null;

                throw new Error('ファイルが見当たらないかサーバーエラーを返しました。');
            }
        }

        try {
            res = this._replaceTemplate(res);
        } catch (e) {
            throw e;
        } finally {
            this._fetching = false;
            this._cacheKey = null;
        }

        return res;
    },
    
    /**
     * 指定したファイル内容を非同期で解析しコールバックに引き渡す
     *
     * @param {String} url ファイルを示すURL
     * @param {Function} callback コールバック
     * @param {String} [cacheKey] キャッシュするキーを明示的に指定したい場合に使用する<br />
     *                             また明示的にnullを渡すとキャッシュなしで動作する
     * @return {Jeeel.Template} 自インスタンス
     * @throws {Error} callbackを指定しなかった場合に発生する
     * @throws {Error} 現在他のテンプレートを解析中だった場合に発生する
     * @throws {Error} ファイルが見当たらないかサーバーエラー時に発生する
     */
    fetchFileAsync: function (url, callback, cacheKey) {
        
        if ( ! Jeeel.Type.isFunction(callback)) {
            throw new Error('callbackは必ず指定しなければなりません。');
        } else if (this._fetching) {
            throw new Error('同時に複数のテンプレートの解析はできません。');
        }
        
        this._fetching = true;
        
        if (cacheKey === null) {
            this._cacheKey = null;
        } else {
            this._cacheKey = cacheKey || url;
        }
        
        if ( ! this._caches[this._cacheKey]) {
            var ajax = new Jeeel.Net.Ajax(url);

            ajax.setSuccessMethod(function (response) {
                var res;

                try {
                    res = this._replaceTemplate(response.responseText);
                } catch (e) {
                    throw e;
                } finally {
                    this._fetching = false;
                    this._cacheKey = null;
                }

                callback(res);
            }, this).setFailureMethod(function (response) {
                this._fetching = false;
                this._cacheKey = null;

                throw new Error('ファイルが見当たらないかサーバーエラーを返しました。');
            }, this).setExceptionMethod(function (r, e) {
                throw e;
            }, this).execute();
        } else {
            try {
                callback(this._replaceTemplate());
            } catch (e) {
                throw e;
            } finally {
                this._fetching = false;
                this._cacheKey = null;
            }
        }
        
        return this;
    },

    /**
     * 指定した文字列をテンプレートして扱い文字列置換を行う
     *
     * @param {String} template テンプレート文字列
     * @param {String} [cacheKey] キャッシュする際に指定する
     * @return {String} 解析後の文字列
     */
    fetchTemplate: function (template, cacheKey) {
        this._fetching = true;
        
        this._cacheKey = cacheKey || null;
        
        try {
            var res = this._replaceTemplate(template);
        } catch (e) {
            throw e;
        } finally {
            this._fetching = false;
        }

        return res;
    },
    
    /**
     * 指定したキャッシュをテンプレートして扱い文字列置換を行う
     *
     * @param {String} cacheKey 取得したいキャッシュ名
     * @return {String} 解析後の文字列
     */
    fetchCache: function (cacheKey) {
        this._fetching = true;
        
        this._cacheKey = cacheKey;
        
        try {
            var res = this._replaceTemplate('');
        } catch (e) {
            throw e;
        } finally {
            this._fetching = false;
        }

        return res;
    },
    
    /**
     * コンストラクタ
     * 
     * @constructor
     */
    constructor: Jeeel.Template,
    
    /**
     * テンプレートを実際に解析する
     * 
     * @param {String} $__template__$ テンプレート
     * @return {String} 解析後のテンプレート
     * @private
     */
    _replaceTemplate: function ($__template__$) {
        
        if ( ! this._fetcher) {
            this._fetcher = Jeeel.Template.create();
        } 
        
        var $__out__$, $__code__$, $__striptmp__$, $__escapetmp__$, $__this__$ = this, $__creator__$ = this._fetcher;
        
        this._functions = {};
        
        var $__compile__$ = function ($__template__$, args) {
            var $__out__$, $__code__$, $__striptmp__$, $__escapetmp__$;
            
            args = args || {};
            
            for (var $__key__$ in args) {
                eval("var " + $__key__$ + " = args[$__key__$];");
            }
            
            $__code__$ = $__template__$.replace($__this__$.constructor.PATTERNS.COMMENT, '');

            $__code__$ = $__this__$._replaceFunction($__code__$);
            $__code__$ = $__this__$._replaceOutput($__code__$);
            $__code__$ = $__this__$._replaceScript($__code__$);
            $__code__$ = $__this__$.replaceRequest($__code__$);
            $__code__$ = $__this__$._replaceBranch($__code__$);
            $__code__$ = $__this__$._replaceLoop($__code__$);
            $__code__$ = $__this__$._replaceCapture($__code__$);
            $__code__$ = $__this__$._replaceStrip($__code__$);
            $__code__$ = $__this__$._replaceEscape($__code__$);
            
            $__code__$ = "$__out__$ = \u001e" + $__code__$ + "\u001e";

            $__code__$ = $__code__$.replace(/\r?\n/g, '\\n')
                                   .replace(/\r/g, '')
                                   .replace(/"/g, '\\"')
                                   .replace(/\u001e/g, '"');
            
            (function () {
                eval($__code__$);
            })();

            return $__out__$;
        };
        
        if (this._cacheKey && this._caches[this._cacheKey]) {
            $__code__$ = this._caches[this._cacheKey].code;
            this._functions = this._caches[this._cacheKey].func;
        } else {
            $__code__$ = $__template__$.replace(this.constructor.PATTERNS.COMMENT, '');

            $__code__$ = this._replaceFunction($__code__$);
            $__code__$ = this._replaceOutput($__code__$);
            $__code__$ = this._replaceScript($__code__$);
            $__code__$ = this.replaceRequest($__code__$);
            $__code__$ = this._replaceBranch($__code__$);
            $__code__$ = this._replaceLoop($__code__$);
            $__code__$ = this._replaceCapture($__code__$);
            $__code__$ = this._replaceStrip($__code__$);
            $__code__$ = this._replaceEscape($__code__$);

            $__code__$ = "$__out__$ = \u001e" + $__code__$ + "\u001e";

            $__code__$ = $__code__$.replace(/\r?\n/g, '\\n')
                                   .replace(/\r/g, '')
                                   .replace(/"/g, '\\"')
                                   .replace(/\u001e/g, '"');

            if (this._cacheKey) {
                this._caches[this._cacheKey] = {
                    tpl: $__template__$,
                    code: $__code__$,
                    func: this._functions
                };
            }
        }
        
        var $__key__$;

        // 使用変数の動的定義
        for ($__key__$ in this._params) {
            eval('var ' + $__key__$ + ' = this._params[$__key__$];');
        }
        
        for ($__key__$ in this._functions) {
            eval('var ' + $__key__$ + ' = function (args) { return $__compile__$("' + this._functions[$__key__$] + '", args);};');
        }

        (function () {
            eval($__code__$);
        })();
        
        return $__out__$;
    },
    
    /**
     * テンプレートの出力パターンの置き換えを行う
     * 
     * @param {String} template テンプレート
     * @return {String} 置換後のテンプレート
     * @private
     */
    _replaceOutput: function (template) {
        return template.replace(this.constructor.PATTERNS.OUTPUT, function (match, output) {
            output = output.replace(/"/g, "\u001e")
                           .replace(/(\r?\n)/g, " ");

            return "\u001e + (" + output + ") +\u001e";
        });
    },
    
    /**
     * テンプレートの実行スクリプトパターンの置き換えを行う
     * 
     * @param {String} template テンプレート
     * @return {String} 置換後のテンプレート
     * @private
     */
    _replaceScript: function (template) {
        return template.replace(this.constructor.PATTERNS.SCRIPT, function (match, script) {
            script = script.replace(/"/g, "\u001e")
                           .replace(/(\r?\n)/g, " ");

            return "\u001e; " + script + "; $__out__$ += \u001e";
        });
    },
    
    /**
     * テンプレートの外部読み込みパターンの置き換えを行う
     * 
     * @param {String} template テンプレート
     * @return {String} 置換後のテンプレート
     * @private
     */
    replaceRequest: function (template) {
        var self = this;
        
        return template.replace(this.constructor.PATTERNS.FETCH, function (match, values) {
            
            var prms = {};
            
            values.replace(self.constructor.PATTERNS.ATTRIBUTE, function (match, key, variable, str) {
                prms[key] = variable || str;
            });
            
            var variable, file = prms.file;
            var isInclude = true;
            
            delete prms.file;
            
            if (prms['var']) {
                variable = ('' + prms['var']).replace(/^("|')([\s\S]+)\1$/g, '$2');
                
                isInclude = false;
                
                delete prms['var'];
            }
            
            var tpl = '(function () {$__creator__$.unassignAll();';
            
            for (var key in prms) {
                tpl += '$__creator__$.assign(\u001e' + key + '\u001e, ' + prms[key] + ');';
            }
            
            tpl += 'return $__creator__$.fetchFile(' + file + ');})()';
            
            if (isInclude) {
                return "\u001e + " + tpl + " + \u001e";
            }
            
            return "\u001e; var  " + variable + ' = ' + tpl + "; $__out__$ += \u001e";
        });
    },
    
    /**
     * テンプレートの条件分岐パターンの置き換えを行う
     * 
     * @param {String} template テンプレート
     * @return {String} 置換後のテンプレート
     * @private
     */
    _replaceBranch: function (template) {
        return template.replace(this.constructor.PATTERNS.IF, "\u001e; if ($1) { $$__out__$$ += \u001e")
                       .replace(this.constructor.PATTERNS.ELSE_IF, "\u001e;} else if ($1) { $$__out__$$ += \u001e")
                       .replace(this.constructor.PATTERNS.ELSE, "\u001e;} else { $$__out__$$ += \u001e")
                       .replace(this.constructor.PATTERNS.END_IF, "\u001e;} $$__out__$$ += \u001e");
    },
    
    /**
     * テンプレートの繰り返しパターンの置き換えを行う
     * 
     * @param {String} template テンプレート
     * @return {String} 置換後のテンプレート
     * @private
     */
    _replaceLoop: function (template) {
        return template.replace(this.constructor.PATTERNS.FOR, "\u001e; for ($1;$2;$3) { $$__out__$$ += \u001e")
                       .replace(this.constructor.PATTERNS.FOREACH, "\u001e; for ($1 in $2) { $$__out__$$ += \u001e")
                       .replace(this.constructor.PATTERNS.END_FOR, "\u001e;} $$__out__$$ += \u001e")
                       .replace(this.constructor.PATTERNS.WHILE, "\u001e; while ($1) { $$__out__$$ += \u001e")
                       .replace(this.constructor.PATTERNS.END_WHILE, "\u001e;} $$__out__$$ += \u001e");
    },
    
    /**
     * テンプレートのcaptureパターンの置き換えを行う
     * 
     * @param {String} template テンプレート
     * @return {String} 置換後のテンプレート
     * @private
     */
    _replaceCapture: function (template) {
        return template.replace(this.constructor.PATTERNS.CAPTURE, "\u001e; var $2 = \u001e")
                       .replace(this.constructor.PATTERNS.END_CAPTURE, "\u001e; $$__out__$$ += \u001e");
    },
    
    /**
     * テンプレートのfunctionパターンの置き換えを行う
     * 
     * @param {String} template テンプレート
     * @return {String} 置換後のテンプレート
     * @private
     */
    _replaceFunction: function (template) {
        var self = this;
        
        return template.replace(this.constructor.PATTERNS.FUNCTION, function (match, quotation, name, value) {
            value = value.replace(/"/g, '\\"')
                         .replace(/(\r?\n)/g, "\\n");
            
            self._functions[name] = value;

            return "";
        });
    },
    
    /**
     * テンプレートのstripパターンの置き換えを行う
     * 
     * @param {String} template テンプレート
     * @return {String} 置換後のテンプレート
     * @private
     */
    _replaceStrip: function (template) {
        return template.replace(this.constructor.PATTERNS.STRIP, "\u001e; if ( ! $$__striptmp__$$) { $$__striptmp__$$ = $$__out__$$; $$__out__$$ = \u001e")
                       .replace(this.constructor.PATTERNS.END_STRIP, "\u001e; $$__out__$$ = $$__striptmp__$$ + $$__out__$$.replace(/\\s+/g, \u001e\u001e); $$__striptmp__$$ = null;} $$__out__$$ += \u001e");
    },
    
    /**
     * テンプレートのescapeパターンの置き換えを行う
     * 
     * @param {String} template テンプレート
     * @return {String} 置換後のテンプレート
     * @private
     */
    _replaceEscape: function (template) {
        return template.replace(this.constructor.PATTERNS.ESCAPE, "\u001e; if ( ! $$__escapetmp__$$) { $$__escapetmp__$$ = $$__out__$$; $$__out__$$ = \u001e")
                       .replace(this.constructor.PATTERNS.END_ESCAPE, "\u001e; $$__out__$$ = $$__escapetmp__$$ + Jeeel.String.escapeHtml($$__out__$$); $$__escapetmp__$$ = null;} $$__out__$$ += \u001e");
    }
};
