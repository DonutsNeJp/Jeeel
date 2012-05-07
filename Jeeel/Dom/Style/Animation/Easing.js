
/**
 * @namespace イージング関数を保持するネームスペース<br />
 * t: currentTime(経過時間: 秒)<br />
 * b: beginningValue(初期値)<br />
 * c: changeInValue(変動値)<br />
 * d: duration(継続時間: 秒)
 */
Jeeel.Dom.Style.Animation.Easing = {
  
    /**
     * y = x
     * 
     * @param {Integer} t 経過時間
     * @param {Number} b 初期値
     * @param {Number} c 変動値
     * @param {Integer} d 継続時間
     * @return {Number} 現在値
     */
    linear: function (t, b, c, d) {
        return c * t / d + b; 
    },
    
    /**
     * y = -( cos(x * π) ) / 2 + 0.5
     * 
     * @param {Integer} t 経過時間
     * @param {Number} b 初期値
     * @param {Number} c 変動値
     * @param {Integer} d 継続時間
     * @return {Number} 現在値
     */
    swing: function (t, b, c, d) {
        return ((-Math.cos(t / d * Math.PI) / 2) + 0.5) * c + b;
    },
    
    /**
     * y = x
     * 
     * @param {Integer} t 経過時間
     * @param {Number} b 初期値
     * @param {Number} c 変動値
     * @param {Integer} d 継続時間
     * @return {Number} 現在値
     */
    easeNone: function (t, b, c, d) {
        return c * t / d + b; 
    },
    
    /**
     * y = 2x
     * 
     * @param {Integer} t 経過時間
     * @param {Number} b 初期値
     * @param {Number} c 変動値
     * @param {Integer} d 継続時間
     * @return {Number} 現在値
     */
    easeInQuad: function (t, b, c, d) {
        return c * (t /= d) * t + b;
    },
    
    easeOutQuad: function (t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    },
    
    easeInOutQuad: function (t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t + b;
        }
        
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
    },
    
    /**
     * y = 3x
     * 
     * @param {Integer} t 経過時間
     * @param {Number} b 初期値
     * @param {Number} c 変動値
     * @param {Integer} d 継続時間
     * @return {Number} 現在値
     */
    easeInCubic: function (t, b, c, d) {
        return c * (t /= d) * t * t + b;
    },
    
    easeOutCubic: function (t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    },
    
    easeInOutCubic: function (t, b, c, d) {
        if ((t /= d / 2) < 1) { 
            return c / 2 * t * t * t + b;
        }
        
        return c / 2 * ((t -= 2) * t * t + 2) + b;
    },
    
    easeOutInCubic: function (t, b, c, d) {
        if (t < d / 2) {
            return Jeeel.Dom.Style.Animation.Easing.easeOutCubic(t * 2, b, c / 2, d);
        }
        
        return Jeeel.Dom.Style.Animation.Easing.easeInCubic((t * 2) - d, b + c / 2, c / 2, d);
    },
    
    /**
     * y = 4x
     * 
     * @param {Integer} t 経過時間
     * @param {Number} b 初期値
     * @param {Number} c 変動値
     * @param {Integer} d 継続時間
     * @return {Number} 現在値
     */
    easeInQuart: function (t, b, c, d) {
        return c * (t /= d) * t * t * t + b;
    },
    
    easeOutQuart: function (t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    
    easeInOutQuart: function (t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t * t + b;
        }
        
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    },
    
    easeOutInQuart: function (t, b, c, d) {
        if (t < d / 2) {
            return Jeeel.Dom.Style.Animation.Easing.easeOutQuart(t * 2, b, c / 2, d);
        }
        
        return Jeeel.Dom.Style.Animation.Easing.easeInQuart((t * 2) - d, b + c / 2, c / 2, d);
    },
    
    /**
     * y = 5x
     * 
     * @param {Integer} t 経過時間
     * @param {Number} b 初期値
     * @param {Number} c 変動値
     * @param {Integer} d 継続時間
     * @return {Number} 現在値
     */
    easeInQuint: function (t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
    },

    easeOutQuint: function (t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    
    easeInOutQuint: function (t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t * t * t + b;
        }
        
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    },
    
    easeOutInQuint: function (t, b, c, d) {
        if (t < d / 2) {
            return Jeeel.Dom.Style.Animation.Easing.easeOutQuint(t * 2, b, c / 2, d);
        }
        
        return Jeeel.Dom.Style.Animation.Easing.easeInQuint((t * 2) - d, b + c / 2, c / 2, d);
    },
    
    /**
     * y = -cos(x * n/2) + 1
     * 
     * @param {Integer} t 経過時間
     * @param {Number} b 初期値
     * @param {Number} c 変動値
     * @param {Integer} d 継続時間
     * @return {Number} 現在値
     */
    easeInSine: function (t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },
    
    easeOutSine: function (t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },
    
    easeInOutSine: function (t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    },
    
    easeOutInSine: function (t, b, c, d) {
        if (t < d / 2) {
            return Jeeel.Dom.Style.Animation.Easing.easeOutSine(t * 2, b, c / 2, d);
        }
        
        return Jeeel.Dom.Style.Animation.Easing.easeInSine((t * 2) - d, b + c / 2, c / 2, d);
    },
    
    /**
     * y = 2 ^ (10 * (x - 1)) : xが0の時はyも0
     * 
     * @param {Integer} t 経過時間
     * @param {Number} b 初期値
     * @param {Number} c 変動値
     * @param {Integer} d 継続時間
     * @return {Number} 現在値
     */
    easeInExpo: function (t, b, c, d) {
        return (t === 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b - c * 0.001);
    },
    
    easeOutExpo: function (t, b, c, d) {
        return (t === d ? b + c : c * 1.001 * (-Math.pow(2, -10 * t / d) + 1) + b);
    },
    
    easeInOutExpo: function (t, b, c, d) {
        if (t === 0) {
            return b;
        } else if (t === d) {
            return b + c;
        } else if ((t /= d / 2) < 1) {
            return c / 2 * Math.pow(2, 10 * (t - 1)) + b - c * 0.0005;
        }
        
        return c / 2 * 1.0005 * (-Math.pow(2, -10 * --t) + 2) + b;
    },
    
    easeOutInExpo: function (t, b, c, d) {
        if (t < d / 2) {
            return Jeeel.Dom.Style.Animation.Easing.easeOutExpo(t * 2, b, c / 2, d);
        }
        
        return Jeeel.Dom.Style.Animation.Easing.easeInExpo((t * 2) - d, b + c / 2, c / 2, d);
    },
    
    /**
     * y = -0.5(1 - x * x) + 1
     * 
     * @param {Integer} t 経過時間
     * @param {Number} b 初期値
     * @param {Number} c 変動値
     * @param {Integer} d 継続時間
     * @return {Number} 現在値
     */
    easeInCirc: function (t, b, c, d) {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },
    
    easeOutCirc: function (t, b, c, d) {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },
    
    easeInOutCirc: function (t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        }
        
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    },
    
    easeOutInCirc: function (t, b, c, d) {
        if (t < d / 2) {
            return Jeeel.Dom.Style.Animation.Easing.easeOutCirc(t * 2, b, c / 2, d);
        }
        
        return Jeeel.Dom.Style.Animation.Easing.easeInCirc((t * 2) - d, b + c / 2, c / 2, d);
    },
    
    easeInElastic: function (t, b, c, d, a, p) {
        var s;
        
        if (t === 0) {
            return b;  
        } else if ((t /= d) === 1) {
            return b + c;  
        } else if ( ! p) {
            p = d * 0.3;
        }
        
        if ( ! a || a < Math.abs(c)) { 
            a = c; 
            s = p / 4; 
        } else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }

        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    
    easeOutElastic: function (t, b, c, d, a, p) {
        var s;
        
        if (t === 0) {
            return b;  
        } else if ((t /= d) === 1) {
            return b + c;  
        } else if ( ! p) {
            p = d * 0.3;
        }
        
        if ( ! a || a < Math.abs(c)) {
            a = c;
            s = p / 4; 
        } else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        
        return(a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p ) + c + b);
    },
    
    easeInOutElastic: function (t, b, c, d, a, p) {
        var s;
        
        if (t === 0) {
            return b;  
        } else if ((t /= d / 2) === 2) {
            return b + c;  
        } else if ( ! p) {
            p = d * (0.3 * 1.5);
        }
        
        if ( ! a || a < Math.abs(c)) { 
            a = c; 
            s = p / 4; 
        } else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        
        if (t < 1) {
            return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        }
        
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
    },
    
    easeOutInElastic: function (t, b, c, d, a, p) {
        if (t < d / 2) {
            return Jeeel.Dom.Style.Animation.Easing.easeOutElastic(t * 2, b, c / 2, d, a, p);
        }
        
        return Jeeel.Dom.Style.Animation.Easing.easeInElastic((t * 2) - d, b + c / 2, c / 2, d, a, p);
    },
    
    /**
     * y = x * x * ( 2.70158 * x - 1.70158 )
     * 
     * @param {Integer} t 経過時間
     * @param {Number} b 初期値
     * @param {Number} c 変動値
     * @param {Integer} d 継続時間
     * @param {Number} [s] 反動などの強さ
     * @return {Number} 現在値
     */
    easeInBack: function (t, b, c, d, s) {
        if ( ! s) {
            s = 1.70158;
        }
        
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    
    easeOutBack: function (t, b, c, d, s) {
        if ( ! s) {
            s = 1.70158;
        }
        
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    
    easeInOutBack: function (t, b, c, d, s) {
        if ( ! s) {
            s = 1.70158;
        }
        
        if ((t /= d / 2) < 1) {
            return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
        }
        
        return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
    },
    
    easeOutInBack: function (t, b, c, d, s) {
        if (t < d / 2) {
            return Jeeel.Dom.Style.Animation.Easing.easeOutBack(t * 2, b, c / 2, d, s);
        }
        
        return Jeeel.Dom.Style.Animation.Easing.easeInBack((t * 2) - d, b + c / 2, c / 2, d, s);
    },
    
    easeInBounce: function (t, b, c, d) {
        return c - Jeeel.Dom.Style.Animation.Easing.easeOutBounce(d - t, 0, c, d) + b;
    },
    
    easeOutBounce: function (t, b, c, d) {
        if ((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b;
        } else if (t < (2 / 2.75)) {
            return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
        } else if (t < (2.5 / 2.75)) {
            return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
        } else {
            return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
        }
    },
    
    easeInOutBounce: function (t, b, c, d) {
        if (t < d / 2) {
            return Jeeel.Dom.Style.Animation.Easing.easeInBounce(t * 2, 0, c, d) * 0.5 + b;
        }
        
        return Jeeel.Dom.Style.Animation.Easing.easeOutBounce(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
    },
    
    easeOutInBounce: function (t, b, c, d) {
        if (t < d / 2) {
            return Jeeel.Dom.Style.Animation.Easing.easeOutBounce(t * 2, b, c / 2, d);
        }
        
        return Jeeel.Dom.Style.Animation.Easing.easeInBounce(t * 2 - d, b + c / 2, c / 2, d);
    }
};
