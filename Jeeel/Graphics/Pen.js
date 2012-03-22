
/**
 * コンストラクタ
 * 
 * @class 線を描画する際の情報を管理するクラス
 */
Jeeel.Graphics.Pen = function () {
    this._color = Jeeel.Object.Color.createRgb(0, 0, 0);
};

Jeeel.Graphics.Pen.prototype = {
    
    /**
     * 線の幅
     * 
     * @type Number
     * @private
     */
    _width: 1,
    
    /**
     * 線の色
     * 
     * @type Jeeel.Object.Color
     * @private
     */
    _color: null,
    
    /**
     * キャップのスタイル
     * 
     * @type String
     * @private
     */
    _cap: 'butt',
    
    /**
     * 接続スタイル
     * 
     * @type String
     * @private
     */
    _join: 'miter',
    
    /**
     * マイター限界比率
     * 
     * @type Number
     * @private
     */
    _miterLimit: 10,
    
    /**
     * 更新時自動コールバック
     * 
     * @type Function
     * @private
     */
    _callback: null,
    
    /**
     * ペン幅を取得する
     * 
     * @return {Number} ペン幅
     */
    getWidth: function () {
        return this._width;
    },
    
    /**
     * ペン幅を設定する
     * 
     * @param {Number} width ペン幅
     * @return {Jeeel.Graphics.Pen} 自インスタンス
     */
    setWidth: function (width) {
        this._width = +width;
        
        return this.refresh(1);
    },
    
    /**
     * ペンの色を取得する
     * 
     * @return {Jeeel.Object.Color} ペンの色
     */
    getColor: function () {
        return this._color;
    },
    
    /**
     * ペンの色を設定する
     * 
     * @param {Jeeel.Object.Color} color ペンの色
     * @return {Jeeel.Graphics.Pen} 自インスタンス
     */
    setColor: function (color) {
        this._color = color;
        
        return this.refresh(2);
    },
    
    /**
     * ペンのキャップスタイルを取得する
     * 
     * @return {String} キャップスタイル
     */
    getCapStyle: function () {
        return this._cap;
    },
    
    /**
     * ペンのキャップスタイルを設定する
     * 
     * @param {String} capStyle キャップスタイル
     * @return {Jeeel.Graphics.Pen} 自インスタンス
     */
    setCapStyle: function (capStyle) {
        this._cap = capStyle;
        
        return this.refresh(3);
    },
    
    /**
     * ペンの線接続スタイルを取得する
     * 
     * @return {String} 接続スタイル
     */
    getJoinStyle: function () {
        return this._join;
    },
    
    /**
     * ペンの線接続スタイルを設定する
     * 
     * @param {String} join 接続スタイル
     * @return {Jeeel.Graphics.Pen} 自インスタンス
     */
    setJoinStyle: function (join) {
        this._join = join;
        
        return this.refresh(4);
    },
    
    /**
     * ペンのマイター限界比率を取得する
     * 
     * @return {Number} マイター限界比率
     */
    getMiterLimit: function () {
        return this._miterLimit;
    },
    
    /**
     * ペンのマイター限界比率を設定する
     * 
     * @param {Number} miterLimit マイター限界比率
     * @return {Jeeel.Graphics.Pen} 自インスタンス
     */
    setMiterLimit: function (miterLimit) {
        this._miterLimit = +miterLimit;
        
        return this.refresh(5);
    },
    
    /**
     * 更新を行った際に呼び出すコールバックを設定する
     * 
     * @param {Function} callback コールバック
     * @return {Jeeel.Graphics.Pen} 自インスタンス
     */
    setRefreshCallback: function (callback) {
        this._callback = callback;
        
        return this;
    },
    
    /**
     * 更新を行いコールバックを呼び出す
     * 
     * @param {Integer} [type] 更新タイプ
     * @return {Jeeel.Graphics.Pen} 自インスタンス
     */
    refresh: function (type) {
        if (this._callback) {
            this._callback(this, type || 0);
        }
        
        return this;
    }
};