Jeeel.directory.Jeeel.Dom.Style = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Dom + 'Style/';
    }
};

/**
 * コンストラクタ
 * 
 * @class スタイルを扱うクラス
 * @param {Element} element スタイルの操作対象Element
 */
Jeeel.Dom.Style = function (element) {
    this._style = element && element.style || null;
    this._hook = element && new this.constructor.Hook(element, this);
    this._customStyle = this._style &&  new this.constructor.Custom(this._style);
    this._bundler = this._customStyle && new this.constructor.Bundler(this._customStyle);
    this._defaultDisplay = this.constructor.getDefaultDisplay(element && element.nodeName);
    this._animationQueue = [];
    this._nextAnimate = Jeeel.Function.simpleBind(this._nextAnimate, this);
    
    if (element) {
        this._computedStyle = element.parentNode && Jeeel.Document.getComputedStyle(element) || null;
    }
};

/**
 * インスタンスの作成を行う
 * 
 * @param {Style} style 操作スタイル
 * @return {Jeeel.Dom.Style} 作成したインスタンス
 */
Jeeel.Dom.Style.create = function (style) {
    return new this(style);
};

(function () {
    var cache = {};
    
    /**
     * 初期状態のdisplayの値を取得する
     * 
     * @param {String} nodeName 取得したいノード名
     * @return {String} 取得したdisplayの初期値
     */
    Jeeel.Dom.Style.getDefaultDisplay = function (nodeName) {
      
        if ( ! nodeName) {
            return 'inline';
        }
        
        if (nodeName in cache) {
            return cache[nodeName];
        }
        
        var elm = Jeeel.Document.createElement(nodeName);
        var body = Jeeel.Document.getBody();

        body.appendChild(elm);

        var display = Jeeel.Document.getComputedStyle(elm).display;

        body.removeChild(elm);

        // 任意にスタイルが設定されていた場合で且displayの値がnoneもしくは不明の場合はiframe内で再取得
        if (display === 'none' || display === '') {
            var iframe = Jeeel.Document.createElement('iframe');

            iframe.frameBorder = iframe.width = iframe.height = 0;

            body.appendChild(iframe);

            var iframeDoc = (iframe.contentWindow || iframe.contentDocument).document;
            iframeDoc.write((Jeeel.Document.getDocument().compatMode === 'CSS1Compat' ? '<!doctype html>' : '' ) + '<html><body>');
            iframeDoc.close();

            elm = iframeDoc.createElement(nodeName);

            iframeDoc.body.appendChild(elm);

            display = Jeeel.Document.getComputedStyle(elm).display;

            body.removeChild(iframe);
        }
        
        cache[nodeName] = display;

        return display;
    };
})();

Jeeel.Dom.Style.prototype = {
  
    /**
     * 操作対象スタイル
     * 
     * @type CSSStyleDeclaration
     * @private
     */
    _style: null,
    
    /**
     * 操作フック
     * 
     * @type Jeeel.Dom.Style.Hook
     * @private
     */
    _hook: null,
    
    /**
     * 操作フック
     * 
     * @type Jeeel.Dom.Style.Bundler
     * @private
     */
    _bundler: null,
    
    /**
     * カスタムスタイル
     * 
     * @type Jeeel.Dom.Style.Custom
     * @private
     */
    _customStyle: null,
    
    /**
     * 計算済みスタイル
     * 
     * @type CSSStyleDeclaration
     * @private
     */
    _computedStyle: null,
    
    /**
     * デフォルトの表示状態(inlineかblock、もしくはnoneの可能性もある: head)
     * 
     * @type String
     * @private
     */
    _defaultDisplay: '',
    
    _oldDisplay: '',
    
    _animated: false,
    
    _currentAnimation: null,
    
    _animationQueue: [],
    
    /**
     * 要素のstyleを取得する
     * 
     * @return {CSSStyleDeclaration} スタイル
     */
    getElementStyle: function () {
        return this._style;
    },
    
    /**
     * 要素の計算済みstyleを取得する
     * 
     * @return {CSSStyleDeclaration} スタイル
     */
    getComputedStyle: function () {
        return this._computedStyle;
    },
    
    /**
     * スタイルを取得する
     *
     * @param {String} style スタイル名
     * @return {String} スタイル値
     */
    getStyle: function (style) {
        style = Jeeel.String.toCamelCase(style);
        
        // まずフックを参照し、続いて通常のスタイル、カスタムスタイル、計算済みスタイルから参照する
        return (this._hook[style] && this._hook[style]()) 
            || this._style[style] 
            || (this._customStyle[style] && this._customStyle[style]()) 
            || (this._computedStyle && this._computedStyle[style])
            || null;
    },

    /**
     * スタイルの設定を行う
     *
     * @param {String} style スタイル名
     * @param {String} value スタイル値
     * @return {Jeeel.Dom.Style} 自インスタンス
     */
    setStyle: function (style, value) {
        var styleName = Jeeel.String.toCamelCase(style);
        
        // カスタムスタイルに対して設定を行う
        if (this._customStyle[styleName]) {
            this._customStyle[styleName](value);
            
            return this;
        }
        
        this._style[styleName] = value;

        return this;
    },
    
    /**
     * 複数のスタイルの設定を行う
     *
     * @param {Hash} styles スタイル名と値のペアリスト
     * @return {Jeeel.Dom.Style} 自インスタンス
     */
    setStyleList: function (styles) {
        var cssText = [];
        var replaces = [];
        
        styles = this._bundler.bundle(styles);
        
        for (var style in styles) {
            
            var styleName  = Jeeel.String.toCamelCase(style);
            var styleValue = styles[style];

            // カスタムスタイルが存在したら実行もしくは名前を変更する
            if (this._customStyle[styleName]) {
                if (this._customStyle[styleName].usableFilter) {
                    styleValue = this._customStyle[styleName](styleValue, true);
                    styleName = this._customStyle[styleName].originName;
                } else if (this._customStyle[styleName].originName) {
                    styleName = this._customStyle[styleName].originName;
                } else {
                    this._customStyle[styleName](styleValue);
                    continue;
                }
            } else {
                styleName = Jeeel.String.toHyphenation(style);
            }
            
            // 数字の0または値が存在するとき値を設定し、空の場合は値を削除する
            if (styleValue || styleValue === 0) {
                cssText[cssText.length] = styleName + ':' + styleValue;
            } else {
                replaces.push(new RegExp(styleName + ':[^;]+;', 'i'));
            }
        }
        
        var baseCss = this._style.cssText;
        
        for (var i = replaces.length; i--;) {
            baseCss = baseCss.replace(replaces[i], '');
        }
        
        this._style.cssText = baseCss + ';' + cssText.join(';');
        
        return this;
    },
    
    /**
     * アニメーションを開始する
     * 
     * @param {Jeeel.Dom.Style.Animation} animation アニメーションインスタンス
     * @return {Jeeel.Dom.Style} 自インスタンス
     */
    animate: function (animation) {},
    
    /**
     * アニメーションを開始する
     * 
     * @param {Hash} params アニメーション変化の数値
     * @param {Hash} [options] アニメーションのオプション(指定できるオプション: duration, easing, complete, step, enqueue)
     * @return {Jeeel.Dom.Style} 自インスタンス
     * @see Jeeel.Dom.Style.Animation.Easing
     */
    animate: function (params, options) {},
    
    /**
     * アニメーションを開始する
     * 
     * @param {Hash} params アニメーション変化の数値
     * @param {Integer|String} [duration] アニメーションが完結するまでの時間(ミリ秒)か定義文字列(fast, slow, defaultがある)
     * @param {Function|String} [easing] アニメーションの数値の変化度合いを変える関数もしくはそれを表す文字列(Jeeel.Dom.Style.Animation.Easingの中の関数名、例:swing等)
     * @param {Function} [complete] アニメーション終了時に呼ばれるコールバック
     * @param {Function} [step] アニメーション更新時に呼ばれるコールバック
     * @return {Jeeel.Dom.Style} 自インスタンス
     * @see Jeeel.Dom.Style.Animation.Easing
     */
    animate: function (params, duration, easing, complete, step) {},
    
    /**
     * 現在実行中のアニメーションを停止させ、次のアニメーションを実行する
     * 
     * @return {Jeeel.Dom.Style} 自インスタンス
     */
    stop: function () {
        this._animated = false;
        
        if (this._currentAnimation) {
            for (var i = this._currentAnimation.length; i--;) {
                this._currentAnimation[i].stop();
            }
        }
        
        this._nextAnimate(true);
        
        return this;
    },
    
    /**
     * 現在実行中のアニメーションを終了させ、次のアニメーションを実行する
     * 
     * @return {Jeeel.Dom.Style} 自インスタンス
     */
    end: function () {
        this._animated = false;
        
        if (this._currentAnimation) {
            for (var i = this._currentAnimation.length; i--;) {
                this._currentAnimation[i].end();
            }
        }
        
        this._nextAnimate(true);
        
        return this;
    },
    
    /**
     * 現在待機中のアニメーションのキューを破棄する
     * 
     * @return {Jeeel.Dom.Style} 自インスタンス
     */
    clear: function () {
        this._animationQueue = [];
        
        return this;
    },
    
    /**
     * アニメーションキューの実行を遅延させる
     * 
     * @param {Integer} delayTime 遅延時間(ミリ秒)
     * @return {Jeeel.Dom.Style} 自インスタンス
     */
    delay: function (delayTime) {
        return this._enqueueAnimation({
            animate: function (next) {
                Jeeel.Timer.setTimeout(next, delayTime);
            }
        });
    },
    
    /**
     * 表示する
     * 
     * @param {Integer|String} [speed] 指定するとアニメーションになる(ミリ秒かfast, slow, defaultの文字列定数がある)
     * @param {Function|String} [easing] アニメーションの数値の変化度合いを変える関数もしくはそれを表す文字列(Jeeel.Dom.Style.Animation.Easingの中の関数名、例:swing等)
     * @param {Function} [complete] アニメーションにした際に終了時に呼ばれるコールバック
     * @return {Jeeel.Dom.Style} 自インスタンス
     * @see Jeeel.Dom.Style.Animation.Easing
     */
    show: function (speed, easing, complete) {
        
        if (speed || speed === 0) {
            return this.animate({display: 'show'}, speed, easing, complete);
        }
        
        var display = this._style.display;
        
        if (display !== '' && display !== 'none') {
            return this;
        }
        
        this._style.display = this._getShowedDisplay();
        
        return this;
    },
    
    /**
     * 隠す
     * 
     * @param {Integer|String} [speed] 指定するとアニメーションになる(ミリ秒かfast, slow, defaultの文字列定数がある)
     * @param {Function|String} [easing] アニメーションの数値の変化度合いを変える関数もしくはそれを表す文字列(Jeeel.Dom.Style.Animation.Easingの中の関数名、例:swing等)
     * @param {Function} [complete] アニメーションにした際に終了時に呼ばれるコールバック
     * @return {Jeeel.Dom.Style} 自インスタンス
     * @see Jeeel.Dom.Style.Animation.Easing
     */
    hide: function (speed, easing, complete) {
      
        if (speed || speed === 0) {
            return this.animate({display: 'hide'}, speed, easing, complete);
        }
      
        this._style.display = 'none';
        
        return this;
    },
    
    /**
     * 表示の切り替えをする
     * 
     * @param {Integer|String} [speed] 指定するとアニメーションになる(ミリ秒かfast, slow, defaultの文字列定数がある)
     * @param {Function|String} [easing] アニメーションの数値の変化度合いを変える関数もしくはそれを表す文字列(Jeeel.Dom.Style.Animation.Easingの中の関数名、例:swing等)
     * @param {Function} [complete] アニメーションにした際に終了時に呼ばれるコールバック
     * @return {Jeeel.Dom.Style} 自インスタンス
     * @see Jeeel.Dom.Style.Animation.Easing
     */
    toggle: function (speed, easing, complete) {
        if (speed || speed === 0) {
            return this.animate({display: 'toggle'}, speed, easing, complete);
        }
      
        return this._style.display === 'none' ? this.show() : this.hide();
    },
    
    /**
     * フェードインを行う
     * 
     * @param {Integer|String} [speed] 指定するとアニメーションになる(ミリ秒かfast, slow, defaultの文字列定数がある)
     * @param {Function|String} [easing] アニメーションの数値の変化度合いを変える関数もしくはそれを表す文字列(Jeeel.Dom.Style.Animation.Easingの中の関数名、例:swing等)
     * @param {Function} [complete] アニメーションにした際に終了時に呼ばれるコールバック
     * @return {Jeeel.Dom.Style} 自インスタンス
     * @see Jeeel.Dom.Style.Animation.Easing
     */
    fadeIn: function (speed, easing, complete) {
        return this.animate({opacity: 'show'}, speed, easing, complete);
    },
    
    /**
     * フェードアウトを行う
     * 
     * @param {Integer|String} [speed] 指定するとアニメーションになる(ミリ秒かfast, slow, defaultの文字列定数がある)
     * @param {Function|String} [easing] アニメーションの数値の変化度合いを変える関数もしくはそれを表す文字列(Jeeel.Dom.Style.Animation.Easingの中の関数名、例:swing等)
     * @param {Function} [complete] アニメーションにした際に終了時に呼ばれるコールバック
     * @return {Jeeel.Dom.Style} 自インスタンス
     * @see Jeeel.Dom.Style.Animation.Easing
     */
    fadeOut: function (speed, easing, complete) {
        return this.animate({opacity: 'hide'}, speed, easing, complete);
    },
    
    /**
     * フェードトグルを行う
     * 
     * @param {Integer|String} [speed] 指定するとアニメーションになる(ミリ秒かfast, slow, defaultの文字列定数がある)
     * @param {Function|String} [easing] アニメーションの数値の変化度合いを変える関数もしくはそれを表す文字列(Jeeel.Dom.Style.Animation.Easingの中の関数名、例:swing等)
     * @param {Function} [complete] アニメーションにした際に終了時に呼ばれるコールバック
     * @return {Jeeel.Dom.Style} 自インスタンス
     * @see Jeeel.Dom.Style.Animation.Easing
     */
    fadeToggle: function (speed, easing, complete) {
        return this.animate({opacity: 'toggle'}, speed, easing, complete);
    },
    
    /**
     * スライドアップを行う
     * 
     * @param {Integer|String} [speed] 指定するとアニメーションになる(ミリ秒かfast, slow, defaultの文字列定数がある)
     * @param {Function|String} [easing] アニメーションの数値の変化度合いを変える関数もしくはそれを表す文字列(Jeeel.Dom.Style.Animation.Easingの中の関数名、例:swing等)
     * @param {Function} [complete] アニメーションにした際に終了時に呼ばれるコールバック
     * @return {Jeeel.Dom.Style} 自インスタンス
     * @see Jeeel.Dom.Style.Animation.Easing
     */
    slideUp: function (speed, easing, complete) {
        return this.animate({height: 'hide'}, speed, easing, complete);
    },
    
    /**
     * スライドダウンを行う
     * 
     * @param {Integer|String} [speed] 指定するとアニメーションになる(ミリ秒かfast, slow, defaultの文字列定数がある)
     * @param {Function|String} [easing] アニメーションの数値の変化度合いを変える関数もしくはそれを表す文字列(Jeeel.Dom.Style.Animation.Easingの中の関数名、例:swing等)
     * @param {Function} [complete] アニメーションにした際に終了時に呼ばれるコールバック
     * @return {Jeeel.Dom.Style} 自インスタンス
     * @see Jeeel.Dom.Style.Animation.Easing
     */
    slideDown: function (speed, easing, complete) {
        return this.animate({height: 'show'}, speed, easing, complete);
    },
    
    /**
     * スライドトグルを行う
     * 
     * @param {Integer|String} [speed] 指定するとアニメーションになる(ミリ秒かfast, slow, defaultの文字列定数がある)
     * @param {Function|String} [easing] アニメーションの数値の変化度合いを変える関数もしくはそれを表す文字列(Jeeel.Dom.Style.Animation.Easingの中の関数名、例:swing等)
     * @param {Function} [complete] アニメーションにした際に終了時に呼ばれるコールバック
     * @return {Jeeel.Dom.Style} 自インスタンス
     * @see Jeeel.Dom.Style.Animation.Easing
     */
    slideToggle: function (speed, easing, complete) {
        return this.animate({height: 'toggle'}, speed, easing, complete);
    },
    
    /**
     * 指定座標に移動する
     * 
     * @param {Integer} x X座標
     * @param {Integer} y Y座標
     * @return {Jeeel.Dom.Style} 自インスタンス
     */
    shiftTo: function (x, y) {
        return this.setStyleList({left: x + 'px', top:  y + 'px'});
    },
    
    /**
     * コンストラクタ
     * 
     * @param {Style} style 操作スタイル
     */
    constructor: Jeeel.Dom.Style,
    
    _getShowedDisplay: function () {
        var display = this._style.display;
        
        if ( ! this._computedStyle) {
            return this._defaultDisplay;
        }
        
        if (this._oldDisplay) {
            return this._oldDisplay;
        }
        
        var computedDisplay;
        
        if (display === 'none') {
            computedDisplay = this._defaultDisplay;
        } else {
            computedDisplay = this._computedStyle.display;
        }
        
        if (display === '' && computedDisplay === 'none') {
            this._oldDisplay =  this._defaultDisplay;
        } else {
            this._oldDisplay = computedDisplay;
        }
        
        return this._oldDisplay;
    },
    
    _enqueueAnimation: function (animate) {
        this._animationQueue.push(animate);
        
        return this;
    },
    
    _dequeueAnimation: function () {
        return this._animationQueue.shift();
    },
    
    _nextAnimate: function (shutdown) {
        var animation = this._dequeueAnimation();
        
        if ( ! animation) {
            if (shutdown) {
                return;
            }
            
            this._currentAnimation = null;
            
            return this.end();
        }
        
        var res = [animation];
        
        if (this._currentAnimation) {
            for (var i = this._currentAnimation.length; i--;) {
                if (this._currentAnimation[i].isAnimating && this._currentAnimation[i].isAnimating()) {
                    res.push(this._currentAnimation[i]);
                }
            }
        }
        
        this._currentAnimation = res;
        
        this._animated = true;
        
        animation.animate(this._nextAnimate);
    },
    
    _init: function () {
        delete this._init;
        
        this.animate = function (params, duration, easing, complete, step) {
            var animation;
            var queue = true;
            
            if (params instanceof this.constructor.Animation) {
                animation = params;
            } else {
                animation = new this.constructor.Animation(this._hook.getElement(), this, params);
                
                if (Jeeel.Type.isHash(duration)) {
                    animation.setDuration(duration.duration)
                             .setEasing(duration.easing)
                             .setCompleteCallback(duration.complete)
                             .setStepCallback(duration.step);
                             
                    if (duration.enqueue === false) {
                        queue = false;
                    }
                } else {
                    animation.setDuration(duration)
                             .setEasing(easing)
                             .setCompleteCallback(complete)
                             .setStepCallback(step);
                }
            }
            
            if (queue) {
                this._enqueueAnimation(animation);

                if ( ! this._animated) {
                    this._nextAnimate();
                }
            } else {
                if (this._currentAnimation) {
                    this._currentAnimation.push(animation);
                } else {
                    this._currentAnimation = [animation];
                }
                
                animation.animate();
            }

            return this;
        };
    }
};

Jeeel.Dom.Style.prototype._init();

Jeeel._Object.JeeelDomStyle = {
    
    cssShow: {position: 'absolute', visibility: 'hidden', display: 'block'},
    
    swapShow: function (domStyle, callback) {
        return this.swap(domStyle, this.cssShow, callback);
    },
    
    swap: function (domStyle, styles, callback) {
        var old = {}, key;

        for (key in styles) {
            var style = styles[key];
            
            old[key] = domStyle[key];
            domStyle[key] = style;
        }
        
        var res = callback();
        
        for (key in old) {
            domStyle[key] = old[key];
        }
        
        return res;
    }
};

Jeeel.file.Jeeel.Dom.Style = ['Hook', 'Custom', 'Bundler', 'Animation'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Dom.Style, Jeeel.file.Jeeel.Dom.Style);