Jeeel.directory.Jeeel.DataStructure = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel + 'DataStructure/';
    }
};

/**
 * @namespace データ構造関するネームスペース
 */
Jeeel.DataStructure = {
    
};

Jeeel.file.Jeeel.DataStructure = ['Stack', 'Queue', 'Deque', 'List', 'Tree'];

Jeeel._autoImports(Jeeel.directory.Jeeel.DataStructure, Jeeel.file.Jeeel.DataStructure);