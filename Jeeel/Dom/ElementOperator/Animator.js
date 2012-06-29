
/**
 * コンストラクタ
 * 
 * @class Elementラッパーの複数のアニメーターを管理する操作インスタンス
 * @param {Jeeel.Dom.Element.Animator[]} animators 操作対象のElementのアニメーターインスタンス
 * @param {Jeeel.Dom.ElementOperator} returnInstance アニメーションを実行した後に返す戻り値
 */
Jeeel.Dom.ElementOperator.Animator = function (animators, returnInstance) {
    this._animators = animators;
    this._returnInstance = returnInstance;
};

Jeeel.Dom.ElementOperator.Animator.prototype = {
    
    /**
     * アニメーターリスト
     * 
     * @type Jeeel.Dom.Element.Animator[]
     * @private
     */
    _animators: null,
    
    /**
     * 戻り値インスタンス
     * 
     * @type Jeeel.Dom.ElementOperator
     * @private
     */
    _returnInstance: null,

    /**
     * アニメーションの対象のスタイルを設定する
     * 
     * @param {String} key スタイル名
     * @param {String|Number|Hash} param スタイルの最終変化値<br />
     *                                    100px等の絶対値の他に、+=や-=を前に付けた相対値やtoggle、show、hide等の特殊値がある(特殊値はdisplay, width, height, opacity, margin系, padding系にしか効かない)<br />
     *                                    また配列や連想配列にすることでスタイルそれぞれにイージング関数を適用できる<br />
     *                                    [value, easing]とするか、{value: value, easing: easing}とすることが出来る
     * @return {Jeeel.Dom.ElementOperator.Animator} 自インスタンス
     */
    set: function (key, param) {
        return this._callMethod('set', [key, param]);
    },
    
    /**
     * アニメーションの対象のスタイルを全て設定する
     * 
     * @param {Hash} params アニメーション対象のスタイル全て
     * @return {Jeeel.Dom.ElementOperator.Animator} 自インスタンス
     */
    setAll: function (params) {
        return this._callMethod('setAll', [params]);
    },
    
    /**
     * アニメーションの対象のスタイルを全て破棄する
     * 
     * @return {Jeeel.Dom.ElementOperator.Animator} 自インスタンス
     */
    clear: function () {
        return this._callMethod('clear');
    },
  
    /**
     * アニメーション完了時間を設定する
     * 
     * @param {Integer|String} duration 完了時間もしくはその定数
     * @return {Jeeel.Dom.ElementOperator.Animator} 自インスタンス
     */
    setDuration: function (duration) {
        return this._callMethod('setDuration', [duration]);
    },
    
    /**
     * イージング関数を設定する
     * 
     * @param {Function|String} easing イージング関数
     * @return {Jeeel.Dom.ElementOperator.Animator} 自インスタンス
     */
    setEasing: function (easing) {
        return this._callMethod('setEasing', [easing]);
    },
    
    /**
     * アニメーション終了時のコールバックを設定する
     * 
     * @param {Function} callback アニメーション終了時のコールバック
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはオーナーインスタンスになる)
     * @return {Jeeel.Dom.ElementOperator.Animator} 自インスタンス
     */
    setCompleteCallback: function (callback, thisArg) {
        return this._callMethod('setCompleteCallback', [callback, thisArg || this._returnInstance]);
    },
    
    /**
     * アニメーション更新時のコールバックを設定する
     * 
     * @param {Function} callback アニメーション更新時のコールバック(初期値0、最終値1の時のイージングが渡される)
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはオーナーインスタンスになる)
     * @return {Jeeel.Dom.ElementOperator.Animator} 自インスタンス
     */
    setStepCallback: function (callback, thisArg) {
        return this._callMethod('setStepCallback', [callback, thisArg || this._returnInstance]);
    },
    
    /**
     * アニメーション実行時にキューを使用するかどうかを設定する
     * 
     * @param {Boolean} useQueue キューを使用するかどうか
     * @return {Jeeel.Dom.ElementOperator.Animator} 自インスタンス
     */
    useQueue: function (useQueue) {
        return this._callMethod('useQueue', [useQueue]);
    },

    /**
     * アニメーションキューの実行を遅延させる
     * 
     * @param {Integer} delayTime 遅延時間(ミリ秒)
     * @return {Jeeel.Dom.ElementOperator.Animator} 自インスタンス
     */
    delay: function (delayTime) {
        return this._callMethod('delay', [delayTime]);
    },
    
    /**
     * 現在実行中のアニメーションを停止させ、次のアニメーションを実行する
     * 
     * @return {Jeeel.Dom.ElementOperator.Animator} 自インスタンス
     */
    stop: function () {
        return this._callMethod('stop');
    },
    
    /**
     * 現在実行中のアニメーションを終了させ、次のアニメーションを実行する
     * 
     * @return {Jeeel.Dom.ElementOperator.Animator} 自インスタンス
     */
    end: function () {
        return this._callMethod('end');
    },
    
    /**
     * 現在待機中のアニメーションのキューを破棄する
     * 
     * @return {Jeeel.Dom.ElementOperator.Animator} 自インスタンス
     */
    clearQueue: function () {
        return this._callMethod('clearQueue');
    },
    
    /**
     * アニメーションを実行する
     * 
     * @return {Jeeel.Dom.ElementOperator} オーナーインスタンス
     */
    animate: function () {
        this._callMethod('animate');
        
        return this._returnInstance;
    },
    
    /**
     * アニメーションが実行中かどうかを返す
     * 
     * @return {Boolean} 実行中かどうか
     */
    isAnimated: function () {
        for (var i = this._animators.length; i--;) {
            if (this._animators[i].isAnimated()) {
                return true;
            }
        }
        
        return false;
    },
    
    _callMethod: function (key, args) {
        for (var i = this._animators.length; i--;) {
            var animator = this._animators[i];
            
            animator[key].apply(animator, args || []);
        }
        
        return this;
    },
    
    /**
     * コンストラクタ
     * 
     * @constructor
     */
    constructor: Jeeel.Dom.ElementOperator.Animator
};