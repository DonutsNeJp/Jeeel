/**
 * @fileOverview 汎用性がある機能の集まりです。<br />
 *                 FireFox, Safari, Chrome, Opera, IE6以上に対応しています。(個々のビルド段階のバグは考慮していません)<br />
 *                 jeeelConfigを定義すると以下の設定を変更できます。<br />
 *                 jeeelConfig.manualLoadをtrueにすると自動読み込みが無効になります。<br />
 *                 jeeelConfig.cleanをtrueにするとグローバル変数がJeeelのみの定義になります。<br />
 *                 jeeelConfig.debugをtrueにするとデバッグが有効になります。また、デバッグメソッドへのショートカットが作成されます。<br />
 *                 jeeelConfig.extendを定義し機能ごとに論理値を埋め込むと拡張機能が追加されます。(gui, webStorage, database, worker, geolocation, file, media, graphics, net)<br />
 *                 jeeelConfig.fullをtrueにすると全ての機能が有効になります。(上記のモード定義より優先される)<br />
 *                 もしくはURLにクエリを付けることでも設定を変更できます。<br />
 *                 この場合はtrue or falseではなく、1 or 0で記述する必要があります。<br >
 *                 キーはml(manualLoad), cl(clean), dbg(debug), ext(extend), full(full)となります。<br />
 *                 更にextはext[gui]=1等と記述する必要があります。<br />
 *                 extに使用できるキーはgui(gui), ws(webStorage), db(database), wk(worker), geo(geolocation), file(file), md(media), grp(graphics), net(net)<br />
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
 * @version 2.0.0 RC4
 * @license <a href="http://ja.wikipedia.org/wiki/MIT_License">MIT License</a>
 * @copylight (c) 2012 Donuts, Masato Shimada
 */

(function (global) {

    /**
     * @namespace 汎用メソッド等を提供するネームスペース
     * @name Jeeel
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
        VERSION: '2.0.0 RC4',

        /**
         * Jeeelのscriptタグに付くclass名
         *
         * @type String
         * @constant
         */
        SCRIPT_CLASS: 'jeeel-script-class',

        /**
         * Jeeelのscriptタグに付くid名(実際にはこれにインデックス番号が付く)
         *
         * @type String
         * @constant
         */
        SCRIPT_ID: 'jeeel-script-id',

        /**
         * Jeeelファイルが置かれているホスト<br />
         * 通常は空文字にする
         *
         * @type String
         * @constant
         */
        HOST: '',

        /**
         * Jeeelファイルが置かれている相対URL<br />
         * 通常は指定しなくても良い
         *
         * @type String
         * @constant
         */
        BASE_URL: '',

        /**
         * Jeeelファイルに渡されているゲットパラメータ<br />
         * 通常は指定しなくても良い
         *
         * @type String
         * @constant
         */
        QUERY: '',

        /**
         * コンフィグ
         * 
         * @type String
         * @constant
         */
        CONFIG: global.jeeelConfig ? global.jeeelConfig : {},

        /**
         * クロスドメインかどうか
         * 
         * @type Boolean
         * @constant
         */
        CROSS_DOMAIN: false,

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
         * 内部のURL等に対して制御を行うためのJeeel.Framework.Acl
         * 
         * @type Jeeel.Framework.Acl
         * @readOnly
         */
        Acl: null,
        
        /**
         * Jeeelのバックアップ
         * 
         * @type Mixied
         * @private
         */
        _backup: global.Jeeel || null,

        /**
         * Jsonp通信のためのキャッシュ
         * 
         * @private
         * @ignore
         */
        _jsp: {

        },

        /**
         * @namespace Jeeel系のサブクラス保存のための媒体
         * @private
         */
        _Object: {
            Jeeel: {}
        },

        /**
         * IEのための高速化手法
         * 
         * @type Document
         * @readOnly
         * @private
         */
        _doc: (global.document ? global.document : null),

        /**
         * IEのための高速化手法
         * 
         * @type Global
         * @readOnly
         * @private
         */
        _global: global,

        /**
         * 様々な判断用途で使用するdivタグ
         * 
         * @type Element
         * @readOnly
         * @private
         */
        _elm: global.document && global.document.createElement('div') || null,

        /**
         * 自動的にスクリプトを読み込むのを設定に関わらず無効化するかどうか
         * 
         * @type Boolean
         * @readOnly
         * @private
         */
        _disableAuto: false,

        /**
         * 自動的にスクリプトを読み込むかどうか
         *
         * @type Boolean
         * @readOnly
         * @private
         */
        _auto: !(global.jeeelConfig && global.jeeelConfig.manualLoad),

        /**
         * グローバル変数をJeeelのみにするかどうか
         *
         * @type Boolean
         * @readOnly
         * @private
         */
        _cleanMode: !!(global.jeeelConfig && global.jeeelConfig.clean),

        /**
         * デバッグを使用できるようにするかどうか(_cleanModeがtrueの場合はショートカットが作成されない)
         *
         * @type Boolean
         * @readOnly
         * @private
         */
        _debugMode: !!(global.jeeelConfig && (global.jeeelConfig.full || global.jeeelConfig.debug)),

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
            Gui: !!(global.jeeelConfig && (global.jeeelConfig.full || global.jeeelConfig.extend && global.jeeelConfig.extend.gui)),

            /**
             * Web Storage(localStorage)の拡張機能を使用するかどうか
             *
             * @type Boolean
             * @readOnly
             * @private
             */
            WebStorage: !!(global.jeeelConfig && (global.jeeelConfig.full || global.jeeelConfig.extend && global.jeeelConfig.extend.webStorage)),

            /**
             * Indexed Database APIの拡張機能を使用するかどうか
             *
             * @type Boolean
             * @readOnly
             * @private
             */
            Database: !!(global.jeeelConfig && (global.jeeelConfig.full || global.jeeelConfig.extend && global.jeeelConfig.extend.database)),

            /**
             * WebWorkersの拡張機能を使用するかどうか
             *
             * @type Boolean
             * @readOnly
             * @private
             */
            Worker: !!(global.jeeelConfig && (global.jeeelConfig.full || global.jeeelConfig.extend && global.jeeelConfig.extend.worker)),

            /**
             * Geolocation APIの拡張機能を使用するかどうか
             *
             * @type Boolean
             * @readOnly
             * @private
             */
            Geolocation: !!(global.jeeelConfig && (global.jeeelConfig.full || global.jeeelConfig.extend && global.jeeelConfig.extend.geolocation)),

            /**
             * File APIの拡張機能を使用するかどうか
             *
             * @type Boolean
             * @readOnly
             * @private
             */
            File: !!(global.jeeelConfig && (global.jeeelConfig.full || global.jeeelConfig.extend && global.jeeelConfig.extend.file)),

            /**
             * メディア系の拡張機能を使用するかどうか
             *
             * @type Boolean
             * @readOnly
             * @private
             */
            Media: !!(global.jeeelConfig && (global.jeeelConfig.full || global.jeeelConfig.extend && global.jeeelConfig.extend.media)),

            /**
             * グラフィックス系の拡張機能を使用するかどうか
             *
             * @type Boolean
             * @readOnly
             * @private
             */
            Graphics: !!(global.jeeelConfig && (global.jeeelConfig.full || global.jeeelConfig.extend && global.jeeelConfig.extend.graphics)),

            /**
             * ネットワーク系の拡張機能を使用するかどうか
             *
             * @type Boolean
             * @readOnly
             * @private
             */
            Net: !!(global.jeeelConfig && (global.jeeelConfig.full || global.jeeelConfig.extend && global.jeeelConfig.extend.net)),
            
            /**
             * 大規模アプリケーションのための機能を使用するかどうか
             *
             * @type Boolean
             * @readOnly
             * @private
             */
            Framework: !!(global.jeeelConfig && (global.jeeelConfig.full || global.jeeelConfig.extend && global.jeeelConfig.extend.framework))
        },

        /**
         * 読み込むディレクトリを示す
         */
        directory: {

        },

        /**
         * 読み込むファイルを示す
         */
        file: {

        }
    };

    // グローバルに設定
    global.Jeeel = Jeeel;
    
})(typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : (typeof this !== 'undefined' ? this : {})));

/**
 * @ignore
 */
Jeeel._Object.Jeeel.getInputName = function (name) {
    var names1 = decodeURIComponent(name).split('][');
    var names2 = names1[0].split('[');

    if (names2.length === 1) {
        return [name];
    }

    var i, l, names = [];

    for (i = 0, l = names2.length; i < l; i++) {
        names[names.length] = names2[i];
    }

    for (i = 1, l = names1.length; i < l; i++) {
        names[names.length] = names1[i];
    }

    names[names.length-1] = names[names.length-1].replace(']', '');

    return names;
};

/**
 * Jeeel.jsの個別読み込みを行う
 * 
 * @param {String} dir ディレクトリ
 * @param {String} file ソース
 */
Jeeel._import = function (dir, file) {
    if ( ! Jeeel._doc) {
        if (typeof importScripts !== 'undefined') {
            importScripts(dir + file + '.js');
        }

        return;
    }

    if ( ! this._import.index) {
        this._import.index = 1;
    }

    var index = this._import.index;
    var src = dir + file + '.js?' + this.QUERY;

    Jeeel._doc.write('<script type="text/javascript" id="' + this.SCRIPT_ID + '-' + index + '" class="' + this.SCRIPT_CLASS + '" src="' + src + '"></script>\n');

    this._import.index++;
};

/**
 * Jeeel.jsのディレクトリ別、自動読み込みを行う
 * 
 * @param {String} dir ディレクトリ
 * @param {Array} files ソースのリスト
 */
Jeeel._autoImports = function (dir, files) {
    if (this._auto) {
        for (var i = 0, l = files.length; i < l; i++) {
            this._import(dir, files[i]);
        }
    }
};

/**
 * Jeeelの名前で衝突していた値を取得する
 * 
 * @return {Mixied} 衝突値
 */
Jeeel.getConflictValue = function () {
    return this._backup;
};

/**
 * ディレクトリに対してのforeach
 *
 * @param {Object} directory ディレクトリ
 * @param {Function} callBack コールバックメソッド(要素、キー、配列)
 */
Jeeel.directoryForEach = function (directory, callBack) {
    for (var key in directory) {
        if (key !== 'toString') {
            callBack.call(this, directory[key], key, directory);
        }
    }
};

/**
 * ファイルに対してのforeach
 *
 * @param {Array} file ファイル
 * @param {Function} callBack コールバックメソッド(要素、キー、配列)
 */
Jeeel.fileForEach = function (file, callBack) {
    for (var key in file) {
        if (isNaN(key) && key !== 'length') {
            callBack.call(this, file[key], key, file);
        }
    }
};

/**
 * ファイルの相対パスを全て返す
 *
 * @return {String} ファイルパスを示す文字列
 */
Jeeel.getFilePath = function () {
    var paths = (arguments.length === 0 ? [this.directory.Jeeel + 'Jeeel.js\n'] : []);
    var directory = (arguments.length === 0 ? this.directory : arguments[0]);
    var file = (arguments.length === 0 ? this.file : arguments[1]);

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
                } else if ( ! this._extendMode.Framework && subKey === 'Framework') {
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

                    paths[paths.length] = this.getFilePath(dirTmp, fileTmp);
                }
            }
        }
    );

    return paths.join('');
};

/**
 * ファイルをスクリプトタグで囲った状態で全て返す
 *
 * @return {String} スクリプトタグで囲われたファイルパスを示す文字列
 */
Jeeel.getScript = function () {
    var paths = (arguments.length === 0 ? ['<script type="text/javascript" class="'+Jeeel.SCRIPT_CLASS+'" src="'+this.directory.Jeeel+'Jeeel.js"></script>\n'] : []);
    var directory = (arguments.length === 0 ? this.directory : arguments[0]);
    var file = (arguments.length === 0 ? this.file : arguments[1]);

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
                } else if ( ! this._extendMode.Framework && subKey === 'Framework') {
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

                    paths[paths.length] = this.getScript(dirTmp, fileTmp);
                }
            }
        }
    );

    return paths.join('');
};

/**
 * 全てのファイルを接続した状態で返す
 *
 * @param {Boolean} [minimize] 必要最小限のファイルのみ接続するかどうか
 * @param {Boolean} [disableDebug] デバッグ関連のファイル読み込みを無効にするかどうか
 * @param {Boolean} [disableExtend] 追加関連のファイル読み込みを無効にするかどうか
 * @return {String} 全てのファイルを接続した文字列
 */
Jeeel.getJoinScript = function (minimize, disableDebug, disableExtend) {
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

    var url = Jeeel.UserAgent.getBaseUrl();

    return script.join('').replace('_disableAuto: false', '_disableAuto: true').replace("HOST: ''", "HOST: '" + url + "'");
};

/**
 * 全てのファイルを接続し、圧縮した状態で返す
 *
 * @param {Boolean} [minimize] 必要最小限のファイルのみ接続するかどうか
 * @param {Boolean} [disableDebug] デバッグ関連のファイル読み込みを無効にするかどうか
 * @param {Boolean} [disableExtend] 追加関連のファイル読み込みを無効にするかどうか
 * @return {String} 全てのファイルを接続・圧縮した文字列
 */
Jeeel.getCompressScript = function (minimize, disableDebug, disableExtend) {
    return Jeeel.Debug.Compressor.compress(this.getJoinScript(minimize, disableDebug, disableExtend), true);
};

/**
 * デバッグモードが有効である場合に限りエラーをダンプする
 *
 * @param {Mixied} var_args エラー出力する値の可変引数
 * @return {Boolean} エラーをダンプしたかどうか
 */
Jeeel.errorDump = function (var_args) {
    if ( ! Jeeel._debugMode || ! Jeeel.Debug) {
        return false;
    }

    Jeeel.Debug.ErrorMessage.dump.apply(null, arguments);
    return true;
};

/**
 * デバッグモードが有効である場合に限りエラーをHTMLとしてダンプする
 *
 * @param {Mixied} var_args エラー出力する値の可変引数
 * @return {Boolean} エラーをダンプしたかどうか
 */
Jeeel.errorHtmlDump = function (var_args) {
    if ( ! Jeeel._debugMode || ! Jeeel.Debug) {
        return false;
    }

    Jeeel.Debug.ErrorMessage.dumpHtml.apply(null, arguments);
    return true;
};

/**
 * デバッグモードが有効である場合に限りエラーをConsoleにダンプする
 *
 * @param {Mixied} var_args エラー出力する値の可変引数
 * @return {Boolean} エラーをダンプしたかどうか
 */
Jeeel.errorDumpConsole = function (var_args) {
    if ( ! Jeeel._debugMode || ! Jeeel.Debug) {
        return false;
    }

    Jeeel.Debug.Console.log.apply(null, arguments);
    return true;
};

/**
 * Domが完成した時に呼び出されるイベントの登録を行う
 *
 * @param {Function} listener 登録イベント
 * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはJeeel.Windowになる)
 */
Jeeel.addLoadEvent = function (listener, thisArg) {
    Jeeel.Window.addEventListener(Jeeel.Dom.Event.Type.LOAD, listener, thisArg);
};

Jeeel.directory.Jeeel = {

    /**
      * 自身を文字列参照された場合の変換
      *
      * @return {String} 自身のディレクトリ
      * @private
      */
    toString: function () {
        return Jeeel.BASE_URL + 'Jeeel/';
    }
};

(function (global) {
    if (typeof Jeeel === 'undefined') {
        return;
    }

    // クロスドメインの判定
    if (Jeeel.HOST && Jeeel.HOST.match(/^https?:\/\//) && global.location) {
        var host = (global.location.protocol + '//' + global.location.host).replace(/([\/()\[\]{}|*+-.,\^$?\\])/g, '\\$1');

        if ( ! Jeeel.HOST.match(new RegExp('^' + host))) {
            Jeeel.CROSS_DOMAIN = true;
        }
    }

    // ユニークIDを設定する
    Jeeel.UNIQUE_ID = 'Jeeel-' + (Jeeel.VERSION + Math.random()).replace(/\D/g, '');
    Jeeel.SCRIPT_ID = Jeeel.SCRIPT_ID + '-' + Jeeel.UNIQUE_ID;

    // ベースURLとクラス、IDの設定
    if (Jeeel._doc) {

        var scripts = Jeeel._doc.getElementsByTagName('script');
        var jeeelRegExp = /^(.*)\/Jeeel\/Jeeel(?:-Set(?:-Min)?)?\.js(\?.*)?$/i,
            jeeelMatch;

        for (var i = scripts.length; i--;) {
            var script = scripts[i],
                src = script.getAttribute('src');

            if ( ! src || ! (jeeelMatch = src.match(jeeelRegExp))) {
                continue;
            }

            script.className = Jeeel.SCRIPT_CLASS;
            script.id = Jeeel.SCRIPT_ID + '-0';

            Jeeel.BASE_URL = jeeelMatch[1] + '/';
            Jeeel.QUERY = jeeelMatch[2] && jeeelMatch[2].replace(/^\?/, '') || '';
            
            break;
        }
        
        // クエリから設定内容の取得
        if (Jeeel.QUERY) {
            var config = Jeeel.QUERY.split('&');
            var full = false;

            for (var j = config.length; j--;) {
                var tmp = config[j].split('=');
                var names = Jeeel._Object.Jeeel.getInputName(tmp[0]);

                switch (names[0]) {
                    case 'ml':
                        Jeeel._auto = !(+tmp[1]);
                        break;

                    case 'cl':
                        Jeeel._cleanMode = !!(+tmp[1]);
                        break;

                    case 'dbg':
                        Jeeel._debugMode = !!(+tmp[1]);
                        break;

                    case 'ext':
                        switch (names[1]) {
                            case 'gui':
                                Jeeel._extendMode.Gui = !!(+tmp[1]);
                                break;

                            case 'ws':
                                Jeeel._extendMode.WebStorage = !!(+tmp[1]);
                                break;

                            case 'db':
                                Jeeel._extendMode.Database = !!(+tmp[1]);
                                break;

                            case 'wk':
                                Jeeel._extendMode.Worker = !!(+tmp[1]);
                                break;

                            case 'geo':
                                Jeeel._extendMode.Geolocation = !!(+tmp[1]);
                                break;

                            case 'file':
                                Jeeel._extendMode.File = !!(+tmp[1]);
                                break;

                            case 'md':
                                Jeeel._extendMode.Media = !!(+tmp[1]);
                                break;

                            case 'grp':
                                Jeeel._extendMode.Graphics = !!(+tmp[1]);
                                break;

                            case 'net':
                                Jeeel._extendMode.Net = !!(+tmp[1]);
                                break;
                                
                            case 'fw':
                                Jeeel._extendMode.Framework = !!(+tmp[1]);
                                break;
                        }
                        break;

                    case 'full':
                        full = !!(+tmp[1]);
                        break;
                }
            }

            // FULLモードの際は全て上書きする
            if (full) {
                Jeeel._debugMode = Jeeel._extendMode.Gui
                                 = Jeeel._extendMode.WebStorage
                                 = Jeeel._extendMode.Database
                                 = Jeeel._extendMode.Worker
                                 = Jeeel._extendMode.Geolocation
                                 = Jeeel._extendMode.File
                                 = Jeeel._extendMode.Media
                                 = Jeeel._extendMode.Graphics
                                 = Jeeel._extendMode.Net
                                 = Jeeel._extendMode.Framework
                                 = true;
            }
        }
        
        // 不要な物を廃棄する
        script = scripts = jeeelMatch = jeeelRegExp = full = config = tmp = names = host = null;
    }

    if (Jeeel._disableAuto) {
        Jeeel._auto = false;
    }

    Jeeel.file.Jeeel = ['Class', 'Function', 'Type', 'Method', 'Filter', 'Hash', 'String', 'Number', 'Code', 'Loader', 'UserAgent', 'Json', 'Session', 'Dom', 'Net', 'Template', 'Timer', 'DataStructure', 'Object', 'Parameter', 'Validator', 'Storage', 'External', 'Deferred', 'Config', 'Error', 'Util'];

    if (Jeeel._extendMode.Gui && Jeeel._doc) {
        Jeeel.file.Jeeel[Jeeel.file.Jeeel.length] = 'Gui';
    }

    if (Jeeel._extendMode.Worker && global && global.Worker) {
        Jeeel.file.Jeeel[Jeeel.file.Jeeel.length] = 'Worker';
    }

    if (Jeeel._extendMode.Database && global && global.openDatabase) {
        Jeeel.file.Jeeel[Jeeel.file.Jeeel.length] = 'Database';
    }

    if (Jeeel._extendMode.File && global && global.FileReader) {
        Jeeel.file.Jeeel[Jeeel.file.Jeeel.length] = 'File';
    }

    if (Jeeel._extendMode.Media && global && global.Audio) {
        Jeeel.file.Jeeel[Jeeel.file.Jeeel.length] = 'Media';
    }

    if (Jeeel._extendMode.Graphics) {
        Jeeel.file.Jeeel[Jeeel.file.Jeeel.length] = 'Graphics';
    }
    
    if (Jeeel._extendMode.Framework) {
        Jeeel.file.Jeeel[Jeeel.file.Jeeel.length] = 'Framework';
    }

    if (Jeeel._debugMode) {
        if ( ! Jeeel._extendMode.Gui && Jeeel._doc) {
            Jeeel.file.Jeeel[Jeeel.file.Jeeel.length] = 'Gui';
        }

        Jeeel.file.Jeeel[Jeeel.file.Jeeel.length] = 'Debug';
    }

    // 自動ロードを始動
    if (Jeeel._auto) {
        Jeeel._tmp = function () {
            for (var i = 5, l = Jeeel.file.Jeeel.length; i < l; i++) {
                Jeeel._import(Jeeel.directory.Jeeel, Jeeel.file.Jeeel[i]);
            }

            delete Jeeel._tmp;
        };

        Jeeel._import(Jeeel.directory.Jeeel, Jeeel.file.Jeeel[0]);
        Jeeel._import(Jeeel.directory.Jeeel, Jeeel.file.Jeeel[1]);
        Jeeel._import(Jeeel.directory.Jeeel, Jeeel.file.Jeeel[2]);
        Jeeel._import(Jeeel.directory.Jeeel, Jeeel.file.Jeeel[3]);
        Jeeel._import(Jeeel.directory.Jeeel, Jeeel.file.Jeeel[4]);
    }

    // グローバル関数・変数の設定
    if (Jeeel._cleanMode) {
        return;
    }

    // undefinedが未定義の特殊なブラウザに対してundefinedを定義する
    if ( ! ('undefined' in global)) {
      
        /**
         * @ignore
         */
        global.undefined = void 0;
    }

    if (Jeeel._debugMode && (typeof Jeeel.DEBUG_URL === 'string') && (typeof global.evalServer === 'undefined')) {

        /**
         * サーバ側のスクリプトを走らせる
         *
         * @param {String} script サーバー側で走らせるスクリプト文字列
         * @param {Hash} [params] サーバー側に渡すパラメータ
         * @param {Function} [callback] クロスドメイン時のコールバック
         * @return {Mixied} サーバー側からの戻り値をデコードしたもの
         * @name evalServer
         * @function
         */
        function evalServer(script, params, callback) {
            return Jeeel.Debug.Debugger.evalServer(script, params, callback);
        }
        
        global.evalServer = evalServer;
    }

    if (Jeeel._debugMode && (typeof Jeeel.SQL_DEBUG_URL === 'string') && (typeof global.evalSql === 'undefined')) {

        /**
         * サーバー側でSQLを実行する
         *
         * @param {String} sql サーバー側実行するSQL文字列
         * @param {Function} [callback] クロスドメイン時のコールバック
         * @return {Mixied} サーバー側からの戻り値をデコードしたもの
         * @name evalSql
         * @function
         */
        function evalSql(sql, callback) {
            return Jeeel.Debug.Debugger.evalSql(sql, callback);
        }
        
        global.evalSql = evalSql;
    }

    if (Jeeel._debugMode && (typeof Jeeel.MAIL_URL === 'string') && (typeof global.sendMail === 'undefined')) {

        /**
         * メールを送信する
         *
         * @param {String} to メール送信先
         * @param {Mixied} body メール本文
         * @param {Boolean} [isHtml] HTMLメールとして送信を行うかどうかを示す(デフォルトはfalse)
         * @param {Function} [callback] クロスドメイン時のコールバック
         * @return {Boolean} メール送信が成功ならばtrueそれ以外はfalseを返す
         * @name sendMail
         * @function
         */
        function sendMail(to, body, isHtml, callback) {
            return Jeeel.Debug.Debugger.sendMail(to, body, isHtml, callback);
        }
        
        global.sendMail = sendMail;
    }

    if (Jeeel._debugMode && (typeof Jeeel.FILE_OPEN_URL === 'string') && (typeof global.fileOpen === 'undefined')) {

        /**
         * 識別子をファイルとしてブラウザに読み込ませる
         *
         * @param {Mixied} value 読み込ませる値
         * @param {String} [fileName] 指定した名前で認識させたい時に指定する
         * @name fileOpen
         * @function
         */
        function fileOpen(value, fileName) {
            return Jeeel.Debug.Debugger.fileOpen(value, fileName);
        }
        
        global.fileOpen = fileOpen;
    }

    if (Jeeel._debugMode && (typeof global.createConsole === 'undefined')) {

        /**
         * コンソールを生成する
         * 
         * @name createConsole
         * @function
         */
        function createConsole() {
            Jeeel.Debug.Console.create();
        }
        
        global.createConsole = createConsole;
    }

    if (typeof global.$ID === 'undefined') {

        /**
         * idからElementを取得する
         *
         * @param {String} id 検索ID
         * @param {Document|Element} [target] 検索対象(省略時は現階層のDocument)
         * @return {Element} 取得したElement
         * @name $ID
         * @function
         */
        function $ID(id, target) {

            if (Jeeel.Type.isDocument(target) && Jeeel._doc !== target) {
                return Jeeel.Dom.Document.create(target).getElementById(id);
            } else if (Jeeel.Type.isElement(target)) {
                return Jeeel.Dom.Element.create(target).getElementById(id);
            }

            return Jeeel.Document.getElementById(id);
        }
        
        global.$ID = $ID;
    }

    if (typeof global.$CLASS === 'undefined') {

        /**
         * classからElementを全て取得する
         *
         * @param {String} className 検索Class
         * @param {Document|Element} [target] 検索対象(省略時は現階層のDocument)
         * @return {Element[]} 取得したElement配列
         * @name $CLASS
         * @function
         */
        function $CLASS(className, target) {

            if (Jeeel.Type.isDocument(target) && Jeeel._doc !== target) {
                return Jeeel.Dom.Document.create(target).getElementsByClassName(className);
            } else if (Jeeel.Type.isElement(target)) {
                return Jeeel.Dom.Element.create(target).getElementsByClassName(className);
            }

            return Jeeel.Document.getElementsByClassName(className);
        }
        
        global.$CLASS = $CLASS;
    }

    if (typeof global.$NAME === 'undefined') {

        /**
         * nameからElementを全て取得する
         *
         * @param {String} name 検索Name
         * @param {Document|Element} [target] 検索対象(省略時は現階層のDocument)
         * @return {Element[]} 取得したElement配列
         * @name $NAME
         * @function
         */
        function $NAME(name, target) {

            if (Jeeel.Type.isDocument(target) && Jeeel._doc !== target) {
                return Jeeel.Dom.Document.create(target).getElementsByName(name);
            } else if (Jeeel.Type.isElement(target)) {
                return Jeeel.Dom.Element.create(target).getElementsByName(name);
            }

            return Jeeel.Document.getElementsByName(name);
        }
        
        global.$NAME = $NAME;
    }

    if (typeof global.$TAG === 'undefined') {

        /**
         * タグ名からElementを全て取得する
         *
         * @param {String} tagName 検索Tag
         * @param {Document|Element} [target] 検索対象(省略時は現階層のDocument)
         * @return {Element[]} 取得したElement配列
         * @name $TAG
         * @function
         */
        function $TAG(tagName, target) {

            if (Jeeel.Type.isDocument(target) && Jeeel._doc !== target) {
                return Jeeel.Dom.Document.create(target).getElementsByTagName(tagName);
            } else if (Jeeel.Type.isElement(target)) {
                return Jeeel.Dom.Element.create(target).getElementsByTagName(tagName);
            }

            return Jeeel.Document.getElementsByTagName(tagName);
        }
        
        global.$TAG = $TAG;
    }
    
    if (typeof global.$QUERY === 'undefined') {

        /**
         * セレクタからElementを全て取得する
         *
         * @param {String} selector 検索セレクタ
         * @param {Document|Element} [target] 検索対象(省略時は現階層のDocument)
         * @return {Element[]} 取得したElement配列
         * @see Jeeel.Dom.Selector
         * @name $QUERY
         * @function
         */
        function $QUERY(selector, target) {

            if (Jeeel.Type.isDocument(target) && Jeeel._doc !== target) {
                return Jeeel.Dom.Document.create(target).getElementsBySelector(selector);
            } else if (Jeeel.Type.isElement(target)) {
                return Jeeel.Dom.Element.create(target).getElementsBySelector(selector);
            }

            return Jeeel.Document.getElementsBySelector(selector);
        }
        
        global.$QUERY = $QUERY;
    }

    if (typeof global.$PRM === 'undefined') {

        /**
         * Jeeel.Parameterインスタンスの作成
         *
         * @param {Hash} [params] 入力パラメータ
         * @return {Jeeel.Parameter} インスタンス
         * @throws {Error} paramsが配列式でない場合に起こる
         * @name $PRM
         * @function
         */
        function $PRM(params) {
            return new Jeeel.Parameter(params);
        }
        
        global.$PRM = $PRM;
    }

    if (typeof global.$ELM === 'undefined') {

        /**
         * Jeeel.Dom.Elementインスタンスの作成
         *
         * @param {Element} element 対象Element
         * @return {Jeeel.Dom.Element} 作成したインスタンス
         * @name $ELM
         * @function
         */
        function $ELM(element) {
            return new Jeeel.Dom.Element(element);
        }
        
        global.$ELM = $ELM;
    }

    if (typeof global.$ELMOP === 'undefined') {

        /**
         * Jeeel.Dom.ElementOperatorインスタンスの作成
         *
         * @param {String|Element|Element[]} elementList セレクタ文字列、対象Elementまたは複数のElementリスト
         * @return {Jeeel.Dom.ElementOperator} 作成したインスタンス
         * @name $ELMOP
         * @function
         */
        function $ELMOP(elementList) {
            return new Jeeel.Dom.ElementOperator(elementList);
        }
        
        global.$ELMOP = $ELMOP;
    }

    if (typeof global.$BIND === 'undefined') {

        /**
         * Jeeel.Functionを使用したthisのバインド
         *
         * @param {Function} func 対象の関数
         * @param {Mixied} [thisArg] バインドするthis
         * @return {Jeeel.Function} 作成したインスタンス
         * @name $BIND
         * @function
         */
        function $BIND(func, thisArg) {
            return Jeeel.Function.create(func).bind(thisArg);
        }
        
        global.$BIND = $BIND;
    }

    if (typeof global.$AJAX === 'undefined') {

        /**
         * Jeeel.Net.Ajaxインスタンスの作成
         *
         * @param {String} url Ajax対象URL文字列
         * @param {String} [method] HTTPメソッド(getまたはpost、大文字小文字は問わない、初期値はPOST)
         * @return {Jeeel.Net.Ajax} 作成したインスタンス
         * @name $AJAX
         * @function
         */
        function $AJAX(url, method) {
            return new Jeeel.Net.Ajax(url, method);
        }
        
        global.$AJAX = $AJAX;
    }

    if (typeof global.$FORM === 'undefined') {

        /**
         * Jeeel.Net.Formインスタンスの作成
         *
         * @param {String|Element} form フォームを示すIDもしくはフォーム自身
         * @return {Jeeel.Net.Form} 作成したインスタンス
         * @name $FORM
         * @function
         */
        function $FORM(form) {
            return new Jeeel.Net.Form(form);
        }
        
        global.$FORM = $FORM;
    }
})(Jeeel._global);
