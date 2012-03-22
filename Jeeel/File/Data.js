
/**
 * コンストラクタ
 * 
 * @class ファイルデータを管理するクラス
 * @param {File} fileData 読み込み元のファイルデータ
 */
Jeeel.File.Data = function (fileData) {
    this._file = fileData;
};

Jeeel.File.Data.prototype = {
  
    /**
     * 読み込み元のファイルデータ
     * 
     * @type File
     * @private
     */
    _file: null,
    
    /**
     * 読み込み元のファイルデータを取得する
     * 
     * @return {File} 読み込み元のファイルデータ
     */
    getFileData: function () {
        return this._file;
    },

    /**
     * ファイルの名前を取得する
     * 
     * @return {String} ファイル名
     */
    getFileName: function () {
        return this._file.fileName;
    },
    
    /**
     * ファイルのサイズを取得する
     * 
     * @return {Integer} ファイルサイズ
     */
    getFileSize: function () {
        return this._file.fileSize;
    },
    
    /**
     * ファイルの種類を取得する
     * 
     * @return {String} ファイル種類
     */
    getFileType: function () {
        return this._file.type;
    },
    
    /**
     * ファイルの最終更新時間を取得する
     * 
     * @return {Jeeel.Object.Date} 最終更新時間
     */
    getLastModifiedDate: function () {
        return Jeeel.Object.Date.create(this._file.lastModifiedDate);
    },
    
    /**
     * 現在のインスタンスを読み込むためのインスタンスを取得する
     * 
     * @return {Jeeel.File.Reader} 読み込みインスタンス
     */
    getReader: function () {
        return new Jeeel.File.Reader(this);
    }
};
