
/**
 * コンストラクタ
 * 
 * @class Elementラッパーからメソッドをチェインしてアニメーションを実行・管理できるクラス
 * @param {Jeeel.Dom.Style} style スタイル
 * @param {Jeeel.Dom.Element} returnInstance アニメーションを実行した後に返す戻り値
 */
Jeeel.Dom.Element.Animator = function (style, returnInstance) {
    this._style = style;
    this._returnInstance = returnInstance;
    this._params = {};
};

Jeeel.Dom.Element.Animator.prototype = {
  
    _style: null,
    
    _returnInstance: null,
    
    /**
     * アニメーションで変化させたいスタイルの名前と値のリスト
     * 
     * @type Hash
     * @private
     */
    _params: {},
  
    /**
     * アニメーションをどのくらいかけて行うかの数値(ミリ秒)
     * 
     * @type Integer
     * @private
     */
    _duration: null,
    
    /**
     * イージング関数
     * 
     * @type Function
     * @private
     */
    _easing: null, 
    
    /**
     * アニメーション終了時に呼ばれるコールバック
     * 
     * @type Function
     * @private
     */
    _complete: null,
    
    /**
     * アニメーション更新時に呼ばれるコールバック
     * 
     * @type Function
     * @private
     */
    _step: null,
    
    /**
     * キューの仕様の有無
     * 
     * @type Boolean
     * @private
     */
    _enqueue: true,
    
    /**
     * アニメーションの対象のスタイルを設定する
     * 
     * @param {String} key スタイル名
     * @param {String|Number|Hash} param スタイルの最終変化値<br />
     *                                    100px等の絶対値の他に、+=や-=を前に付けた相対値やtoggle、show、hide等の特殊値がある(特殊値はdisplay, width, height, opacity, margin系, padding系にしか効かない)<br />
     *                                    また配列や連想配列にすることでスタイルそれぞれにイージング関数を適用できる<br />
     *                                    [value, easing]とするか、{value: value, easing: easing}とすることが出来る
     * @return {Jeeel.Dom.Element.Animator} 自インスタンス
     */
    set: function (key, param) {
        this._params[key] = param;
        
        return this;
    },
    
    /**
     * アニメーションの対象のスタイルを全て設定する
     * 
     * @param {Hash} params アニメーション対象のスタイル全て
     * @return {Jeeel.Dom.Element.Animator} 自インスタンス
     */
    setAll: function (params) {
      
        for (var key in params) {
            this._params[key] = params[key];
        }
        
        return this;
    },
    
    /**
     * アニメーションの対象のスタイルを全て破棄する
     * 
     * @return {Jeeel.Dom.Element.Animator} 自インスタンス
     */
    clear: function () {
        this._params = {};
        
        return this;
    },
  
    /**
     * アニメーション完了時間を設定する
     * 
     * @param {Integer|String} duration 完了時間もしくはその定数
     * @return {Jeeel.Dom.Element.Animator} 自インスタンス
     */
    setDuration: function (duration) {
        this._duration = duration;
        
        return this;
    },
    
    /**
     * イージング関数を設定する
     * 
     * @param {Function|String} easing イージング関数
     * @return {Jeeel.Dom.Element.Animator} 自インスタンス
     */
    setEasing: function (easing) {
        this._easing = easing;
        
        return this;
    },
    
    /**
     * アニメーション終了時のコールバックを設定する
     * 
     * @param {Function} callback アニメーション終了時のコールバック
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはオーナーインスタンスになる)
     * @return {Jeeel.Dom.Element.Animator} 自インスタンス
     */
    setCompleteCallback: function (callback, thisArg) {
        this._complete = [callback, thisArg || this._returnInstance];
        
        return this;
    },
    
    /**
     * アニメーション更新時のコールバックを設定する
     * 
     * @param {Function} callback アニメーション更新時のコールバック(初期値0、最終値1の時のイージングが渡される)
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはオーナーインスタンスになる)
     * @return {Jeeel.Dom.Element.Animator} 自インスタンス
     */
    setStepCallback: function (callback, thisArg) {
        this._step = [callback, thisArg || this._returnInstance];
        
        return this;
    },
    
    /**
     * アニメーション実行時にキューを使用するかどうかを設定する
     * 
     * @param {Boolean} useQueue キューを使用するかどうか
     * @return {Jeeel.Dom.Element.Animator} 自インスタンス
     */
    useQueue: function (useQueue) {
        this._enqueue = !!useQueue;
        
        return this;
    },

    /**
     * アニメーションキューの実行を遅延させる
     * 
     * @param {Integer} delayTime 遅延時間(ミリ秒)
     * @return {Jeeel.Dom.Element.Animator} 自インスタンス
     */
    delay: function (delayTime) {
        this._style.delay(delayTime);
        
        return this;
    },
    
    /**
     * 現在実行中のアニメーションを停止させ、次のアニメーションを実行する
     * 
     * @return {Jeeel.Dom.Element.Animator} 自インスタンス
     */
    stop: function () {
        this._style.stop();
        
        return this;
    },
    
    /**
     * 現在実行中のアニメーションを終了させ、次のアニメーションを実行する
     * 
     * @return {Jeeel.Dom.Element.Animator} 自インスタンス
     */
    end: function () {
        this._style.end();
        
        return this;
    },
    
    /**
     * 現在待機中のアニメーションのキューを破棄する
     * 
     * @return {Jeeel.Dom.Element.Animator} 自インスタンス
     */
    clearQueue: function () {
        this._style.clear();
        
        return this;
    },
    
    /**
     * アニメーションを実行する
     * 
     * @return {Jeeel.Dom.Element} オーナーインスタンス
     */
    animate: function () {
        this._style.animate(this._params, {
            duration: this._duration, 
            easing: this._easing, 
            complete: this._complete, 
            step: this._step,
            enqueue: this._enqueue
        });
        
        return this._returnInstance;
    },
    
    /**
     * コンストラクタ
     * 
     * @constructor
     */
    constructor: Jeeel.Dom.Element.Animator
};