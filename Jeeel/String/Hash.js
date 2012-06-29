Jeeel.directory.Jeeel.String.Hash = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.String + 'Hash/';
    }
};

/**
 * @namespace Hash関数関連のネームスペース
 */
Jeeel.String.Hash = {

};

/**
 * @private
 */
Jeeel._Object.JeeelStringHash = {
    
};

Jeeel.file.Jeeel.String.Hash = ['Base64', 'Md5'];

Jeeel._autoImports(Jeeel.directory.Jeeel.String.Hash, Jeeel.file.Jeeel.String.Hash);
