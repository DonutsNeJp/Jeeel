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
 * 大規模アプリケーション開発を円滑にするための汎用クラス等を保持するネームスペース<br />
 * 現在試用段階であり、使用する際は削除・変更が頻繁にある事に注意
 */
Jeeel.Framework = {
    
};

Jeeel.file.Jeeel.Framework = ['Net', 'Event', 'EventDispatcher', 'Layer', 'Mvc'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Framework, Jeeel.file.Jeeel.Framework);
