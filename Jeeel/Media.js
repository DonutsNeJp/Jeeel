
Jeeel.directory.Jeeel.Media = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel + 'Media/';
    }
};

/**
 * メディア関連のネームスペース
 */
Jeeel.Media = {

};

Jeeel.file.Jeeel.Media = ['Abstract', 'Audio', 'Video'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Media, Jeeel.file.Jeeel.Media);
