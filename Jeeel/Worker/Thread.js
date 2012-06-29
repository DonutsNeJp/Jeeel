var jeeelConfig;

/**
 * @class スレッドを管理するクラス
 * @static
 */
var Thread = {

    /**
     * タスクのリスト
     * 
     * @type Function[]
     */
    _tasks: [],
    
    /**
     * 動作タイプ
     * 
     * @type String
     */
    _type: null,
    
    /**
     * 受信データ
     * 
     * @type Mixied
     */
    _data: null,
    
    /**
     * Workerオブジェクトにメッセージを送信する
     * 
     * @param {Mixied} msg 送信データ
     */
    post: function (msg) {
        postMessage(msg);
    },
    
    /**
     * スレッド内で使用するスクリプトを読み込む
     * 
     * @param {String} url スクリプトのURL
     */
    importScript: function (url) {
        importScripts(url);
        
        this.post({
            type: this._type,
            msg: 'Import Script'
        });
    },
    
    /**
     * スクリプトの実行を行う
     * 
     * @param {String} script 実行スクリプト
     */
    executeScript: function (script) {
        eval(script);
        
        this.post({
            type: this._type,
            msg: 'Execute Script'
        });
    },

    /**
     * タスクの追加を行う
     * 
     * @param {Function} task 追加タスク
     */
    addTask: function (task) {
        this._tasks[this._tasks.length] = task;
        
        this.post({
            type: this._type,
            msg: 'Add Task'
        });
    },

    /**
     * タスクを順に実行する
     * 
     * @param {Mixied} data タスクに引き渡されるデータ
     */
    executeTasks: function (data) {
        var res;

        for (var i = 0, l = this._tasks.length; i < l; i++) {
            res = this._tasks[i].call(self, data);

            this.post({
                type: this._type,
                msg: res
            });
        }
    },
    
    /**
     * 実行動作を指定されたタイプ毎に振り分ける
     * 
     * @param {Hash} dataObj データ
     */
    switchEvent: function (dataObj) {
        this._data = dataObj.data;
        this._type = dataObj.type;
        
        switch (dataObj.type) {
            case 'import':
                this.importScript(this._data);
                break;
                
            case 'script':
                this.executeScript(this._data);
                break;
                
            case 'add-task':
                this.addTask(this._data);
                break;
                
            default:
                this.executeTasks(this._data);
                break;
        }
    },
    
    /**
     * Workerからメッセージを受信した場合に発生する
     * 
     * @param {MessageEvent} event イベントオブジェクト
     */
    messageEvent: function (event) {
        Thread.switchEvent(eval('(' + event.data + ')'));
    }
};

// イベントの設定
self.onmessage = Thread.messageEvent;
