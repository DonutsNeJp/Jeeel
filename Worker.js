Jeeel.directory.Jeeel.Worker = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel + 'Worker/';
    }
};

/**
 * コンストラクタ
 * 
 * @class マルチスレッドを提供するクラス(1インスタンスにつき1スレッド)
 */
Jeeel.Worker = function () {
    var script = Jeeel.directory.Jeeel.Worker + 'Thread.js';
    
    this._worker = new Worker(script);
    this._errors = [];
    this._messages = {};
    
    this._init();
};

/**
 * インスタンスの作成を行う
 * 
 * @return {Jeeel.Worker} 作成したインスタンス
 */
Jeeel.Worker.create = function () {
    return new this();
};

Jeeel.Worker.prototype = {
  
    /**
     * 内部スレッドWorker
     * 
     * @type Worker
     * @private
     */
    _worker: null,
    
    /**
     * 内部スレッドの動作数(待ちキュー)
     * 
     * @type Integer
     * @private
     */
    _workCount: 0,
    
    /**
     * メッセージイベントリスト
     * 
     * @type Hash
     * @private
     */
    _messages: {},
    
    /**
     * エラーイベントリスト
     * 
     * @type Function[]
     * @private
     */
    _errors: [],
    
    /**
     * メッセージイベント
     * 
     * @private
     */
    _messageEvent: function () {
        var event = Jeeel.Dom.Event.getEventObject();
        var data = event.data;
        
        if (Jeeel.Type.inArray(data.type, [Jeeel.Worker.Type.EXECUTE_SCRIPT])) {
            return;
        }
        
        var actionEvents = this._messages[data.type];
        
        if ( ! actionEvents) {
            this._workCount--;
            return;
        }
        
        for (var i = 0, l = actionEvents.length; i < l; i++) {
            actionEvents[i](data.msg, data.type);
        }
        
        this._workCount--;
    },
    
    /**
     * エラーイベント
     * 
     * @private
     */
    _errorEvent: function () {
        var event = Jeeel.Dom.Event.getEventObject().getEvent();

        for (var i = 0, l = this._errors.length; i < l; i++) {
            this._errors[i](event);
        }
        
        if (l === 0) {
            var error = event.message + '\n'
                      + event.filename + '('
                      + event.lineno + ')';

            Jeeel.errorDump(error);
        }
        
        this._workCount--;
    },
    
    /**
     * タスク内でJeeel.jsを使用できるようにする
     * 
     * @private
     */
    _init: function () {
      
        this._messageEvent = Jeeel.Function.simpleBind(this._messageEvent, this);
        this._errorEvent = Jeeel.Function.simpleBind(this._errorEvent, this);
        
        this._worker.onmessage = this._messageEvent;
        this._worker.onerror = this._errorEvent;
        
        var i, l, script = [];
        var globalValues = [
            '_JEEEL_CLEAN_MODE_',
            '_JEEEL_DEBUG_MODE_',
            '_JEEEL_EXTEND_MODE_',
            '_JEEEL_FULL_MODE_'
        ];

        for (i = 0, l = globalValues.length; i < l; i++) {
            script[i] = globalValues[i] + '=' + Jeeel.Json.encode(Jeeel._global[globalValues[i]]) + ';';
        }
        
        var scriptData = {
            type: Jeeel.Worker.Type.EXECUTE_SCRIPT,
            data: '_JEEEL_MANUAL_LOAD_ = true;\n' + script.join('\n')
        };
        
        this._worker.postMessage(Jeeel.Json.encode(scriptData));
        
        if (Jeeel._auto) {
            var urls = Jeeel.getFilePath().replace(/\n$/g, '').split('\n');

            for (i = 0, l = urls.length; i < l; i++) {
                this.importScript(urls[i]);
            }
        } else {
            this.importScript(Jeeel.directory.Jeeel + 'Jeeel-Set.js');
        }
    },
    
    /**
     * タスク内で使用するスクリプトを読み込ませる(windowやDomを使用しているスクリプトは動作しない: windowの代わりにglobal変数が存在する)
     * 
     * @param {String} url スクリプトのURL
     * @return {Jeeel.Worker} 自インスタンス
     */
    importScript: function (url) {
        var importData = {
            type: Jeeel.Worker.Type.IMPORT_SCRIPT,
            data: url
        };
        
        this._post(Jeeel.Json.encode(importData));
        
        return this;
    },
    
    /**
     * このスレッドで実行を行うタスクの追加を行う(タスク内では外部変数にアクセスしてはならず、window・Domに対してのアクセスは出来ない: JeeelやImportしたライブラリのみ可能, windowの代わりにglobal変数が存在する)
     * 
     * @param {Function} task 実行タスク Mixied task(Mixied data)
     * @return {Jeeel.Worker} 自インスタンス
     */
    addTask: function (task) {
        var taskData = {
            type: Jeeel.Worker.Type.ADD_TASK,
            data: task
        };
        
        this._post(Jeeel.Json.encode(taskData));
        
        return this;
    },
    
    /**
     * 様々なアクションを起こした際に呼ばれるイベントの追加を行う
     * 
     * @param {String} actionType アクションタイプ
     * @param {Function} listener イベント
     * @return {Jeeel.Worker} 自インスタンス
     * @see Jeeel.Worker.Type
     */
    addActionEvent: function (actionType, listener) {
        if ( ! this._messages[actionType]) {
            this._messages[actionType] = [];
        }
        
        var actionEvents = this._messages[actionType];
        
        actionEvents[actionEvents.length] = listener;

        return this;
    },
    
    /**
     * タスク内でエラーが発生した場合に呼ばれるイベントの追加を行う
     * 
     * @param {Function} listener イベント
     * @return {Jeeel.Worker} 自インスタンス
     */
    addErrorEvent: function (listener) {
        this._errors.push(listener);

        return this;
    },
    
    /**
     * タスクをバックグラウンドで順に実行する
     * 
     * @param {Mixied} [data] タスクに渡すデータ
     * @return {Jeeel.Worker} 自インスタンス
     */
    execute: function (data) {
        var messageData = {
            type: Jeeel.Worker.Type.EXECUTE_TASK,
            data: (Jeeel.Type.isSet(data) ? data : null)
        };
        
        this._post(Jeeel.Json.encode(messageData, true));
        
        return this;
    },
    
    /**
     * 現在バックグラウンドで実行・待機中のアクション数を取得する<br />
     * タスクが複数あってもexecuteして増えるアクション数は1である
     * 
     * @return {Integer} アクション数
     */
    getActioningCount: function () {
        return this._workCount;
    },
    
    /**
     * スレッドの実行を停止する
     * 
     * @return {Jeeel.Worker} 自インスタンス
     */
    terminate: function () {
        this._workCount = 0;
        this._worker.terminate();
        
        return this;
    },
    
    /**
     * コンストラクタ
     * 
     * @constructor
     */
    constructor: Jeeel.Worker,
    
    _post: function (msg) {
        this._workCount++;
        this._worker.postMessage(msg);
    }
};

Jeeel.file.Jeeel.Worker = ['Type'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Worker, Jeeel.file.Jeeel.Worker);