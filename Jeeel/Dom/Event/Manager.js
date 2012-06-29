
(function () {
    var instance;
    
    /**
     * コンストラクタ
     * 
     * @class 全てのイベントを管理するシングルトンクラス
     */
    Jeeel.Dom.Event.Manager = function () {
        if (instance) {
            return instance;
        }

        instance = this;
        
        this._listeners = [];
    };
    
    /**
     * インスタンスを取得する
     * 
     * @return {Jeeel.Dom.Event.Manager} インスタンス
     */
    Jeeel.Dom.Event.Manager.getInstance = function () {
        return (instance || new this());
    };
})();



Jeeel.Dom.Event.Manager.prototype = {
  
    /**
     * リスナー配列
     * 
     * @type Jeeel.Dom.Event.Listener[]
     * @private
     */
    _listeners: [],
    
    /**
     * イベントの登録を行う
     *
     * @param {Element} element HTML要素
     * @param {String} type イベントタイプ
     * @param {Function} listener 登録イベントメソッド
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値
     * @param {Mixied} var_args 可変引数、コールバックに渡す引数(最初の引数はJeeel.Dom.Event、次の引数はイベント発生Element、3つ目以降に任意引数)
     */
    addEventListener: function (element, type, listener, thisArg, var_args) {
        var args = Array.prototype.slice.call(arguments, 4, arguments.length);
        this._getListener(element).add(type, listener, thisArg, args);
        
        return this;
    },
    
    /**
     * イベントの削除を行う
     *
     * @param {Element} element HTML要素
     * @param {String} type イベントタイプ
     * @param {Function} listener 登録イベントメソッド
     */
    removeEventListener: function (element, type, listener) {
        this._getListener(element).remove(type, listener);
        
        return this;
    },
    
    /**
     * 複数のElementに対してのイベントを上位Elementに委譲して登録を行う
     *
     * @param {Element} elementList 対象Elementまたは複数のElementリスト(Jeeel.Dom.ElementOperatorやJeeel.Dom.Element自体やリストでも可能)
     * @param {String} type イベントタイプ
     * @param {Function} listener 登録イベントメソッド
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値
     * @param {Mixied} var_args 可変引数、コールバックに渡す引数(最初の引数はJeeel.Dom.Event、次の引数はイベント発生Element、3つ目以降に任意引数)
     */
    delegate: function (elementList, type, listener, thisArg, var_args) {
        elementList = new Jeeel.Dom.ElementOperator(elementList);
        var args = Array.prototype.slice.call(arguments, 4, arguments.length);
        this._getListener(elementList.getCommonParent()).delegate(elementList, type, listener, thisArg, args);
        
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
        elementList = new Jeeel.Dom.ElementOperator(elementList);
        this._getListener(elementList.getCommonParent()).undelegate(elementList, type, listener);
        
        return this;
    },
    
    /**
     * Listenerインスタンスを取得する
     * 
     * @param {Element} elm Element
     * @return {Jeeel.Dom.Event.Listener} Listenerインスタンス
     * @private
     */
    _getListener: function (elm) {
        var i, listener = this._listeners;
        
        for (i = listener.length; i--;) {
            if (listener[i].hasElement(elm)) {
                return listener[i];
            }
        }
        
        return listener[listener.length] = new Jeeel.Dom.Event.Listener(elm);
    },
    
    /**
     * コンストラクタ
     * 
     * @constructor
     */
    constructor: Jeeel.Dom.Event.Manager
};
