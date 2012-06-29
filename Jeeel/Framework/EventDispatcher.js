
/**
 * コンストラクタ
 * 
 * @class イベントのハンドリング、ディスパッチを行うクラス
 */
Jeeel.Framework.EventDispatcher = function () {
    this._eventHandlers = {};
};

Jeeel.Framework.EventDispatcher.prototype = {
    
    /**
     * 登録イベントハンドラー
     * 
     * @type Hash
     * @private
     */
    _eventHandlers: {},
    
    /**
     * イベントの登録を行う
     * 
     * @param {String} type イベントタイプ
     * @param {Function} listener 登録リスナー
     * @param {Boolean} [useCapture] キャプチャ段階でリスナーを呼び出すかどうか
     * @param {Mixied} [thisArg] イベントリスナー内でthisに相当する値
     * @param {Mixied} var_args 可変引数、コールバックに渡す引数(最初の引数はJeeel.Framework.Event、２つ目以降に任意引数)
     * @return {Jeeel.Framework.EventDispatcher} 自インスタンス
     */
    addEventListener: function (type, listener, useCapture, thisArg, var_args) {
        if ( ! this._eventHandlers[type]) {
            this._eventHandlers[type] = [];
        }
        
        useCapture = !!useCapture;
        
        var handlers = this._eventHandlers[type];
        
        for (var i = handlers.length; i--;) {
            if (handlers[i].listener === listener && handlers[i].useCapture === useCapture) {
                return this;
            }
        }
        
        var args = Array.prototype.slice.call(arguments, 4, arguments.length);
        
        args.unshift(null);
          
        handlers[handlers.length] = {
            listener: listener,
            useCapture: useCapture,
            thisArg: thisArg,
            args: args
        };
        
        return this;
    },
    
    /**
     * イベントの削除を行う
     * 
     * @param {String} type イベントタイプ
     * @param {Function} listener 削除リスナー
     * @param {Boolean} [useCapture] キャプチャ段階でリスナーを呼び出すかどうか
     * @return {Jeeel.Framework.EventDispatcher} 自インスタンス
     */
    removeEventListener: function (type, listener, useCapture) {
        var handlers = this._eventHandlers[type];
        
        if ( ! handlers) {
            return this;
        }
        
        useCapture = !!useCapture;
        
        for (var i = handlers.length; i--;) {
            if (handlers[i].listener === listener && handlers[i].useCapture === useCapture) {
                handlers.splice(i, 1);
                break;
            }
        }
        
        return this;
    },
    
    /**
     * 指定したイベントタイプのイベントが登録されているかどうかを返す
     * 
     * @param {String} type イベントタイプ
     * @return {Boolean} 登録されているかどうか
     */
    hasEventListener: function (type) {
        return !!(this._eventHandlers[type] && this._eventHandlers[type].length);
    },
    
    /**
     * イベントを発生させる
     * 
     * @param {Jeeel.Framework.Event} event 発生対象のEvent
     * @return {Jeeel.Framework.EventDispatcher} 自インスタンス
     */
    dispatchEvent: function (event) {
        if (event._target) {
            throw new Error('eventは既にディスパッチ済みのEventオブジェクトです。');
        }
        
        event._target = this;
        
        event._captureTargets.push(this);
        
        return this._flowEvent(event);
    },
    
    /**
     * コンストラクタ
     * 
     * @constructor
     */
    constructor: Jeeel.Framework.EventDispatcher,
    
    /**
     * 他のディスパッチャーで発生したイベントを疑似フローさせる
     * 
     * @param {Jeeel.Framework.Event} event 疑似フロー対象のEvent
     * @return {Jeeel.Framework.EventDispatcher} 自インスタンス
     * @final
     * @protected
     */
    _flowEvent: function (event) {
        if (event._cancelFlow) {
            return this;
        }
        
        var phase = event.getEventPhase();
        
        this._callListener(event, phase === Jeeel.Framework.Event.Phase.CAPTURING);
        
        switch (phase) {
            case Jeeel.Framework.Event.Phase.CAPTURING:
                var capture = event._captureTargets.pop();
                
                if (capture === event._target) {
                    event._phase = Jeeel.Framework.Event.Phase.TARGETING;
                } else if (capture === this) {
                    capture = event._captureTargets.pop();
                    
                    if (capture === event._target) {
                        event._phase = Jeeel.Framework.Event.Phase.TARGETING;
                    }
                }
                
                capture._flowEvent(event);
                break;
                
            case Jeeel.Framework.Event.Phase.TARGETING:
                if (event.useBubbles() || event.useFalls()) {
                    if (event.useBubbles()) {
                        event._phase = Jeeel.Framework.Event.Phase.BUBBLING;
                        this._flowBubblingPhaseEvent(event);
                    }
                    
                    if (event.useFalls()) {
                        event._phase = Jeeel.Framework.Event.Phase.FALLING;
                        this._flowFallingPhaseEvent(event);
                    }
                } else {
                    event._cancelFlow = true;
                }
                
                break;
            
            case Jeeel.Framework.Event.Phase.BUBBLING:
                if (event.useBubbles()) {
                    this._flowBubblingPhaseEvent(event);
                }
                break;
                
            case Jeeel.Framework.Event.Phase.FALLING:
                if (event.useFalls()) {
                    this._flowFallingPhaseEvent(event);
                }
                break;
                
            default:
                throw new Error('フェーズの状態が不明です。');
                break;
        }
        
        return this;
    },
    
    /**
     * イベントをバブリングする
     * 
     * @param {Jeeel.Framework.Event} event バブリング対象のEvent
     * @protected
     * @abstract
     */
    _flowBubblingPhaseEvent: function (event) {
        
    },
    
    /**
     * イベントをフォーリングする
     * 
     * @param {Jeeel.Framework.Event} event フォーリング対象のEvent
     * @protected
     * @abstract
     */
    _flowFallingPhaseEvent: function (event) {
        
    },
    
    /**
     * このインスタンスに定義されているリスナーを呼び出す
     * 
     * @param {Jeeel.Framework.Event} event Eventオブジェクト
     * @param {Boolean} useCapture キャプチャ段階でのリスナーをキャッチするかどうか
     * @final
     * @protected
     */
    _callListener: function (event, useCapture) {
        if (event._cancelHandle) {
            return this;
        }
        
        var handlers = this._eventHandlers[event.getType()];
        
        if ( ! handlers) {
            return this;
        }
        
        event._currentTarget = this;
        
        var cloneHandlers = handlers.concat();
        
        for (var i = 0, l = cloneHandlers.length; i < l; i++) {
            
            if (cloneHandlers[i].useCapture === useCapture) {
                cloneHandlers[i].args[0] = event;
                
                cloneHandlers[i].listener.apply(cloneHandlers[i].thisArg, cloneHandlers[i].args);
                
                cloneHandlers[i].args[0] = null;

                if (event._cancelHandle) {
                    break;
                }
            }
        }
        
        return this;
    }
};
