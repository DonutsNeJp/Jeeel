
/**
 * @staticClass アニメーションフレームを制御するスタティッククラス
 */
Jeeel.Dom.Style.Animation.Frame = {
    
    /**
     * FPS
     * 
     * @type Integer
     * @private
     */
    _fps: 60,
    
    /**
     * animation/frame
     * 
     * @type Number
     * @private
     */
    _apf: 1,
    
    /**
     * frameCount
     * 
     * @type Number
     * @private
     */
    _fcount: 0,
    
    /**
     * アニメーションフレーム内でのタスクリスト
     * 
     * @type Function[]
     * @private
     */
    _tasks: [],
    
    /**
     * アニメーションタスクのIDをキーにしたハッシュマップ
     * 
     * @type Hash
     * @private
     */
    _taskHashs: {},
    
    /**
     * 現在までに追加したタスク数の合計
     * 
     * @type Integer
     * @private
     */
    _taskCount: 0,
    
    /**
     * ロック
     * 
     * @type Integer
     * @private
     */
    _lock: false,
    
    /**
     * requestAnimationFrame関数を使用するかどうか
     * 
     * @type Boolean
     * @private
     */
    _useRaf: true,
    
    /**
     * アニメーションフレームのリクエストID
     * 
     * @type Integer
     * @private
     */
    _requestId: null,
    
    /**
     * アニメーションの1秒間の描画回数を設定する
     * 
     * @param {Integer} fps 1秒毎のフレーム描画回数
     * @return {Jeeel.Dom.Style.Animation.Frame} 自クラス
     */
    setFps: function (fps) {
        var requested = !!this._requestId;
        
        if (requested) {
            this.stop();
        }
        
        this._fps = +fps;
        this._apf = 60 / this._fps;
        
        if (requested) {
            this.start();
        }
        
        return this;
    },
    
    /**
     * requestAnimationFrameを使用するかどうかを設定する
     * 
     * @param {Boolean} enable 使用するかどうか
     */
    useAnimationFrame: function (enable) {
        var requested = !!this._requestId;
        
        if (requested) {
            this.stop();
        }
        
        this._useRaf = !!enable;
        
        if (requested) {
            this.start();
        }
        
        return this;
    },
    
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

        this._fcount = 0;
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
        
        this._fcount++;
        
        if (this._fcount >= this._apf) {
            this._fcount -= this._apf;
        } else {
            this._requestId = this._requestAnimationFrame(this.animate);
            
            return;
        }
        
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
    
    /**
     * アニメーションフレームの呼び出しを要求する
     * 
     * @param {Function} callback 呼び出し関数
     * @return {Integer} リクエストID
     * @private
     */
    _requestAnimationFrame: function (callback) {
        var win = Jeeel._global;
        
        if (this._useRaf) {
            return (win.requestAnimationFrame
                || win.webkitRequestAnimationFrame
                || win.mozRequestAnimationFrame
                || win.oRequestAnimationFrame
                || win.msRequestAnimationFrame
                || Jeeel.Timer.setTimeout)(callback, 1000 / 60);
        }
        
        return Jeeel.Timer.setTimeout(callback, 1000 / 60);
    },
    
    /**
     * アニメーションフレームの呼び出しをキャンセルする
     * 
     * @param {Integer} id リクエストID
     * @private
     */
    _cancelAnimationFrame: function (id) {
        var win = Jeeel._global;
        
        if (this._useRaf) {
            return (win.cancelAnimationFrame
                || win.webkitCancelRequestAnimationFrame
                || win.mozCancelRequestAnimationFrame
                || win.oCancelRequestAnimationFrame
                || win.msCancelRequestAnimationFrame
                || Jeeel.Timer.clearTimeout)(id);
        }
        
        return Jeeel.Timer.clearTimeout(id);
    },
    
    /**
     * 初期化
     */
    _init: function () {
        delete this._init;
        
        if ( ! Jeeel._global) {
            return;
        }
        
        this.animate = Jeeel.Function.simpleBind(this.animate, this);
    }
};

Jeeel.Dom.Style.Animation.Frame._init();