Jeeel.directory.Jeeel.Object = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel + 'Object/';
    }
};

/**
 * @namespace 汎用オブジェクト関連のネームスペース
 */
Jeeel.Object = {

};

Jeeel.file.Jeeel.Object = ['Item', 'Point', 'Size', 'Rect', 'Color', 'Date', 'Font', 'Technical'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Object, Jeeel.file.Jeeel.Object);
