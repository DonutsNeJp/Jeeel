
Jeeel.directory.Jeeel.Code = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel + 'Code/';
    }
};

/**
 * @namespace コード関連のネームスペース
 */
Jeeel.Code = {

};

Jeeel.file.Jeeel.Code = ['CharCode', 'CharEncoding', 'HtmlCode'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Code, Jeeel.file.Jeeel.Code);
