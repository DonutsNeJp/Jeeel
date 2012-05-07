Jeeel.directory.Jeeel.Framework.Mvc = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Framework + 'Mvc/';
    }
};

/**
 * @namespace MVCモデル関連のネームスペース
 */
Jeeel.Framework.Mvc = {
    
};

Jeeel.file.Jeeel.Framework.Mvc = ['Model', 'View', 'Controller'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Framework.Mvc, Jeeel.file.Jeeel.Framework.Mvc);
