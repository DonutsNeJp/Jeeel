
/**
 * コンストラクタ
 * 
 * @class ファイルデータの読み込み操作を提供するクラス
 * @param {Jeeel.File.Data} file ファイルデータ
 */
Jeeel.File.Reader = function (file) {
    this._file = file;
    this._reader = new FileReader();
    this._setEvents();
};

Jeeel.File.Reader.prototype = {
  
    /**
     * 読み込み元
     * 
     * @type Jeeel.File.Data
     * @private
     */
    _file: null,
    
    /**
     * 読み込みインスタンス
     * 
     * @type FileReader
     * @private
     */
    _reader: null,
    
    /**
     * 読み込み開始コールバック
     * 
     * @type Hash
     * @private
     */
    _loadStartMethod: null,
    
    /**
     * 読み込み処理完了コールバック
     * 
     * @type Hash
     * @private
     */
    _loadEndMethod: null,
    
    /**
     * 正常読み込み完了コールバック
     * 
     * @type Hash
     * @private
     */
    _loadMethod: null,

    /**
     * 読み込み作業中コールバック
     * 
     * @type Hash
     * @private
     */
    _progressMethod: null,
    
    /**
     * 読み込み中断コールバック
     * 
     * @type Hash
     * @private
     */
    _abortMethod: null,
    
    /**
     * エラーコールバック
     * 
     * @type Hash
     * @private
     */
    _errorMethod: null,
    
    /**
     * 読み込み開始メソッドの登録
     *
     * @param {Function} callBack 読み込み開始メソッド<br />
     *                             コールバックメソッドに渡される引数はEventとなる<br />
     *                             void callBack(ProgressEvent event)
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.File.Reader} 自身のインスタンス
     */
    setLoadStartMethod: function (callBack, thisArg) {
        this._loadStartMethod = {func: callBack, thisArg: thisArg};
        
        return this;
    },
    
    /**
     * 読み込み処理完了メソッドの登録
     *
     * @param {Function} callBack 読み込み処理完了メソッド<br />
     *                             コールバックメソッドに渡される引数はEventとなる<br />
     *                             void callBack(ProgressEvent event)
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.File.Reader} 自身のインスタンス
     */
    setLoadEndMethod: function (callBack, thisArg) {
        this._loadEndMethod = {func: callBack, thisArg: thisArg};
        
        return this;
    },
    
    /**
     * 正常読み込み完了メソッドの登録
     *
     * @param {Function} callBack 正常読み込み完了メソッド<br />
     *                             コールバックメソッドに渡される引数はEventとなる<br />
     *                             void callBack(ProgressEvent event)
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.File.Reader} 自身のインスタンス
     */
    setLoadMethod: function (callBack, thisArg) {
        this._loadMethod = {func: callBack, thisArg: thisArg};
        
        return this;
    },
    
    /**
     * 読み込み作業中メソッドの登録
     *
     * @param {Function} callBack 読み込み作業中メソッド<br />
     *                             コールバックメソッドに渡される引数はEventとなる<br />
     *                             void callBack(ProgressEvent event)
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.File.Reader} 自身のインスタンス
     */
    setProgressMethod: function (callBack, thisArg) {
        this._progressMethod = {func: callBack, thisArg: thisArg};
        
        return this;
    },
    
    /**
     * 読み込み中断メソッドの登録
     *
     * @param {Function} callBack 読み込み中断メソッド<br />
     *                             コールバックメソッドに渡される引数はEventとなる<br />
     *                             void callBack(ProgressEvent event)
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.File.Reader} 自身のインスタンス
     */
    setAbortMethod: function (callBack, thisArg) {
        this._abortMethod = {func: callBack, thisArg: thisArg};
        
        return this;
    },
    
    /**
     * エラーメソッドの登録
     *
     * @param {Function} callBack エラーメソッド<br />
     *                             コールバックメソッドに渡される引数はEventとなる<br />
     *                             void callBack(ProgressEvent event)
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.File.Reader} 自身のインスタンス
     */
    setErrorMethod: function (callBack, thisArg) {
        this._errorMethod = {func: callBack, thisArg: thisArg};
        
        return this;
    },
    
    /**
     * 読み込み結果を取得する
     * 
     * @return {ArrayBuffer|String} 読み込み結果
     */
    getResult: function () {
        return this._reader.result;
    },
    
    /**
     * 読み込みが完了しているかどうかを取得する
     * 
     * @return {Boolean} 読み込みが完了しているかどうか
     */
    isLoaded: function () {
        return this._reader.readyState === FileReader.DONE;
    },
    
    /**
     * 読み込中かどうかを取得する
     * 
     * @return {Boolean} 読み込中かどうか
     */
    isLoading: function () {
        return this._reader.readyState === FileReader.LOADING;
    },
    
    /**
     * ArrayBufferとして読み込みを行う
     * 
     * @return {Jeeel.File.Reader} 自インスタンス
     * @throws {Error} 読み込み中や読み込みが完了している場合に発生
     */
    readArrayBuffer: function () {
        this._errorConfirm();
        
        this._reader.readAsArrayBuffer(this._file.getFileData());
        
        return this;
    },
    
    /**
     * バイナリ文字列として読み込みを行う
     * 
     * @return {Jeeel.File.Reader} 自インスタンス
     * @throws {Error} 読み込み中や読み込みが完了している場合に発生
     */
    readBinaryString: function () {
        this._errorConfirm();
        
        this._reader.readAsBinaryString(this._file.getFileData());
        
        return this;
    },
    
    /**
     * テキストとして読み込みを行う
     * 
     * @param {String} [charCode] 明示的にキャラクターコードを設定する場合に指定(Jeeel.Code.CharEncoding参照)
     * @return {Jeeel.File.Reader} 自インスタンス
     * @throws {Error} 読み込み中や読み込みが完了している場合に発生
     */
    readText: function (charCode) {
        this._errorConfirm();
        
        this._reader.readAsText(this._file.getFileData(), charCode);
        
        return this;
    },
    
    /**
     * データのURLの読み込みを行う
     * 
     * @return {Jeeel.File.Reader} 自インスタンス
     * @throws {Error} 読み込み中や読み込みが完了している場合に発生
     */
    readDataUrl: function () {
        this._errorConfirm();
      
        this._reader.readAsDataURL(this._file.getFileData());
        
        return this;
    },
    
    /**
     * 読み込みを途中で中断する
     * 
     * @return {Jeeel.File.Reader} 自インスタンス
     */
    abort: function () {
        this._reader.abort();
      
        return this;
    },
    
    /**
     * 読み込み込んだ結果を全て破棄する
     * 
     * @return {Jeeel.File.Reader} 自インスタンス
     * @throws {Error} 読み込み中の場合に発生
     */
    reset: function () {
        if (this.isLoading()) {
            throw new Error('読み込み中にこのメソッドは呼び出せません。');
        }
        
        this._reader = new FileReader();
        this._setEvents();
        
        return this;
    },

    /**
     * 読み込みを始める前に呼び出しエラーを確認する
     * 
     * @throws {Error} 読み込み中や読み込みが完了している場合に発生
     */
    _errorConfirm: function () {
        if (this._reader.readyState !== FileReader.EMPTY) {
            throw new Error('読み込み中もしくは読み込み完了後にこのメソッドは呼び出せません。');
        }
    },
    
    /**
     * 初期イベントの設定を行う
     * 
     * @private
     */
    _setEvents: function () {
        var self = this;
        
        this._reader.onloadstart = function () {
            if (self._loadStartMethod) {
                self._loadStartMethod.func.apply(self._loadStartMethod.thisArg || self, arguments);
            }
        };
        
        this._reader.onloadend = function () {
            if (self._loadEndMethod) {
                self._loadEndMethod.func.apply(self._loadEndMethod.thisArg || self, arguments);
            }
        };
        
        this._reader.onload = function () {
            if (self._loadMethod) {
                self._loadMethod.func.apply(self._loadMethod.thisArg || self, arguments);
            }
        };
        
        this._reader.onprogress = function () {
            if (self._progressMethod) {
                self._progressMethod.func.apply(self._progressMethod.thisArg || self, arguments);
            }
        };
        
        this._reader.onabort = function () {
            if (self._abortMethod) {
                self._abortMethod.func.apply(self._abortMethod.thisArg || self, arguments);
            }
        };
        
        this._reader.onerror = function () {
            if (self._errorMethod) {
                self._errorMethod.func.apply(self._errorMethod.thisArg || self, arguments);
            }
        };
    }
};
