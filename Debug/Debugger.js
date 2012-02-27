
Jeeel.directory.Jeeel.Debug.Debugger = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Debug + 'Debugger/';
    }
};

/**
 * 専門的なデバッグを行うためのモジュール等を保持するネームスペース
 */
Jeeel.Debug.Debugger = {

    /**
     * 内部参照関数を作るための文字列定数<br />
     * 内部参照をしたい場所でevalで展開する
     *
     * @type String
     * @constant
     */
    INSPECTOR: '(function (){return function (___$){try{return eval(___$);}catch(e){return e.message;}}})();',

    /**
     * 解析情報を設定する時の名前
     *
     * @type String
     * @constant
     */
    INFORMATION_NAME: '_jeeelInfo',

    /**
     * 内部の変数などを動的に参照するブレークポイントを設定する<br />
     * このメソッドを呼んだ際のプロンプトに変数名を入れると変数の値がdumpされる<br />
     * なおこのメソッドにignoreをつけると全ての呼び出し時の動作が無効になる
     *
     * @param {Function} inspector このオブジェクトのメンバのINSPECTORを関数内部でevalした関数
     * @param {Mixied} [self] 参照変数の際のthisを示す値
     * @param {String} [title] この関数を区別するために表記するタイトル
     * @throws {Error} inspectorがメソッドではない場合に発生
     */
    inspect: function (inspector, self, title) {

        if ( ! Jeeel.Type.isFunction(inspector)) {
            throw new Error('inspectorがメソッドではありません。');
        }

        var expression, result;

        if ('ignore' in arguments.callee) {
            return;
        }

        while(true) {

            var message = "";

            if (title) {
                message += title + '\n';
            }

            if (expression) {
                expression += ' = ' + result + ';';
            } else {
                expression = '';
            }

            message += '変数名を入力:';

            expression = Jeeel.Debug.Debugger.showPrompt(message, expression);

            if ( ! expression) {
                return;
            }

            result = inspector.call(self, expression);
        }
    },
    
    /**
     * @ignore
     */
    getLocalVariableList: function (inspector, thisArg) {
        var variableNames = this.getLocalVariableNames(arguments.callee.caller);
        var name, list = {};
        
        for (var i = 0, l = variableNames.length; i < l; i++) {
            name = variableNames[i];
            
            list[name] = inspector.call(thisArg, name);
        }
        
        return list;
    },
    
    /**
     * @ignore
     */
    getLocalVariableNames: function (func) {
        var source = func.toString();
        
        // 文字列、コメント、正規表現の削除
        source = source.replace(/(^|[^\\])'[^']*'/g, '$1')
                       .replace(/(^|[^\\])"[^"]*"/g, '$1');
                       
        var args = source.match(/function ?([a-zA-Z_$][a-zA-Z0-9_$]*)?\(([^)]*)\)/)[2].split(',');
        var reg = /var\s+(\w+)/g;
        var match = null;
        var variables = [];
        
        while(match = reg.exec(source)) {
            variables[variables.length] = match[1];
        }
        
        return variables;
    },

    /**
     * HTML要素をbodyの最初に差し込む
     *
     * @param {Element} element 差し込む要素
     * @return {Element} 差し込んだ要素
     */
    elementInsertTop: function (element) {
        var body  = Jeeel.Document.getBody();
        var first = body.firstChild;

        if (first) {
            body.insertBefore(element, first);
        } else {
            body.appendChild(element);
        }
        
        return element;
    },

    /**
     * JavaScriptソースの表示を行う
     *
     * @param {String} url JavaScriptソースの相対URL
     * @return {Boolean} 常にtrue
     */
    showSource: function (url) {
        Jeeel.Window.createDialogOpener(Jeeel.HOST + Jeeel.BASE_URL + url)
                  .setOption('dialogWidth', 600)
                  .setOption('dialogHeight', 300)
                  .open();

        return true;
    },

    /**
     * プロンプトの表示を行う
     *
     * @param {String} title プロンプトのタイトル
     * @param {String} message プロンプトの初期メッセージ
     */
    showPrompt: function (title, message) {
        var callback = function (args, selfWindow) {
            var html = '<div><p style="float:left;width: 440px;margin: 0; padding: 0;">ダイアログプロンプト</p><div style="">'
                     + '<button onclick="closeDialog(document.getElementById(\'result\').value);">OK</button>'
                     + '</div></div><br/><div><p style="float:left;width: 440px;margin: 0; padding: 0;">' + args.title
                     + '</p><div style="">'
                     + '<button onclick="closeDialog(false);">CANCEL</button></div></div>'
                     + '<br /><textarea id="result" style="width:560px;height:200px;">'
                     + args.message + '</textarea>';
            
            selfWindow.document.body.innerHTML = html;
        };
        
        return Jeeel.Window.createDialogOpener('')
                         .setArgument('title', title)
                         .setArgument('message', message)
                         .setOption('dialogWidth', 600)
                         .setOption('dialogHeight', 300)
                         .openTemplate(callback);
    },

    /**
     * サーバ側のスクリプトを走らせる
     *
     * @param {String} script サーバー側で走らせるスクリプト文字列
     * @param {Hash} [params] サーバー側に渡すパラメータ
     * @param {Function} [callback] クロスドメイン時のコールバック
     * @return {Mixied} サーバー側からの戻り値をデコードしたもの
     */
    evalServer: function (script, params, callback) {

        if ( ! params) {
            params = {};
        }

        if ( ! Jeeel.Type.isHash(params)) {
            throw new Error('paramsはHashでなければなりません。');
        }

        params = {params: params};

        if (script) {
            params.script = script;
        }
        
        if (Jeeel.CROSS_DOMAIN) {
            return this._jsonpDebug('evalServer', callback, params);
        }

        var res = Jeeel.Net.Ajax.serverResponse(Jeeel.HOST + Jeeel.DEBUG_URL, params);

        if (Jeeel.Type.isString(res)) {

            try {
                res = Jeeel.Json.decode(res);
            } catch(e) {
                res = Jeeel.String.stripTags(res);
            }

            return res;
        }

        Jeeel.Debug.ErrorMessage.dumpStripTags(res.response);

        return false;
    },

    /**
     * サーバー側でSQLを実行する
     *
     * @param {String} sql サーバー側実行するSQL文字列
     * @param {Function} [callback] クロスドメイン時のコールバック
     * @return {Mixied} サーバー側からの戻り値をデコードしたもの
     */
    evalSql: function (sql, callback) {

        if (sql) {
            sql = {sql: sql};
        }
        
        if (Jeeel.CROSS_DOMAIN) {
            return this._jsonpDebug('evalServer', callback, sql);
        }

        var res = Jeeel.Net.Ajax.serverResponse(Jeeel.HOST + Jeeel.SQL_DEBUG_URL, sql);

        if (Jeeel.Type.isString(res)) {
          
            try {
                res = Jeeel.Json.decode(res);
            } catch(e) {
                res = Jeeel.String.stripTags(res);
            }

            return res;
        }

        Jeeel.Debug.ErrorMessage.dumpStripTags(res.response);

        return false;
    },

    /**
     * メールを送信する
     * 
     * @param {String} to メール送信先
     * @param {Mixied} body メール本文
     * @param {Boolean} [isHtml] HTMLメールとして送信を行うかどうかを示す(デフォルトはfalse)
     * @param {Function} [callback] クロスドメイン時のコールバック
     * @return {Boolean} メール送信が成功ならばtrueそれ以外はfalseを返す
     */
    sendMail: function (to, body, isHtml, callback) {
      
        var validator = Jeeel.Validator.Helper.create(to)
                                            .email();

        if ( ! validator.isValid()) {
            return false;
        }

        var params = {to: to, body: body};

        if (isHtml) {
            params.type = 'html';
        } else {
            params.type = 'text';
        }
        
        if (Jeeel.CROSS_DOMAIN) {
            return this._jsonpDebug('evalServer', callback, params);
        }

        var res = Jeeel.Net.Ajax.serverResponse(Jeeel.HOST + Jeeel.MAIL_URL, params);

        if (Jeeel.Type.isString(res)) {

            try {
                res = Jeeel.Json.decode(res);
            } catch(e) {
                res = Jeeel.String.stripTags(res);
            }

            return res;
        }

        Jeeel.Debug.ErrorMessage.dumpStripTags(res.response);

        return false;
    },

    /**
     * 識別子をファイルとしてブラウザに読み込ませる
     *
     * @param {Mixied} value 読み込ませる値
     * @param {String} [fileName] 指定した名前で認識させたい時に指定する
     * @return {Boolean} 正常終了ならばtrueそれ以外はfalseを返す
     */
    fileOpen: function (value, fileName) {

        try {
            var form = Jeeel.Net.Submit.newForm();
            
            form.setMethod('POST')
                .setAction(Jeeel.HOST + Jeeel.FILE_OPEN_URL)
                .set('value', value);

            if (Jeeel.Type.isString(fileName)) {
                form.set('file', fileName);
            }

            form.execute();
        } catch (e) {
            return false;
        }

        return true;
    },
    
    /**
     * 呼び出し元のメソッドのトレースを取得する
     *
     * @return {Jeeel.Object.Technical.Trace[]} トレース内容のリスト
     */
    getTrace: function () {
        var res = [];
        var func = arguments.callee;

        while(func.caller) {

            func = func.caller;

            res[res.length] = new Jeeel.Object.Technical.Trace(func);
        }

        return res;
    },

    /**
     * 指定したオブジェクトに解析情報を設定する
     *
     * @param {Mixied} object 解析情報を設定するオブジェクト
     * @param {String} name オブジェクトに付ける名前
     * @param {Boolean} [deepSet] 再帰的に情報を設定するかどうか
     * @return {Boolean} 解析情報の設定が正しく行われたかどうか
     */
    setInformation: function (object, name, deepSet) {

        if (Jeeel.Type.isPrimitive(object)) {
            return false;
        } else if (object instanceof Jeeel.Object.Technical.Information) {
            return false;
        } else if (Jeeel.Type.isElement(object) || Jeeel.Type.isDocument(object) || Jeeel.Type.isWindow(object)) {
            return false;
        } else if (this.INFORMATION_NAME in object) {
            return false;
        }

        if (Jeeel.Type.isFunction(object) && object.prototype) {
            object.prototype.constructor = object;
        }
        
        object[this.INFORMATION_NAME] = new Jeeel.Object.Technical.Information(name, arguments[3]);

        if (deepSet) {
            for (var property in object) {
                if (property === 'constructor') {
                    continue;
                } else if ( ! object.hasOwnProperty(property)) {
                    continue;
                }
                
                try {
                    arguments.callee.call(this, object[property], name + '.' + property, deepSet, object);
                } catch (e) {}
            }
        }

        return true;
    },
    
    /**
     * Element固有のIDを定義する(IEのuniqueIDを他ブラウザで再現)
     * 
     * @return {Boolean} 定義が行われたかどうか
     */
    defineUniqueId: function () {
        
        if (Jeeel._doc.uniqueID) {
            return false;
        } else if (typeof HTMLElement !== 'function') {
            return false;
        } else if ( ! Object.prototype.__defineGetter__ || ! Object.defineProperty) {
            return false;
        }
        
        var nextUniqueID = 1;
        
        if (Object.prototype.__defineGetter__) {
            HTMLElement.prototype.__defineGetter__('uniqueID', function () {
                var uniqueID = 'id' + nextUniqueID++;

                this.__defineGetter__("uniqueID", function (){return uniqueID});

                return uniqueID;
            });
        } else {
            Object.defineProperty(HTMLElement.prototype, 'uniqueID', {
                get: function () {
                    var uniqueID = 'id' + nextUniqueID++;

                    Object.defineProperty(this, "uniqueID", {get: function (){return uniqueID}});

                    return uniqueID;
                }
            });
        }
        
        return true;
    },
    
    /**
     * このクラスのevalServer, evalSql, sendMailをJsonp通信で実行する
     * 
     * @param {String} callMethodName 実行するメソッド名
     * @param {Function} [callback] Jsonp通信の結果のコールバック
     * @param {Hash} [params] サーバー側に引き渡す値
     * @return {Boolean} 正常終了ならばtrueそれ以外はfalseを返す
     * @private
     */
    _jsonpDebug: function (callMethodName, callback, params) {
        
        callback = callback || Jeeel.Debug.Console.log;
        params = params || {};
        
        var url;
        
        switch(callMethodName) {
            case 'evalServer':
                url = Jeeel.DEBUG_URL;
                break;
                
            case 'evalSql':
                url = Jeeel.SQL_DEBUG_URL;
                break;
                
            case 'sendMail':
                url = Jeeel.MAIL_URL;
                break;
                
            default:
                return false;
                break;
        }
        
        url = url.match(/\/([a-z\-]+)\/?$/)[1];
        
        var jsonp = new Jeeel.Net.Jsonp(Jeeel.HOST + Jeeel.JSONP_URL);
        
        jsonp.setAll(params || {})
             .set('exec-action', url)
             .setCallback('callback', callback)
             .execute();

        return true;
    }
};

Jeeel.file.Jeeel.Debug.Debugger = ['Observer', 'StackTracer', 'Profiler'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Debug.Debugger, Jeeel.file.Jeeel.Debug.Debugger);

(function () {
  
    if (typeof window === 'undefined') {
        return;
    }

    var Jeeel = window.Jeeel;

    var listener =  function () {
        var state = document.readyState.toLowerCase();
        
        if (state.match(/loaded|complete/) && ((Jeeel.Object || {}).Technical || {}).Information) {
            if (Jeeel === window.Jeeel) {
                Jeeel.Debug.Debugger.setInformation(Jeeel, 'Jeeel', true, window);
            }
        } else {
            setTimeout(arguments.callee, 1);
        }
    };

    setTimeout(listener, 1);

})();
