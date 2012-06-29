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
 * @namespace Html関連のフィルター管理ネームスペース
 */
Jeeel.Filter.Html = {

};

Jeeel.file.Jeeel.Filter.Html = ['Form', 'FormValue', 'Hidden', 'HiddenString'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Filter.Html, Jeeel.file.Jeeel.Filter.Html);
