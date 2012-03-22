
/**
 * コンストラクタ
 * 
 * @class プロファイル結果を保持するクラス
 * @param {String} methodName メソッド名
 * @param {Number} [time] メソッドの実行に掛かった時間
 */
Jeeel.Debug.Profiler.Profile = function (methodName, time) {
    var self = this;
    
    self.method = methodName;
    self.time = time || 0;
    self.calls = [];
};

Jeeel.Debug.Profiler.Profile.prototype = {
    /**
     * メソッド名
     * 
     * @type String
     */
    method: '',
    
    /**
     * このメソッドに処理に掛かった時間(ミリ秒)
     * 
     * @type Number
     */
    time: 0,
    
    /**
     * メソッド内で呼び出しを行ったメソッドのリスト
     * 
     * @type Jeeel.Debug.Profiler.Profile[]
     */
    calls: [],
    
    /**
     * このメソッド内で一番時間が掛かっているものを取得する
     * 
     * @param {Boolean} [deepGet] 再帰的に内部メソッドのボトルネックを取得するかどうか
     * @return {Jeeel.Debug.Profiler.Profile} 取得したプロファイル
     */
    getBottleneck: function (deepGet) {
        if ( ! this.calls.length) {
            return this;
        }
        
        var max = this.calls[0].time,
            l = this.calls.length,
            i = 1,
            j = 0;

        for (; i < l; i++) {
            if (max < this.calls[i].time) {
                max = this.calls[i].time;
                j = i;
            }
        }
        
        if (deepGet) {
            return this.calls[j].getBottleneck(deepGet);
        }
        
        return this.calls[j];
    },
    
    /**
     * このメソッド名を取得する
     * 
     * @return {String} メソッド名
     */
    toString: function () {
        return this.method;
    },
    
    /**
     * このメソッドに掛かった時間を取得する
     * 
     * @return {Integer} 掛かった時間
     */
    valueOf: function () {
        return this.time;
    },
    
    /**
     * コンストラクタ
     * 
     * @constructor
     */
    constructor: Jeeel.Debug.Profiler.Profile
};