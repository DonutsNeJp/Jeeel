Jeeel.directory.Jeeel.Framework = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel + 'Framework/';
    }
};

/**
 * @namespace 大規模アプリケーション開発を円滑にするための汎用クラス等を保持するネームスペース
 */
Jeeel.Framework = {
    
};

Jeeel.file.Jeeel.Framework = ['Net', 'Event', 'EventDispatcher', 'Layer', 'Mvc', 'Acl'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Framework, Jeeel.file.Jeeel.Framework);
