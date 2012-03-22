
/**
 * コンストラクタ
 * 
 * @class タイマー内で実行されるタスクを管理するクラス
 * @param {Function} func タスク
 * @param {Integer} delay どれくらい置きに実行するか(ミリ秒)
 * @param {Array} args タスクに渡す引数のリスト
 */
Jeeel.Dom.Window.Interval.Task = function (func, delay, args) {
    this._process = func;
    this._delay = delay;
    this._args = args || [];
};

Jeeel.Dom.Window.Interval.Task.prototype = {
    
    /**
     * 実行タスク
     * 
     * @type Function
     * @private
     */
    _process: null,
    
    /**
     * 実行遅延時間
     * 
     * @type Integer
     * @private
     */
    _delay: 0,
    
    /**
     * タスク引数
     * 
     * @type Array
     * @private
     */
    _args: [],
    
    /**
     * 前回実際にタスクを実行してからの経過時間
     * 
     * @type Integer
     * @private
     */
    _time: 0,
    
    /**
     * タスクの実行を行う
     * 
     * @param {Integer} time 前回の実行からの経過時間
     */
    execute: function (time) {
        this._time += time;
        
        while(this._time >= this._delay) {
            this._process.apply(null, this._args);
            this._time -= this._delay;
        }
    }
};