
/**
 * コンストラクタ
 * 
 * @class デバッグ用のタイマー(ストップウォッチ)を管理するクラス
 */
Jeeel.Debug.Timer = function () {
    this.reset();
};

/**
 * インスタンスの作成を行う
 * 
 * @return {Jeeel.Debug.Timer} 作成したインスタンス
 */
Jeeel.Debug.Timer.create = function () {
    return new this();
};

Jeeel.Debug.Timer.prototype = {
    
    /**
     * Timerを作る際のベースにする現時刻
     * 
     * @type Jeeel.Object.Date
     * @private
     */
    _date: null,
    
    /**
     * ラップタイムの記録
     * 
     * @type Hash
     * @private
     */
    _laps: {},
    
    /**
     * インターバルの記録
     * 
     * @type Hash
     * @private
     */
    _interval: {},
    
    /**
     * インターバルを最後に記録した際のタイム
     * 
     * @type Integer
     * @private
     */
    _lastTime: 0,
    
    /**
     * 現在動いているかどうか
     * 
     * @type Boolean
     */
    _active: true,
    
    /**
     * stopメソッドを呼び出した際の時間
     * 
     * @type Integer
     */
    _stopTime: 0,
    
    /**
     * タイマーをスタートする<br />
     * 作成時は既にスタート済み
     * 
     * @return {Jeeel.Debug.Timer} 自インスタンス
     */
    start: function () {
        if ( ! this._active) {
            this._date.setElapsedTime(this._stopTime);
            this._active = true;
        }

        return this;
    },
    
    /**
     * タイマーを一時停止する<br />
     * もう一度使いたい場合はstartメソッドを呼び出す
     * 
     * @return {Jeeel.Debug.Timer} 自インスタンス
     */
    stop: function () {
        this._active   = false;
        this._stopTime = this._date.getElapsedTime();
        
        return this;
    },
    
    /**
     * インスタンスを作成時の状態にリセットする
     * 
     * @return {Jeeel.Debug.Timer} 自インスタンス
     */
    reset: function () {

        this._laps = {};
        this._interval = {};
        this._lastTime = 0;
        this._stopTime = 0;
        this._date = Jeeel.Object.Date.create();
        this._active = true;
        
        return this;
    },
    
    /**
     * ラップタイムを記録する
     * 
     * @param {String} [key] 任意の記録キーを指定したい場合に引き渡す(デフォルトは現在の記録数)
     * @return {Jeeel.Debug.Timer} 自インスタンス
     */
    lap: function (key) {
        if ( ! this._active) {
            return this;
        }
        
        if ( ! key) {
            key = Jeeel.Hash.getCount(this._laps);
        }
        
        this._laps[key] = this._date.getElapsedTime();
        
        return this;
    },
    
    /**
     * ラップタイムの記録を返す
     * 
     * @param {String} key 読み込みたいラップのキー
     * @return {Integer} ラップタイム
     */
    loadLap: function (key) {
        return this._laps[key];
    },
    
    /**
     * ラップタイムの記録を全て返す
     * 
     * @return {Hash} ラップタイムとそのキーのペアリスト
     */
    loadAllLap: function () {
        return this._laps;
    },
    
    /**
     * ラップタイムの記録を全て破棄する
     * 
     * @return {Jeeel.Debug.Timer} 自インスタンス
     */
    clearLap: function () {
        this._laps = {};
        
        return this;
    },
    
    /**
     * インターバルを記録する
     * 
     * @param {String} [key] 任意の記録キーを指定したい場合に引き渡す(デフォルトは現在の記録数)
     * @return {Jeeel.Debug.Timer} 自インスタンス
     */
    interval: function (key) {
        if ( ! this._active) {
            return this;
        }
        
        if ( ! key) {
            key = Jeeel.Hash.getCount(this._interval);
        }
        
        var t = this._date.getElapsedTime();
        
        this._interval[key] = (this._interval[key] || 0) + t - this._lastTime;
        
        this._lastTime = t;
        
        return this;
    },
    
    /**
     * インターバルの記録を取得する
     * 
     * @param {String} key 読み込みたいインターバルのキー
     * @return {Integer} インターバル
     */
    loadInterval: function (key) {
        return this._interval[key];
    },
    
    /**
     * インターバルの記録を全て取得する
     * 
     * @return {Hash} インターバルとそのキーのペアリスト
     */
    loadAllInterval: function () {
        return this._interval;
    },
    
    /**
     * インターバルの記録を全破棄する
     * 
     * @return {Jeeel.Debug.Timer} 自インスタンス
     */
    clearInterval: function () {
        this._interval = {};
        this._lastTime = 0;
        
        return this;
    }
};
