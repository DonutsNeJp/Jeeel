/**
 * @fileOverview 汎用性がある機能の集まりです。<br />
 *                 FireFox, Safari, Chrome, Opera, IE6以上に対応しています。(個々のビルド段階のバグは考慮していません)<br />
 *                 _JEEEL_MANUAL_LOAD_を定義すると自動読み込みが無効になります。<br />
 *                 _JEEEL_CLEAN_MODE_を定義するとグローバル変数がJeeelのみの定義になります。<br />
 *                 _JEEEL_DEBUG_MODE_を定義するとデバッグが有効になります。また、デバッグメソッドへのショートカットが作成されます。<br />
 *                 _JEEEL_EXTEND_MODE_を連想配列で定義し機能ごとに論理値を埋め込むと拡張機能が追加されます。(WebStorage等)<br />
 *                 _JEEEL_FULL_MODE_を定義すると全ての機能が有効になります。(上記のモード定義より優先される)<br />
 *                 また、エラーを詳細に表示する機能も追加されます。<br />
 *                 このライブラリ内ではいくつかの疑似的型表現を用いています。<br />
 *                 以下の型表現がそれにあたり、外部で定義されているものとは異なることに注意してください。<br />
 *                 Integer: 整数値<br />
 *                 Digit: 整数値もしくは整数値文字列<br />
 *                 Hash: 配列及び連想配列(基本的には基本型と関数以外すべて)<br />
 *                 Primitive: 基本型(真偽値・数値・文字列値・null・undefined)<br />
 *                 Mixied: なんでも良い<br />
 *                 引数にvar_argsがあったらそれは可変引数を示します。<br />
 *                 var_argsを含めて順に引数を必要数渡します。
 *
 * @name Jeeel.js(Javascript Easy Error and Exception handling Library: Japanease Eeel)
 * @author Masato Shimada
 * @version 2.0.0β58
 * @license <a href="http://en.wikipedia.org/wiki/BSD_licenses">BSD License</a>
 */

// Jeeelが定義されていた場合バックアップを取ってから書き換えを行う
if (typeof window !== 'undefined' && window.Jeeel) {

    (function (backupPrefix, backupValue) {
        if ( ! arguments.callee.backupPrefix) {
            arguments.callee.backupPrefix = backupPrefix;
        }

        var backupName = backupPrefix + 'Jeeel';

        if (backupName in window) {
            arguments.callee(backupPrefix + arguments.callee.backupPrefix, window[backupName]);
        }

        window[backupName] = backupValue;
    })('_', window.Jeeel);
}

/**
 * 汎用メソッド等を提供するネームスペース
 */
var Jeeel = {

    /**
     * 現在のJeeelのバージョン<br />
     * 1.0.0<br />
     * | | |<br />
     * A B C<br />
     * <br />
     * Aバージョンは互換性が無いバージョンを示す<br />
     * Bバージョンは新規機能追加を示す<br />
     * Cバージョンは既存機能追加・微調整・バグ修正を示す
     *
     * @type String
     * @constant
     */
    VERSION: '2.0.0β58',
    
    /**
     * Jeeelのscriptタグに付くclass名
     *
     * @type String
     * @constant
     */
    SCRIPT_CLASS: 'JEEEL-SCRIPT-CLASS',
    
    /**
     * Jeeelのscriptタグに付くid名(実際にはこれにインデックス番号が付く)
     *
     * @type String
     * @constant
     */
    SCRIPT_ID: 'JEEEL-SCRIPT-ID',

    /**
     * Jeeelファイルが置かれているホスト<br />
     * 通常は空文字にする
     *
     * @type String
     * @constant
     */
    HOST: '',
    
    /**
     * クロスドメインかどうか
     * 
     * @type Boolean
     * @constant
     */
    CROSS_DOMAIN: false,

    /**
     * Jeeelファイルが置かれている相対URL
     *
     * @type String
     * @constant
     */
    BASE_URL: '/st/js/',

    /**
     * サーバー側のevalを使用できる相対URL<br />
     * 以下のパラメータを受け取り実行した後結果を返す機能をサーバーに実装
     *
     * <pre>
     * パラメータ {
     * &nbsp;   script: サーバー言語スクリプト,
     * &nbsp;   params: サーバ側に渡す任意パラメータ
     * }
     * </pre>
     *
     * @type String
     * @constant
     */
    DEBUG_URL: '/dev/debug/eval/',

    /**
     * サーバー側でSQLを実行できる相対URL<br />
     * 以下のパラメータを受け取り実行した後結果を返す機能をサーバーに実装
     *
     * <pre>
     * パラメータ {
     * &nbsp;   sql: SQL文字列
     * }
     * </pre>
     *
     * @type String
     * @constant
     */
    SQL_DEBUG_URL: '/dev/debug/eval-sql/',

    /**
     * サーバー側でメール送信を出来る相対URL<br />
     * 以下のパラメータを処理してメール送信する機能をサーバーに実装
     *
     * <pre>
     * パラメータ {
     * &nbsp;   to  : 送信先,
     * &nbsp;   body: 送信内容,
     * &nbsp;   type: メールのタイプ
     * }
     * </pre>
     *
     * @type String
     * @constant
     */
    MAIL_URL: '/dev/debug/mail/',

    /**
     * サーバー側でパラメータを表記した文字列をファイルとして読み込ませるための相対URL<br />
     * 以下のパラメータを処理してファイルを渡す機能をサーバーに実装
     *
     * <pre>
     * パラメータ {
     * &nbsp;   file : ファイル名(省略可能),
     * &nbsp;   value: ファイルに変換するパラメータ
     * }
     * </pre>
     *
     * @type String
     * @constant
     */
    FILE_OPEN_URL: '/dev/debug/file-open/',
    
    /**
     * Jsonp通信を行うための相対URL<br />
     * 以下のパラメータを処理してファイルを渡す機能をサーバーに実装
     *
     * <pre>
     * パラメータ {
     * &nbsp;   exec-action: 実行アクション名,
     * &nbsp;   callback: コールバック関数名
     * }
     * </pre>
     *
     * @type String
     * @constant
     */
    JSONP_URL: '/dev/debug/jsonp/',
    
    /**
     * このJeeelオブジェクト固有ID
     * 
     * @type String
     * @constant
     */
    UNIQUE_ID: null,

    /**
     * 現在の階層のDocumentで作成したJeeel.Dom.Document
     *
     * @type Jeeel.Dom.Document
     * @readOnly
     */
    Document: null,
    
    /**
     * 現在の階層のWindowで作成したJeeel.Dom.Window
     *
     * @type Jeeel.Dom.Window
     * @readOnly
     */
    Window: null,
    
    /**
     * Jsonp通信のためのキャッシュ
     * 
     * @private
     */
    _jsp: {
        
    },

    /**
     * Jeeel系のサブクラス保存のための媒体
     *
     * @private
     */
    _Object: {
      
    },

    /**
     * IEのための高速化手法
     * 
     * @type Document
     * @readOnly
     * @private
     */
    _doc: (typeof document !== 'undefined' ? document : null),
    
    /**
     * IEのための高速化手法
     * 
     * @type Global
     * @readOnly
     * @private
     */
    _global: (typeof window !== 'undefined' ? window : this),

    /**
     * 自動的にスクリプトを読み込むかどうか
     *
     * @type Boolean
     * @readOnly
     * @private
     */
    _auto: typeof _JEEEL_MANUAL_LOAD_ === 'undefined',

    /**
     * グローバル変数をJeeelのみにするかどうか
     *
     * @type Boolean
     * @readOnly
     * @private
     */
    _cleanMode: typeof _JEEEL_CLEAN_MODE_ !== 'undefined',

    /**
     * デバッグを使用できるようにするかどうか(_cleanModeがtrueの場合はショートカットが作成されない)
     *
     * @type Boolean
     * @readOnly
     * @private
     */
    _debugMode: typeof _JEEEL_FULL_MODE_ !== 'undefined' || typeof _JEEEL_DEBUG_MODE_ !== 'undefined',

    /**
     * 拡張機能を機能ごとに使用するかどうかを設定する
     *
     * @type Hash
     * @readOnly
     * @private
     */
    _extendMode: {
        /**
         * GUIの拡張機能を使用するかどうか
         *
         * @type Boolean
         * @readOnly
         * @private
         */
        Gui: !!(typeof _JEEEL_FULL_MODE_ !== 'undefined' || typeof _JEEEL_EXTEND_MODE_ !== 'undefined' && _JEEEL_EXTEND_MODE_.Gui),
        
        /**
         * Web Storage(localStorage)の拡張機能を使用するかどうか
         *
         * @type Boolean
         * @readOnly
         * @private
         */
        WebStorage: !!(typeof _JEEEL_FULL_MODE_ !== 'undefined' || typeof _JEEEL_EXTEND_MODE_ !== 'undefined' && _JEEEL_EXTEND_MODE_.WebStorage),

        /**
         * Indexed Database APIの拡張機能を使用するかどうか
         *
         * @type Boolean
         * @readOnly
         * @private
         */
        Database: !!(typeof _JEEEL_FULL_MODE_ !== 'undefined' || typeof _JEEEL_EXTEND_MODE_ !== 'undefined' && _JEEEL_EXTEND_MODE_.Database),
        
        /**
         * WebWorkersの拡張機能を使用するかどうか
         *
         * @type Boolean
         * @readOnly
         * @private
         */
        Worker: !!(typeof _JEEEL_FULL_MODE_ !== 'undefined' || typeof _JEEEL_EXTEND_MODE_ !== 'undefined' && _JEEEL_EXTEND_MODE_.Worker),
        
        /**
         * Geolocation APIの拡張機能を使用するかどうか
         *
         * @type Boolean
         * @readOnly
         * @private
         */
        Geolocation: !!(typeof _JEEEL_FULL_MODE_ !== 'undefined' || typeof _JEEEL_EXTEND_MODE_ !== 'undefined' && _JEEEL_EXTEND_MODE_.Geolocation),
        
        /**
         * File APIの拡張機能を使用するかどうか
         *
         * @type Boolean
         * @readOnly
         * @private
         */
        File: !!(typeof _JEEEL_FULL_MODE_ !== 'undefined' || typeof _JEEEL_EXTEND_MODE_ !== 'undefined' && _JEEEL_EXTEND_MODE_.File),
        
        /**
         * メディア系の拡張機能を使用するかどうか
         *
         * @type Boolean
         * @readOnly
         * @private
         */
        Media: !!(typeof _JEEEL_FULL_MODE_ !== 'undefined' || typeof _JEEEL_EXTEND_MODE_ !== 'undefined' && _JEEEL_EXTEND_MODE_.Media),
        
        /**
         * グラフィックス系の拡張機能を使用するかどうか
         *
         * @type Boolean
         * @readOnly
         * @private
         */
        Graphics: !!(typeof _JEEEL_FULL_MODE_ !== 'undefined' || typeof _JEEEL_EXTEND_MODE_ !== 'undefined' && _JEEEL_EXTEND_MODE_.Graphics),
        
        /**
         * ネットワーク系の拡張機能を使用するかどうか
         *
         * @type Boolean
         * @readOnly
         * @private
         */
        Net: !!(typeof _JEEEL_FULL_MODE_ !== 'undefined' || typeof _JEEEL_EXTEND_MODE_ !== 'undefined' && _JEEEL_EXTEND_MODE_.Net)
    },

    /**
     * エラーメッセージを表示するメソッド
     *
     * @param {String|Event} message エラーメッセージ
     * @param {String} file エラーファイル
     * @param {Integer} line エラー行数
     * @private
     */
    _error: (function (message, file, line) {

        if (typeof console !== 'undefined') {
            return function (message, file, line) {
                if (Jeeel.Type.isEvent(message)) {
                    file = message.target.src;
                    line = 'undefined';
                }
                
                console.log(file + '(' + line + ')', message);
            };
        } else {
            return function (message, file, line) {
                if (Jeeel.Type.isEvent(message)) {
                    file = message.target.src;
                    line = 'undefined';
                }
                
                Jeeel.errorDump(file + '(' + line + ')\n'+ message);
            };
        }
    })(),

    /**
     * Jeeel.jsの個別読み込みを行う
     * 
     * @param {String} dir ディレクトリ
     * @param {String} file ソース
     */
    _import: function (dir, file) {
        if ( ! Jeeel._doc) {
            if (typeof importScripts !== 'undefined') {
                importScripts(dir + file + '.js');
            }

            return;
        }
        
        if ( ! arguments.callee.index) {
            arguments.callee.index = 1;
        }
        
        var index = arguments.callee.index;
        
        Jeeel._doc.write('<script type="text/javascript" id="' + this.SCRIPT_ID + '-' + index + '" class="' + this.SCRIPT_CLASS + '" src="' + dir + file + '.js"></script>\n');

        arguments.callee.index++;
    },
    
    /**
     * Jeeel.jsのディレクトリ別、自動読み込みを行う
     * 
     * @param {String} dir ディレクトリ
     * @param {Array} files ソースのリスト
     */
    _autoImports: function (dir, files) {
        if (this._auto) {
            for (var i = 0, l = files.length; i < l; i++) {
                this._import(dir, files[i]);
            }
        }
    },

    /**
     * 読み込むディレクトリを示す
     */
    directory: {

    },

    /**
     * ディレクトリに対してのforeach
     *
     * @param {Object} directory ディレクトリ
     * @param {Function} callBack コールバックメソッド(要素、キー、配列)
     */
    directoryForEach: function (directory, callBack) {
        for (var key in directory) {
            if (key !== 'toString') {
                callBack.call(this, directory[key], key, directory);
            }
        }
    },

    /**
     * 読み込むファイルを示す
     */
    file: {

    },

    /**
     * ファイルに対してのforeach
     *
     * @param {Array} file ファイル
     * @param {Function} callBack コールバックメソッド(要素、キー、配列)
     */
    fileForEach: function (file, callBack) {
        for (var key in file) {
            if (isNaN(key) && key !== 'length') {
                callBack.call(this, file[key], key, file);
            }
        }
    },

    /**
     * ファイルの相対パスを全て返す
     *
     * @return {String} ファイルパスを示す文字列
     */
    getFilePath: function () {
        var paths = (arguments.length === 0 ? [this.directory.Jeeel + 'Jeeel.js\n'] : []);
        var directory = (arguments.length === 0 ? this.directory : arguments[0]);
        var file = (arguments.length === 0 ? this.file : arguments[1]);

        var self = arguments.callee;

        Jeeel.directoryForEach(directory,
            function (dir, key) {

                for (var i = 0, l = file[key].length; i < l; i++) {

                    var subKey = file[key][i];
                    
                    if ( ! this._debugMode && subKey === 'Debug') {
                        continue;
                    } else if ( ! this._debugMode && key === 'Technical' && Jeeel.Type.inArray(subKey, ['Information', 'Trace'], true)) {
                        continue;
                    } else if ( ! this._extendMode.Gui && subKey === 'Gui') {
                        continue;
                    } else if ( ! this._extendMode.WebStorage && subKey === 'WebStorage') {
                        continue;
                    } else if ( ! this._extendMode.Database && subKey === 'Database') {
                        continue;
                    } else if ( ! this._extendMode.Worker && subKey === 'Worker') {
                        continue;
                    } else if ( ! this._extendMode.Geolocation && subKey === 'Geolocation') {
                        continue;
                    } else if ( ! this._extendMode.File && subKey === 'File') {
                        continue;
                    } else if ( ! this._extendMode.Media && subKey === 'Media') {
                        continue;
                    } else if ( ! this._extendMode.Graphics && subKey === 'Graphics') {
                        continue;
                    } else if ( ! this._extendMode.Net && Jeeel.Type.inArray(subKey, ['Comet', 'Socket'], true)) {
                        continue;
                    }

                    paths[paths.length] = dir + subKey+'.js\n';

                    if (dir[subKey] && file[key][subKey]) {
                        var dirTmp = {};
                        var fileTmp = {};
                        dirTmp[subKey] = dir[subKey];
                        fileTmp[subKey] = file[key][subKey];

                        paths[paths.length] = self(dirTmp, fileTmp);
                    }
                }
            }
        );

        return paths.join('');
    },

    /**
     * ファイルをスクリプトタグで囲った状態で全て返す
     *
     * @return {String} スクリプトタグで囲われたファイルパスを示す文字列
     */
    getScript: function () {
        var paths = (arguments.length === 0 ? ['<script type="text/javascript" class="'+Jeeel.SCRIPT_CLASS+'" src="'+this.directory.Jeeel+'Jeeel.js"></script>\n'] : []);
        var directory = (arguments.length === 0 ? this.directory : arguments[0]);
        var file = (arguments.length === 0 ? this.file : arguments[1]);

        var self = arguments.callee;

        Jeeel.directoryForEach(directory,
            function (dir, key) {

                for (var i = 0, l = file[key].length; i < l; i++) {
                  
                    var subKey = file[key][i];

                    if ( ! this._debugMode && subKey === 'Debug') {
                        continue;
                    }else if ( ! this._debugMode && key === 'Technical' && Jeeel.Type.inArray(subKey, ['Information', 'Trace'], true)) {
                        continue;
                    } else if ( ! this._extendMode.Gui && subKey === 'Gui') {
                        continue;
                    } else if ( ! this._extendMode.WebStorage && subKey === 'WebStorage') {
                        continue;
                    } else if ( ! this._extendMode.Database && subKey === 'Database') {
                        continue;
                    } else if ( ! this._extendMode.Worker && subKey === 'Worker') {
                        continue;
                    }else if ( ! this._extendMode.Geolocation && subKey === 'Geolocation') {
                        continue;
                    } else if ( ! this._extendMode.File && subKey === 'File') {
                        continue;
                    } else if ( ! this._extendMode.Media && subKey === 'Media') {
                        continue;
                    } else if ( ! this._extendMode.Graphics && subKey === 'Graphics') {
                        continue;
                    } else if ( ! this._extendMode.Net && Jeeel.Type.inArray(subKey, ['Comet', 'Socket'], true)) {
                        continue;
                    }

                    paths[paths.length] = '<script type="text/javascript" class="'+Jeeel.SCRIPT_CLASS+'" src="'+dir + subKey+'.js"></script>\n';

                    if (dir[subKey] && file[key][subKey]) {
                        var dirTmp = {};
                        var fileTmp = {};
                        dirTmp[subKey] = dir[subKey];
                        fileTmp[subKey] = file[key][subKey];

                        paths[paths.length] = self(dirTmp, fileTmp);
                    }
                }
            }
        );

        return paths.join('');
    },

    /**
     * 全てのファイルを接続した状態で返す
     *
     * @param {Boolean} [minimize] 必要最小限のファイルのみ接続するかどうか
     * @param {Boolean} [disableDebug] デバッグ関連のファイル読み込みを無効にするかどうか
     * @param {Boolean} [disableExtend] 追加関連のファイル読み込みを無効にするかどうか
     * @return {String} 全てのファイルを接続した文字列
     */
    getJoinScript: function (minimize, disableDebug, disableExtend) {
        var debugTmp = this._debugMode;
        var geneTmp  = this._extendMode;

        if (minimize) {
            this._debugMode = false;
            this._extendMode = {};
        }
        
        if (disableDebug) {
            this._debugMode = false;
        }
        
        if (disableExtend) {
            this._extendMode = {};
        }

        var files = this.getFilePath().replace(/\n$/g, '').split('\n');
        var script = [];

        for (var i = 0, l = files.length; i < l; i++) {
            script[i] = Jeeel.Net.Ajax.serverResponse(files[i]);
        }

        this._debugMode  = debugTmp;
        this._extendMode = geneTmp;
        
        var url = Jeeel.UserAgent.getProtocol() + '://' + Jeeel.UserAgent.getHost();

        return 'var _JEEEL_MANUAL_LOAD_ = true;\n' + script.join('').replace("HOST: ''", "HOST: '" + url + "'");
    },
    
    getCompressScript: function (minimize, disableDebug, disableExtend) {
        return Jeeel.Debug.Compressor.compress(this.getJoinScript(minimize, disableDebug, disableExtend));
    },

    /**
     * デバッグモードが有効である場合に限りエラーをダンプする
     *
     * @param {Mixied} var_args エラー出力する値の可変引数
     * @return {Boolean} エラーをダンプしたかどうか
     */
    errorDump: function (var_args) {
        if ( ! Jeeel._debugMode || ! Jeeel.Debug) {
            return false;
        }

        Jeeel.Debug.ErrorMessage.dump.apply(null, arguments);
        return true;
    },

    /**
     * デバッグモードが有効である場合に限りエラーをHTMLとしてダンプする
     *
     * @param {Mixied} var_args エラー出力する値の可変引数
     * @return {Boolean} エラーをダンプしたかどうか
     */
    errorHtmlDump: function (var_args) {
        if ( ! Jeeel._debugMode || ! Jeeel.Debug) {
            return false;
        }

        Jeeel.Debug.ErrorMessage.dumpHtml.apply(null, arguments);
        return true;
    },

    /**
     * デバッグモードが有効である場合に限りエラーをConsoleにダンプする
     *
     * @param {Mixied} var_args エラー出力する値の可変引数
     * @return {Boolean} エラーをダンプしたかどうか
     */
    errorDumpConsole: function (var_args) {
        if ( ! Jeeel._debugMode || ! Jeeel.Debug) {
            return false;
        }

        Jeeel.Debug.Console.log.apply(null, arguments);
        return true;
    },
    
    /**
     * Domが完成した時に呼び出されるイベントの登録を行う
     *
     * @param {Function} listener 登録イベント
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはJeeel.Windowになる)
     */
    addLoadEvent: function (listener, thisArg) {
        Jeeel.Window.addEventListener(Jeeel.Dom.Event.Type.LOAD, listener, thisArg);
    }
};

Jeeel.directory.Jeeel = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.HOST + Jeeel.BASE_URL + 'Jeeel/';
    }
};

if (Jeeel._global && Jeeel._debugMode) {
    Jeeel._global.onerror = Jeeel._error;
}

(function () {
    if ( ! Jeeel._doc) {
        return;
    }
    
    var scripts = Jeeel._doc.getElementsByTagName('script');
    var script  = scripts[scripts.length - 1];
    script.className = Jeeel.SCRIPT_CLASS;
    script.id = Jeeel.SCRIPT_ID + '-0';
})();

(function () {
    Jeeel.UNIQUE_ID = 'Jeeel-' + (Jeeel.VERSION + Math.random()).replace(/\D/g, '');
    
    if (Jeeel._global) {
        Jeeel._global.Jeeel = Jeeel;
    }
    
    Jeeel.file.Jeeel = ['Class', 'Filter', 'Type', 'Method', 'Hash', 'String', 'Number', 'Code', 'Import', 'Function', 'UserAgent', 'Json', 'Session', 'Dom', 'Net', 'Evaluator', 'Template', 'Timer', 'DataStructure', 'Object', 'Parameter', 'Validator', 'Storage', 'Namespace', 'External', 'Deferred', 'Framework', 'Config', 'Util'];
   
    if (Jeeel._extendMode.Gui && Jeeel._doc) {
        Jeeel.file.Jeeel[Jeeel.file.Jeeel.length] = 'Gui';
    }
    
    if (Jeeel._extendMode.Worker && Jeeel._global && Jeeel._global.Worker) {
        Jeeel.file.Jeeel[Jeeel.file.Jeeel.length] = 'Worker';
    }
    
    if (Jeeel._extendMode.Database && Jeeel._global && Jeeel._global.openDatabase) {
        Jeeel.file.Jeeel[Jeeel.file.Jeeel.length] = 'Database';
    }
    
    if (Jeeel._extendMode.File && Jeeel._global && Jeeel._global.FileReader) {
        Jeeel.file.Jeeel[Jeeel.file.Jeeel.length] = 'File';
    }
    
    if (Jeeel._extendMode.Media && Jeeel._global && Jeeel._global.Audio) {
        Jeeel.file.Jeeel[Jeeel.file.Jeeel.length] = 'Media';
    }
    
    if (Jeeel._extendMode.Graphics) {
        Jeeel.file.Jeeel[Jeeel.file.Jeeel.length] = 'Graphics';
    }

    if (Jeeel._debugMode) {
        if ( ! Jeeel._extendMode.Gui && Jeeel._doc) {
            Jeeel.file.Jeeel[Jeeel.file.Jeeel.length] = 'Gui';
        }
        
        Jeeel.file.Jeeel[Jeeel.file.Jeeel.length] = 'Debug';
    }

    if (Jeeel._auto) {
        Jeeel._tmp = function () {
            for (var i = 4, l = Jeeel.file.Jeeel.length; i < l; i++) {
                Jeeel._import(Jeeel.directory.Jeeel, Jeeel.file.Jeeel[i]);
            }

            delete Jeeel._tmp;
        };

        Jeeel._import(Jeeel.directory.Jeeel, Jeeel.file.Jeeel[0]);
        Jeeel._import(Jeeel.directory.Jeeel, Jeeel.file.Jeeel[1]);
        Jeeel._import(Jeeel.directory.Jeeel, Jeeel.file.Jeeel[2]);
        Jeeel._import(Jeeel.directory.Jeeel, Jeeel.file.Jeeel[3]);
    }
})();

(function () {
    if ( ! Jeeel._global) {
        return;
    } else if (Jeeel._cleanMode) {
        return;
    }
    
    // undefinedが未定義の特殊なブラウザに対してundefinedを定義する
    if ( ! ('undefined' in Jeeel._global)) {
        Jeeel._global.undefined = void 0;
    }
      
    if (Jeeel._debugMode && (typeof Jeeel.DEBUG_URL === 'string') && (typeof Jeeel._global.evalServer === 'undefined')) {

        /**
         * サーバ側のスクリプトを走らせる
         *
         * @param {String} script サーバー側で走らせるスクリプト文字列
         * @param {Hash} [params] サーバー側に渡すパラメータ
         * @param {Function} [callback] クロスドメイン時のコールバック
         * @return {Mixied} サーバー側からの戻り値をデコードしたもの
         */
        Jeeel._global.evalServer = function evalServer(script, params, callback) {
            return Jeeel.Debug.Debugger.evalServer(script, params, callback);
        };
    }

    if (Jeeel._debugMode && (typeof Jeeel.SQL_DEBUG_URL === 'string') && (typeof Jeeel._global.evalSql === 'undefined')) {

        /**
         * サーバー側でSQLを実行する
         *
         * @param {String} sql サーバー側実行するSQL文字列
         * @param {Function} [callback] クロスドメイン時のコールバック
         * @return {Mixied} サーバー側からの戻り値をデコードしたもの
         */
        Jeeel._global.evalSql = function evalSql(sql, callback) {
            return Jeeel.Debug.Debugger.evalSql(sql, callback);
        };
    }

    if (Jeeel._debugMode && (typeof Jeeel.MAIL_URL === 'string') && (typeof Jeeel._global.sendMail === 'undefined')) {

        /**
         * メールを送信する
         *
         * @param {String} to メール送信先
         * @param {Mixied} body メール本文
         * @param {Boolean} [isHtml] HTMLメールとして送信を行うかどうかを示す(デフォルトはfalse)
         * @param {Function} [callback] クロスドメイン時のコールバック
         * @return {Boolean} メール送信が成功ならばtrueそれ以外はfalseを返す
         */
        Jeeel._global.sendMail = function sendMail(to, body, isHtml, callback) {
            return Jeeel.Debug.Debugger.sendMail(to, body, isHtml, callback);
        };
    }

    if (Jeeel._debugMode && (typeof Jeeel.FILE_OPEN_URL === 'string') && (typeof Jeeel._global.fileOpen === 'undefined')) {

        /**
         * 識別子をファイルとしてブラウザに読み込ませる
         *
         * @param {Mixied} value 読み込ませる値
         * @param {String} [fileName] 指定した名前で認識させたい時に指定する
         */
        Jeeel._global.fileOpen = function fileOpen(value, fileName) {
            return Jeeel.Debug.Debugger.fileOpen(value, fileName);
        };
    }

    if (Jeeel._debugMode && (typeof Jeeel._global.createConsole === 'undefined')) {

        /**
         * コンソールを生成する
         */
        Jeeel._global.createConsole = function createConsole() {
            Jeeel.Debug.Console.create();
        };
    }

    if (typeof Jeeel._global.$ID === 'undefined') {

        /**
         * idからElementを取得する
         *
         * @param {String} id 検索ID
         * @param {Document|Element} [target] 検索対象(省略時は現階層のDocument)
         * @return {Element} 取得したElement
         */
        Jeeel._global.$ID = function $ID(id, target) {

            if (Jeeel.Type.isDocument(target) && Jeeel._doc !== target) {
                return Jeeel.Dom.Document.create(target).getElementById(id);
            } else if (Jeeel.Type.isElement(target)) {
                return Jeeel.Dom.Element.create(target).getElementById(id);
            }

            return Jeeel.Document.getElementById(id);
        };
    }

    if (typeof Jeeel._global.$CLASS === 'undefined') {

        /**
         * classからElementを全て取得する
         *
         * @param {String} className 検索Class
         * @param {Document|Element} [target] 検索対象(省略時は現階層のDocument)
         * @return {Element[]} 取得したElement配列
         */
        Jeeel._global.$CLASS = function $CLASS(className, target) {

            if (Jeeel.Type.isDocument(target) && Jeeel._doc !== target) {
                return Jeeel.Dom.Document.create(target).getElementsByClassName(className);
            } else if (Jeeel.Type.isElement(target)) {
                return Jeeel.Dom.Element.create(target).getElementsByClassName(className);
            }

            return Jeeel.Document.getElementsByClassName(className);
        };
    }

    if (typeof Jeeel._global.$NAME === 'undefined') {

        /**
         * nameからElementを全て取得する
         *
         * @param {String} name 検索Name
         * @param {Document|Element} [target] 検索対象(省略時は現階層のDocument)
         * @return {Element[]} 取得したElement配列
         */
        Jeeel._global.$NAME = function $NAME(name, target) {

            if (Jeeel.Type.isDocument(target) && Jeeel._doc !== target) {
                return Jeeel.Dom.Document.create(target).getElementsByName(name);
            } else if (Jeeel.Type.isElement(target)) {
                return Jeeel.Dom.Element.create(target).getElementsByName(name);
            }

            return Jeeel.Document.getElementsByName(name);
        };
    }

    if (typeof Jeeel._global.$TAG === 'undefined') {

        /**
         * タグ名からElementを全て取得する
         *
         * @param {String} tagName 検索Tag
         * @param {Document|Element} [target] 検索対象(省略時は現階層のDocument)
         * @return {Element[]} 取得したElement配列
         */
        Jeeel._global.$TAG = function $TAG(tagName, target) {

            if (Jeeel.Type.isDocument(target) && Jeeel._doc !== target) {
                return Jeeel.Dom.Document.create(target).getElementsByTagName(tagName);
            } else if (Jeeel.Type.isElement(target)) {
                return Jeeel.Dom.Element.create(target).getElementsByTagName(tagName);
            }

            return Jeeel.Document.getElementsByTagName(tagName);
        };
    }

    if (typeof Jeeel._global.$PRM === 'undefined') {

        /**
         * Jeeel.Parameterインスタンスの作成
         *
         * @param {Hash} [params] 入力パラメータ
         * @return {Jeeel.Parameter} インスタンス
         * @throws {Error} paramsが配列式でない場合に起こる
         */
        Jeeel._global.$PRM = function $PRM(params) {
            return new Jeeel.Parameter(params);
        };
    }

    if (typeof Jeeel._global.$ELM === 'undefined') {

        /**
         * Jeeel.Dom.Elementインスタンスの作成
         *
         * @param {Element} element 対象Element
         * @return {Jeeel.Dom.Element} 作成したインスタンス
         */
        Jeeel._global.$ELM = function $ELM(element) {
            return new Jeeel.Dom.Element(element);
        };
    }

    if (typeof Jeeel._global.$ELMOP === 'undefined') {

        /**
         * Jeeel.Dom.ElementOperatorインスタンスの作成
         *
         * @param {Element|Element[]} elementList 対象Elementまたは複数のElementリスト
         * @return {Jeeel.Dom.ElementOperator} 作成したインスタンス
         */
        Jeeel._global.$ELMOP = function $ELMOP(elementList) {
            return new Jeeel.Dom.ElementOperator(elementList);
        };
    }
    
    if (typeof Jeeel._global.$BIND === 'undefined') {

        /**
         * Jeeel.Functionを使用したthisのバインド
         *
         * @param {Function} func 対象の関数
         * @param {Mixied} [thisArg] バインドするthis
         * @return {Jeeel.Function} 作成したインスタンス
         */
        Jeeel._global.$BIND = function $BIND(func, thisArg) {
            return Jeeel.Function.create(func).bind(thisArg);
        };
    }
    
    if (typeof Jeeel._global.$AJAX === 'undefined') {

        /**
         * Jeeel.Net.Ajaxインスタンスの作成
         *
         * @param {String} url Ajax対象URL文字列
         * @param {String} [method] HTTPメソッド(getまたはpost、大文字小文字は問わない、初期値はPOST)
         * @return {Jeeel.Net.Ajax} 作成したインスタンス
         */
        Jeeel._global.$AJAX = function $AJAX(url, method) {
            return new Jeeel.Net.Ajax(url, method);
        };
    }
    
    if (typeof Jeeel._global.$SUBMIT === 'undefined') {

        /**
         * Jeeel.Net.Submitインスタンスの作成
         *
         * @param {String|Element} form フォームを示すIDもしくはフォーム自身
         * @return {Jeeel.Net.Submit} 作成したインスタンス
         */
        Jeeel._global.$SUBMIT = function $SUBMIT(form) {
            return new Jeeel.Net.Submit(form);
        };
    }
})();
