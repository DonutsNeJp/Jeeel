
/**
 * イベントフェーズの列挙体
 * 
 * @enum {Integer}
 */
Jeeel.Framework.Event.Phase = {
  
    /**
     * キャプチャ段階
     * 
     * @type Integer
     * @constant
     */
    CAPTURING: 1,
    
    /**
     * ターゲット段階
     * 
     * @type Integer
     * @constant
     */
    TARGETING: 2,
    
    /**
     * バブリング段階
     * 
     * @type Integer
     * @constant
     */
    BUBBLING: 3,
    
    /**
     * フォーリング段階
     * 
     * @type Integer
     * @constant
     */
    FALLING: 4
};