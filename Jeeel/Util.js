Jeeel.directory.Jeeel.Util = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel + 'Util/';
    }
};

/**
 * @namespace ユーティル関連のネームスペース
 * @deprecated 今後削除される可能性あり
 */
Jeeel.Util = {

};

Jeeel.file.Jeeel.Util = ['Prefecture'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Util, Jeeel.file.Jeeel.Util);
