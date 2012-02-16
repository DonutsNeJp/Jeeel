
/**
 * コンストラクタ
 * 
 * @class ビデオを扱うクラス
 * @augments Jeeel.Media.Abstract
 * @param {Video} video 基となるビデオ要素
 */
Jeeel.Media.Video = function (video) {
    Jeeel.Media.Abstract.call(this, video);
};

/**
 * インスタンスの作成を行う
 * 
 * @param {Video} video 基となるビデオ要素
 * @return {Jeeel.Media.Video} 作成したインスタンス
 */
Jeeel.Media.Video.create = function (video) {
    return new this(video);
};

Jeeel.Media.Video.prototype = {
  
    /**
     * 動画の幅を取得する
     * 
     * @return {Number} 幅(初期値は0)
     */
    getWidth: function () {
        return this._media.width;
    },
    
    /**
     * 動画の幅を設定する
     * 
     * @param {Number} width 幅
     * @return {Jeeel.Media.Video} 自インスタンス
     */
    setWidth: function (width) {
        this._media.width = width;
        
        return this;
    },
    
    /**
     * 動画の高さを取得する
     * 
     * @return {Number} 高さ(初期値は0)
     */
    getHeight: function () {
        return this._media.height;
    },
    
    /**
     * 動画の高さを設定する
     * 
     * @param {Number} height 高さ
     * @return {Jeeel.Media.Video} 自インスタンス
     */
    setHeight: function (height) {
        this._media.height = height;
        
        return this;
    },
    
    /**
     * 動画のサイズを取得する
     * 
     * @return {Jeeel.Object.Size} サイズ
     */
    getSize: function () {
        return new Jeeel.Object.Size(this._media.width, this._media.height);
    },
    
    /**
     * 動画の元の幅を取得する
     * 
     * @return {Number} 幅
     */
    getVideoWidth: function () {
        return this._media.videoWidth;
    },
    
    /**
     * 動画の元の高さを取得する
     * 
     * @return {Number} 高さ
     */
    getVideoHeight: function () {
        return this._media.videoHeight;
    },
    
    /**
     * 動画の元のサイズを取得する
     * 
     * @return {Jeeel.Object.Size} サイズ
     */
    getVideoSize: function () {
        return new Jeeel.Object.Size(this._media.videoWidth, this._media.videoHeight);
    },
    
    /**
     * 再生可能な動画がなかった場合の静止画のURLを取得する
     * 
     * @return {String} 静止画URL
     */
    getPoster: function () {
        return this._media.poster;
    },
    
    /**
     * 再生可能な動画がなかった場合の静止画のURLを設定する
     * 
     * @param {String} url 静止画URL
     * @return {Jeeel.Media.Video} 自インスタンス
     */
    setPoster: function (url) {
        this._media.poster = url;
        
        return this;
    }
};

Jeeel.Class.extend(Jeeel.Media.Video, Jeeel.Media.Abstract);
