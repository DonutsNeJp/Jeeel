Jeeel.directory.Jeeel.Dom.Window.Interval = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Dom.Window + 'Interval/';
    }
};

/**
 * コンストラクタ
 * 
 * @class タイマーの負荷を軽減し、クロスブラウザの違いを吸収するクラス
 * @param {Window} window setInterval,clearIntervalを保持するWindow
 */
Jeeel.Dom.Window.Interval = function (window) {
    this._window = window;
    this._timestamp = Jeeel.Object.Date.create();
    this._tasks = [];
    this._tasksHash = {};
    
    var self = this, interval = this.interval;
    
    this.interval = function () {
        interval.call(self);
    };
    
    this.start();
};

Jeeel.Dom.Window.Interval.prototype = {
    /**
     * タイマー関数保持オブジェクト
     * 
     * @type Window
     * @private
     */
    _window: null,
    
    /**
     * インスタンス作成時間
     * 
     * @type Jeeel.Object.Date
     * @private
     */
    _timestamp: null,
    
    /**
     * 有効タスク一覧
     * 
     * @type Jeeel.Dom.Window.Interval[]
     * @private
     */
    _tasks: [],
    
    /**
     * タスク参照Hashテーブル
     * 
     * @type Hash
     * @private
     */
    _tasksHash: {},
    
    /**
     * タスクの実行数に応じて変化するタスクIDの元
     * 
     * @type Integer
     * @private
     */
    _taskIndex: 0,
    
    /**
     * 実際のタイマーID
     * 
     * @type Integer
     * @private
     */
    _id: 0,
    
    /**
     * ロックをしているかどうか
     * 
     * @type Boolean
     * @private
     */
    _lock: false,
    
    /**
     * 現在のタイマーにタスクを追加する
     * 
     * @param {Function|String} task タスク
     * @param {Integer} delay どれくらい置きに実行するか(ミリ秒)
     * @param {Mixied} var_args 可変引数、タスクに渡す引数
     * @return {Integer} タスクID
     * @throws {Error} taskの型が正しくなかった際に発生
     */
    addTask: function (task, delay, var_args) {
        var id = ++this._taskIndex;
        var args = Array.prototype.slice.call(arguments, 2, arguments.length);
        
        if (Jeeel.Type.isString(task)) {
            task = new Function(task);
        } else if ( ! Jeeel.Type.isFunction(task)) {
            throw new Error('taskが文字列もしくは関数ではありません。');
        }
        
        this._tasks[this._tasks.length] = this._tasksHash[id] = new this.constructor.Task(task, delay, args);
        
        this.start();
        
        args = null;
        
        return id;
    },
    
    /**
     * タイマーのタスクを破棄する
     * 
     * @param {Integer} id タスクID
     * @return {Jeeel.Dom.Window.Interval} 自インスタンス
     */
    removeTask: function (id) {
        var task = this._tasksHash[id];
        
        if ( ! task) {
            task = null;
            return this;
        }
        
        this._lock = true;
        
        for (var i = 0, l = this._tasks.length; i < l; i++) {
            if (this._tasks[i] === task) {
                this._tasks.splice(i, 1);
                break;
            }
        }
        
        task = null;
        
        delete this._tasksHash[id];
        
        if ( ! this._tasks.length) {
            this.stop();
        }
        
        this._lock = false;
        
        return this;
    },
    
    /**
     * タイマーの実行を開始する(実行中は意味が無い)
     * 
     * @return {Jeeel.Dom.Window.Interval} 自インスタンス
     */
    start: function () {
        if (this._id) {
            return this;
        }
        
        this._id = this._window.setInterval(this.interval, 10);
        
        return this;
    },
    
    /**
     * タイマーの実行を停止する(停止中は意味が無い)
     * 
     * @return {Jeeel.Dom.Window.Interval} 自インスタンス
     */
    stop: function () {
        if ( ! this._id) {
            return this;
        }
        
        this._window.clearInterval(this._id);
        
        this._id = null;
        
        return this;
    },
    
    /**
     * タイマーに呼び出されるメソッド
     */
    interval: function () {
        if (this._lock) {
            return;
        }
        
        var time = this._timestamp.getElapsedTime();
        
        this._timestamp.setElapsedTime(0);
      
        for (var i = 0, l = this._tasks.length; i < l; i++) {
            this._tasks[i].execute(time);
        }
    },
    
    /**
     * コンストラクタ
     * 
     * @param {Window} window setInterval,clearIntervalを保持するWindow
     * @constructor
     */
    constructor: Jeeel.Dom.Window.Interval
};

Jeeel.file.Jeeel.Dom.Window.Interval = ['Task'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Dom.Window.Interval, Jeeel.file.Jeeel.Dom.Window.Interval);