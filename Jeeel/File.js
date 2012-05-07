Jeeel.directory.Jeeel.File = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel + 'File/';
    }
};

/**
 * @namespace ファイルに関するネームスペース
 */
Jeeel.File = {
  
    /**
     * 取得したファイルの数だけデータの作成を行う
     * 
     * @param {Element|FormData} fileOwner ファイル選択をしたfileタイプのinputタグかファイルドロップをしたFormData
     * @return {Jeeel.File.Data[]} 取得したファイルの数だけのデータリスト
     */
    createData: function (fileOwner) {
        if ( ! fileOwner.files) {
            throw new Error('fileOwnerがファイルを保持していません。');
        }
        
        var files = fileOwner.files;
        var res = [];
        
        for (var i = 0, l = files.length; i < l; i++) {
            res[i] = new this.Data(files[i]);
        }
        
        return res;
    }
};

Jeeel.file.Jeeel.File = ['Reader', 'Data'];

Jeeel._autoImports(Jeeel.directory.Jeeel.File, Jeeel.file.Jeeel.File);