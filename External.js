Jeeel.directory.Jeeel.External = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel + 'External/';
    }
};

/**
 * 外部との連携に関するネームスペース
 */
Jeeel.External = {

};

Jeeel.file.Jeeel.External = ['CallActionScript'];

Jeeel._autoImports(Jeeel.directory.Jeeel.External, Jeeel.file.Jeeel.External);
