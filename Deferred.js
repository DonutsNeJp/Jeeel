
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
    Jeeel.Deferred.success = function (x) {
        return x;
    };

    /**
     * デフォルトのメソッド失敗時の挙動
     * 
     * @param {Mixied} [x] 引数
     */
    Jeeel.Deferred.error = function (x) {
        throw x;
    };

    /**
     * 指定したメソッドを遅延実行する
     * 
     * @param {Function} callback 遅延実行対象のメソッド
     * @return {Jeeel.Deferred} 作成したインスタンス
     */
    Jeeel.Deferred.next = function (callback) {
        var df = new this();
        
        if ( ! deferredQueue[0]) {
            var id = setTimeout(function () {
              
                var dq = deferredQueue.shift();

                if (deferredQueue[0]) {
                    id = setTimeout(arguments.callee, 0);
                    
                    deferredQueue[0]._canceller = function () {
                        clearTimeout(id);
                    };
                }
                
                dq.call();
            }, 0);

            df._canceller = function () {
                clearTimeout(id);
            };
        }
        
        deferredQueue[deferredQueue.length] = function () {
            df.call();
        };

        if (callback) {
            df._callback.success = callback;
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
    _next: null,
    
    /**
     * 初期状態に戻す
     * 
     * @return {Jeeel.Deferred} 自インスタンス
     */
    reset: function () {
        this._next = null;

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
        return this._dispatch("success", val);
    },
    
    /**
     * 遅延実行を途中キャンセルする
     * 
     * @return {Jeeel.Deferred} 自インスタンス
     */
    cancel: function () {
        (this._canceller || function () {})();
        
        return this.reset();
    },
    
    /**
     * 次のメソッドを呼ぶ
     * 
     * @param {Function} nextCallback 次のメソッド
     * @return {Jeeel.Deferred} 新規インスタンス
     */
    next: function (nextCallback) {
        return this._push('success', nextCallback);
    },
    
    /**
     * コンストラクタ
     * 
     * @constructor
     */
    constructor: Jeeel.Deferred,
    
    _dispatch: function (p, v) {
        var next = "success";
        
        try {
            v = this._callback[p].call(this, v);
        } catch (e) {
            next = "error";
            v = e;
        }
        
        if (v instanceof this.constructor) {
            v._next = this._next;
        } else {
            if (this._next) {
                this._next._dispatch(next, v);
            }
        }
        
        return this;
    },
    
    _push: function (p, f) {
        this._next = new this.constructor();
        this._next._callback[p] = f;
        
        return this._next;
    }
};
