
/**
 * @staticClass コンソールを管理するスタティッククラス
 */
Jeeel.Debug.Console = {

    /**
     * コンソールの識別子
     *
     * @type String
     * @constant
     */
    CONSOLE_ID: 'jeeel-debug-console',

    /**
     * コンソールログの識別子
     *
     * @type String
     * @constant
     */
    CONSOLE_LOG_ID: 'jeeel-debug-console-log',
    
    /**
     * コンソールキーボードの識別子
     * 
     * @type String
     * @constant
     */
    CONSOLE_KEYBOARD_ID: 'jeeel-debug-console-keyboard',

    /**
     * コンソール実行結果の識別子
     *
     * @type String
     * @constant
     */
    CONSOLE_RESULT_ID: 'jeeel-debug-console-res',

    /**
     * コンソールの関数補完識別子
     *
     * @type String
     * @constant
     */
    CONSOLE_CODE_ASSIST_ID: 'jeeel-debug-console-code-assist',
    
    /**
     * コンソール
     *
     * @type Element
     * @private
     */
    _console: null,

    /**
     * コンソール入力部
     *
     * @type Jeeel.Dom.Element.Textarea
     * @private
     */
    _consoleIn: null,
    
    /**
     * コンソールキーボード
     * 
     * @type Element
     * @private
     */
    _consoleKeyboard: null,

    /**
     * コンソール出力部
     *
     * @type Element
     * @private
     */
    _consoleOut: null,

    /**
     * コンソール関数補完ウィンドウ
     *
     * @type Jeeel.Dom.ElementOperator
     * @private
     */
    _consoleCodeAssistWindow: null,

    /**
     * コンソールログの現在のポジション
     *
     * @type Integer
     * @private
     */
    _consolePosition: 0,

    /**
     * コンソールのログ
     *
     * @type String[]
     * @private
     */
    _consoleLog: [],

    /**
     * コンソールの実行結果
     *
     * @type Element[]
     * @private
     */
    _consoleResult: [],
    
    /**
     * コンソールの保存媒体
     * 
     * @type Jeeel.Session.Name
     * @private
     */
    _consoleSession: null,
    
    /**
     * 現在のモードが単数行モードかどうか
     * 
     * @type Boolean
     * @private
     */
    _isSingleLineMode: true,

    /**
     * Html要素の展開及び操作を行うモードかどうかを示す
     *
     * @type Boolean
     * @private
     */
    _useHtmlExplorer: true,

    /**
     * 関数補完に使用するデータ
     *
     * @type Hash
     * @private
     * @ignore
     */
    _codeAssistData: {
      
        /**
         * コード補完を使うかどうか
         * 
         * @type Boolean
         */
        use: true,
        
        /**
         * 補完Windowの子リストを収めたElementラッパー
         * 
         * @type Jeeel.Dom.ElementOperator
         */
        winChild: null,
        
        /**
         * 使用中かどうか
         * 
         * @type Boolean
         */
        enable: false,
        
        /**
         * ウィンドウが表示中かどうか
         * 
         * @type Boolean
         */
        show: false,
        
        /**
         * 次のデータ更新をキャンセルするかどうか
         * 
         * @type Boolean
         */
        cancel: false,
        
        /**
         * 親要素
         * 
         * @type String
         */
        parent: '',
        
        /**
         * 子要素
         * 
         * @type String
         */
        child: '',
        
        /**
         * 補完した際に書き換えを行うインデックス
         * 
         * @type Interger
         */
        index: 0,
        
        /**
         * 補完した際の選択中のデータのインデックス
         * 
         * @type Interger
         */
        selectIndex: -1,
        
        /**
         * 現在補完している要素のキーと値のペアリストを保持する配列
         * 
         * @type Jeeel.Object.Item[]
         */
        pairs: [],
        
        /**
         * 現在補完している要素のキーを保持する配列
         * 
         * @type String[]
         */
        keys: [],
        
        /**
         * 検索が完了したキャッシュ
         * 
         * @type Hash
         */
        cache: {}
    },

    /**
     * 簡易コンソールを生成する<br />
     * 以下操作方法<br />
     * 単数行モード<br />
     * <ul>
     *   <li>Enterで実行</li>
     *   <li>上下で履歴</li>
     *   <li>Ctrl+Mで複数行モードに切り替え</li>
     *   <li>結果がオブジェクトの場合は矢印をクリックで展開</li>
     * </ul><br />
     * 複数行モード<br />
     * <ul>
     *   <li>Ctrl+Enterで実行</li>
     *   <li>Ctrl+上下で履歴</li>
     *   <li>Ctrl+Mで複数行モードに切り替え</li>
     *   <li>結果がオブジェクトの場合は矢印をクリックで展開</li>
     * </ul>
     */
    create: function () {

        if (arguments.callee.ignore) {
            return;
        }
        
        // thisをbind
        for (var property in this) {
            if (Jeeel.Type.isFunction(this[property])) {
                this[property] = Jeeel.Function.simpleBind(this[property], this);
            }
        }

        arguments.callee.ignore = true;

        this._setStyle();

        var div = Jeeel.Document.createElement('div');
        div.innerHTML = '<textarea style="height: 25px;" id="' + this.CONSOLE_LOG_ID + '"></textarea>\n'
                      + '<div id="' + this.CONSOLE_KEYBOARD_ID + '"><div class="title">キーボード</div></div>\n'
                      + '<div id="' + this.CONSOLE_RESULT_ID + '"></div>\n'
                      + '<ul style="display: none;" id="' + this.CONSOLE_CODE_ASSIST_ID + '"></ul>';

        div.id = this.CONSOLE_ID;
        this._console = Jeeel.Debug.Debugger.elementInsertTop(div);

        var self = this;
        var session = Jeeel.Session.Name.create();

        this._consoleSession = session.setExpires(-1);
        
        this._consoleIn  = Jeeel.Dom.Element.Textarea.create(Jeeel.Document.getElementById(this.CONSOLE_LOG_ID));
        this._consoleOut = Jeeel.Document.getElementById(this.CONSOLE_RESULT_ID);
        this._consoleKeyboard = Jeeel.Document.getElementById(this.CONSOLE_KEYBOARD_ID);
        this._consoleCodeAssistWindow = Jeeel.Dom.ElementOperator.create(Jeeel.Dom.Element.create(Jeeel.Document.getElementById(this.CONSOLE_CODE_ASSIST_ID)).setShim());

        this._consoleLog    = session.get(this.CONSOLE_LOG_ID, []);
        this._consoleResult = Jeeel.Filter.Hash.Fill.create(0, this._consoleLog.length, null).filter([]);
        this._initKeyboard();

        this._consolePosition = this._consoleLog.length;
        
        // モバイル系ではキーボードがショボイためソフトウェアキーボードを有効化
        if (Jeeel.UserAgent.isMobile()) {
            this._consoleKeyboard.style.display = 'block';
        }
        
        var singleLine, multiLine;

        var setEvent = function (listener) {
            if (Jeeel.UserAgent.isOpera()) {
                self._consoleIn.getElement()['on' + Jeeel.Dom.Event.Type.KEY_PRESS] =listener;
            } else {
                self._consoleIn.getElement()['on' + Jeeel.Dom.Event.Type.KEY_DOWN] = listener;
            }
            
            self._isSingleLineMode = listener === singleLine;
        };

        /**
         * @ignore
         */
        singleLine = function () {
            var e = Jeeel.Dom.Event.getEventObject();
            var keyCode = e.getKeyCode();
            var timeoutId;
            
            if (self._codeAssistData.use) {
                if (Jeeel.Type.inArray(keyCode, [Jeeel.Dom.Event.KeyCode.Space, Jeeel.Dom.Event.KeyCode.LeftBracket, Jeeel.Dom.Event.KeyCode.RightBracket])) {
                    self._codeAssistDataClose();
                } else if (self._codeAssistData.enable || Jeeel.Type.inArray(keyCode, [Jeeel.Dom.Event.KeyCode.Period, Jeeel.Dom.Event.KeyCode.BackSpace]) || ! self._consoleIn.getText()) {
                    timeoutId = Jeeel.Timer.setTimeout(self._setCodeAssistData, 1);
                }
            }

            if (keyCode === Jeeel.Dom.Event.KeyCode.Enter) {

                e.stop();

                self._evalConsoleText();
                
                return false;
                
            } else if (Jeeel.Type.inArray(keyCode, [Jeeel.Dom.Event.KeyCode.Up, Jeeel.Dom.Event.KeyCode.PageUp])) {

                e.stop();

                self._consoleUp();
                
                Jeeel.Timer.clearTimeout(timeoutId);

                return false;
                
            } else if (Jeeel.Type.inArray(keyCode, [Jeeel.Dom.Event.KeyCode.Down, Jeeel.Dom.Event.KeyCode.PageDown])) {
                
                e.stop();

                self._consoleDown();
                
                Jeeel.Timer.clearTimeout(timeoutId);

                return false;
                
            } else if (self._codeAssistData.enable && keyCode === Jeeel.Dom.Event.KeyCode.Tab) {
                e.stop();

                if (e.shiftKey) {
                    self._consoleUp();
                } else {
                    self._consoleDown();
                }
                
                Jeeel.Timer.clearTimeout(timeoutId);

                return false;
                
            } else if (keyCode === Jeeel.Dom.Event.KeyCode.M && e.ctrlKey) {

                e.stop();

                self._consoleIn.getStyle().height = '75px';
                setEvent(multiLine);
                
                self._codeAssistDataClose(true);
                
                Jeeel.Dom.Element.create(self._consoleOut).hide().show();

                return false;
            } else if (keyCode === Jeeel.Dom.Event.KeyCode.Shift) {
                e.stop();
                
                Jeeel.Timer.clearTimeout(timeoutId);

                return false;
            }

            return true;
        };

        /**
         * @ignore
         */
        multiLine = function () {
            var e = Jeeel.Dom.Event.getEventObject();
            var keyCode = e.getKeyCode();
            
            if (e.ctrlKey) {
                if (keyCode === Jeeel.Dom.Event.KeyCode.Enter) {

                    e.stop();

                    self._evalConsoleText();

                    return false;

                } else if (Jeeel.Type.inArray(keyCode, [Jeeel.Dom.Event.KeyCode.Up, Jeeel.Dom.Event.KeyCode.PageUp])) {

                    e.stop();

                    self._consoleUp();

                    return false;

                } else if (Jeeel.Type.inArray(keyCode, [Jeeel.Dom.Event.KeyCode.Down, Jeeel.Dom.Event.KeyCode.PageDown])) {

                    e.stop();

                    self._consoleDown();

                    return false;

                } else if (keyCode === Jeeel.Dom.Event.KeyCode.M) {

                    e.stop();

                    self._consoleIn.getStyle().height = '25px';
                    setEvent(singleLine);
                    self._setConsoleText(self._consoleIn.replace(/\r\n|\n/g, ' '));
                    
                    Jeeel.Dom.Element.create(self._consoleOut).hide().show();

                    return false;
                }
            }

            return true;
        };

        setEvent(singleLine);
    },

    /**
     * コンソール出力に値を表示する<br />
     * 履歴には残らない
     *
     * @param {Mixied} var_args 表示する値の可変引数
     * @return {Array} 表示する値をそのまま返す
     */
    log: function (var_args) {
        Jeeel.Debug.Console.create();

        var logs = Array.prototype.slice.call(arguments, 0, arguments.length);

        Jeeel.Debug.Console._addResult(logs);

        return logs;
    },

    /**
     * コンソールの履歴等を全て破棄する
     */
    clear: function () {
        this._consoleLog = this._consoleResult = [];
        this._consolePosition = 0;
        this._setConsoleText('');
        
        Jeeel.Dom.ElementOperator.create(this._consoleOut.childNodes).remove();

        this._consoleSession.set(this.CONSOLE_LOG_ID, [])
                            .save();
    },

    /**
     * コンソールの履歴を返す
     *
     * @param {Integer} index 履歴番号
     * @return {String} 結果値
     */
    getLog: function (index) {
        if (0 <= index && index < this._consoleLog.length) {
            return this._consoleLog[index];
        }

        return null;
    },

    /**
     * コンソールの結果履歴を全て返す
     *
     * @return {String[]} 結果値のリスト
     */
    getLogAll: function () {
        return this._consoleLog;
    },

    /**
     * HTML操作、閲覧機能の有効にするかどうかを設定する
     *
     * @param {Boolean} enable 有効にするかどうか
     */
    enableHtmlExplorer: function (enable) {
        this._useHtmlExplorer = !!enable;
    },
    
    /**
     * コード補完を有効にするかどうかを設定する
     * 
     * @param {Boolean} enable 有効にするかどうか
     */
    enableCodeAssist: function (enable) {
        this._codeAssistData.use = !!enable;
        
        if ( ! enable) {
            this._codeAssistDataClose(true);
        }
    },

    /**
     * コンソールを上部に移動する(デフォルト)
     */
    moveTop: function () {
        Jeeel.Debug.Debugger.elementInsertTop(this._console);
    },

    /**
     * コンソールを下部に移動する
     */
    moveBottom: function () {
        Jeeel._doc.body.appendChild(this._console);
    },

    /**
     * コンソールに対するスタイルの設定を行う
     */
    _setStyle: function () {
        if (arguments.callee.ignore) {
            return;
        }

        arguments.callee.ignore = true;

        var css = 'div#' + this.CONSOLE_ID + ' {\n'
                + '    position: relative;\n'
                + '    z-index: 100000;\n'
                + '    background-color: white;\n'
                + '    text-align: left;\n'
                + '    font-family: "Arial", "Times New Roman", "Courier New", "Courier", cursive;\n'
                + '}\n'
                + 'textarea#' + this.CONSOLE_LOG_ID + ' {\n'
                + '    width: 99.3%;\n'
                + '    font-size: 20px;\n'
                + '}\n'
                + 'div#' + this.CONSOLE_RESULT_ID + ' {\n'
                + '    background-color: white;\n'
                + '    text-align: left;\n'
                + '    width: 100%;\n'
                + '    height: auto;\n'
                + '    font-size:15px;\n'
                + '}\n'
                + 'div#' + this.CONSOLE_KEYBOARD_ID + ' {\n'
                + '    background-color: white;\n'
                + '    position: fixed;\n'
                + '    z-index: 20;\n'
                + '    top: 38%;\n'
                + '    left: 38%;\n'
                + '    border: 1px solid #C2C2C2;\n'
                + '    width: 30%;\n'
                + '    height: 100px;\n'
                + '    display: none;\n'
                + '}\n'
                + 'div#' + this.CONSOLE_KEYBOARD_ID + ' .title {\n'
                + '    text-align: center;\n'
                + '}\n'
                + 'div#' + this.CONSOLE_KEYBOARD_ID + ' .keyboard {\n'
                + '    border-top: 1px solid #F2F2F2;\n'
                + '}\n'
                + 'div#' + this.CONSOLE_KEYBOARD_ID + ' .operator {\n'
                + '    text-align: center;\n'
                + '}\n'
                + 'div#' + this.CONSOLE_KEYBOARD_ID + ' .button {\n'
                + '    cursor: pointer;\n'
                + '    display: inline-block;\n'
                + '    color: #d9eef7;\n'
                + '    padding: .2em 1.25em .4em;\n'
                + '    margin: 3px;\n'
                + '    border: solid 1px #0076a3;\n'
                + '    -webkit-border-radius: .5em;\n'
                + '    -moz-border-radius: .5em;\n'
                + '    border-radius: .5em;\n'
                + '    -webkit-box-shadow: 0 1px 2px rgba(0,0,0,.2);\n'
                + '    -moz-box-shadow: 0 1px 2px rgba(0,0,0,.2);\n'
                + '    box-shadow: 0 1px 2px rgba(0,0,0,.2);\n'
                + '    background: #0095cd;\n'
                + '    background: -webkit-gradient(linear, left top, left bottom, from(#00adee), to(#0078a5));\n'
                + '    background: -moz-linear-gradient(top,  #00adee,  #0078a5);\n'
                + '    filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#00adee\', endColorstr=\'#0078a5\');\n'
                + '}\n'
                + 'div#' + this.CONSOLE_KEYBOARD_ID + ' .button:hover {\n'
                + '    background: #007ead;\n'
                + '    background: -webkit-gradient(linear, left top, left bottom, from(#0095cc), to(#00678e));\n'
                + '    background: -moz-linear-gradient(top,  #0095cc,  #00678e);\n'
                + '    filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#0095cc\', endColorstr=\'#00678e\');\n'
                + '}\n'
                + 'div#' + this.CONSOLE_KEYBOARD_ID + ' .button:active {\n'
                + '    position: relative;\n'
                + '    top: 1px;\n'
                + '    color: #80bed6;\n'
                + '    background: -webkit-gradient(linear, left top, left bottom, from(#0078a5), to(#00adee));\n'
                + '    background: -moz-linear-gradient(top,  #0078a5,  #00adee);\n'
                + '    filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#0078a5\', endColorstr=\'#00adee\');\n'
                + '}\n'
                + 'ul#' + this.CONSOLE_CODE_ASSIST_ID + ' {\n'
                + '    padding: 0;\n'
                + '    font-size: 15px;\n'
                + '    line-height: 18px;\n'
                + '    text-align: left;\n'
                + '    overflow: auto;\n'
                + '    border: solid 1px gray;\n'
                + '    z-index: 200;\n'
                + '    position: absolute;\n'
                + '    left: 200px;\n'
                + '    top: 40px;\n'
                + '    overflow-x: hidden;\n'
                + '    overflow-y: auto;\n'
                + '    background-color: white;\n'
                + '    max-height: 200px;\n'
                + '    _height: 200px;\n'
                + '}\n'
                + 'ul#' + this.CONSOLE_CODE_ASSIST_ID + ' li {\n'
                + '    list-style-type: none;\n'
                + '    padding: 1px 20px 1px 2px;\n'
                + '    cursor: pointer;\n'
                + '}';

        Jeeel.Loader.addStyle(css);
    },

    /**
     * コンソール入力部にテキストをセットする
     *
     * @param {String} text 設定値
     * @private
     */
    _setConsoleText: function (text) {

        this._codeAssistDataClose();
        this._consoleIn.setText(text);
    },
    
    /**
     * thisをbindして実行を行う
     * 
     * @param {String} _$txt$_ 実行文字列
     * @return {Mixied} 実行結果
     */
    _eval: function (_$txt$_) {
        // eval中に使える関数の定義
        var clear = this.clear;
        var enableCodeAssist = this.enableCodeAssist;
        var enableHtmlExplorer = this.enableHtmlExplorer;
        
        // 先頭のvar宣言は自動的にグローバル宣言に切り替える
        _$txt$_ = _$txt$_.replace(/^ *var +([a-zA-Z$_][a-zA-Z0-9$_]*) *= */g, "this['$1'] = ");
        
        return (function (){
            return eval(_$txt$_);
        }).call(Jeeel._global);
    },
    
    /**
     * コンソールの文字列をスクリプトとして実行し結果を保持する
     */
    _evalConsoleText: function () {
        if (this._codeAssistData.show) {
            this._selectCodeAssistDataExecute();
            return;
        }
        
        if ( ! this._consoleIn.getText()) {
            return;
        }
        
        var tmp;

        try {
            tmp = this._eval(this._consoleIn.getText());
        } catch (e) {
            tmp = e;
        }

        this._addResult(tmp);

        this._consolePosition = this._consoleLog.length;

        this._consoleResult[this._consolePosition] = tmp;
        this._consoleLog[this._consolePosition] = this._consoleIn.getText();

        this._consoleSession.set(this.CONSOLE_LOG_ID, this._consoleLog).save();

        this._consolePosition++;

        this._setConsoleText('');
    },
    
    /**
     * コンソールの履歴ポジションを上に一つ上げる
     */
    _consoleUp: function () {
        if (this._codeAssistData.show) {
            this._selectCodeAssistData(1);
            return;
        }
        
        if (this._consoleLog.length == 0) {
            return;
        }

        this._consolePosition--;

        if (this._consolePosition < 0) {
            this._consolePosition = 0;
        }
        
        var txt = this._consoleLog[this._consolePosition];
        
        this._setConsoleText(this._isSingleLineMode ? txt.replace(/\r\n|\n/g, ' ') : txt);
    },
    
    /**
     * コンソールの履歴ポジションを下に一つ下げる
     */
    _consoleDown: function () {
        if (this._codeAssistData.show) {
            this._selectCodeAssistData(-1);
            return;
        }
      
        if (this._consoleLog.length == 0) {
            return;
        }

        this._consolePosition++;

        if (this._consolePosition > this._consoleLog.length) {
            this._consolePosition = this._consoleLog.length;
        }

        if (this._consolePosition < this._consoleLog.length) {
            var txt = this._consoleLog[this._consolePosition];

            this._setConsoleText(this._isSingleLineMode ? txt.replace(/\r\n|\n/g, ' ') : txt);
        } else {
            this._setConsoleText('');
        }
    },

    /**
     * 結果を展開できる状態にする
     *
     * @param {Mixied} obj 展開する結果値
     * @private
     */
    _addResult: function (obj) {
        var res = Jeeel.Debug.ObjectExpander.expand(obj, this._useHtmlExplorer);

        if (this._consoleOut.firstChild) {
            var hr = Jeeel.Document.createElement('hr');
            this._consoleOut.appendChild(hr);
        }
        
        this._consoleOut.appendChild(res);
    },

    /**
     * コード補完のデータを初期化して終了させる
     * 
     * @param {Boolean} [cancel] この後の動作キャンセルを行うかどうか
     */
    _codeAssistDataClose: function (cancel) {
        var caData = this._codeAssistData;
        
        caData.selectIndex = -1;
        caData.enable = false;
        caData.cancel = !!cancel;
        
        this._codeAssistWindowHide();
    },
    
    /**
     * コード補完ウィンドウを表示させる
     * 
     * @ignore
     */
    _codeAssistWindowShow: function () {
        var left = this._codeAssistData.index * 10 + 20;
        
        this._consoleCodeAssistWindow.shiftTo(left, 40);
        
        this._consoleCodeAssistWindow.show();
        this._codeAssistData.show = true;
    },
    
    /**
     * コード補完ウィンドウを非表示にする
     * 
     * @ignore
     */
    _codeAssistWindowHide: function () {
        this._consoleCodeAssistWindow.hide();
        this._codeAssistData.show = false;
    },
    
    /**
     * コード補完に必要なデータを更新する
     * 
     * @ignore
     */
    _setCodeAssistData: (function () {
        var txtReg = /(^|[;:{}(\[\] ])([a-zA-Z$_][a-zA-Z0-9$_.]*)\.(|[a-zA-Z$_][a-zA-Z0-9$_]*)$/;
        var idxReg = /\.(|[a-zA-Z$_][a-zA-Z0-9$_]*)$/;
        var rf = new Jeeel.Filter.String.RegularExpressionEscape();
        var appendKeys = [
            'var',
            'function',
            'return',
            'delete',
            'in',
            'typeof',
            'instanceof',
            'for',
            'do',
            'while',
            'switch',
            'case',
            'break',
            'continue',
            'if',
            'else',
            'else if',
            'with'
        ];
        
        return function () {
            var caData = this._codeAssistData;

            if (caData.cancel) {
                caData.cancel = false;
                return;
            }

            var txt = this._consoleIn.getText();
            var appendThis = false;
            
            if ( ! txt) {
                this._codeAssistDataClose();
                return;
            }
            
            if (txt.indexOf('.') < 0) {
                appendThis = true;
                txt = 'this.' + txt;
            }

            var tmp = txt.match(txtReg);
            var index = txt.search(idxReg) + 1 - (appendThis ? 5 : 0);

            if ( ! tmp) {
                this._codeAssistDataClose();
                return;
            }

            caData.enable = false;
            caData.child  = tmp[3];

            if (caData.parent != tmp[2] || ! appendThis && tmp[2] === 'this') {
                if (false && caData.cache[tmp[2]]) {
                    var cache = this._codeAssistData.cache[tmp[2]];

                    caData = this._codeAssistData = Jeeel.Hash.merge(caData, cache);
                }
                else {
                    caData.parent = tmp[2];

                    try {
                        var target = this._eval(caData.parent);
                    } catch(e) {
                        this._codeAssistWindowHide();
                        return;
                    }

                    try {
                        caData.pairs = Jeeel.Hash.getPairs(target, true, true);
                    } catch(e) {
                        this._codeAssistDataClose(true);
                        return;
                    }
                    
                    var pairs = caData.pairs;
                    
                    if (appendThis) {
                        pairs[pairs.length] = new Jeeel.Object.Item('clear', this.clear);
                        pairs[pairs.length] = new Jeeel.Object.Item('enableCodeAssist', this.enableCodeAssist);
                        pairs[pairs.length] = new Jeeel.Object.Item('enableHtmlExplorer', this.enableHtmlExplorer);
                        
                        for (i = 0, l = appendKeys.length; i < l; i++) {
                            pairs[pairs.length] = new Jeeel.Object.Item(appendKeys[i], null);
                        }
                    }
                    
                    caData.cache[tmp[2]] = {
                        parent: tmp[2],
                        pairs: caData.pairs
                    };
                }
            }

            if (caData.pairs.length < 1) {
                this._codeAssistWindowHide();
                return;
            }

            caData.selectIndex = -1;
            caData.index  = index;
            caData.enable = true;

            var i, l, keys = [];

            if (caData.child) {

                var regVal = rf.filter(caData.child);

                var reg = new RegExp('^' + regVal);

                for (i = 0, l = caData.pairs.length; i < l; i++) {

                    if ( ! caData.pairs[i].key.match(reg)) {
                        continue;
                    }

                    keys[keys.length] = caData.pairs[i].key;
                }
            } else {
                for (i = 0, l = caData.pairs.length; i < l; i++) {
                    keys[keys.length] = caData.pairs[i].key;
                }
            }

            caData.keys = keys;

            if (keys.length < 1) {
                this._codeAssistWindowHide();
                return;
            }

            var elm = this._consoleCodeAssistWindow;
            var lis = [];
            var self = this;

            if (caData.winChild) {
                caData.winChild.remove();
            }

            for (i = 0, l = keys.length; i < l; i++) {
                var key = keys[i];
                var li = Jeeel.Document.createElement('li');
                li.innerHTML = key;

                /**
                 * @ignore
                 */
                li.onclick = function () {
                    self._replaceLog(arguments.callee.data);
                };

                li.onclick.data = key;

                lis[i] = li;
            }

            caData.winChild = new Jeeel.Dom.ElementOperator(lis);

            elm.appendChild(lis);
            this._codeAssistWindowShow();
        }
    })(),
    
    /**
     * @ignore
     */
    _setCodeData: function (index, divs) {
        var self = this;
        var key = this._codeAssistData.keys[index];
        var div = this._codeAssistData.winChild[index] || Jeeel.Document.createElement('div');
        div.innerHTML = key;

        /**
         * @ignore
         */
        div.onclick = function () {
            self._replaceLog(arguments.callee.data);
        };

        div.onclick.data = key;

        divs[index] = div;
    },
    
    /**
     * コード補完の候補を選択する
     * 
     * @ignore
     */
    _selectCodeAssistData: function (advanceIndex) {
        var caData = this._codeAssistData;
        var index = caData.selectIndex - advanceIndex;
        
        if (index < 0) {
            index = caData.keys.length - 1;
        } else if (index >= caData.keys.length) {
            index = 0;
        }
        
        if (index === caData.selectIndex) {
            return;
        }
        
        caData.winChild.$GET(caData.selectIndex).setCss('backgroundColor', '#FFF');
        
        caData.winChild.$GET(index).setCss('backgroundColor', '#FFD700');

        caData.selectIndex = index;
        
        var top = index * 20;
        var pos = this._consoleCodeAssistWindow.getScrollPos();
        
        if (pos.y < (top - 180)) {
            this._consoleCodeAssistWindow.scroll(0, top - 180);
        } else if (pos.y > top) {
            this._consoleCodeAssistWindow.scroll(0, top);
        }
    },
    
    /**
     * 選択されているコード補完候補を使用して適用する
     * 
     * @ignore
     */
    _selectCodeAssistDataExecute: function () {
        var caData = this._codeAssistData;
        var index = caData.selectIndex;
        
        if (caData.keys.length === 0) {
            return;
        } else if (index < 0) {
            index = 0;
        } else if(index >= caData.keys.length) {
            return;
        }
        
        caData.winChild[index].onclick();
        caData.cancel = true;
    },

    /**
     * 補完データを選択した時に現在の値を書き換える
     * 
     * @ignore
     */
    _replaceLog: function (key) {
        var txt = this._consoleIn.getText();

        txt = txt.substring(0, this._codeAssistData.index) + key;

        this._setConsoleText(txt);

        this._consoleIn.setSelectionStart(txt.length);
    },
    
    /**
     * ソフトウェアキーボードの初期化を行う
     * 
     * @ignore
     */
    _initKeyboard: function () {
        var keyboard = this._consoleKeyboard;
        
        var keyboardArea = Jeeel.Document.createElement('div');
        var keyInputer = Jeeel.Document.createElement('div');
        var consoleOperator = Jeeel.Document.createElement('div');
        
        keyboardArea.className = 'keyboard';
        consoleOperator.className = 'operator';
        
        var button, type, keyTypes = [
//            {txt: '{' , dispatch: Jeeel.Function.Template.EMPTY},
//            {txt: '}' , key: Jeeel.Dom.Event.KeyCode.RightBracket, shift: true, ctrl: false},
//            {txt: '[' , key: Jeeel.Dom.Event.KeyCode.LeftBracket, shift: false, ctrl: false},
//            {txt: ']' , key: Jeeel.Dom.Event.KeyCode.RightBracket, shift: false, ctrl: false}
        ], operatorTypes = [
            {txt: '↑' , dispatch: function (){this._consoleUp();}},
            {txt: '↓' , dispatch: function (){this._consoleDown();}},
            {txt: Jeeel.Code.HtmlCode.CarriageReturn , dispatch: function (){
                    if (this._codeAssistData.enable || ! this._consoleIn.getText()) {
                        Jeeel.Timer.setTimeout(this._setCodeAssistData, 1);
                    }
                    
                    this._evalConsoleText();
                }
            }
        ];
        
        var self = this, consoleIn = this._consoleIn.getElement();
        
        for (var i = 0; i < keyTypes.length; i++) {
            type = keyTypes[i];
            
            button = Jeeel.Document.createElement('div');
            button.innerHTML = type.txt;
            
            /**
             * @ignore
             */
            button.onclick = function () {
                var op = new Jeeel.Dom.Event.Option();
                op.setKeyCodeArg(type.key)
                  .setCtrlKeyArg(type.ctrl)
                  .setShiftKeyArg(type.shift);
                
                Jeeel.Dom.Event.dispatchEvent(consoleIn, Jeeel.Dom.Event.Type.KEY_DOWN, op);
            };
            
            keyInputer.appendChild(button);
        }
        
        for (var i = 0; i < operatorTypes.length; i++) {
            type = operatorTypes[i];
            
            button = Jeeel.Document.createElement('div');
            button.className = 'button';
            button.innerHTML = type.txt;
            
            /**
             * @ignore
             */
            button.onclick = function () {
                arguments.callee.type.dispatch.call(self);
                
                return false;
            };
            
            button.onclick.type = type;
            button.onmousemove = Jeeel.Function.Template.RETURN_FALSE;
            
            consoleOperator.appendChild(button);
        }
        
        keyboardArea.appendChild(keyInputer);
        keyboardArea.appendChild(consoleOperator);
        
        keyboard.appendChild(keyboardArea);
    },
    
    /**
     * @ignore
     */
    _appendLogText: function (appendText) {
        
        var txt = this._consoleIn.getText() + appendText;
        
        this._setConsoleText(txt);

        this._consoleIn.setSelectionStart(txt.length);
    }
};
