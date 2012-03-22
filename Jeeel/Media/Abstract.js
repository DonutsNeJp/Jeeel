
/**
 * コンストラクタ
 * 
 * @abstractClass メディア系の抽象クラス
 * @param {HTMLMediaElement} media 基となるメディア要素
 */
Jeeel.Media.Abstract = function (media) {
    if (media) {
        this._media = media;
    }
};

Jeeel.Media.Abstract.prototype = {
  
    /**
     * 基となるメディア要素
     * 
     * @type HTMLMediaElement
     * @private
     */
    _media: null,
    
    /**
     * 内部メディアを取得する
     * 
     * @return {HTMLMediaElement} メディア
     */
    getMedia: function () {
        return this._media;
    },
    
    /**
     * メディアを再生する
     * 
     * @return {Jeeel.Media.Abstract} 自インスタンス
     */
    play: function () {
        this._media.play();
        
        return this;
    },
    
    /**
     * メディアを停止する
     * 
     * @return {Jeeel.Media.Abstract} 自インスタンス
     */
    pause: function () {
        this._media.pause();
        
        return this;
    },
    
    /**
     * メディアの再生位置を変更する
     * 
     * @param {Number} time 再生位置(秒)
     * @return {Jeeel.Media.Abstract} 自インスタンス
     */
    seek: function (time) {
        if (isNaN(this._media.duration)) {
            throw new Error('メディアが読み込まれていません。');
        }
        
        time = +time;
        
        if (time > this._media.duration) {
            time = this._media.duration;
        }
        
        this._media.currentTime = time;
        
        return this;
    },
    
    /**
     * 連続再生の設定を行う
     * 
     * @param {Boolean} enable 連続再生を有効にするかどうか
     * @return {Jeeel.Media.Abstract} 自インスタンス
     */
    enableLoop: function (enable) {
        this._media.loop = !!enable;
        
        return this;
    },
    
    /**
     * シークの設定を行う
     * 
     * @param {Boolean} enable ユーザーがシークを行えるかどうか
     * @return {Jeeel.Media.Abstract} 自インスタンス
     */
    enableSeek: function (enable) {
        this._media.seekable = !!enable;
        
        return this;
    },
    
    /**
     * メディアコントロールのUIの設定を行う
     * 
     * @param {Boolean} enable UIを表示するかどうか
     * @return {Jeeel.Media.Abstract} 自インスタンス
     */
    enableControl: function (enable) {
        this._media.controls = !!enable;
        
        return this;
    },
    
    /**
     * ミュートの設定を行う
     * 
     * @param {Boolean} enable ミュートにするかどうか
     * @return {Jeeel.Media.Abstract} 自インスタンス
     */
    enableMute: function (enable) {
        this._media.muted = !!enable;
        
        return this;
    },
    
    /**
     * ボリュームを取得する
     * 
     * @return {Number} ボリューム(0.0～1.0)
     */
    getVolume: function () {
        return this._media.volume;
    },
    
    /**
     * ボリュームを設定する
     * 
     * @param {Number} volume ボリューム(0.0～1.0)
     * @return {Jeeel.Media.Abstract} 自インスタンス
     */
    setVolume: function (volume) {
        this._media.volume = volume;
        
        return this;
    },
    
    /**
     * 現在ユーザーがシーク動作を行っているかどうかを返す
     * 
     * @return {Boolean} シークを行っているかどうか
     */
    seeking: function () {
        return this._media.seeking;
    },
    
    /**
     * 指定したメディアソースのタイプが再生可能かどうかを返す
     * 
     * @param {String} type メディアソースタイプ
     * @return {Boolean} 再生可能かどうか
     */
    canPlayType: function (type) {
        return "" != this._media.canPlayType(type);
    },
    
    /**
     * メディアの読み込みを行う
     * 
     * @param {String} mediaUrl メディアのURL
     * @return {Jeeel.Media.Abstract} 自インスタンス
     */
    load: function (mediaUrl) {
        this._media.load(mediaUrl);
        
        return this;
    },
    
    /**
     * メディアの再読み込みを行う<br />
     * 読み込みを行うのは元々のメディアである
     * 
     * @return {Jeeel.Media.Abstract} 自インスタンス
     */
    reload: function () {
        return this.load(this._media.src);
    }
};
