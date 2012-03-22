
/**
 * コンストラクタ
 * 
 * @class コントローラのプロトタイプ<br />
 *         役割はそれぞれ、モデルが通信・計算・ステータス保持、<br />
 *         ビューが描画・構成・HTML要素とのやりとり、<br />
 *         コントローラが制御・イベントリスナ・カスタムイベントディスパッチなどとなる<br />
 *         なおコントローラとビューはLayerを継承しており、子供にそれぞれコントローラ、ビューを持つ事が出来る<br />
 *         また、EventDispatcherも継承しているのでイベントの制御も可能であり、<br />
 *         子に追加された時や削除された時はデフォルトでイベントがディスパッチされるようになっている
 * @augments Jeeel.Framework.Layer
 */
Jeeel.Framework.Mvc.Controller = function () {
    Jeeel.Framework.Layer.call(this);
};

/**
 * インスタンスの作成を行う
 * 
 * @return {Jeeel.Framework.Mvc.Controller} 作成したインスタンス
 */
Jeeel.Framework.Mvc.Controller.create = function () {
    return new this();
};

Jeeel.Framework.Mvc.Controller.prototype = {
  
    /**
     * このコントローラに紐づくモデル
     * 
     * @type Jeeel.Framework.Mvc.Model
     * @protected
     */
    _model: null,
    
    /**
     * このコントローラに紐づくビュー
     * 
     * @type Jeeel.Framework.Mvc.View
     * @protected
     */
    _view: null,
    
    /**
     * ビューへの通知を行う
     * 
     * @return {Jeeel.Framework.Mvc.Controller} 自インスタンス
     */
    update: function () {
        this._view.update(this);
        
        return this;
    },
    
    /**
     * モデルを取得する
     * 
     * @return {Jeeel.Framework.Mvc.Model} モデル
     */
    getModel: function () {
        return this._model;
    },
    
    /**
     * モデルを設定する
     * 
     * @param {Jeeel.Framework.Mvc.Model} model モデル
     * @return {Jeeel.Framework.Mvc.Controller} 自インスタンス
     */
    setModel: function (model) {
        if (this._model) {
            this._model.detach(this);
        }
        
        this._model = model;
        
        if (model) {
            model.attach(this);
        }
        
        return this;
    },
    
    /**
     * ビューを取得する
     * 
     * @return {Jeeel.Framework.Mvc.View} ビュー
     */
    getView: function () {
        return this._view;
    },
    
    /**
     * ビューを設定する
     * 
     * @param {Jeeel.Framework.Mvc.View} view ビュー
     * @return {Jeeel.Framework.Mvc.Controller} 自インスタンス
     */
    setView: function (view) {
        if (this._view) {
            this._view.detach(this);
        }
        
        this._view = view;
        
        if (view) {
            view.attach(this);
        }
        
        return this;
    },
       
    /**
     * コンストラクタ
     * 
     * @constructor
     */
    constructor: Jeeel.Framework.Mvc.Controller,
    
    /**
     * 親に追加された時に呼び出される(デフォルトの挙動)
     * 
     * @protected
     */
    _onAddedThis: function (parent) {
        this._view.onControllerAdded(this, parent);
    },
    
    /**
     * 親から削除された時に呼び出される(デフォルトの挙動)
     * 
     * @protected
     */
    _onRemovedThis: function (parent) {
        this._view.onControllerRemoved(this, parent);
    }
};

Jeeel.Class.extend(Jeeel.Framework.Mvc.Controller, Jeeel.Framework.Layer);
