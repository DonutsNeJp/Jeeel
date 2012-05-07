Jeeel.directory.Jeeel.Gui.Tree.Node.File = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Gui.Tree.Node + 'File/';
    }
};

/**
 * コンストラクタ
 * 
 * @class ファイルを示すノード
 * @param {String} fileName ファイル名
 * @param {Mixed} data ファイルデータ
 * @param {String} [fileType] ファイルの種類(拡張子や種類の名前)
 */
Jeeel.Gui.Tree.Node.File = function (fileName, data, fileType) {
    Jeeel.Gui.Tree.Node.call(this, fileName, this._getFile(fileType), data);
};

/**
 * インスタンスの作成を行う
 * 
 * @param {String} fileName ファイル名
 * @param {Mixed} data ファイルデータ
 * @param {String} [fileType] ファイルの種類(拡張子や種類の名前)
 * @return {Jeeel.Gui.Tree.Node.File} 作成したインスタンス
 */
Jeeel.Gui.Tree.Node.File.create = function (fileName, data, fileType) {
    return new this(fileName, data, fileType);
};

Jeeel.Gui.Tree.Node.File.prototype = {
    
    /**
     * 子要素の追加は出来ない
     * 
     * @param {Jeeel.Gui.Tree.Node} node 追加要素
     * @return {Jeeel.Gui.Tree.Node.File} 自インスタンス
     */
    appendChild: function (node) {
        return this;
    },
    
    _getFile: function (fileType) {
      
        switch (fileType) {
            
            case 'TEXT/PLAIN':
            case 'TEXT':
            case 'TXT':
                fileType = 'large/txt.gif';
                break;
            
            case 'text/plain':
            case 'text':
            case 'txt':
                fileType = 'small/txt.gif';
                break;
                
            case 'TEXT/CSV':
            case 'CSV':
                fileType = 'large/csv.gif';
                break;

            case 'text/csv':
            case 'csv':
                fileType = 'small/csv.gif';
                break;
                
            case 'TEXT/HTML':
            case 'HTML':
                fileType = 'large/html.gif';
                break;

            case 'text/html':
            case 'html':
                fileType = 'small/html.gif';
                break;
                
            case 'TEXT/XML':
            case 'APPLICATION/XML':
            case 'XML':
                fileType = 'large/xml.gif';
                break;

            case 'text/xml':
            case 'application/xml':
            case 'xml':
                fileType = 'small/xml.gif';
                break;
                
            case 'TEXT/CSS':
            case 'STYLE SHEET':
            case 'CSS':
                fileType = 'large/css.gif';
                break;

            case 'text/css':
            case 'style sheet':
            case 'css':
                fileType = 'small/css.gif';
                break;
                
            case 'TEXT/JAVASCRIPT':
            case 'APPLICATION/JAVASCRIPT':
            case 'JAVASCRIPT':
            case 'JS':
                fileType = 'large/js.gif';
                break;

            case 'text/javascript':
            case 'application/javascript':
            case 'javascript':
            case 'js':
                fileType = 'small/js.gif';
                break;
            
            case 'IMAGE/JPEG':
            case 'JPEG':
            case 'JPG':
                fileType = 'large/jpg.gif';
                break;
                
            case 'image/jpeg':
            case 'jpeg':
            case 'jpg':
                fileType = 'small/jpg.gif';
                break;
                
            case 'IMAGE/GIF':
            case 'GIF':
                fileType = 'large/gif.gif';
                break;
                
            case 'image/gif':
            case 'gif':
                fileType = 'small/gif.gif';
                break;
                
            case 'IMAGE/PNG':
            case 'PNG':
                fileType = 'large/png.gif';
                break;
                
            case 'image/png':
            case 'png':
                fileType = 'small/png.gif';
                break;
            
            case 'IMAGE/BMP':
            case 'BITMAP':
            case 'BMP':
                fileType = 'large/bmp.gif';
                break;
            
            case 'image/bmp':
            case 'bitmap':
            case 'bmp':
                fileType = 'small/bmp.gif';
                break;

            case 'AUDIO/MP3':
            case 'MP3':
                fileType = 'large/mp3.gif';
                break;

            case 'audio/mp3':
            case 'mp3':
                fileType = 'small/mp3.gif';
                break;
            
            case 'APPLICATION/X-MIDI':
            case 'MIDI':
            case 'MID':
                fileType = 'large/mid.gif';
                break;

            case 'application/x-midi':
            case 'midi':
            case 'mid':
                fileType = 'small/mid.gif';
                break;
                
            case 'AUDIO/OGG':
            case 'OGG':
                fileType = 'large/ogg.gif';
                break;

            case 'audio/ogg':
            case 'ogg':
                fileType = 'small/ogg.gif';
                break;
                
            case 'AUDIO/WAV':
            case 'WAVE':
            case 'WAV':
                fileType = 'large/wav.gif';
                break;

            case 'audio/wav':
            case 'wave':
            case 'wav':
                fileType = 'small/wav.gif';
                break;
                
            case 'APPLICATION/ZIP':
            case 'ZIP':
                fileType = 'large/zip.gif';
                break;

            case 'application/zip':
            case 'zip':
                fileType = 'small/zip.gif';
                break;
                
            case 'APPLICATION/LHA':
            case 'LZH':
                fileType = 'large/lzh.gif';
                break;

            case 'application/lha':
            case 'lzh':
                fileType = 'small/lzh.gif';
                break;

            default:
                fileType = ((fileType || '').toString().match(/^[a-z\/ ]+$/) ? 'small' : 'large')
                         + '/unknown.gif';
                break;
        }
        
        return Jeeel.directory.Jeeel.Gui.Tree.Node.File
             + 'images/'
             + fileType;
    }
};

Jeeel.Class.extend(Jeeel.Gui.Tree.Node.File, Jeeel.Gui.Tree.Node);