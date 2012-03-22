
/**
 * アニメーションフレームを制御するスタティッククラス
 */
Jeeel.Dom.Style.Animation.Frame = {
    _tasks: [],
    _taskHashs: {},
    _taskCount: 0,
    _lock: false,
    _requestAnimationFrame: null,
    _cancelAnimationFrame: null,
    _requestId: null,
    
    /**
     * アニメーションタスクを追加する
     * 
     * @param {Function} task タスク
     * @return {Integer} タスクID
     */
    addTask: function (task) {
        this._taskCount++;
        
        this._tasks[this._tasks.length] = this._taskHashs[this._taskCount] = task;
        
        this.start();
        
        return this._taskCount;
    },
    
    /**
     * アニメーションタスクを削除する
     * 
     * @param {Integer} id 削除対象のタスクID
     * @return {Jeeel.Dom.Style.Animation.Frame} 自クラス
     */
    removeTask: function (id) {
        var task = this._taskHashs[id];
        
        if ( ! task) {
            return this;
        }
        
        for (var i = this._tasks.length; i--;) {
            if (this._tasks[i] === task) {
                this._tasks.splice(i, 1);
                break;
            }
        }
        
        delete this._taskHashs[id];
        
        if ( ! this._tasks.length) {
            this.stop();
        }
        
        return this;
    },
    
    /**
     * アニメーションフレームを開始する
     * 
     * @return {Jeeel.Dom.Style.Animation.Frame} 自クラス
     */
    start: function () {
        
        if (this._requestId) {
            return this;
        }

        this._requestId = this._requestAnimationFrame(this.animate);
        
        return this;
    },
    
    /**
     * アニメーションフレームを停止する
     * 
     * @return {Jeeel.Dom.Style.Animation.Frame} 自クラス
     */
    stop: function () {
        
        if ( ! this._requestId) {
            return this;
        }
        
        this._cancelAnimationFrame(this._requestId);
        
        this._requestId = null;
        
        return this;
    },
    
    /**
     * アニメーションフレームのタスクを実行する
     * 
     * @param {Integer} time タイムスタンプ
     */
    animate: function (time) {
      
        // setTimeoutで疑似作成している場合のタイムスタンプを作成
        if ( ! time) {
            time = new Date().getTime();
        }
        
        // タスク中にremoveTaskを呼ばれるとおかしいんで複製する
        var cloneTasks = this._tasks.concat();
        
        for (var i = 0, l = cloneTasks.length; i < l; i++) {
            cloneTasks[i](time);
        }
        
        this._requestId = this._requestAnimationFrame(this.animate);
    },
    
    _init: function () {
        delete this._init;
        
        if ( ! Jeeel._global) {
            return;
        }
        
        this.animate = Jeeel.Function.simpleBind(this.animate, this);
        
        var win = Jeeel._global;
        
        var reqAniFrm = function(callback) {
            return (win.requestAnimationFrame
                || win.webkitRequestAnimationFrame
                || win.mozRequestAnimationFrame
                || win.oRequestAnimationFrame
                || win.msRequestAnimationFrame
                || win.setTimeout)(callback, 1000 / 60);
        };
                   
        var casAniFrm = function(id) { 
            return (win.cancelAnimationFrame
                || win.webkitCancelRequestAnimationFrame
                || win.mozCancelRequestAnimationFrame
                || win.oCancelRequestAnimationFrame
                || win.msCancelRequestAnimationFrame
                || win.clearTimeout
                )(id);
        };
        
        this._requestAnimationFrame = reqAniFrm;
        this._cancelAnimationFrame = casAniFrm;
    }
};

Jeeel.Dom.Style.Animation.Frame._init();