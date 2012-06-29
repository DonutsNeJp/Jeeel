
/**
 * @class スピードに関するクラス
 * @static
 */
Jeeel.Dom.Style.Animation.Speed = {
    
    getSpeed: function (duration) {
      
        // 数値で且正の値だった場合はそのまま返す
        if (duration > 0) {
            return duration;
        }
        
        duration = ('' + duration).toUpperCase();
        
        return (duration in this.SPEEDS ? this.SPEEDS[duration] : this.SPEEDS.DEFAULT);
    }
};

/**
 * @namespace 規定の速度を示す列挙体
 */
Jeeel.Dom.Style.Animation.Speed.SPEEDS = {
    /**
     * 遅い
     * 
     * @type Integer
     * @constant
     */
    SLOW: 600,
    
    /**
     * 早い
     * 
     * @type Integer
     * @constant
     */
    FAST: 200,
    
    /**
     * デフォルト
     * 
     * @type Integer
     * @constant
     */
    DEFAULT: 400
};
