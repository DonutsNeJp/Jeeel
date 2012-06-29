
/**
 * コンストラクタ
 * 
 * @class 階層構造のオブジェクトを管理するクラス
 * @augments Jeeel.Framework.EventDispatcher
 */
Jeeel.Framework.Layer = function () {
    Jeeel.Framework.EventDispatcher.call(this);
    
    this._children = [];
};

Jeeel.Framework.Layer.prototype = {
    
    /**
     * 親レイヤー
     * 
     * @type Jeeel.Framework.Layer
     * @protected
     */
    _parent: null,
    
    /**
     * 子レイヤーリスト
     * 
     * @type Jeeel.Framework.Layer[]
     * @protected
     */
    _children: [],
    
    /**
     * 子レイヤーを追加する
     * 
     * @param {Jeeel.Framework.Layer} child 子レイヤー
     * @return {Jeeel.Framework.Layer} 自インスタンス
     */
    addChild: function (child) {
        this._children[this._children.length] = child;
        
        child._refreshRelationship(this);
        
        return this;
    },
    
    /**
     * 子レイヤーを削除する
     * 
     * @param {Jeeel.Framework.Layer} child 子レイヤー
     * @return {Jeeel.Framework.Layer} 自インスタンス
     */
    removeChild: function (child) {
        for (var i = this._children.length; i--;) {
            if (this._children[i] === child) {
                this._children.splice(i, 1);
                child._refreshRelationship();
                break;
            }
        }

        return this;
    },
    
    /**
     * 指定したインデックスの子レイヤーを削除する
     * 
     * @param {Integer} index インデックス
     * @return {Jeeel.Framework.Layer} 自インスタンス
     */
    removeChildAt: function (index) {
        if (this._children[index]) {
            var child = this._children[index];
            
            this._children.splice(index, 1);
            
            child._refreshRelationship();
        }
        
        return this;
    },
    
    /**
     * 全ての子レイヤーを削除する
     * 
     * @return {Jeeel.Framework.Layer} 自インスタンス
     */
    removeChildren: function () {
        for (var i = this._children.length; i--;) {
            this._children[i]._refreshRelationship();
        }
        
        this._children.splice(0, this._children.length);
        
        return this;
    },
    
    /**
     * 親レイヤーを取得する
     * 
     * @return {Jeeel.Framework.Layer} 親レイヤー
     */
    getParent: function () {
        return this._parent;
    },
    
    /**
     * 子レイヤーリストを取得する
     * 
     * @return {Jeeel.Framework.Layer[]} 子レイヤーリスト
     */
    getChildren: function () {
        return this._children;
    },
    
    /**
     * 指定したインデックスの子レイヤーを取得する
     * 
     * @param {Integer} index インデックス
     * @return {Jeeel.Framework.Layer} 子レイヤー
     */
    getChildAt: function (index) {
        return this._children[index] || null;
    },
    
    /**
     * 子レイヤーの数を取得する
     * 
     * @return {Integer} 子レイヤーの数
     */
    getChildSize: function () {
        return this._children.length;
    },
    
    /**
     * イベントを発生させる
     * 
     * @param {Jeeel.Framework.Event} event 発生対象のEvent
     * @return {Jeeel.Framework.Layer} 自インスタンス
     */
    dispatchEvent: function (event) {
        if ( ! (event instanceof Jeeel.Framework.Event)) {
            throw new Error('eventが指定されていません。');
        } else if (event._target) {
            throw new Error('eventは既にディスパッチ済みのEventオブジェクトです。');
        }
        
        event._target = this;
        
        var layer = this;
        var captureTargets = event._captureTargets;
        
        while (layer) {
            captureTargets[captureTargets.length] = layer;
            layer = layer._parent;
        }
        
        captureTargets[captureTargets.length - 1]._flowEvent(event);
        
        return this;
    },
    
    /**
     * コンストラクタ
     * 
     * @constructor
     */
    constructor: Jeeel.Framework.Layer,
    
    /**
     * ディスパッチされたイベントのフローを親レイヤーに伝える
     * 
     * @param {Jeeel.Framework.Event} event フロー対象のEvent
     * @return {Jeeel.Framework.Layer} 自インスタンス
     * @protected
     */
    _flowBubblingPhaseEvent: function (event) {
        // 上位伝播対象でイベントがキャンセルしていない場合に親レイヤーに伝播する
        if (this._parent && event.useBubbles() && ! event._cancelFlow) {
            this._parent._flowEvent(event);
        }
    },
    
    /**
     * ディスパッチされたイベントのフローを子レイヤーに伝える
     * 
     * @param {Jeeel.Framework.Event} event フォーリング対象のEvent
     * @return {Jeeel.Framework.Layer} 自インスタンス
     * @protected
     */
    _flowFallingPhaseEvent: function (event) {
        // 下位伝播対象でイベントがキャンセルしていない場合に子レイヤーに伝播する
        if (event.useFalls() && ! event._cancelFlow) {
            for (var i =  this._children.length; i--;) {
                this._children[i]._flowEvent(event);
            }
        }
    },
    
    /**
     * 親に追加された時に呼び出される(デフォルトの挙動)
     * 
     * @abstract
     * @protected
     */
    _onAddedThis: function (parent) {
        
    },
    
    /**
     * 親から削除された時に呼び出される(デフォルトの挙動)
     * 
     * @abstract
     * @protected
     */
    _onRemovedThis: function (parent) {
        
    },
    
    /**
     * 親子関係の更新する
     * 
     * @param {Jeeel.Framework.Layer} parent 親レイヤー
     * @final
     * @protected
     */
    _refreshRelationship: function (parent) {
        var event;
        
        if ( ! parent) {
            parent = this._parent;
            this._parent = null;
            
            event = new Jeeel.Framework.Event(Jeeel.Framework.Event.Type.REMOVED, true, false, true);
            
            this.dispatchEvent(event);
            
            if ( ! event.isDefaultPrevented()) {
                this._onRemovedThis(parent);
            }
            return;
        } else if (this._parent) {
            this._parent.removeChild(this);
        }
        
        this._parent = parent;
        
        event = new Jeeel.Framework.Event(Jeeel.Framework.Event.Type.ADDED, true, false, true);
        
        this.dispatchEvent(event);
        
        if ( ! event.isDefaultPrevented()) {
            this._onAddedThis(parent);
        }
    }
};

Jeeel.Class.extend(Jeeel.Framework.Layer, Jeeel.Framework.EventDispatcher);
