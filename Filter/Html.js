Jeeel.directory.Jeeel.Filter.Html = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Filter + 'Html/';
    }
};

/**
 * Html関連のフィルター管理ネームスペース
 */
Jeeel.Filter.Html = {

};

Jeeel.file.Jeeel.Filter.Html = ['Escape', 'Unescape', 'Form', 'FormValue', 'Hidden', 'HiddenString', 'ElementTagBundle', 'ElementAttributeReduce'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Filter.Html, Jeeel.file.Jeeel.Filter.Html);
