
/**
 * コンストラクタ
 * 
 * @class プロファイル管理クラス
 */
Jeeel.Debug.Profiler.ProfileManager = function () {
    this._profiles = [];
};

Jeeel.Debug.Profiler.ProfileManager.prototype = {
  
    /**
     * 管理プロファイルリスト
     * 
     * @type Jeeel.Debug.Profiler.Profile[]
     * @private
     */
    _profiles: [],
    
    /**
     * 管理プロファイルの数
     * 
     * @type Integer
     * @private
     */
    _length: 0,
    
    /**
     * プロファイルの追加を行う
     * 
     * @param {Jeeel.Debug.Profiler.Profile} profile 追加プロファイル
     * @return {Jeeel.Debug.Profiler.ProfileManager} 自インスタンス
     */
    addProfile: function (profile) {
        this._profiles[this._length] = profile;
        this._length++;
        
        return this;
    },
    
    /**
     * 管理プロファイル数を取得する
     * 
     * @return {Integer} 管理プロファイル数
     */
    getProfileLength: function () {
        return this._length;
    },
    
    /**
     * 管理プロファイルを全て取得する
     * 
     * @return {Jeeel.Debug.Profiler.Profile[]} 管理プロファイル
     */
    getProfiles: function () {
        return this._profiles;
    },

    /**
     * 管理プロファイルの中から一番時間がかかっているプロファイルを取得する
     * 
     * @return {Jeeel.Debug.Profiler.Profile} 最遅のメソッドプロファイル
     */
    getBottleneckProfile: function () {
        if ( ! this._length) {
            return null;
        }
        
        var max = this._profiles[0].time,
            l = this._length,
            i = 1,
            j = 0;

        for (; i < l; i++) {
            if (max < this._profiles[i].time) {
                max = this._profiles[i].time;
                j = i;
            }
        }
        
        return this._profiles[j];
    },
    
    searchProfile: function (pattern) {
        var manager = new this.constructor();
        
        for (var i = 0; i < this._length; i++) {
          
            if (this._profiles[i].method.match(pattern)) {
                manager.addProfile(this._profiles[i]);
            }
        }
        
        return manager;
    },
    
    /**
     * 管理プロファイルを並び変える
     * 
     * @param {Function} [compareFunction] 比較関数 Boolean callback(Jeeel.Debug.Profiler.Profile a, Jeeel.Debug.Profiler.Profile b)
     * @return {Jeeel.Debug.Profiler.ProfileManager} 自インスタンス
     */
    sort: function (compareFunction) {
        this._profiles.sort(compareFunction || function (a, b) {
            return b.time - a.time;
        });
        
        return this;
    },
    
    constructor: Jeeel.Debug.Profiler.ProfileManager
};