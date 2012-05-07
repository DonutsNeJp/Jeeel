
Jeeel.directory.Jeeel.Database = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel + 'Database/';
    }
};

/**
 * @namespace データベースに関連する機能を保有するネームスペース
 */
Jeeel.Database = {

};

Jeeel.file.Jeeel.Database = ['Relation', 'Index'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Database, Jeeel.file.Jeeel.Database);
