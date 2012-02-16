Jeeel.directory.Jeeel.Json = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel + 'Json/';
    }
};

/**
 * Json関連のモジュール
 */
Jeeel.Json = {

};

Jeeel.file.Jeeel.Json = ['Encode', 'Decode', 'IsJson'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Json, Jeeel.file.Jeeel.Json);
