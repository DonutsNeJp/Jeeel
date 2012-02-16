Jeeel.directory.Jeeel.Dom.Style.Animation = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Dom.Style + 'Animation/';
    }
};

/**
 * @ignore
 */
Jeeel.Dom.Style.Animation = function (style, params, duration, easing, callback) {
  
    this.step = Jeeel.Function.simpleBind(this.step, this);
    
    this._style = style;
    this._params = params;
    this._duration = this.constructor.Speed.getSpeed(duration);
    this._easing = easing;
    this._callback = callback;
    
    this.init();
};

/**
 * インスタンスの作成を行う
 * 
 * @return {Jeeel.Dom.Style.Animation} 作成したインスタンス
 */
Jeeel.Dom.Style.Animation.create = function (style, params, duration, easing, callback) {
    return new this(style, params, duration, easing, callback);
};

Jeeel.Dom.Style.Animation.prototype = {
    _style: null,
    _defaultParams: {},
    _params: {},
    _duration: null,
    _easing: null, 
    _callback: null,
    _timerId: null,
    _dt: 13,
    _tick: 0,
    
    setDuration: function (duration) {
        this._duration = this.constructor.Speed.getSpeed(duration);
        
        return this;
    },
    
    setEasing: function (easing) {
        this._easing = easing;
        
        return this;
    },
    
    setCallback: function (callback) {
        this._callback = callback;
        
        return this;
    },
    
    init: function () {
        if (this._timerId) {
            Jeeel.Window.clearInterval(this._timerId);
        }
        
        this._timerId = null;
        this._tick = 0;
        //パラメータの初期化
    },
    
    animate: function () {
        this.init();
        this.start();
        
        return this;
    },
    
    start: function () {
      
        if ( ! this._timerId) {
            Jeeel.Window.setInterval(this.step, this._dt);
        }
    },
    
    step: function () {
        
        if (this._tick > this._duration) {
            return this.stop(true);
        }
        
        this._tick += this._dt;
        
        
    },
    
    end: function () {
        if (this._callback) {
            this._callback();
        }
    },
    
    stop: function (goToEnd) {
        if (this._timerId) {
            Jeeel.Window.clearInterval(this._timerId);
            
            this._timerId = null;
        }
        
        if (goToEnd) {
            this.end();
        }
    },
    
    constructor: Jeeel.Dom.Style.Animation
};

Jeeel.file.Jeeel.Dom.Style.Animation = ['Speed', 'Easing'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Dom.Style.Animation, Jeeel.file.Jeeel.Dom.Style.Animation);