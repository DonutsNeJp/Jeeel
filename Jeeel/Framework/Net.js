Jeeel.directory.Jeeel.Framework.Net = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Framework + 'Net/';
    }
};

/**
 * ネット関連のネームスペース
 */
Jeeel.Framework.Net = {

};

Jeeel.file.Jeeel.Framework.Net = ['Connect'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Framework.Net, Jeeel.file.Jeeel.Framework.Net);
