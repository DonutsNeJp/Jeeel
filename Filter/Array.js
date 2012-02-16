Jeeel.directory.Jeeel.Filter.Array = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Filter + 'Array/';
    }
};

/**
 * 配列・連想配列関連のフィルター管理ネームスペース
 */
Jeeel.Filter.Array = {

};

Jeeel.file.Jeeel.Filter.Array = ['Reduce', 'Bundle', 'Key', 'Flat', 'KeySpecify', 'Fill', 'Unique', 'Difference'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Filter.Array, Jeeel.file.Jeeel.Filter.Array);
