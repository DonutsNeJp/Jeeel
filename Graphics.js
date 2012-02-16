
Jeeel.directory.Jeeel.Graphics = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel + 'Graphics/';
    }
};

/**
 * グラフィックス関連のネームスペース
 */
Jeeel.Graphics = {

};

Jeeel.file.Jeeel.Graphics = ['Abstract', 'Pen', 'Brush', 'Raster', 'Vector'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Graphics, Jeeel.file.Jeeel.Graphics);
