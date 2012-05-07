Jeeel.directory.Jeeel.Filter.Cast = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Filter + 'Cast/';
    }
};

/**
 * @namespace キャスト系のネームスペース
 */
Jeeel.Filter.Cast = {
    
};

Jeeel.file.Jeeel.Filter.Cast = ['Number', 'String'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Filter.Cast, Jeeel.file.Jeeel.Filter.Cast);
