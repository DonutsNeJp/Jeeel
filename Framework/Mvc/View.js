
/**
 * コンストラクタ
 * 
 * @class ビューのプロトタイプ(Elementのラッパー要素の代わりでもある)
 * @augments Jeeel.Framework.Layer
 * @param {Element|String} element このビューが扱うElement
 * @param {Boolean} [useAutoAdd] このビューのオーナーコントローラが親コントローラに追加された時に、<br />
 *                                自動的にこのビューのElementを親コントローラのビューに追加するかどうか
 * @throws {Error} elementがHTML要素かIDで無かった場合に発生
 */
Jeeel.Framework.Mvc.View = function (element, useAutoAdd) {
    if (Jeeel.Type.isString(element)) {
        element = Jeeel.Document.getElementById(element);
    }
    
    if ( ! Jeeel.Type.isElement(element)) {
        throw new Error('このビューに対するElementを指定して下さい。');
    }
    
    this._element = element;
    this._useAutoAdd = !!useAutoAdd;
    
    Jeeel.Framework.Layer.call(this);
};

/**
 * インスタンスの作成を行う
 * 
 * @param {Element|String} element このビューが扱うElement
 * @param {Boolean} [useAutoAdd] このビューのオーナーコントローラが親コントローラに追加された時に、<br />
 *                                自動的にこのビューのElementを親コントローラのビューに追加するかどうか
 * @return {Jeeel.Framework.Mvc.View} 作成したインスタンス
 * @throws {Error} elementがHTML要素かIDで無かった場合に発生
 */
Jeeel.Framework.Mvc.View.create = function (element, useAutoAdd) {
    return new this(element, useAutoAdd);
};

Jeeel.Framework.Mvc.View.prototype = {
    
    /**
     * このビューを管理するコントローラ
     * 
     * @type Jeeel.Framework.Mvc.Controller
     * @protected
     */
    _controller: null,
    
    /**
     * このビューに関連付けられているElement
     * 
     * @type Element
     * @protected
     */
    _element: null,
    
    /**
     * Dom上に自動追加するかどうか
     * 
     * @type Boolean
     * @protected
     */
    _useAutoAdd: false,
    
    /**
     * このビューに関連付けられているElementを取得する
     * 
     * @return {Element} 関連付けElement
     */
    getElement: function () {
        return this._element;
    },
    
    /**
     * 子ビューを追加する<br />
     * この追加でコントローラ管理されているビューを追加するとElement間の追加しか行われない
     * 
     * @param {Jeeel.Framework.Mvc.View} child 追加要素
     * @return {Jeeel.Framework.Mvc.View} 自インスタンス
     */
    addChild: function (child) {
      
        if ( ! child._controller) {
            Jeeel.Framework.Layer.prototype.addChild.call(this, child);
        }
        
        if (child._useAutoAdd) {
            this._element.appendChild(child._element);
        }
        
        return this;
    },
    
    /**
     * 子ビューを削除する<br />
     * この削除でコントローラ管理されているビューを削除するとElement間の削除しか行われない
     * 
     * @param {Jeeel.Framework.Mvc.View} child 削除要素
     * @return {Jeeel.Framework.Mvc.View} 自インスタンス
     */
    removeChild: function (child) {
      
        if ( ! child._controller) {
            Jeeel.Framework.Layer.prototype.removeChild.call(this, child);
        }
        
        if (child._useAutoAdd) {
            this._element.removeChild(child._element);
        }
        
        return this;
    },
    
    /**
     * このビューのElementへイベントの登録を行う
     * 
     * @param {String} type イベントタイプ
     * @param {Function} listener 登録リスナー
     * @param {Mixied} [thisArg] イベントリスナー内でthisに相当する値(デフォルトはこのインスタンス)
     * @param {Mixied} var_args 可変引数、コールバックに渡す引数(最初の引数はJeeel.Dom.Eventで固定)
     * @return {Jeeel.Framework.Mvc.View} 自インスタンス
     */
    addDomEventListener: function (type, listener, thisArg, var_args) {
        var args = Array.prototype.slice.call(arguments, 0, arguments.length);
        
        args.unshift(this._element);
        
        if ( ! thisArg) {
            args[3] = this;
        }
        
        Jeeel.Dom.Event.addEventListener.apply(Jeeel.Dom.Event, args);
        
        return this;
    },
    
    /**
     * このビューのElementからイベントの削除を行う
     * 
     * @param {String} type イベントタイプ
     * @param {Function} listener 削除リスナー
     * @return {Jeeel.Framework.Mvc.View} 自インスタンス
     */
    removeDomEventListener: function (type, listener) {
        Jeeel.Dom.Event.removeEventListener(this._element, type, listener);
        
        return this;
    },
    
    /**
     * コントローラを紐付ける
     * 
     * @param {Jeeel.Framework.Mvc.Controller} controller コントローラ
     * @return {Jeeel.Framework.Mvc.View} 自インスタンス
     */
    attach: function (controller) {
        if (this._controller) {
            this._controller.removeView(this);
        }
        
        this._controller = controller;
        
        return this;
    },
    
    /**
     * コントローラとの紐付けを解除する
     * 
     * @param {Jeeel.Framework.Mvc.Controller} controller コントローラ
     * @return {Jeeel.Framework.Mvc.View} 自インスタンス
     */
    detach: function (controller) {
        if (this._controller === controller) {
            this._controller = null;
        }
        
        return this;
    },
    
    /**
     * コントローラが親コントローラに追加された時に呼び出される<br />
     * デフォルトでは親コントローラのビューにaddChildされる
     * 
     * @param {Jeeel.Framework.Mvc.Controller} controller コントローラ
     * @param {Jeeel.Framework.Mvc.Controller} parentController 親コントローラ
     */
    onControllerAdded: function (controller, parentController) {
        if ( ! this._useAutoAdd) {
            return;
        }
        
        var parentView = parentController.getView();
        
        if (parentView) {
            parentView.addChild(this);
        }
    },
    
    /**
     * コントローラが親コントローラから削除された時に呼び出される<br />
     * デフォルトでは親コントローラのビューからremoveChildされる
     * 
     * @param {Jeeel.Framework.Mvc.Controller} controller コントローラ
     * @param {Jeeel.Framework.Mvc.Controller} parentController 親コントローラ
     */
    onControllerRemoved: function (controller, parentController) {
        if ( ! this._useAutoAdd) {
            return;
        }
        
        var parentView = parentController.getView();
        
        if (parentView) {
            parentView.removeChild(this);
        }
    },
    
    /**
     * モデルが変化した際にコントローラから呼び出される<br />
     * デフォルトでは子ビュー全てのupdateメソッドを呼び出す
     * 
     * @param {Jeeel.Framework.Mvc.Controller} controller コントローラ
     * @return {Jeeel.Framework.Mvc.View} 自インスタンス
     */
    update: function (controller) {
        for (var i = 0, l = this._children.length; i < l; i++) {
            this._children[i].update(controller);
        }
        
        return this;
    },
    
    /**
     * コンストラクタ
     * 
     * @param {Element|String} element このビューが扱うElement
     * @constructor
     */
    constructor: Jeeel.Framework.Mvc.View
};

Jeeel.Class.extend(Jeeel.Framework.Mvc.View, Jeeel.Framework.Layer);
