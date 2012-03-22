Jeeel.directory.Jeeel.Filter.Url = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Filter + 'Url/';
    }
};

/**
 * Url関連のフィルター管理ネームスペース
 */
Jeeel.Filter.Url = {

};

Jeeel.file.Jeeel.Filter.Url = ['Escape', 'QueryString', 'QueryParameter'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Filter.Url, Jeeel.file.Jeeel.Filter.Url);