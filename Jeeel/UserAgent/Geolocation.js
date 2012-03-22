Jeeel.directory.Jeeel.UserAgent.Geolocation = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.UserAgent + 'Geolocation/';
    }
};

/**
 * コンストラクタ
 * 
 * @class 位置情報について操作するクラス
 */
Jeeel.UserAgent.Geolocation = function () {
};

/**
 * インスタンスの作成を行う
 * 
 * @return {Jeeel.UserAgent.Geolocation} 作成したインスタンス
 */
Jeeel.UserAgent.Geolocation.create = function () {
    return new this();
};
    
Jeeel.UserAgent.Geolocation.prototype = {
  
    /**
     * 成功コールバック
     * 
     * @type Hash
     * @private
     */
    _successMethod: null,
    
    /**
     * エラーコールバック
     * 
     * @type Hash
     * @private
     */
    _errorMethod: null,
    
    /**
     * 取得する情報の正確性
     * 
     * @type Boolean
     * @private
     */
    _enableHighAccuracy: false,
    
    /**
     * 接続タイムアウト
     * 
     * @type Integer
     * @private
     */
    _timeout: null,
    
    /**
     * キャッシュの有効期限
     * 
     * @type Integer
     * @private
     */
    _maximumAge: null,
    
    /**
     * 位置情報監視ID
     * 
     * @type Integer
     * @private
     */
    _watchId: null,
    
    /**
     * 最後に取得した位置情報
     * 
     * @type Jeeel.UserAgent.Geolocation.Position
     * @private
     */
    _lastPosition: null,
    
    /**
     * 成功メソッドの登録
     *
     * @param {Function} callBack 成功メソッド<br />
     *                             コールバックメソッドに渡される引数は位置情報となる<br />
     *                             void callBack(Jeeel.UserAgent.Geolocation.Position position)
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.UserAgent.Geolocation} 自身のインスタンス
     */
    setSuccessMethod: function (callBack, thisArg) {
        this._successMethod = {func: callBack, thisArg: thisArg};
        
        return this;
    },
    
    /**
     * 例外メソッドの登録
     *
     * @param {Function} callBack 例外メソッド<br />
     *                             コールバックメソッドに渡される引数はエラーとなる<br />
     *                             void callBack(Error error)
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.UserAgent.Geolocation} 自身のインスタンス
     */
    setErrorMethod: function (callBack, thisArg) {
        this._errorMethod = {func: callBack, thisArg: thisArg};
        
        return this;
    },
       
    /**
     * 取得に掛かる時間の制限を設けタイムアウトの設定をする
     * 
     * @param {Integer} timeout タイムアウトの時間(ミリ秒)
     * @return {Jeeel.UserAgent.Geolocation} 自身のインスタンス
     */
    setTimeout: function (timeout) {
        this._timeout = timeout;
        
        return this;
    },
    
    /**
     * キャッシュの有効期限
     * 
     * @param {Integer} maximumAge キャッシュが破棄されるまでの時間(ミリ秒)
     * @return {Jeeel.UserAgent.Geolocation} 自身のインスタンス
     */
    setMaximumAge: function (maximumAge) {
        this._maximumAge = maximumAge;
        
        return this;
    },
    
    /**
     * 正確性の高い位置情報を要求するかどうかを設定する
     * 
     * @param {Booleans} enable 正確な情報を要求するかどうか
     * @return {Jeeel.UserAgent.Geolocation} 自身のインスタンス
     */
    enableHighAccuracy: function (enable) {
        this._enableHighAccuracy = !!enable;
        
        return this;
    },
    
    /**
     * 最後の取得した位置情報を取得する<br />
     * なお成功メソッドが呼び出された後に更新が行われる
     * 
     * @return {Jeeel.UserAgent.Geolocation.Position} 位置情報を示すインスタンス
     */
    getLastPosition: function () {
        return this._lastPosition;
    },
    
    /**
     * 現在の位置情報を取得する
     * 
     * @return {Jeeel.UserAgent.Geolocation} 自身のインスタンス
     */
    getCurrentPosition: function () {
        if (this._watchId) {
            throw new Error('このインスタンスは位置情報の監視を行っています。\n監視中はこのメソッドを使用できません。');
        }
        
        var self = this;

        navigator.geolocation.getCurrentPosition(
            function (pos) {
                pos = new Jeeel.UserAgent.Geolocation.Position(pos);
                
                if (self._successMethod) {
                    self._callMethod('_successMethod', pos);
                }
                
                self._lastPosition = pos;
            },
            function (error) {
                if (self._errorMethod) {
                    self._callMethod('_errorMethod', error);
                } else {
                    Jeeel.errorHtmlDump('Error', error.name, error.fileName + '(' + error.lineNumber + ')', error.message);
                }
            },
            this._getOption()
        );
          
        return this;
    },
    
    /**
     * 位置情報の監視を行う
     * 
     * @return {Jeeel.UserAgent.Geolocation} 自身のインスタンス
     */
    watchPosition: function () {
        if (this._watchId) {
            throw new Error('既に位置情報の監視を行っています。位置情報の監視は1つまでです。');
        }
        
        var self = this;
        
        this._watchId = navigator.geolocation.watchPosition(
            function (pos) {
                pos = new Jeeel.UserAgent.Geolocation.Position(pos);
                
                if (self._successMethod) {
                    self._callMethod('_successMethod', pos);
                }
                
                self._lastPosition = pos;
            },
            function (error) {
                if (self._errorMethod) {
                    self._callMethod('_errorMethod', error);
                } else {
                    Jeeel.errorHtmlDump('Error', error.name, error.fileName + '(' + error.lineNumber + ')', error.message);
                }
            },
            this._getOption()
        );
          
        return this;
    },
    
    /**
     * 位置情報の監視を破棄する
     * 
     * @return {Jeeel.UserAgent.Geolocation} 自身のインスタンス
     */
    clearWatch: function () {
        if ( ! this._watchId) {
            throw new Error('このインスタンスで位置情報の監視は行っていません。');
        }
        
        navigator.geolocation.clearWatch(this._watchId);
        
        this._watchId = null;
        
        return this;
    },
    
    /**
     * オプションを作成して返す
     * 
     * @return {Hash} オプション
     * @private
     */
    _getOption: function () {
        var option = {
            enableHighAccuracy: this._enableHighAccuracy
        };
        
        if (Jeeel.Type.isInteger(this._timeout)) {
            option.timeout = this._timeout;
        }
        
        if (Jeeel.Type.isInteger(this._maximumAge)) {
            option.timeout = this._maximumAge;
        }
        
        return option;
    },
    
    _callMethod: function (name, arg) {
        this[name].func.call(this[name].thisArg || this, arg);
    }
};

Jeeel.file.Jeeel.UserAgent.Geolocation = ['Position'];

Jeeel._autoImports(Jeeel.directory.Jeeel.UserAgent.Geolocation, Jeeel.file.Jeeel.UserAgent.Geolocation);