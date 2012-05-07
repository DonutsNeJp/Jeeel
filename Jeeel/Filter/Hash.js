Jeeel.directory.Jeeel.Filter.Hash = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Filter + 'Hash/';
    }
};

/**
 * @namespace 配列・連想配列関連のフィルター管理ネームスペース
 */
Jeeel.Filter.Hash = {

};

Jeeel.file.Jeeel.Filter.Hash = ['Reduce', 'Bundle', 'Key', 'Flat', 'KeySpecify', 'Fill', 'Unique', 'Difference', 'CopyKey', 'DeleteKey'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Filter.Hash, Jeeel.file.Jeeel.Filter.Hash);
