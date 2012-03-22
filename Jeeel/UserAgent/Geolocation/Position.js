
/**
 * コンストラクタ
 * 
 * @class 位置情報を保持するクラス
 * @param {Geoposition} position 基となる位置情報
 */
Jeeel.UserAgent.Geolocation.Position = function (position) {
    this._position = position;
    this._timestamp = Jeeel.Object.Date.create(position.timestamp);
};

Jeeel.UserAgent.Geolocation.Position.prototype = {
  
    /**
     * 基となる位置情報
     * 
     * @type Geoposition
     * @private
     */
    _position: null,
    
    /**
     * 位置情報を取得した時刻
     * 
     * @type Jeeel.Object.Date
     * @private
     */
    _timestamp: null,
    
    /**
     * 経度を取得する
     * 
     * @return {Number} 経度
     */
    getLatitude: function () {
        return this._position.latitude;
    },
    
    /**
     * 緯度を取得する
     * 
     * @return {Number} 緯度
     */
    getLongitude: function () {
        return this._position.longitude;
    },
    
    /**
     * 標高を取得する
     * 
     * @return {Number} 標高
     */
    getAltitude: function () {
        return this._position.altitude;
    },
    
    /**
     * 経度・緯度の正確さを取得する
     * 
     * @return {Number} 正確さ
     */
    getAccuracy: function () {
        return this._position.accuracy;
    },
    
    /**
     * 標高の正確さを取得する
     * 
     * @return {Number} 正確さ
     */
    getAltitudeAccuracy: function () {
        return this._position.altitudeAccuracy;
    },
    
    /**
     * デバイスの進行方向を取得する
     * 
     * @return {Number} 進行方向
     */
    getHeading: function () {
        return this._position.heading;
    },
    
    /**
     * デバイスの進行速度を取得する
     * 
     * @return {Number} 進行速度
     */
    getSpeed: function () {
        return this._position.speed;
    },
    
    /**
     * 位置情報が取得された時刻を示すインスタンスを返す
     * 
     * @return {Jeeel.Object.Date} 位置情報の取得時刻を示すインスタンス
     */
    getTimestamp: function () {
        return this._timestamp;
    }
};

