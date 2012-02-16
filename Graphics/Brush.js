
/**
 * コンストラクタ
 * 
 * @class 面を塗りつぶす際の情報を管理するクラス
 */
Jeeel.Graphics.Brush = function () {
    this._color = Jeeel.Object.Color.createRgb(0, 0, 0);
};

Jeeel.Graphics.Brush.prototype = {
    
    /**
     * 塗りつぶしの色
     * 
     * @type Jeeel.Object.Color
     * @private
     */
    _color: null,
    
    /**
     * 更新時自動コールバック
     * 
     * @type Function
     * @private
     */
    _callback: null,
    
    /**
     * ブラシの色を取得する
     * 
     * @return {Jeeel.Object.Color} ブラシの色
     */
    getColor: function () {
        return this._color;
    },
    
    /**
     * ブラシの色を設定する
     * 
     * @param {Jeeel.Object.Color} color ブラシの色
     * @return {Jeeel.Graphics.Brush} 自インスタンス
     */
    setColor: function (color) {
        this._color = color;
        
        return this.refresh(1);
    },
    
    /**
     * 更新を行った際に呼び出すコールバックを設定する
     * 
     * @param {Function} callback コールバック
     * @return {Jeeel.Graphics.Brush} 自インスタンス
     */
    setRefreshCallback: function (callback) {
        this._callback = callback;
        
        return this;
    },
    
    /**
     * 更新を行いコールバックを呼び出す
     * 
     * @param {Integer} [type] 更新タイプ
     * @return {Jeeel.Graphics.Brush} 自インスタンス
     */
    refresh: function (type) {
        if (this._callback) {
            this._callback(this, type || 0);
        }
        
        return this;
    }
};