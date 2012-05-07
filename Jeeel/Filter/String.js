Jeeel.directory.Jeeel.Filter.String = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Filter + 'String/';
    }
};

/**
 * @namespace 文字列関連のフィルター管理ネームスペース
 */
Jeeel.Filter.String = {

};

Jeeel.file.Jeeel.Filter.String = ['Split', 'Replace', 'RegularExpressionEscape'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Filter.String, Jeeel.file.Jeeel.Filter.String);
