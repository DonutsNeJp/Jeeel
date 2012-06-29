
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
 * @example
 * コントローラとビューは対応するビュー・モデルやオーナーコントローラが無くても存在出来るが、モデルは必ずオーナーコントローラが無ければならない
 * RC: ルートコントローラ
 * RV: ルートビュー
 * RM: ルートモデル
 * C1: グループ1のコントローラ
 * V1: グループ1のビュー
 * M1: グループ1のモデル
 * V2: グループ2のビュー
 * 
 * RM  M1
 * ｜  ｜
 * RC―C1
 * ｜  ｜
 * RV…V1―V2
 * 
 * この図はMVCの構成の一例である
 * まず大本のルートコントローラとそれに付属するモデルとビューが1つずつ存在する
 * ルートコントローラは子供にコントローラ、モデル、ビューのセットを保持しており、V1はuseAutoAddをtrueにしたことにより、RVの子要素ともなっている
 * この構成は基本構成であり、MVCで完結する要素がそれぞれ親子関係を築き、ビューは内部的に親子関係になるといった具合である
 * 
 * それに対してV2はオーナーコントローラもそれに対するモデルも無い
 * この構成は要素が描画のみでデータや制御を持たない場合に用いられる
 * ビューはHTML上の1つの要素と紐付けられるので、要素内の子要素が簡単な描画だけ行うような形式の時に用いる
 * この形式の場合はV1内部でV2を生成し明示的にaddChildするのが一般的だと思われる
 * 
 * コントローラやビューは複数の子要素を持てるのでそれを用いて大規模な要素を分割していく手法を用いるべきである
 * コントローラやビューはディスパッチャーを継承しているので、イベントをディスパッチするとキャプチャ段階、ターゲット段階、バブリング段階(もうひとつフォーリング段階もあるが通常は使わない)の順に伝搬を行う
 * イベントはstopされるまで全ての対象の要素に対して伝搬していくが、必ずコントローラ同士かビュー同士の伝搬になる
 * ルートコントローラ及びルートビューは親が存在しないため、HTMLに対して反映させるためには手動で要素を追加もしくは追加してある要素からルートビューを作成する必要がある
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
     * @param {Jeeel.Framework.Mvc.Controller} parent 親コントローラ
     * @protected
     */
    _onAddedThis: function (parent) {
        this._view.onControllerAdded(this, parent);
    },
    
    /**
     * 親から削除された時に呼び出される(デフォルトの挙動)
     * 
     * @param {Jeeel.Framework.Mvc.Controller} parent 親コントローラ
     * @protected
     */
    _onRemovedThis: function (parent) {
        this._view.onControllerRemoved(this, parent);
    }
};

Jeeel.Class.extend(Jeeel.Framework.Mvc.Controller, Jeeel.Framework.Layer);
