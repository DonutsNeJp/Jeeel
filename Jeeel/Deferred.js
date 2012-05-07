
(function () {
  
    // 遅延実行待ちのメソッド
    var deferredQueue = [];
    
    /**
     * コンストラクタ
     * 
     * @class 遅延実行を管理するクラス
     */
    Jeeel.Deferred = function () {
        this.reset();
    };
    
    /**
     * インスタンスの作成を行う
     * 
     * @return {Jeeel.Deferred} 作成したインスタンス
     */
    Jeeel.Deferred.create = function () {
        return new this();
    };
    
    /**
     * デフォルトのメソッド成功時の挙動
     * 
     * @param {Mixied} [x] 引数
     */
    Jeeel.Deferred.success = {func: Jeeel.Function.Template.RETURN_ARGUMENT};

    /**
     * デフォルトのメソッド失敗時の挙動
     * 
     * @param {Mixied} [x] 引数
     */
    Jeeel.Deferred.error = {func: Jeeel.Function.Template.THROW_ARGUMENT};

    /**
     * 指定したメソッドを遅延実行する
     * 
     * @param {Function} callback 遅延実行対象のメソッド
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトは作成したインスタンスになる)
     * @param {Integer} [delayTime] 遅延時間(デフォルトは0)
     * @return {Jeeel.Deferred} 作成したインスタンス
     */
    Jeeel.Deferred.next = function (callback, thisArg, delayTime) {
        var df = new this();
        
        if ( ! deferredQueue[0]) {
            var id = setTimeout(function () {
              
                var dq = deferredQueue.shift();

                if (deferredQueue[0]) {
                    id = setTimeout(arguments.callee, dq._delayTime);
                    
                    /**
                     * @ignore
                     */
                    deferredQueue[0]._canceller = function () {
                        clearTimeout(id);
                    };
                }
                
                dq.call();
            }, +delayTime || 0);

            /**
             * @ignore
             */
            df._canceller = function () {
                clearTimeout(id);
            };
        }
        
        deferredQueue[deferredQueue.length] = function () {
            df.call();
        };
        
        deferredQueue[deferredQueue.length - 1]._delayTime = +delayTime || 0;

        if (callback) {
            df.next(callback, thisArg);
        }

        return df;
    };
    
    /**
     * 待ちキューのサイズを取得する
     * 
     * @return {Integer} 待ちキューのサイズ
     */
    Jeeel.Deferred.getQueueSize = function () {
        return deferredQueue.length;
    };
})();

Jeeel.Deferred.prototype = {
    
    /**
     * 成功・失敗の時に呼ばれるコールバック
     * 
     * @type Hash
     * @private
     */
    _callback: null,
    
    /**
     * キャンセル時に呼ばれるメソッド
     * 
     * @type Function
     * @private
     */
    _canceller: null,
    
    /**
     * 次に実行されるメソッドのキュー
     * 
     * @type Function[]
     */
    _next: [],
    
    /**
     * 初期状態に戻す
     * 
     * @return {Jeeel.Deferred} 自インスタンス
     */
    reset: function () {
        this._next = [];

        this._callback = {
            success: this.constructor.success,
            error: this.constructor.error
        };
        
        return this;
    },
    
    /**
     * 遅延実行を執行する
     * 
     * @param {Mixied} [val] 引数
     * @return {Jeeel.Deferred} 自インスタンス
     */
	  call: function (val) {
        return this._call(val);
    },
    
    /**
     * 遅延実行を途中キャンセルする
     * 
     * @return {Jeeel.Deferred} 自インスタンス
     */
    cancel: function () {
        (this._canceller || Jeeel.Function.Template.EMPTY)();
        
        return this.reset();
    },
    
    /**
     * 次のメソッドを登録する
     * 
     * @param {Function} nextCallback 次のメソッド
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.Deferred} 新規インスタンス
     */
    next: function (nextCallback, thisArg) {
        this._next.push({func: nextCallback, thisArg: thisArg});
        
        return this;
    },
    
    /**
     * コンストラクタ
     * 
     * @constructor
     */
    constructor: Jeeel.Deferred,
    
    _call: function (val) {
      
        if ( ! this._next.length) {
            return this;
        }
        
        var next = this._next.shift();
        var type = 'success', callback;
        
        try {
            val = next.func.call(next.thisArg || this, val);
            
            callback = this._callback[type];
            val = callback.func.call(callback.thisArg || this, val);
        } catch (e) {
            type = "error";
            val = e;
            
            callback = this._callback[type];
            callback.func.call(callback.thisArg || this, val);
            
            return this;
        }
        
        if (this._next.length) {
            this._call(val);
        }
        
        return this;
    }
};
