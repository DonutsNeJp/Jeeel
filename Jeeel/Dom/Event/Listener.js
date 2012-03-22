
/**
 * コンストラクタ
 * 
 * @class イベントリスナーを管理するクラス
 * @param {Element} element リスナー管理対象のElement
 */
Jeeel.Dom.Event.Listener = function (element) {
    this._element = element;
    
    this._tasks = {};
    
    this.listener = Jeeel.Function.simpleBind(this.listener, this);
};

Jeeel.Dom.Event.Listener.prototype = {
  
    /**
     * リスナー登録要素
     * 
     * @type Element
     * @private
     */
    _element: null,
    
    /**
     * タスクリスト
     * 
     * @type Hash
     * @private
     */
    _tasks: {},
    
    /**
     * Elementを保持しているかどうかを返す
     * 
     * @param {Element} elm 検索Element
     * @return {Boolean} 保持しているかどうか
     */
    hasElement: function (elm) {
        return this._element === elm;
    },
    
    /**
     * 登録を行う
     *
     * @param {String} type イベントタイプ
     * @param {Function} listener 登録イベントメソッド
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値
     * @param {Array} [args] コールバックに渡す引数のリスト(最初の引数はJeeel.Dom.Event、次の引数はイベント発生Element、3つ目以降に任意引数)
     */
    add: function (type, listener, thisArg, args) {
        type = this._getType(type);
        
        var lowerType = type.toLowerCase();
        
        if ( ! this._tasks[lowerType]) {
            this._tasks[lowerType] = [];
            this._setListener(type);
        }
        
        if ( ! args) {
            args = [];
        }
        
        var tasks = this._tasks[lowerType];
        
        Array.prototype.unshift.call(args, null, null);

        tasks[tasks.length] = {
            listener: listener, 
            thisArg: thisArg,
            useThis: Jeeel.Type.isSet(thisArg),
            args: args
        };
        
        tasks = null;
        
        return this;
    },
    
    /**
     * 削除を行う
     *
     * @param {String} type イベントタイプ
     * @param {Function} listener 登録イベントメソッド
     */
    remove: function (type, listener) {
        type = this._getType(type);
        
        var lowerType = type.toLowerCase();
        
        if ( ! this._tasks[lowerType]) {
            return this;
        }
        
        var tasks = this._tasks[lowerType],
            l = tasks.length,
            i = 0;
            
        if (l === 1) {
            delete this._tasks[lowerType];
            this._unsetListener(type);
            tasks = null;
            return this;
        }

        for (; i < l; i++) {
            if (tasks[i].listener === listener) {
                tasks.splice(i, 1);
                break;
            }
        }
        
        tasks = null;
        
        return this;
    },
    
    /**
     * 複数のElementに対してのイベントを上位Elementに委譲して登録を行う
     *
     * @param {Element} elementList 対象Elementまたは複数のElementリスト(Jeeel.Dom.ElementOperatorやJeeel.Dom.Element自体やリストでも可能)
     * @param {String} type イベントタイプ
     * @param {Function} listener 登録イベントメソッド
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値
     * @param {Array} [args] コールバックに渡す引数のリスト(最初の引数はJeeel.Dom.Event、次の引数はイベント発生Element、3つ目以降に任意引数)
     */
    delegate: function (elementList, type, listener, thisArg, args) {
        type = this._getType(type);
        
        var lowerType = type.toLowerCase();
        
        elementList = new Jeeel.Dom.ElementOperator(elementList);

        var parent = elementList.getCommonParent();
        
        if (parent && (this._element === parent || this._element === parent.ownerDocument)) {
            if ( ! this._tasks[lowerType]) {
                this._tasks[lowerType] = [];
                this._setListener(type);
            }
            
            if ( ! args) {
                args = [];
            }
            
            var tasks = this._tasks[lowerType];
            
            Array.prototype.unshift.call(args, null, null);
            
            tasks[tasks.length] = {
                elementList: elementList.getAll(),
                listener: listener, 
                thisArg: thisArg,
                useThis: Jeeel.Type.isSet(thisArg),
                args: args
            };
            
            tasks = null;
        }
        
        return this;
    },
    
    /**
     *  複数のElementに対してのイベントを上位Elementに委譲してたものの削除を行う
     *
     * @param {Element} elementList 対象Elementまたは複数のElementリスト(Jeeel.Dom.ElementOperatorやJeeel.Dom.Element自体やリストでも可能)
     * @param {String} type イベントタイプ
     * @param {Function} listener 登録イベントメソッド
     */
    undelegate: function (elementList, type, listener) {
        type = this._getType(type);
        
        var lowerType = type.toLowerCase();
        
        if ( ! this._tasks[lowerType]) {
            return this;
        }
        
        elementList = new Jeeel.Dom.ElementOperator(elementList);
        
        var parent = elementList.getCommonParent();
        
        if (this._element !== parent && this._element !== parent.ownerDocument) {
            return this;
        }
        
        var tasks = this._tasks[lowerType],
            l = tasks.length,
            i = 0;
            
        if (l === 1) {
            delete this._tasks[lowerType];
            this._unsetListener(type);
            tasks = null;
            return this;
        }

        for (; i < l; i++) {
            if (tasks[i].elementList && tasks[i].listener === listener) {
                tasks.splice(i, 1);
                break;
            }
        }
        
        tasks = null;
        
        return this;
    },
    
    /**
     * イベントから実際に呼ばれるリスナー
     * 
     * @param {Event} e イベントオブジェクト
     */
    listener: function (e) {
        e = new Jeeel.Dom.Event(e || Jeeel._global.event, this._element);
        
        var tasks = this._tasks[e.type].concat(),
            task, args, i = 0,
            j, k, targets, target, elmList, elm, brk;

        while(task = tasks[i++]) {
            args = task.args;
            elmList = task.elementList;
            
            args[0] = e;
            
            if (elmList) {
                targets = e.getBubblingTargets();
                brk = false;
                j = 0;
                
                while(target = targets[j++]) {
                    k = 0;
                    
                    while(elm = elmList[k++]) {
                        if (target === elm) {
                            if ( ! task.useThis) {
                                task.thisArg = target;
                            }
                            
                            args[1] = target;
                            task.listener.apply(task.thisArg, args);
                            brk = true;
                            break;
                        }
                    }
                    
                    if (brk) {
                        break;
                    }
                }
            } else {
                if ( ! task.useThis) {
                    task.thisArg = e.currentTarget;
                }
                
                args[1] = e.currentTarget;
                task.listener.apply(task.thisArg, args);
            }
            
            if ( ! task.useThis) {
                task.thisArg = null;
            }
            
            args[0] = args[1] = null;
        }
        
        // メモリリークを防ぐため
        tasks = task = targets = target = elmList = elm = e = args = null;
    },
    
    /**
     * イベントタイプを渡して変換する
     * 
     * @param {String} type イベントタイプ
     * @return {String} イベントタイプ
     */
    _getType: function (type) {},

    /**
     * 実際にリスナーを登録する
     * 
     * @param {String} type イベントタイプ
     * @private
     */
    _setListener: function (type) {},
    
    /**
     * 実際にリスナーを削除する
     * 
     * @param {String} type イベントタイプ
     * @private
     */
    _unsetListener: function (type) {}
};

(function () {
    var getType, add, remove;
    
    var isTouchPanelMobile = Jeeel.UserAgent.isAndroid()
                          || Jeeel.UserAgent.isIPhone()
                          || Jeeel.UserAgent.isIPad()
                          || Jeeel.UserAgent.isIPod();

    if (Jeeel._global && isTouchPanelMobile) {
        getType = function (type) {
            switch (type) {
                case Jeeel.Dom.Event.Type.MOUSE_DOWN:
                    type = Jeeel.Dom.Event.Type.TOUCH_START;
                    break;

                case Jeeel.Dom.Event.Type.MOUSE_MOVE:
                    type = Jeeel.Dom.Event.Type.TOUCH_MOVE;
                    break;

                case Jeeel.Dom.Event.Type.MOUSE_UP:
                    type = Jeeel.Dom.Event.Type.TOUCH_END;
                    break;

                default:
                    break;
            }
            
            return type;
        };
    } else {
        getType = function (type) {
            return type;
        };
    }
    
    if (Jeeel._global && Jeeel._global.addEventListener) {
        add = function (type) {
            this._element.addEventListener(type, this.listener, false);
        };
        remove = function (type) {
            this._element.removeEventListener(type, this.listener, false);
        };
    } else if (Jeeel._global && Jeeel._global.attachEvent) {
        add = function (type) {
            this._element.attachEvent("on" + type, this.listener);
        };
        remove = function (type) {
            this._element.detachEvent("on" + type, this.listener);
        };
    } else {
        add = remove = function (type) {
            Jeeel.errorDump('このブラウザはイベント登録に対応していません。');
        };
    }
    
    Jeeel.Dom.Event.Listener.prototype._getType = getType;
    Jeeel.Dom.Event.Listener.prototype._setListener = add;
    Jeeel.Dom.Event.Listener.prototype._unsetListener = remove;
    
    getType = add = remove = null;
})();