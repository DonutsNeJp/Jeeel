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
 * コンストラクタ
 * 
 * @class アニメーションを管理するクラス
 * @param {Element} element エレメント
 * @param {Jeeel.Dom.Style} style スタイル
 * @param {Hash} params アニメーションで変化させる値のリスト(キーにはスタイル名、値には変化させたい終端値を入力<br />
 *                       値は100px等の絶対値の他に、+=や-=を前に付けた相対値やtoggle、show、hide等の特殊値がある(特殊値はdisplay, width, height, opacity, margin系, padding系にしか効かない)<br />
 *                       また値を配列や連想配列にすることでスタイルそれぞれにイージング関数やオプションを適用できる<br />
 *                       [value, easing, option]とするか、{value: value, easing: easing, option: option}とすることが出来る<br />
 *                       オプションはそれ自体が更に連想配列である必要があり、付けることが出来るキーはlimitである
 * @param {Integer|String} [duration] アニメーションを何ミリ秒で完結させるか
 * @param {Function|String} [easing] イージング関数
 * @param {Function} [complete] アニメーション終了時のコールバック
 * @param {Function} [step] アニメーション更新時のコールバック(引数にはeasingでの変化値が渡される)
 */
Jeeel.Dom.Style.Animation = function (element, style, params, duration, easing, complete, step) {
  
    this.step = Jeeel.Function.simpleBind(this.step, this);
    
    var keys = [], styles = {};
    var custom = this.constructor.Custom.getInstance();
    var filter = new Jeeel.Filter.Hash.Unique(true, true);
    
    for (var key in params) {
        var name = Jeeel.String.toCamelCase(key);
        
        var prms = this._toInnerStyle(params[key]);
        
        if (custom[name]) {
            var cnvPrms = custom[name](prms.value);
            
            for (var prm in cnvPrms) {
                keys[keys.length] = prm;
                styles[prm] = {
                    value: cnvPrms[prm],
                    easing: prms.easing
                };
            }
            
            continue;
        }
        
        keys[keys.length] = name;
        styles[name] = prms;
    }
    
    this._targetStyles = filter.filter(keys);
    
    this._style = style;
    this._element = element;
    this._hook = new this.constructor.Hook(element, style);
    this._params = styles;
    
    this.setDuration(duration)
        .setEasing(easing)
        .setCompleteCallback(complete)
        .setStepCallback(step);
};

/**
 * インスタンスの作成を行う
 * 
 * @param {Jeeel.Dom.Style} style スタイル
 * @param {Hash} params アニメーションで変化させる値のリスト
 * @param {Integer|String} [duration] アニメーションを何ミリ秒で完結させるか
 * @param {Function|String} [easing] イージング関数
 * @param {Function} [complete] アニメーション終了時のコールバック
 * @param {Function} [step] アニメーション更新時のコールバック
 * @return {Jeeel.Dom.Style.Animation} 作成したインスタンス
 */
Jeeel.Dom.Style.Animation.create = function (style, params, duration, easing, complete, step) {
    return new this(style, params, duration, easing, complete, step);
};

/**
 * アニメーション中の要素リスト
 * 
 * @type Element[]
 */
Jeeel.Dom.Style.Animation.animated = [];

Jeeel.Dom.Style.Animation.prototype = {
  
    /**
     * スタイル
     * 
     * @type Jeeel.Dom.Style
     * @private
     */
    _style: null,
    
    /**
     * 要素
     * 
     * @type Element
     * @private
     */
    _element: null,
    
    /**
     * アニメーションフック
     * 
     * @type Jeeel.Dom.Style.Animation.Hook
     * @private
     */
    _hook: null,
    
    /**
     * アニメーション中に更新する対象のスタイルのリスト
     * 
     * @type String[]
     * @private
     */
    _targetStyles: null,
    
    /**
     * アニメーション中に更新する前のスタイルの状態
     * 
     * @type Hash
     * @private
     */
    _defaultParams: {},
    
    /**
     * アニメーションで更新されるべき変化数値とその単位
     * 
     * @type Hash
     * @private
     */
    _deltaParams: {},
    
    /**
     * アニメーションで最終的に適用するスタイルの値
     * 
     * @type Hash
     * @private
     */
    _endParams: {},
    
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
     * アニメーション終了時のコールバックが呼ばれた後の最終コールバック
     * 
     * @type Function
     * @private
     */
    _lastCallback: null,
    
    /**
     * アニメーションフレームのタスクID
     * 
     * @type Integer
     * @private
     */
    _frameId: null,
    
    /**
     * アニメーションが開始されたタイムスタンプ
     * 
     * @type Integer
     * @private
     */
    _st: 0,
    
    /**
     * アニメーションが開始されてから経過した時間
     * 
     * @type Integer
     * @private
     */
    _ct: 0,
    
    /**
     * アニメーション完了時間を設定する
     * 
     * @param {Integer|String} duration 完了時間もしくはその定数
     * @return {Jeeel.Dom.Style.Animation} 自インスタンス
     */
    setDuration: function (duration) {
        this._duration = this.constructor.Speed.getSpeed(duration);
        
        return this;
    },
    
    /**
     * イージング関数を設定する
     * 
     * @param {Function|String} easing イージング関数
     * @return {Jeeel.Dom.Style.Animation} 自インスタンス
     */
    setEasing: function (easing) {
        this._easing = (Jeeel.Type.isFunction(easing) ? easing : this.constructor.Easing[easing]) || this.constructor.Easing.swing;
        
        return this;
    },
    
    /**
     * アニメーション終了時のコールバックを設定する
     * 
     * @param {Function} callback アニメーション終了時のコールバック
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.Dom.Style.Animation} 自インスタンス
     */
    setCompleteCallback: function (callback, thisArg) {
        if ( ! callback) {
            return this;
        }
        
        if (callback.splice) {
            thisArg = callback[1];
            callback = callback[0];
        }
        
        this._complete = {func: callback, thisArg: thisArg};
        
        return this;
    },
    
    /**
     * アニメーション更新時のコールバックを設定する
     * 
     * @param {Function} callback アニメーション更新時のコールバック(初期値0、最終値1の時のイージングが渡される)
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.Dom.Style.Animation} 自インスタンス
     */
    setStepCallback: function (callback, thisArg) {
        if ( ! callback) {
            return this;
        }
      
        if (callback.splice) {
            thisArg = callback[1];
            callback = callback[0];
        }
      
        this._step = {func: callback, thisArg: thisArg};
        
        return this;
    },
    
    /**
     * アニメーションが実行中かどうかを取得する
     * 
     * @return {Boolean} 実行中かどうか
     */
    isAnimating: function () {
        return !!this._frameId;
    },

    /**
     * アニメーションの初期化と開始を一括で行う
     * 
     * @return {Jeeel.Dom.Style.Animation} 自インスタンス
     */
    animate: function (callback) {
        this._lastCallback = callback;
        
        this.init();
        this.start();
        
        return this;
    },
    
    /**
     * アニメーションの初期化を行う
     * 
     * @return {Jeeel.Dom.Style.Animation} 自インスタンス
     */
    init: function () {
        if (this._frameId) {
            this.constructor.Frame.removeTask(this._frameId);
        }
        
        this._frameId = null;
        this._ct = 0;

        this._defaultParams = {};
        this._deltaParams = {};
        this._endParams = {};
        
        var initCss = {};
        var op = this.constructor.StyleOperator;
        var relativeReg = /^(\+|-)=/i;
        var unitReg = /[^0-9.]+$/i;
        
        for (var i = this._targetStyles.length; i--;) {
            var key  = this._targetStyles[i];
            var prm  = '' + this._params[key].value;
            var pre  = prm.match(relativeReg);
            var unit = prm.match(unitReg);
            var limit = this._params[key].limit;
            var fprm, prmLimit;
            
            unit = unit && unit[0] || '';
            
            this._defaultParams[key] = op.filter(key, this._style.getStyle(key));
            
            if (pre) {
                prm = prm.replace(relativeReg, '');
                pre = pre[1];
                
                fprm = op.filter(key, prm);
                
                fprm = (pre === '+' ? this._add : this._sub)(this._defaultParams[key], fprm);
            } else {
                fprm = op.filter(key, prm);
            }
            
            // 制限が課せられていた場合下準備をする
            if (limit) {
                prmLimit = {};
                
                if (limit.useUpper) {
                    prmLimit.upper = op.filter(key, limit.upper);
                    
                    if (fprm.splice && ( ! prmLimit.upper.splice || fprm.length !== prmLimit.upper.length)) {
                        delete prmLimit.upper;
                    } else {
                        prmLimit.useUpper = true;
                    }
                }

                if (limit.useLower) {
                    prmLimit.lower = op.filter(key, limit.lower);
                    
                    if (fprm.splice && ( ! prmLimit.lower.splice || fprm.length !== prmLimit.lower.length)) {
                        delete prmLimit.lower;
                    } else {
                        prmLimit.useLower = true;
                    }
                }
                
                if ( ! (prmLimit.useUpper || prmLimit.useLower)) {
                    prmLimit = null;
                } else {
                    prmLimit.reverse = limit.reverse;
                }
            }
            
            this._deltaParams[key] = {
                value: this._sub(fprm, this._defaultParams[key]),
                unit: unit,
                easing: this._params[key].easing || this._easing,
                limit: prmLimit
            };
            
            this._endParams[key] = op.unfilter(key, fprm, this._deltaParams[key].unit);
            
            if (key === 'width' || key === 'height') {
                var style = this._style.getElementStyle();
                this._endParams['overflow'] = style.overflow;
                this._endParams['overflow-x'] = style.overflowX;
                this._endParams['overflow-y'] = style.overflowY;
                
                initCss['overflow'] = 'hidden';
            }
            
            if (this._hook[prm]) {
                var res = this._hook[prm](key, this._defaultParams[key], this._deltaParams[key], this._endParams[key]);
                
                if ( ! res) {
                    continue;
                }
                
                var prmKey;
                
                for (prmKey in res.init) {
                    if (prmKey === key) {
                        this._defaultParams[prmKey] = op.filter(prmKey, res.init[prmKey]);
                    }
                    
                    initCss[prmKey] = res.init[prmKey];
                }
                
                for (prmKey in res.delta) {
                    if (this._deltaParams[prmKey]) {
                        this._deltaParams[prmKey] = Jeeel.Hash.merge(this._deltaParams[prmKey], res.delta[prmKey]);
                    } else {
                        this._deltaParams[prmKey] = res.delta[prmKey];
                    }
                    
                    if ( ! this._deltaParams[prmKey].easing) {
                        this._deltaParams[prmKey].easing = this._easing;
                    }
                }
                
                for (prmKey in res.end) {
                    this._endParams[prmKey] = res.end[prmKey];
                }
            }
        }
        
        this._style.setStyleList(initCss);

        return this;
    },

    /**
     * アニメーションを開始する
     * 
     * @return {Jeeel.Dom.Style.Animation} 自インスタンス
     */
    start: function () {
      
        if ( ! this._frameId) {
            
            this._st = new Date().getTime() - this._ct;
            
            this._frameId = this.constructor.Frame.addTask(this.step);
            
            this.constructor.animated.push(this._element);
        }
        
        return this;
    },
    
    /**
     * アニメーションを一時停止する
     * 
     * @return {Jeeel.Dom.Style.Animation} 自インスタンス
     */
    stop: function () {
        if (this._frameId) {
            this.constructor.Frame.removeTask(this._frameId);
            
            this._frameId = null;
            
            for (var i = this.constructor.animated.length; i--;) {
                if (this.constructor.animated[i] === this._element) {
                    this.constructor.animated.splice(i, 1);
                    break;
                }
            }
        }
        
        return this;
    },
    
    /**
     * アニメーションを最小単位だけ進める
     * 
     * @return {Jeeel.Dom.Style.Animation} 自インスタンス
     */
    step: function (time) {
        
        var ct = time - this._st;
        var brk = false;
        
        if (ct > this._duration) {
            ct = this._duration;
            brk = true;
        }
        
        this._ct = ct;
        
        var css = this._getCss();

        this._style.setStyleList(css);
        
        if (this._step) {
            this._step.func.call(this._step.thisArg || this, this._easing(ct, 0, 1, this._duration));
        }
        
        if (brk) {
            return this.end();
        }

        return this;
    },
    
    /**
     * アニメーションを終了する
     * 
     * @return {Jeeel.Dom.Style.Animation} 自インスタンス
     */
    end: function () {
        
        // まだアニメーションが稼働中の場合は止める
        if (this._frameId) {
            this.stop();
        }
        
        // 最終状態のスタイルに変更する
        this._style.setStyleList(this._endParams);
        
        if (this._complete) {
            this._complete.func.call(this._complete.thisArg || this);
        }
        
        if (this._lastCallback) {
            this._lastCallback();
        }
        
        return this;
    },
    
    /**
     * コンストラクタ
     * 
     * @constructor
     */
    constructor: Jeeel.Dom.Style.Animation,
    
    /**
     * 加算する
     * 
     * @param {Number|Number[]} a 加算元
     * @param {Number|Number[]} b 加算先
     * @return {Number|Number[]} 加算結果
     */
    _add: function (a, b) {
        if (a.splice) {
            var res = [];
            
            for (var i = a.length; i--;) {
                res[i] = a[i] + b[i];
            }
            
            return res;
        }
        
        return a + b;
    },
    
    /**
     * 減算する
     * 
     * @param {Number|Number[]} a 減算元
     * @param {Number|Number[]} b 減算先
     * @return {Number|Number[]} 減算結果
     */
    _sub: function (a, b) {
        if (a.splice) {
            var res = [];
            
            for (var i = a.length; i--;) {
                res[i] = a[i] - b[i];
            }
            
            return res;
        }
        
        return a - b;
    },
    
    /**
     * CSSを取得する
     * 
     * @return {Hash} CSSリスト
     */
    _getCss: function () {
        var css = {};
        var op = this.constructor.StyleOperator;
        
        for (var i = this._targetStyles.length; i--;) {
            var key = this._targetStyles[i];
            var defaultPrm = this._defaultParams[key];
            var deltaParam = this._deltaParams[key];
            var limit = deltaParam.limit;
            var res, j, chn = false;
            
            // 配列の時のループ
            if (defaultPrm.splice) {
                res = [];
                
                for (j = defaultPrm.length; j--;) {
                    res[j] = deltaParam.easing(this._ct, defaultPrm[j], deltaParam.value[j], this._duration);
                }
                
                // リミットの処理
                if (limit) {
                    if (limit.reverse) {
                        if (limit.useUpper) {
                            for (j = res.length; j--;) {
                                if (res[j] > limit.upper[j]) {
                                    defaultPrm[j] = limit.upper[j] + (limit.upper[j] - defaultPrm[j]);
                                    res[j] = limit.upper[j] - (res[j] - limit.upper[j]);
                                    deltaParam.value[j] = -deltaParam.value[j];
                                    chn = true;
                                }
                            }
                        }

                        if (limit.useLower) {
                            for (j = res.length; j--;) {
                                if (res[j] < limit.lower[j]) {
                                    defaultPrm[j] = limit.lower[j] - (defaultPrm[j] - limit.lower[j]);
                                    res[j] = limit.lower[j] + (limit.lower[j] - res[j]);
                                    deltaParam.value[j] = -deltaParam.value[j];
                                    chn = true;
                                }
                            }
                        }
                        
                        if (chn) {
                            this._endParams[key] = op.unfilter(key, this._add(defaultPrm, deltaParam.value), deltaParam.unit);
                        }
                    } else {
                        if (limit.useUpper) {
                            for (j = res.length; j--;) {
                                if (res[j] > limit.upper[j]) {
                                    res[j] = limit.upper[j];
                                    chn = true;
                                }
                            }
                        }

                        if (limit.useLower) {
                            for (j = res.length; j--;) {
                                if (res[j] < limit.lower[j]) {
                                    res[j] = limit.lower[j];
                                    chn = true;
                                }
                            }
                        }
                        
                        if (chn) {
                            this._endParams[key] = op.unfilter(key, res, deltaParam.unit);
                        }
                    }
                }
                
            } else {
                res = deltaParam.easing(this._ct, defaultPrm, deltaParam.value, this._duration);
                
                // リミットの処理
                if (limit) {
                    if (limit.reverse) {
                        if (limit.useUpper && res > limit.upper) {
                            this._defaultParams[key] = defaultPrm = limit.upper + (limit.upper - defaultPrm);
                            res = limit.upper - (res - limit.upper);
                            deltaParam.value = -deltaParam.value;
                            chn = true;
                        }

                        if (limit.useLower && res < limit.lower) {
                            this._defaultParams[key] = defaultPrm = limit.lower - (defaultPrm - limit.lower);
                            res = limit.lower + (limit.lower - res);
                            deltaParam.value = -deltaParam.value;
                            chn = true;
                        }

                        if (chn) {
                            this._endParams[key] = op.unfilter(key, this._add(defaultPrm, deltaParam.value), deltaParam.unit);
                        }
                    } else {
                        if (limit.useUpper && res > limit.upper) {
                            res = limit.upper;
                            chn = true;
                        }

                        if (limit.useLower && res < limit.lower) {
                            res = limit.lower;
                            chn = true;
                        }

                        if (chn) {
                            this._endParams[key] = op.unfilter(key, res, deltaParam.unit);
                        }
                    }
                }
            }
            
            css[key] = op.unfilter(key, res, deltaParam.unit);
        }
        
        return css;
    },
    
    /**
     * 内部で用いるスタイルに変換する
     */
    _toInnerStyle: function (style) {
        var res = {}, op;
        
        if (Jeeel.Type.isHash(style)) {
          
            if (Jeeel.Type.isArray(style)) {
                res.value   = style[0];
                res.easing  = (Jeeel.Type.isFunction(style[1]) ? style[1] : this.constructor.Easing[style[1]]);
                
                op = style[2];
            } else {
                res.value   = ('value' in style) ? style.value : '0px';
                res.easing  = (Jeeel.Type.isFunction(style.easing) ? style.easing : this.constructor.Easing[style.easing]);
                
                op = style.option;
            }
            
            this._analyzeOption(res, op);
            
        } else {
            res.value = style;
        }
        
        return res;
    },
    
    /**
     * オプションの解析
     */
    _analyzeOption: function (res, option) {
        if ( ! option) {
            return;
        }
        
        if (option.limit) {
            var limit = {
                upper: option.limit.upper,
                useUpper: 'upper' in option.limit,
                lower: option.limit.lower,
                useLower: 'lower' in option.limit,
                reverse: !!option.limit.reverse
            };
            
            if (limit.useUpper || limit.useLower) {
                res.limit = limit;
            }
        }
    }
};

Jeeel.file.Jeeel.Dom.Style.Animation = ['Frame', 'Hook', 'Custom', 'StyleOperator', 'Speed', 'Easing'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Dom.Style.Animation, Jeeel.file.Jeeel.Dom.Style.Animation);