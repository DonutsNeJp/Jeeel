Jeeel.directory.Jeeel.Dom.Behavior = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Dom + 'Behavior/';
    }
};

/**
 * @namespace DOMの挙動を変更するためのネームスペース
 */
Jeeel.Dom.Behavior = {
    
};

Jeeel.file.Jeeel.Dom.Behavior = ['Rollover', 'Placeholder', 'Autofocus', 'EditInplace', 'Autoresize'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Dom.Behavior, Jeeel.file.Jeeel.Dom.Behavior);
